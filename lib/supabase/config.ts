export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const missingKeys = [
    ["NEXT_PUBLIC_SUPABASE_URL", url],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (!url || !anonKey) {
    throw new Error(
      `Supabase-Konfiguration fehlt: ${missingKeys.join(", ")}. Bitte .env.local prüfen.`,
    );
  }

  return {
    anonKey,
    url,
  };
}
