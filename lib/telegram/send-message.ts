import { getTelegramConfig } from "@/lib/telegram/config";

type SendTelegramMessageResult =
  | { success: true }
  | { success: false; error: string };

export async function sendTelegramMessage(text: string): Promise<SendTelegramMessageResult> {
  const config = getTelegramConfig();

  if (!config) {
    return {
      success: false,
      error: "Telegram ist nicht konfiguriert.",
    };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: config.chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        cache: "no-store",
      },
    );

    const data = (await response.json()) as { ok?: boolean; description?: string };

    if (!response.ok || !data.ok) {
      return {
        success: false,
        error: data.description ?? "Telegram API Fehler",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Verbindung zu Telegram fehlgeschlagen.",
    };
  }
}
