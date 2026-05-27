import { NextResponse } from "next/server";

import { isGeminiConfigured } from "@/lib/ai/config";
import { generateGeminiReply, streamGeminiReply } from "@/lib/ai/gemini/server";
import { checkAntiSpam, checkRateLimit, getClientIp } from "@/lib/ai/rate-limit";
import { parseChatRequestBody } from "@/lib/ai/validation";

export const runtime = "nodejs";

function secureJson(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      ...init?.headers,
    },
  });
}

export async function POST(request: Request) {
  try {
    if (!isGeminiConfigured()) {
      return secureJson(
        { error: "KI-Assistent ist derzeit nicht verfügbar." },
        { status: 503 },
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return secureJson({ error: "Ungültiger Content-Type." }, { status: 415 });
    }

    const clientIp = getClientIp(request);

    const body = await request.json();
    const parsed = parseChatRequestBody(body);

    if (!parsed.ok) {
      return secureJson({ error: parsed.error }, { status: 400 });
    }

    const antiSpam = checkAntiSpam(clientIp, parsed.messages.at(-1)?.content ?? "");
    if (!antiSpam.allowed) {
      const message =
        antiSpam.reason === "too_fast"
          ? `Bitte senden Sie Nachrichten nicht zu schnell. Versuchen Sie es in ${antiSpam.retryAfterSeconds} Sekunden erneut.`
          : `Wiederholte Nachrichten erkannt. Bitte in ${antiSpam.retryAfterSeconds} Sekunden erneut versuchen.`;
      return secureJson({ error: message }, { status: 429 });
    }

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return secureJson(
        {
          error: `Zu viele Anfragen. Bitte in ${rateLimit.retryAfterSeconds} Sekunden erneut versuchen.`,
        },
        { status: 429 },
      );
    }

    if (parsed.stream) {
      const streamResult = await streamGeminiReply(parsed.messages);
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResult.stream) {
              const text = chunk.text();

              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }

            controller.close();
          } catch (error) {
            console.error("Gemini stream failed", error);
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      });
    }

    const content = await generateGeminiReply(parsed.messages);

    return secureJson({ content });
  } catch (error) {
    console.error("AI chat API failed", error);

    return secureJson(
      {
        error:
          "Die Antwort konnte nicht erstellt werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
      },
      { status: 500 },
    );
  }
}
