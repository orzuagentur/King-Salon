# Telegram Bot – Terminanfragen

Alle Terminanfragen aus dem Kontaktformular werden an Ihren Telegram-Chat gesendet.

## 1. Bot erstellen

1. Öffnen Sie [@BotFather](https://t.me/BotFather) in Telegram.
2. Senden Sie `/newbot` und folgen Sie den Anweisungen.
3. Kopieren Sie den **Bot Token** (z. B. `123456789:ABCdef...`).

## 2. Chat-ID ermitteln

### Privater Chat (nur Sie)

1. Schreiben Sie Ihrem Bot eine Nachricht (z. B. „Hallo“).
2. Öffnen Sie im Browser:
   `https://api.telegram.org/bot<IHR_TOKEN>/getUpdates`
3. Suchen Sie `"chat":{"id":` – die Zahl ist Ihre **Chat-ID** (z. B. `123456789`).

### Gruppe

1. Bot zur Gruppe hinzufügen.
2. Eine Nachricht in der Gruppe senden.
3. `getUpdates` wie oben aufrufen – die Chat-ID ist oft negativ (z. B. `-1001234567890`).

## 3. Umgebungsvariablen

In `.env.local` im Ordner `kingsalon/`:

```env
TELEGRAM_BOT_TOKEN=ihr_bot_token
TELEGRAM_CHAT_ID=ihre_chat_id
```

Dev-Server neu starten: `npm run dev`

## 4. Test

1. Website öffnen → Kontakt → Formular ausfüllen.
2. „Termin anfragen“ klicken.
3. Nachricht sollte im Telegram-Chat erscheinen.

## Hinweis

- Token und Chat-ID **niemals** in Git committen.
- Auf Vercel/Hosting dieselben Variablen unter **Environment Variables** setzen.
