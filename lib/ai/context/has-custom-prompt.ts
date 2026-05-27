import { getAiSettings } from "@/lib/data/ai-settings";

export async function hasCustomAiSystemPrompt() {
  const settings = await getAiSettings();
  return Boolean(settings?.system_prompt?.trim());
}
