"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { weekDays } from "@/lib/opening-hours/defaults";
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

export async function updateOpeningHours(formData: FormData) {
  await assertAdmin();

  const openingHours = weekDays.map((day) => {
    const hours = getTextField(formData, `hours_${day}`);

    return {
      day,
      hours: hours || "Geschlossen",
    };
  });

  const hasInvalid = openingHours.some((entry) => !entry.hours);

  if (hasInvalid) {
    redirect("/admin/oeffnungszeiten?fehler=Bitte%20alle%20Tage%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase.from("settings").select("id").eq("id", "main").maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({ opening_hours: openingHours })
      .eq("id", "main");

    if (error) {
      redirect("/admin/oeffnungszeiten?fehler=Öffnungszeiten%20konnten%20nicht%20gespeichert%20werden");
    }
  } else {
    const { error } = await supabase.from("settings").insert({
      id: "main",
      phone: "+49 173 8882560",
      address: "Hehlentorstraße 8, 29221 Celle, Deutschland",
      opening_hours: openingHours,
      seo_title: "King Salon Celle | Premium Barbershop",
      seo_description:
        "King Salon Celle – Premium Barbershop für Haarschnitte, Fades und Bartpflege in der Hehlentorstraße.",
    });

    if (error) {
      redirect("/admin/oeffnungszeiten?fehler=Öffnungszeiten%20konnten%20nicht%20gespeichert%20werden");
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/oeffnungszeiten");
  redirect("/admin/oeffnungszeiten?erfolg=Öffnungszeiten%20erfolgreich%20gespeichert");
}
