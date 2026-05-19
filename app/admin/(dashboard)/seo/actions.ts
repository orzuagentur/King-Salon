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

export async function updateSeoSettings(formData: FormData) {
  await assertAdmin();

  const seoTitle = getTextField(formData, "seo_title");
  const seoDescription = getTextField(formData, "seo_description");

  if (!seoTitle || !seoDescription) {
    redirect("/admin/seo?fehler=Bitte%20Titel%20und%20Beschreibung%20ausfüllen");
  }

  if (seoTitle.length > 70) {
    redirect("/admin/seo?fehler=Meta-Titel%20maximal%2070%20Zeichen");
  }

  if (seoDescription.length > 160) {
    redirect("/admin/seo?fehler=Meta-Beschreibung%20maximal%20160%20Zeichen");
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase.from("settings").select("id").eq("id", "main").maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({
        seo_title: seoTitle,
        seo_description: seoDescription,
      })
      .eq("id", "main");

    if (error) {
      redirect("/admin/seo?fehler=SEO-Einstellungen%20konnten%20nicht%20gespeichert%20werden");
    }
  } else {
    const { error } = await supabase.from("settings").insert({
      id: "main",
      phone: "+49 173 8882560",
      address: "Hehlentorstraße 8, 29221 Celle, Deutschland",
      opening_hours: [],
      seo_title: seoTitle,
      seo_description: seoDescription,
    });

    if (error) {
      redirect("/admin/seo?fehler=SEO-Einstellungen%20konnten%20nicht%20gespeichert%20werden");
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/seo");
  redirect("/admin/seo?erfolg=SEO-Einstellungen%20erfolgreich%20gespeichert");
}
