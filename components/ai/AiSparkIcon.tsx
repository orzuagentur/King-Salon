type AiSparkIconProps = {
  className?: string;
};

export function AiSparkIcon({ className = "h-5 w-5" }: AiSparkIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 2.5 13.8 8.2l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.7-5.7-1.8 5.7-1.8L12 2.5Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M18.5 14.2h2.2M3.3 9.8h2.2M16.8 4.5v2.2M7.2 17.3v2.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
