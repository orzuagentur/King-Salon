import { AiSparkIcon } from "@/components/ai/AiSparkIcon";

type AiAgentAvatarProps = {
  avatar: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClassName = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizeClassName = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

function AvatarGlyph({ avatar, iconClassName }: { avatar: string; iconClassName: string }) {
  if (avatar === "crown") {
    return <span className={`${iconClassName} leading-none`}>♛</span>;
  }

  if (avatar === "scissors") {
    return <span className={`${iconClassName} leading-none`}>✂</span>;
  }

  if (avatar.startsWith("http") || avatar.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt="" className="h-full w-full rounded-full object-cover" src={avatar} />
    );
  }

  return <AiSparkIcon className={iconClassName} />;
}

export function AiAgentAvatar({ avatar, className = "", size = "md" }: AiAgentAvatarProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[var(--ai-accent)]/35 bg-[var(--ai-accent)]/10 text-[var(--ai-accent)] ${sizeClassName[size]} ${className}`}
    >
      <AvatarGlyph avatar={avatar} iconClassName={iconSizeClassName[size]} />
    </span>
  );
}
