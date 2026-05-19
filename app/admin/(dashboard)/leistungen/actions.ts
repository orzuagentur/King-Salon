"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function parsePrice(value: string) {
  const normalized = value.replace(",", ".");
  const price = Number(normalized);

  if (Number.isNaN(price) || price < 0) {
    return null;
  }

  return price;
}

function parseSortOrder(value: string) {
  const sortOrder = Number(value);

  if (Number.isNaN(sortOrder)) {
    return 0;
  }

  return sortOrder;
}

async function assertAdmin() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/anmelden?fehler=Kein%20Admin-Zugriff");
  }

  return session;
}

function buildServicePayload(formData: FormData) {
  const title = getTextField(formData, "title");
  const description = getTextField(formData, "description");
  const price = parsePrice(getTextField(formData, "price"));
  const duration = getTextField(formData, "duration") || null;
  const image = getTextField(formData, "image") || null;
  const active = formData.get("active") === "on";
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));

  return { title, description, price, duration, image, active, sortOrder };
}

export async function createService(formData: FormData) {
  await assertAdmin();

  const payload = buildServicePayload(formData);

  if (!payload.title || !payload.description || payload.price === null) {
    redirect("/admin/leistungen?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").insert({
    title: payload.title,
    description: payload.description,
    price: payload.price,
    duration: payload.duration,
    image: payload.image,
    active: payload.active,
    sort_order: payload.sortOrder,
  });

  if (error) {
    redirect("/admin/leistungen?fehler=Leistung%20konnte%20nicht%20erstellt%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/leistungen");
  redirect("/admin/leistungen?erfolg=Leistung%20erfolgreich%20erstellt");
}

export async function updateService(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const payload = buildServicePayload(formData);

  if (!id || !payload.title || !payload.description || payload.price === null) {
    redirect("/admin/leistungen?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services")
    .update({
      title: payload.title,
      description: payload.description,
      price: payload.price,
      duration: payload.duration,
      image: payload.image,
      active: payload.active,
      sort_order: payload.sortOrder,
    })
    .eq("id", id);

  if (error) {
    redirect("/admin/leistungen?fehler=Leistung%20konnte%20nicht%20gespeichert%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/leistungen");
  redirect("/admin/leistungen?erfolg=Leistung%20erfolgreich%20gespeichert");
}

export async function updateServicePrice(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const price = parsePrice(getTextField(formData, "price"));

  if (!id || price === null) {
    redirect("/admin/leistungen?fehler=Ungültiger%20Preis");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").update({ price }).eq("id", id);

  if (error) {
    redirect("/admin/leistungen?fehler=Preis%20konnte%20nicht%20gespeichert%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/leistungen");
  redirect("/admin/leistungen?erfolg=Preis%20erfolgreich%20gespeichert");
}

export async function deleteService(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");

  if (!id) {
    redirect("/admin/leistungen?fehler=Leistung%20nicht%20gefunden");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    redirect("/admin/leistungen?fehler=Leistung%20konnte%20nicht%20gelöscht%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/leistungen");
  redirect("/admin/leistungen?erfolg=Leistung%20gelöscht");
}
