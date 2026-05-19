"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

async function assertAdmin() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/anmelden?fehler=Kein%20Admin-Zugriff");
  }

  return session;
}

export async function updateHomepageContent(formData: FormData) {
  await assertAdmin();

  const heroEyebrow = getTextField(formData, "hero_eyebrow");
  const heroTitle = getTextField(formData, "hero_title");
  const heroSubtitle = getTextField(formData, "hero_subtitle");

  if (!heroEyebrow || !heroTitle || !heroSubtitle) {
    redirect("/admin/startseite?fehler=Bitte%20alle%20Hero-Felder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("homepage_content")
    .select("id")
    .eq("id", "main")
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("homepage_content")
      .update({
        hero_eyebrow: heroEyebrow,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
      })
      .eq("id", "main");

    if (error) {
      redirect("/admin/startseite?fehler=Startseite%20konnte%20nicht%20gespeichert%20werden");
    }
  } else {
    const { error } = await supabase.from("homepage_content").insert({
      id: "main",
      hero_eyebrow: heroEyebrow,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
    });

    if (error) {
      redirect("/admin/startseite?fehler=Startseite%20konnte%20nicht%20gespeichert%20werden");
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/startseite");
  redirect("/admin/startseite?erfolg=Startseiten-Inhalte%20erfolgreich%20gespeichert");
}
