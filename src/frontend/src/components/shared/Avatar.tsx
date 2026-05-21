import type { ExternalBlob } from "@/types";

interface AvatarProps {
  blob?: ExternalBlob;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

export function Avatar({
  blob,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const sizeClass = sizeClasses[size];

  if (blob) {
    return (
      <img
        src={blob.getDirectURL()}
        alt={name ?? "Avatar"}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-border flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full gradient-accent flex items-center justify-center flex-shrink-0 font-display font-semibold text-white ring-2 ring-border ${className}`}
    >
      {initials}
    </div>
  );
}
