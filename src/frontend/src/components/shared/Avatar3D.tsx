import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";

export type SkinTone = "light" | "medium" | "dark" | "deep";
export type HairStyle = "short" | "medium" | "long" | "curly";
export type BodyType = "slim" | "average" | "athletic";

interface Avatar3DProps {
  skinTone?: SkinTone;
  hairStyle?: HairStyle;
  bodyType?: BodyType;
  size?: number;
}

const skinToneColors: Record<SkinTone, string> = {
  light: "#f5d0b0",
  medium: "#c68642",
  dark: "#8d5524",
  deep: "#3b2219",
};

const hairColors = ["#1a1a1a", "#4a3b2a", "#d4a574", "#8b0000", "#2c1a0e"];

function getHairColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hairColors[Math.abs(hash) % hairColors.length];
}

function Character({
  skinTone = "medium",
  hairStyle = "short",
  bodyType = "average",
}: Omit<Avatar3DProps, "size">) {
  const skinColor = skinToneColors[skinTone];
  const hairColor = useMemo(
    () => getHairColor(`${skinTone}-${hairStyle}-${bodyType}`),
    [skinTone, hairStyle, bodyType],
  );

  const bodyRadius = useMemo(() => {
    switch (bodyType) {
      case "slim":
        return 0.35;
      case "athletic":
        return 0.5;
      default:
        return 0.42;
    }
  }, [bodyType]);

  const hairGeometry = useMemo(() => {
    switch (hairStyle) {
      case "short":
        return (
          <group position={[0, 1.35, 0]}>
            <mesh>
              <sphereGeometry
                args={[0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]}
              />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        );
      case "medium":
        return (
          <group position={[0, 1.35, 0]}>
            <mesh>
              <sphereGeometry
                args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]}
              />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0, -0.15, 0.05]}>
              <sphereGeometry
                args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]}
              />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        );
      case "long":
        return (
          <group position={[0, 1.35, 0]}>
            <mesh>
              <sphereGeometry
                args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]}
              />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0, -0.35, -0.05]}>
              <cylinderGeometry args={[0.32, 0.25, 0.6, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        );
      case "curly":
        return (
          <group position={[0, 1.35, 0]}>
            <mesh>
              <sphereGeometry args={[0.42, 16, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[0.15, 0.1, 0.15]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[-0.15, 0.1, 0.15]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[0.15, 0.1, -0.15]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
            <mesh position={[-0.15, 0.1, -0.15]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  }, [hairStyle, hairColor]);

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 1.28, 0.28]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.1, 1.28, 0.28]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.18, 0.32]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 1.08, 0.3]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#a05040" />
      </mesh>

      {/* Hair */}
      {hairGeometry}

      {/* Neck */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Body / Torso */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[bodyRadius, bodyRadius * 0.85, 0.7, 16]} />
        <meshStandardMaterial color="#2c5282" roughness={0.7} />
      </mesh>

      {/* Arms */}
      <mesh position={[-(bodyRadius + 0.1), 0.55, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.08, 0.07, 0.55, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      <mesh position={[bodyRadius + 0.1, 0.55, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.08, 0.07, 0.55, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Hands */}
      <mesh position={[-(bodyRadius + 0.18), 0.22, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      <mesh position={[bodyRadius + 0.18, 0.22, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, -0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 12]} />
        <meshStandardMaterial color="#1a365d" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, -0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 12]} />
        <meshStandardMaterial color="#1a365d" roughness={0.7} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.15, -0.45, 0.05]}>
        <boxGeometry args={[0.14, 0.08, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, -0.45, 0.05]}>
        <boxGeometry args={[0.14, 0.08, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function FallbackAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full gradient-accent flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="font-display font-semibold text-white text-xs">3D</span>
    </div>
  );
}

export function Avatar3D({
  skinTone = "medium",
  hairStyle = "short",
  bodyType = "average",
  size = 40,
}: Avatar3DProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <FallbackAvatar size={size} />;
  }

  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border"
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 1.2, 2.8], fov: 35 }}
        style={{ width: size, height: size }}
        onError={() => setHasError(true)}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 3]} intensity={0.8} />
        <directionalLight position={[-2, 2, 1]} intensity={0.3} />
        <Character
          skinTone={skinTone}
          hairStyle={hairStyle}
          bodyType={bodyType}
        />
      </Canvas>
    </div>
  );
}
