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

export async function updateContactSettings(formData: FormData) {
  await assertAdmin();

  const phone = getTextField(formData, "phone");
  const email = getTextField(formData, "email") || null;
  const address = getTextField(formData, "address");
  const instagram = getTextField(formData, "instagram") || null;
  const facebook = getTextField(formData, "facebook") || null;
  const whatsapp = getTextField(formData, "whatsapp") || null;
  const googleMapsUrl = getTextField(formData, "google_maps_url") || null;

  if (!phone || !address) {
    redirect("/admin/kontakt?fehler=Telefon%20und%20Adresse%20sind%20Pflichtfelder");
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase.from("settings").select("id").eq("id", "main").maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({
        phone,
        email,
        address,
        instagram,
        facebook,
        whatsapp,
        google_maps_url: googleMapsUrl,
      })
      .eq("id", "main");

    if (error) {
      redirect("/admin/kontakt?fehler=Kontaktdaten%20konnten%20nicht%20gespeichert%20werden");
    }
  } else {
    const { error } = await supabase.from("settings").insert({
      id: "main",
      phone,
      email,
      address,
      instagram,
      facebook,
      whatsapp,
      google_maps_url: googleMapsUrl,
      opening_hours: [],
      seo_title: "King Salon Celle | Premium Barbershop",
      seo_description:
        "King Salon Celle – Premium Barbershop für Haarschnitte, Fades und Bartpflege in der Hehlentorstraße.",
    });

    if (error) {
      redirect("/admin/kontakt?fehler=Kontaktdaten%20konnten%20nicht%20gespeichert%20werden");
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/kontakt");
  redirect("/admin/kontakt?erfolg=Kontaktdaten%20erfolgreich%20gespeichert");
}
