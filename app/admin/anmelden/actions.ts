"use server";

import { redirect } from "next/navigation";

import { isAdminUser } from "@/lib/auth/is-admin-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function mapAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "E-Mail oder Passwort ist falsch.";
  }

  if (normalized.includes("email not confirmed")) {
    return "E-Mail noch nicht bestätigt. In Supabase unter Authentication den Nutzer bestätigen oder „Confirm email“ deaktivieren.";
  }

  return "Anmeldung fehlgeschlagen. Prüfen Sie E-Mail, Passwort und Supabase-Einstellungen.";
}

export async function signIn(formData: FormData) {
  const email = getTextField(formData, "email");
  const password = getTextField(formData, "password");

  if (!email || !password) {
    redirect("/admin/anmelden?fehler=Bitte%20E-Mail%20und%20Passwort%20eingeben");
  }

  if (!isSupabaseConfigured()) {
    redirect(
      "/admin/anmelden?fehler=Supabase%20nicht%20konfiguriert.%20In%20Vercel%20NEXT_PUBLIC_SUPABASE_URL%20und%20NEXT_PUBLIC_SUPABASE_ANON_KEY%20setzen.",
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/admin/anmelden?fehler=${encodeURIComponent(mapAuthErrorMessage(error.message))}`);
  }

  const userId = signInData.user?.id;

  if (!userId || !(await isAdminUser(supabase, userId))) {
    await supabase.auth.signOut();
    redirect(
      "/admin/anmelden?fehler=Kein%20Admin-Zugriff.%20In%20Supabase%20muss%20public.admins%20die%20gleiche%20UUID%20wie%20der%20Auth-Nutzer%20haben.",
    );
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect("/admin/anmelden");
}
