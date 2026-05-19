"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function parseSortOrder(value: string) {
  const sortOrder = Number(value);

  return Number.isNaN(sortOrder) ? 0 : sortOrder;
}

async function assertAdmin() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/anmelden?fehler=Kein%20Admin-Zugriff");
  }

  return session;
}

export async function createMaster(formData: FormData) {
  await assertAdmin();

  const name = getTextField(formData, "name");
  const title = getTextField(formData, "title") || null;
  const active = formData.get("active") === "on";
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));

  if (!name) {
    redirect("/admin/meister?fehler=Name%20ist%20erforderlich");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("masters").insert({
    name,
    title,
    active,
    sort_order: sortOrder,
  });

  if (error) {
    redirect("/admin/meister?fehler=Meister%20konnte%20nicht%20erstellt%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/meister");
  redirect("/admin/meister?erfolg=Meister%20erfolgreich%20erstellt");
}

export async function updateMaster(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const name = getTextField(formData, "name");
  const title = getTextField(formData, "title") || null;
  const active = formData.get("active") === "on";
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));

  if (!id || !name) {
    redirect("/admin/meister?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("masters")
    .update({ name, title, active, sort_order: sortOrder })
    .eq("id", id);

  if (error) {
    redirect("/admin/meister?fehler=Meister%20konnte%20nicht%20gespeichert%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/meister");
  redirect("/admin/meister?erfolg=Meister%20erfolgreich%20gespeichert");
}

export async function deleteMaster(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");

  if (!id) {
    redirect("/admin/meister?fehler=Meister%20nicht%20gefunden");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("masters").delete().eq("id", id);

  if (error) {
    redirect(
      "/admin/meister?fehler=Meister%20hat%20noch%20Termine%20und%20kann%20nicht%20gelöscht%20werden",
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/meister");
  redirect("/admin/meister?erfolg=Meister%20gelöscht");
}
