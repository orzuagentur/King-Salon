"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { defaultHomepageContent } from "@/lib/homepage/defaults";
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

  const siteName = getTextField(formData, "site_name");
  const heroEyebrow = getTextField(formData, "hero_eyebrow");
  const heroTitle = getTextField(formData, "hero_title");
  const heroSubtitle = getTextField(formData, "hero_subtitle");
  const heroBackgroundImage =
    getTextField(formData, "hero_background_image") ||
    defaultHomepageContent.hero_background_image;
  const heroImage =
    getTextField(formData, "hero_image") || defaultHomepageContent.hero_image;
  const heroImageAlt =
    getTextField(formData, "hero_image_alt") || defaultHomepageContent.hero_image_alt;

  if (!siteName || !heroEyebrow || !heroTitle || !heroSubtitle) {
    redirect("/admin/startseite?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
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
        site_name: siteName,
        hero_eyebrow: heroEyebrow,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_background_image: heroBackgroundImage,
        hero_image: heroImage,
        hero_image_alt: heroImageAlt,
      })
      .eq("id", "main");

    if (error) {
      redirect("/admin/startseite?fehler=Startseite%20konnte%20nicht%20gespeichert%20werden");
    }
  } else {
    const { error } = await supabase.from("homepage_content").insert({
      id: "main",
      site_name: siteName,
      hero_eyebrow: heroEyebrow,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      hero_background_image: heroBackgroundImage,
      hero_image: heroImage,
      hero_image_alt: heroImageAlt,
    });

    if (error) {
      redirect("/admin/startseite?fehler=Startseite%20konnte%20nicht%20gespeichert%20werden");
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/startseite");
  redirect("/admin/startseite?erfolg=Startseiten-Inhalte%20erfolgreich%20gespeichert");
}
