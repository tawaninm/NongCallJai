/**
 * MascotIcon – renders a small mascot image as an inline icon replacement.
 *
 * Designed to replace Lucide icons throughout the app with the actual
 * NongCallJai mascot illustrations from /Mascot Icon Logo/.
 *
 * Props:
 *  variant  – which mascot image to show (default "call")
 *  size     – CSS size in rem/px, controls both width and height (default "1.5rem")
 *  className – additional CSS classes
 *
 * Variant mapping:
 *  "wave"       → 2.png  (waving)
 *  "heart"      → 3.png  (holding heart)
 *  "call"       → LogoWeb.png (main mascot)
 *  "point"      → 10.png (pointing)
 *  "dance"      → 5.png  (arms out)
 *  "check"      → 11.png (thumbs up / check pose)
 *  "shield"     → 12.png (shielding / safe)
 *  "bell"       → 13.png (alert / bell)
 *  "settings"   → 14.png (gear-like pose)
 *  "phone"      → 15.png (calling)
 *  "chat"       → 16.png (chatting)
 *  "star"       → 17.png (sparkle / star)
 *  "link"       → 18.png (connecting)
 *  "money"      → 19.png (billing)
 *  "people"     → 20.png (group / people)
 *  "clipboard"  → 21.png (clipboard)
 *  "calendar"   → 22.png (schedule)
 *  "search"     → 23.png (search)
 *  "report"     → 24.png (chart / report)
 *  "mic"        → 25.png (microphone)
 *  "user"       → 26.png (user / person)
 *  "download"   → 27.png (download)
 *  "home"       → 28.png (home)
 *  "log"        → 29.png (log / list)
 *  "warning"    → 30.png (warning / alert)
 *  "bot"        → 31.png (robot)
 *  "happy"      → 32.png (happy face)
 *  "copy"       → 33.png (copy / duplicate)
 *  "eye"        → 34.png (preview / eye)
 *  "slider"     → 35.png (settings / slider)
 *  "send"       → 36.png (send)
 *  "file"       → 37.png (file)
 *  "pill"       → 38.png (medicine)
 *  "menu"       → 39.png (menu)
 *  "qr"         → 40.png (QR code)
 */

export type MascotVariant =
  | "wave"
  | "heart"
  | "call"
  | "point"
  | "dance"
  | "check"
  | "shield"
  | "bell"
  | "settings"
  | "phone"
  | "chat"
  | "star"
  | "link"
  | "money"
  | "people"
  | "clipboard"
  | "calendar"
  | "search"
  | "report"
  | "mic"
  | "user"
  | "download"
  | "home"
  | "log"
  | "warning"
  | "bot"
  | "happy"
  | "copy"
  | "eye"
  | "slider"
  | "send"
  | "file"
  | "pill"
  | "menu"
  | "qr";

const MASCOT_SRC: Record<MascotVariant, string> = {
  wave: "/Mascot Icon Logo/2.png",
  heart: "/Mascot Icon Logo/3.png",
  call: "/Mascot Icon Logo/LogoWeb.png",
  point: "/Mascot Icon Logo/10.png",
  dance: "/Mascot Icon Logo/5.png",
  check: "/Mascot Icon Logo/11.png",
  shield: "/Mascot Icon Logo/12.png",
  bell: "/Mascot Icon Logo/13.png",
  settings: "/Mascot Icon Logo/14.png",
  phone: "/Mascot Icon Logo/15.png",
  chat: "/Mascot Icon Logo/16.png",
  star: "/Mascot Icon Logo/17.png",
  link: "/Mascot Icon Logo/18.png",
  money: "/Mascot Icon Logo/19.png",
  people: "/Mascot Icon Logo/20.png",
  clipboard: "/Mascot Icon Logo/21.png",
  calendar: "/Mascot Icon Logo/22.png",
  search: "/Mascot Icon Logo/23.png",
  report: "/Mascot Icon Logo/24.png",
  mic: "/Mascot Icon Logo/25.png",
  user: "/Mascot Icon Logo/26.png",
  download: "/Mascot Icon Logo/27.png",
  home: "/Mascot Icon Logo/28.png",
  log: "/Mascot Icon Logo/29.png",
  warning: "/Mascot Icon Logo/30.png",
  bot: "/Mascot Icon Logo/31.png",
  happy: "/Mascot Icon Logo/32.png",
  copy: "/Mascot Icon Logo/33.png",
  eye: "/Mascot Icon Logo/34.png",
  slider: "/Mascot Icon Logo/35.png",
  send: "/Mascot Icon Logo/36.png",
  file: "/Mascot Icon Logo/37.png",
  pill: "/Mascot Icon Logo/38.png",
  menu: "/Mascot Icon Logo/39.png",
  qr: "/Mascot Icon Logo/40.png",
};

interface MascotIconProps {
  variant?: MascotVariant;
  /** CSS size string applied to width & height, e.g. "1.25rem", "24px", "2rem" */
  size?: string;
  className?: string;
  alt?: string;
}

import { motion } from "framer-motion";

export function MascotIcon({
  variant = "call",
  size = "1.5rem",
  className = "",
  alt = "NongCallJai",
}: MascotIconProps) {
  return (
    <motion.img
      src={MASCOT_SRC[variant]}
      alt={alt}
      className={`inline-block shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
      whileHover={{ scale: 1.1, rotate: [-2, 2, 0], transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.9 }}
      layoutId={`mascot-icon-${variant}`}
    />
  );
}
