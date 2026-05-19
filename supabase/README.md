# Supabase – King Salon Celle

## Schema anwenden

1. Supabase-Projekt erstellen: https://supabase.com/dashboard  
2. `.env.local` im Projektroot ausfüllen:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

3. Migration ausführen:
   - **SQL Editor:** Inhalt von `migrations/20260519120000_initial_schema.sql` einfügen und ausführen  
   - **CLI:** `supabase db push` (falls Supabase CLI installiert ist)

4. Seed-Daten laden:
   - Inhalt von `seed.sql` im SQL Editor ausführen

5. Storage einrichten:
   - Inhalt von `migrations/20260519130000_setup_storage.sql` im SQL Editor ausführen

6. Row Level Security aktivieren:
   - Inhalt von `migrations/20260519140000_configure_rls.sql` im SQL Editor ausführen

7. Meister & Terminbuchung:
   - `migrations/20260519150000_masters_and_bookings.sql`
   - `migrations/20260519150100_booking_rls.sql`

## Row Level Security

| Tabelle | Öffentlich | Admin |
|---------|------------|-------|
| `services` | Nur `active = true` lesen | Voller Zugriff |
| `gallery` | Lesen | Voller Zugriff |
| `settings` | Lesen | Einfügen & Aktualisieren |
| `reviews` | Nur `active = true` lesen | Voller Zugriff |
| `homepage_content` | Lesen | Einfügen & Aktualisieren |
| `admins` | — | Eigenes Profil lesen; `admin`-Rolle verwaltet Admins |
| `masters` | Nur `active = true` lesen | Voller Zugriff |
| `bookings` | `pending` einfügen (Website) | Voller Zugriff |

**Storage:** Policies sind in der Storage-Migration enthalten.

## Storage

| Bucket | Zweck | Zugriff |
|--------|-------|---------|
| `gallery` | Galerie-Bilder | Öffentlich lesbar, Admin-Upload |
| `services` | Service-Bilder | Öffentlich lesbar, Admin-Upload |

**Limits:** max. 5 MB, JPG/PNG/WebP

**Code:** `lib/storage/` – Upload-, URL- und Pfad-Helfer für die Admin-Galerie.

## Tabellen

| Tabelle | Beschreibung |
|---------|--------------|
| `services` | Leistungen & Preise |
| `gallery` | Galerie-Bilder |
| `settings` | Kontakt, SEO, Öffnungszeiten (Singleton) |
| `reviews` | Kundenbewertungen |
| `admins` | Admin-Benutzer (verknüpft mit `auth.users`) |
| `homepage_content` | Hero-Texte (Singleton) |

## Admin anlegen

Nach Registrierung in Supabase Auth:

```sql
insert into public.admins (id, email, role)
values ('<auth-user-uuid>', 'admin@example.com', 'admin');
```

Alle Migrationen in der oben genannten Reihenfolge ausführen.
