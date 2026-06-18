import type { ExternalBlob } from "@/types";
import { Avatar3D } from "./Avatar3D";

interface AvatarProps {
  blob?: ExternalBlob;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  avatarType?: "photo" | "3d";
  avatar3dConfig?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

const sizePixels = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
};

function parse3dConfig(config?: string): {
  skinTone: "light" | "medium" | "dark" | "deep";
  hairStyle: "short" | "medium" | "long" | "curly";
  bodyType: "slim" | "average" | "athletic";
} {
  try {
    if (!config) throw new Error("No config");
    const parsed = JSON.parse(config);
    const skinTone = ["light", "medium", "dark", "deep"].includes(
      parsed.skinTone,
    )
      ? parsed.skinTone
      : "medium";
    const hairStyle = ["short", "medium", "long", "curly"].includes(
      parsed.hairStyle,
    )
      ? parsed.hairStyle
      : "short";
    const bodyType = ["slim", "average", "athletic"].includes(parsed.bodyType)
      ? parsed.bodyType
      : "average";
    return { skinTone, hairStyle, bodyType };
  } catch {
    return { skinTone: "medium", hairStyle: "short", bodyType: "average" };
  }
}

export function Avatar({
  blob,
  name,
  size = "md",
  className = "",
  avatarType = "photo",
  avatar3dConfig,
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
  const pixelSize = sizePixels[size];

  if (avatarType === "3d") {
    const config = parse3dConfig(avatar3dConfig);
    return (
      <Avatar3D
        skinTone={config.skinTone}
        hairStyle={config.hairStyle}
        bodyType={config.bodyType}
        size={pixelSize}
      />
    );
  }

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
