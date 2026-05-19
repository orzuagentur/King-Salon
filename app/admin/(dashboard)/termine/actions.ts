"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

const validStatuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

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

export async function updateBookingStatus(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const status = getTextField(formData, "status") as BookingStatus;

  if (!id || !validStatuses.includes(status)) {
    redirect("/admin/termine?fehler=Ungültiger%20Termin%20oder%20Status");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);

  if (error) {
    redirect("/admin/termine?fehler=Status%20konnte%20nicht%20gespeichert%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/termine");
  redirect("/admin/termine?erfolg=Terminstatus%20aktualisiert");
}

export async function deleteBooking(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");

  if (!id) {
    redirect("/admin/termine?fehler=Termin%20nicht%20gefunden");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    redirect("/admin/termine?fehler=Termin%20konnte%20nicht%20gelöscht%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/termine");
  redirect("/admin/termine?erfolg=Termin%20gelöscht");
}
