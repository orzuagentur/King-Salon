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

function parseRating(value: string) {
  const rating = Number(value);

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return null;
  }

  return Math.round(rating);
}

async function assertAdmin() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/anmelden?fehler=Kein%20Admin-Zugriff");
  }

  return session;
}

function buildReviewPayload(formData: FormData) {
  const name = getTextField(formData, "name");
  const text = getTextField(formData, "text");
  const rating = parseRating(getTextField(formData, "rating"));
  const active = formData.get("active") === "on";
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));

  return { name, text, rating, active, sortOrder };
}

export async function createReview(formData: FormData) {
  await assertAdmin();

  const payload = buildReviewPayload(formData);

  if (!payload.name || !payload.text || payload.rating === null) {
    redirect("/admin/bewertungen?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("reviews").insert({
    name: payload.name,
    text: payload.text,
    rating: payload.rating,
    active: payload.active,
    sort_order: payload.sortOrder,
  });

  if (error) {
    redirect("/admin/bewertungen?fehler=Bewertung%20konnte%20nicht%20erstellt%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/bewertungen");
  redirect("/admin/bewertungen?erfolg=Bewertung%20erfolgreich%20erstellt");
}

export async function updateReview(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const payload = buildReviewPayload(formData);

  if (!id || !payload.name || !payload.text || payload.rating === null) {
    redirect("/admin/bewertungen?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("reviews")
    .update({
      name: payload.name,
      text: payload.text,
      rating: payload.rating,
      active: payload.active,
      sort_order: payload.sortOrder,
    })
    .eq("id", id);

  if (error) {
    redirect("/admin/bewertungen?fehler=Bewertung%20konnte%20nicht%20gespeichert%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/bewertungen");
  redirect("/admin/bewertungen?erfolg=Bewertung%20erfolgreich%20gespeichert");
}

export async function deleteReview(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");

  if (!id) {
    redirect("/admin/bewertungen?fehler=Bewertung%20nicht%20gefunden");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    redirect("/admin/bewertungen?fehler=Bewertung%20konnte%20nicht%20gelöscht%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/bewertungen");
  redirect("/admin/bewertungen?erfolg=Bewertung%20gelöscht");
}
