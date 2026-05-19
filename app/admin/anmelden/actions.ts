"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function signIn(formData: FormData) {
  const email = getTextField(formData, "email");
  const password = getTextField(formData, "password");

  if (!email || !password) {
    redirect("/admin/anmelden?fehler=Bitte%20E-Mail%20und%20Passwort%20eingeben");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/anmelden?fehler=Anmeldung%20fehlgeschlagen");
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect("/admin/anmelden");
}
