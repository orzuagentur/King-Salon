import { NextResponse } from "next/server";

import { validateBookingDraftStep } from "@/lib/ai/booking/validate-draft";
import type { AiBookingDraft, AiBookingStep } from "@/lib/ai/booking/types";

export const runtime = "nodejs";

const STEPS: AiBookingStep[] = [
  "date",
  "time",
  "master",
  "name",
  "phone",
  "email",
  "confirm",
  "done",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { draft?: AiBookingDraft; step?: AiBookingStep };

    if (!body.step || !STEPS.includes(body.step)) {
      return NextResponse.json({ ok: false, error: "Ungültiger Buchungsschritt." }, { status: 400 });
    }

    if (!body.draft || typeof body.draft !== "object") {
      return NextResponse.json({ ok: false, error: "Buchungsdaten fehlen." }, { status: 400 });
    }

    const result = await validateBookingDraftStep(body.step, body.draft);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("AI booking validate failed", error);

    return NextResponse.json(
      { ok: false, error: "Validierung fehlgeschlagen. Bitte erneut versuchen." },
      { status: 500 },
    );
  }
}
