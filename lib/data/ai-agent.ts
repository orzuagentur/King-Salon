import type { AiAgentConfig } from "@/lib/ai/agent/types";
import { defaultAiAgentConfig } from "@/lib/ai/agent/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAiAgentConfig(): Promise<AiAgentConfig> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_settings")
    .select("agent_name, agent_avatar, welcome_message, language, theme_color")
    .eq("id", "main")
    .maybeSingle();

  if (error || !data) {
    return defaultAiAgentConfig;
  }

  return {
    agentName: data.agent_name?.trim() || defaultAiAgentConfig.agentName,
    agentAvatar: data.agent_avatar?.trim() || defaultAiAgentConfig.agentAvatar,
    welcomeMessage: data.welcome_message?.trim() || defaultAiAgentConfig.welcomeMessage,
    language: data.language?.trim() || defaultAiAgentConfig.language,
    themeColor: data.theme_color?.trim() || defaultAiAgentConfig.themeColor,
  };
}
