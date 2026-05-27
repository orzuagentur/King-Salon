"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { defaultHomepageContent } from "@/lib/homepage/defaults";
import { inferHomepageBackgroundMediaType } from "@/lib/homepage/media";
import type { HomepageContent } from "@/lib/homepage/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function buildHomepagePayload(formData: FormData): HomepageContent {
  const heroBackgroundImage =
    getTextField(formData, "hero_background_image") ||
    defaultHomepageContent.hero_background_image;
  const heroBackgroundMediaType = inferHomepageBackgroundMediaType(
    heroBackgroundImage,
    getTextField(formData, "hero_background_media_type"),
  );

  return {
    site_name: getTextField(formData, "site_name"),
    hero_eyebrow: getTextField(formData, "hero_eyebrow"),
    hero_title: getTextField(formData, "hero_title"),
    hero_subtitle: getTextField(formData, "hero_subtitle"),
    hero_background_image: heroBackgroundImage,
    hero_background_media_type: heroBackgroundMediaType,
    hero_image: getTextField(formData, "hero_image") || defaultHomepageContent.hero_image,
    hero_image_alt:
      getTextField(formData, "hero_image_alt") || defaultHomepageContent.hero_image_alt,
    hero_card_street:
      getTextField(formData, "hero_card_street") || defaultHomepageContent.hero_card_street,
    hero_card_city:
      getTextField(formData, "hero_card_city") || defaultHomepageContent.hero_card_city,
    hero_card_hours:
      getTextField(formData, "hero_card_hours") || defaultHomepageContent.hero_card_hours,
    hero_stat_location:
      getTextField(formData, "hero_stat_location") || defaultHomepageContent.hero_stat_location,
    hero_stat_style:
      getTextField(formData, "hero_stat_style") || defaultHomepageContent.hero_stat_style,
    footer_tagline: getTextField(formData, "footer_tagline"),
    footer_rights:
      getTextField(formData, "footer_rights") || defaultHomepageContent.footer_rights,
    contact_section_eyebrow:
      getTextField(formData, "contact_section_eyebrow") ||
      defaultHomepageContent.contact_section_eyebrow,
    contact_section_title:
      getTextField(formData, "contact_section_title") ||
      defaultHomepageContent.contact_section_title,
    contact_section_subtitle:
      getTextField(formData, "contact_section_subtitle") ||
      defaultHomepageContent.contact_section_subtitle,
  };
}

function isHomepagePayloadValid(payload: HomepageContent) {
  return Boolean(
    payload.site_name &&
      payload.hero_eyebrow &&
      payload.hero_title &&
      payload.hero_subtitle &&
      payload.hero_card_street &&
      payload.hero_card_city &&
      payload.hero_card_hours &&
      payload.hero_stat_location &&
      payload.hero_stat_style &&
      payload.footer_rights &&
      payload.contact_section_eyebrow &&
      payload.contact_section_title &&
      payload.contact_section_subtitle,
  );
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

  const payload = buildHomepagePayload(formData);

  if (!isHomepagePayloadValid(payload)) {
    redirect("/admin/startseite?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("homepage_content")
    .select("id")
    .eq("id", "main")
    .maybeSingle();

  const row = {
    site_name: payload.site_name,
    hero_eyebrow: payload.hero_eyebrow,
    hero_title: payload.hero_title,
    hero_subtitle: payload.hero_subtitle,
    hero_background_image: payload.hero_background_image,
    hero_background_media_type: payload.hero_background_media_type,
    hero_image: payload.hero_image,
    hero_image_alt: payload.hero_image_alt,
    hero_card_street: payload.hero_card_street,
    hero_card_city: payload.hero_card_city,
    hero_card_hours: payload.hero_card_hours,
    hero_stat_location: payload.hero_stat_location,
    hero_stat_style: payload.hero_stat_style,
    footer_tagline: payload.footer_tagline || null,
    footer_rights: payload.footer_rights,
    contact_section_eyebrow: payload.contact_section_eyebrow,
    contact_section_title: payload.contact_section_title,
    contact_section_subtitle: payload.contact_section_subtitle,
  };

  if (existing) {
    const { error } = await supabase.from("homepage_content").update(row).eq("id", "main");

    if (error) {
      redirect("/admin/startseite?fehler=Startseite%20konnte%20nicht%20gespeichert%20werden");
    }
  } else {
    const { error } = await supabase.from("homepage_content").insert({
      id: "main",
      ...row,
    });

    if (error) {
      redirect("/admin/startseite?fehler=Startseite%20konnte%20nicht%20gespeichert%20werden");
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/startseite");
  redirect("/admin/startseite?erfolg=Startseiten-Inhalte%20erfolgreich%20gespeichert");
}
