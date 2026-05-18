/**
 * NongCallJaiMascot – renders the real mascot image asset.
 *
 * Props
 *  compact  – smaller size for cards / hero preview (default false)
 *  variant  – which mascot image to show (default "wave")
 *    "wave"     → 2.png  (waving, holding phone heart)
 *    "heart"    → 3.png  (holding heart with both hands)
 *    "call"     → LogoWeb.png (holding phone heart, waving)
 *    "point"    → 10.png (pointing at phone icon)
 *    "dance"    → 5.png  (arms out, talking)
 */

type MascotVariant = "wave" | "heart" | "call" | "point" | "dance";

const MASCOT_SRC: Record<MascotVariant, string> = {
  wave: "/Mascot Icon Logo/2.png",
  heart: "/Mascot Icon Logo/3.png",
  call: "/Mascot Icon Logo/LogoWeb.png",
  point: "/Mascot Icon Logo/10.png",
  dance: "/Mascot Icon Logo/5.png",
};

export function NongCallJaiMascot({
  compact = false,
  variant = "call",
}: {
  compact?: boolean;
  variant?: MascotVariant;
}) {
  const src = MASCOT_SRC[variant];

  return (
    <div
      className={`relative mx-auto flex items-center justify-center ${
        compact ? "h-36 w-36" : "h-72 w-72 md:h-96 md:w-96"
      }`}
    >
      {/* soft glow behind mascot */}
      <div className="absolute inset-4 rounded-full bg-[#d6eddb]/60 blur-2xl" />
      <img
        src={src}
        alt="NongCallJai mascot"
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(58,89,64,0.20)]"
        loading="lazy"
      />
    </div>
  );
}
