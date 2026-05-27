import type { AiKnowledgeRow, AiMemoryRow } from "@/lib/ai/context/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAllAiKnowledge(): Promise<AiKnowledgeRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_knowledge")
    .select("id, category, title, content, pinned, active, sort_order")
    .order("category", { ascending: true })
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getActiveAiKnowledge(): Promise<AiKnowledgeRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_knowledge")
    .select("id, category, title, content, pinned, active, sort_order")
    .eq("active", true)
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getActiveAiFaqKnowledge(): Promise<AiKnowledgeRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_knowledge")
    .select("id, category, title, content, pinned, active, sort_order")
    .eq("active", true)
    .ilike("category", "%faq%")
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getActiveAiMemory(): Promise<AiMemoryRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_memory")
    .select("id, title, content, pinned, active, sort_order")
    .eq("active", true)
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getAllAiMemory(): Promise<AiMemoryRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_memory")
    .select("id, title, content, pinned, active, sort_order")
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}
