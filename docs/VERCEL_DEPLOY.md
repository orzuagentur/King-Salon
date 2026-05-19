# Vercel + Supabase – Checkliste

Wenn auf **king-salon.vercel.app** beim Datumsfeld ein Serverfehler erscheint oder die Admin-Anmeldung fehlschlägt, fast immer fehlen Umgebungsvariablen oder die Supabase-Einrichtung ist unvollständig.

## 1. Umgebungsvariablen in Vercel

Vercel → Projekt **king-salon** → **Settings** → **Environment Variables**

| Variable | Woher |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key |

Optional:

| Variable | Zweck |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://king-salon.vercel.app` |
| `TELEGRAM_BOT_TOKEN` | Telegram-Benachrichtigungen |
| `TELEGRAM_CHAT_ID` | Telegram-Chat-ID |

Nach dem Speichern: **Deployments** → letztes Deployment → **Redeploy** (ohne Redeploy werden neue Variablen nicht geladen).

Lokal dieselben Werte in `kingsalon/.env.local`.

## 2. SQL-Migrationen in Supabase

Im **SQL Editor** nacheinander ausführen (falls noch nicht geschehen):

1. `supabase/migrations/20260519120000_initial_schema.sql`
2. `supabase/seed.sql`
3. `supabase/migrations/20260519130000_setup_storage.sql`
4. `supabase/migrations/20260519140000_configure_rls.sql`
5. `supabase/migrations/20260519150000_masters_and_bookings.sql`
6. `supabase/migrations/20260519150100_booking_rls.sql`

Ohne Schritt 5–6 funktionieren Meister und Terminbuchung nicht.

## 3. Admin-Benutzer (zwei Schritte!)

Nur einen Nutzer unter **Authentication → Users** anzulegen reicht **nicht**.

### A) Auth-Nutzer

Supabase → **Authentication** → **Users** → **Add user**

- E-Mail: z. B. `admin@kingsalon.de`
- Passwort: sicheres Passwort
- **Auto Confirm User** aktivieren (wichtig!)

### B) Zeile in `admins`

**SQL Editor:**

```sql
insert into public.admins (id, email, role)
values (
  'HIER-DIE-USER-UUID-AUS-AUTH',
  'admin@kingsalon.de',
  'admin'
)
on conflict (id) do update set email = excluded.email, role = excluded.role;
```

Die UUID finden Sie bei Authentication → Users → Klick auf den Nutzer → **User UID**.

### Anmeldung

`https://king-salon.vercel.app/admin/anmelden`

| Fehlermeldung | Lösung |
|---------------|--------|
| Supabase nicht konfiguriert | Vercel-Variablen setzen + Redeploy |
| E-Mail oder Passwort falsch | Passwort in Supabase zurücksetzen |
| E-Mail noch nicht bestätigt | Auto Confirm oder Nutzer manuell bestätigen |
| Kein Admin-Zugriff | Schritt B – Eintrag in `public.admins` |

## 4. Terminbuchung testen

Nach Redeploy und Migrationen:

1. Startseite → Kontakt → Datum wählen  
2. Uhrzeit und Meister sollten erscheinen  
3. Wenn „geschlossen“ oder leer: Öffnungszeiten in Supabase `settings` prüfen
