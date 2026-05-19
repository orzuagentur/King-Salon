"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { verifyAdminSession } from "@/lib/auth/verify-admin";
import { deleteStorageObject } from "@/lib/storage/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
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

function buildGalleryPayload(formData: FormData) {
  const image = getTextField(formData, "image");
  const category = getTextField(formData, "category");
  const title = getTextField(formData, "title") || null;
  const alt = getTextField(formData, "alt") || null;
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));

  return { image, category, title, alt, sortOrder };
}

export async function createGalleryItem(formData: FormData) {
  await assertAdmin();

  const payload = buildGalleryPayload(formData);

  if (!payload.image || !payload.category) {
    redirect("/admin/galerie?fehler=Bitte%20Bild%20und%20Kategorie%20angeben");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("gallery").insert({
    image: payload.image,
    category: payload.category,
    title: payload.title,
    alt: payload.alt,
    sort_order: payload.sortOrder,
  });

  if (error) {
    redirect("/admin/galerie?fehler=Bild%20konnte%20nicht%20erstellt%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/galerie");
  redirect("/admin/galerie?erfolg=Galeriebild%20erfolgreich%20erstellt");
}

export async function updateGalleryItem(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const payload = buildGalleryPayload(formData);

  if (!id || !payload.image || !payload.category) {
    redirect("/admin/galerie?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("gallery")
    .update({
      image: payload.image,
      category: payload.category,
      title: payload.title,
      alt: payload.alt,
      sort_order: payload.sortOrder,
    })
    .eq("id", id);

  if (error) {
    redirect("/admin/galerie?fehler=Bild%20konnte%20nicht%20gespeichert%20werden");
  }

  revalidatePath("/");
  revalidatePath("/admin/galerie");
  redirect("/admin/galerie?erfolg=Galeriebild%20erfolgreich%20gespeichert");
}

export async function deleteGalleryItem(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const image = getTextField(formData, "image");

  if (!id) {
    redirect("/admin/galerie?fehler=Bild%20nicht%20gefunden");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    redirect("/admin/galerie?fehler=Bild%20konnte%20nicht%20gelöscht%20werden");
  }

  if (image) {
    await deleteStorageObject("gallery", image);
  }

  revalidatePath("/");
  revalidatePath("/admin/galerie");
  redirect("/admin/galerie?erfolg=Galeriebild%20gelöscht");
}
