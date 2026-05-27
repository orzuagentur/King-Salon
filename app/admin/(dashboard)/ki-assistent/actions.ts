"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { invalidateContextCache } from "@/lib/ai/context/cache";
import { refreshSiteContentSnapshot } from "@/lib/ai/site-content/snapshot";
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

export async function updateAiSettings(formData: FormData) {
  await assertAdmin();

  const systemPrompt = getTextField(formData, "system_prompt");
  const tone = getTextField(formData, "tone");
  const behaviorNotes = getTextField(formData, "behavior_notes");

  const payload = {
    id: "main",
    system_prompt: systemPrompt ? systemPrompt : null,
    tone: tone ? tone : null,
    behavior_notes: behaviorNotes ? behaviorNotes : null,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ai_settings").upsert(payload, { onConflict: "id" });

  if (error) {
    redirect("/admin/ki-assistent?fehler=KI-Einstellungen%20konnten%20nicht%20gespeichert%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=KI-Einstellungen%20gespeichert");
}

export async function resetAiSystemPrompt() {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("ai_settings")
    .upsert({ id: "main", system_prompt: null }, { onConflict: "id" });

  if (error) {
    redirect("/admin/ki-assistent?fehler=System-Prompt%20konnte%20nicht%20zurückgesetzt%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=System-Prompt%20zurückgesetzt");
}

export async function createAiKnowledge(formData: FormData) {
  await assertAdmin();

  const category = getTextField(formData, "category");
  const title = getTextField(formData, "title");
  const content = getTextField(formData, "content");
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));
  const active = formData.get("active") === "on";
  const pinned = formData.get("pinned") === "on";

  if (!category || !title || !content) {
    redirect("/admin/ki-assistent?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ai_knowledge").insert({
    category,
    title,
    content,
    sort_order: sortOrder,
    active,
    pinned,
  });

  if (error) {
    redirect("/admin/ki-assistent?fehler=Wissenseintrag%20konnte%20nicht%20erstellt%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=Wissenseintrag%20erstellt");
}

export async function updateAiKnowledge(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const category = getTextField(formData, "category");
  const title = getTextField(formData, "title");
  const content = getTextField(formData, "content");
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));
  const active = formData.get("active") === "on";
  const pinned = formData.get("pinned") === "on";

  if (!id || !category || !title || !content) {
    redirect("/admin/ki-assistent?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("ai_knowledge")
    .update({
      category,
      title,
      content,
      sort_order: sortOrder,
      active,
      pinned,
    })
    .eq("id", id);

  if (error) {
    redirect("/admin/ki-assistent?fehler=Wissenseintrag%20konnte%20nicht%20gespeichert%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=Wissenseintrag%20gespeichert");
}

export async function deleteAiKnowledge(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  if (!id) {
    redirect("/admin/ki-assistent?fehler=Wissenseintrag%20nicht%20gefunden");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ai_knowledge").delete().eq("id", id);

  if (error) {
    redirect("/admin/ki-assistent?fehler=Wissenseintrag%20konnte%20nicht%20gelöscht%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=Wissenseintrag%20gelöscht");
}

export async function createAiMemory(formData: FormData) {
  await assertAdmin();

  const title = getTextField(formData, "title");
  const content = getTextField(formData, "content");
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));
  const active = formData.get("active") === "on";
  const pinned = formData.get("pinned") === "on";

  if (!title || !content) {
    redirect("/admin/ki-assistent?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ai_memory").insert({
    title,
    content,
    sort_order: sortOrder,
    active,
    pinned,
  });

  if (error) {
    redirect("/admin/ki-assistent?fehler=Speicher-Eintrag%20konnte%20nicht%20erstellt%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=Speicher-Eintrag%20erstellt");
}

export async function updateAiMemory(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  const title = getTextField(formData, "title");
  const content = getTextField(formData, "content");
  const sortOrder = parseSortOrder(getTextField(formData, "sort_order"));
  const active = formData.get("active") === "on";
  const pinned = formData.get("pinned") === "on";

  if (!id || !title || !content) {
    redirect("/admin/ki-assistent?fehler=Bitte%20alle%20Pflichtfelder%20ausfüllen");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("ai_memory")
    .update({
      title,
      content,
      sort_order: sortOrder,
      active,
      pinned,
    })
    .eq("id", id);

  if (error) {
    redirect("/admin/ki-assistent?fehler=Speicher-Eintrag%20konnte%20nicht%20gespeichert%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=Speicher-Eintrag%20gespeichert");
}

export async function deleteAiMemory(formData: FormData) {
  await assertAdmin();

  const id = getTextField(formData, "id");
  if (!id) {
    redirect("/admin/ki-assistent?fehler=Speicher-Eintrag%20nicht%20gefunden");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ai_memory").delete().eq("id", id);

  if (error) {
    redirect("/admin/ki-assistent?fehler=Speicher-Eintrag%20konnte%20nicht%20gelöscht%20werden");
  }

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=Speicher-Eintrag%20gelöscht");
}

export async function clearAiMemoryCache() {
  await assertAdmin();

  invalidateContextCache();
  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=KI-Cache%20geleert");
}

export async function refreshAiWebsiteTraining() {
  await assertAdmin();

  try {
    await refreshSiteContentSnapshot();
  } catch {
    redirect("/admin/ki-assistent?fehler=Website-Inhalte%20konnten%20nicht%20neu%20indexiert%20werden");
  }

  revalidatePath("/admin/ki-assistent");
  redirect("/admin/ki-assistent?erfolg=Website-Inhalte%20neu%20synchronisiert");
}

