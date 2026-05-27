import { updateAiAgentSettings } from "@/app/admin/(dashboard)/ki-assistent/actions";
import type { AiSettingsRow } from "@/lib/ai/context/types";
import { defaultAiAgentConfig } from "@/lib/ai/agent/types";

type AiAgentSettingsFormProps = {
  settings: AiSettingsRow | null;
};

const avatarOptions = [
  { value: "spark", label: "KI Spark" },
  { value: "crown", label: "Krone" },
  { value: "scissors", label: "Schere" },
];

const languageOptions = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
  { value: "ar", label: "العربية" },
];

export function AiAgentSettingsForm({ settings }: AiAgentSettingsFormProps) {
  const agentName = settings?.agent_name ?? defaultAiAgentConfig.agentName;
  const agentAvatar = settings?.agent_avatar ?? defaultAiAgentConfig.agentAvatar;
  const welcomeMessage = settings?.welcome_message ?? defaultAiAgentConfig.welcomeMessage;
  const language = settings?.language ?? defaultAiAgentConfig.language;
  const themeColor = settings?.theme_color ?? defaultAiAgentConfig.themeColor;

  return (
    <form action={updateAiAgentSettings} className="mt-6 space-y-5 rounded-2xl border border-border bg-background p-5">
      <div>
        <p className="text-sm font-semibold text-foreground">Agent-Branding</p>
        <p className="mt-1 text-xs text-muted">
          Name, Avatar, Begrüßung, Sprache und Akzentfarbe für den öffentlichen Chat.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="text-muted">Agent-Name</span>
          <input
            className="luxury-input !rounded-2xl"
            defaultValue={agentName}
            name="agent_name"
            required
            type="text"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-muted">Avatar / Icon</span>
          <select
            className="luxury-input !rounded-2xl"
            defaultValue={avatarOptions.some((option) => option.value === agentAvatar) ? agentAvatar : "custom"}
            name="agent_avatar_preset"
          >
            {avatarOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="custom">Eigene URL</option>
          </select>
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="text-muted">Eigene Avatar-URL (optional)</span>
        <input
          className="luxury-input !rounded-2xl"
          defaultValue={
            avatarOptions.some((option) => option.value === agentAvatar) ? "" : agentAvatar
          }
          name="agent_avatar_url"
          placeholder="https://… oder /images/…"
          type="text"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="text-muted">Willkommensnachricht</span>
        <textarea
          className="luxury-input luxury-textarea !rounded-2xl"
          defaultValue={welcomeMessage}
          name="welcome_message"
          required
          rows={4}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="text-muted">Sprache</span>
          <select className="luxury-input !rounded-2xl" defaultValue={language} name="language">
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-muted">Theme-Farbe</span>
          <input
            className="luxury-input !rounded-2xl"
            defaultValue={themeColor}
            name="theme_color"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            required
            type="text"
          />
        </label>
      </div>

      <button
        className="rounded-full border border-gold bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-gold-soft"
        type="submit"
      >
        Agent speichern
      </button>
    </form>
  );
}
