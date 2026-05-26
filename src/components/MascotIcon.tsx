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
  wave: "/assets/nongcalljai/mascot-icons/wave.webp",
  heart: "/assets/nongcalljai/mascot-icons/heart.webp",
  call: "/assets/nongcalljai/mascot-icons/call.webp",
  point: "/assets/nongcalljai/mascot-icons/point.webp",
  dance: "/assets/nongcalljai/mascot-icons/dance.webp",
  check: "/assets/nongcalljai/mascot-icons/check.webp",
  shield: "/assets/nongcalljai/mascot-icons/shield.webp",
  bell: "/assets/nongcalljai/mascot-icons/bell.webp",
  settings: "/assets/nongcalljai/mascot-icons/settings.webp",
  phone: "/assets/nongcalljai/mascot-icons/phone.webp",
  chat: "/assets/nongcalljai/mascot-icons/chat.webp",
  star: "/assets/nongcalljai/mascot-icons/star.webp",
  link: "/assets/nongcalljai/mascot-icons/link.webp",
  money: "/assets/nongcalljai/mascot-icons/money.webp",
  people: "/assets/nongcalljai/mascot-icons/people.webp",
  clipboard: "/assets/nongcalljai/mascot-icons/clipboard.webp",
  calendar: "/assets/nongcalljai/mascot-icons/calendar.webp",
  search: "/assets/nongcalljai/mascot-icons/search.webp",
  report: "/assets/nongcalljai/mascot-icons/report.webp",
  mic: "/assets/nongcalljai/mascot-icons/mic.webp",
  user: "/assets/nongcalljai/mascot-icons/user.webp",
  download: "/assets/nongcalljai/mascot-icons/download.webp",
  home: "/assets/nongcalljai/mascot-icons/home.webp",
  log: "/assets/nongcalljai/mascot-icons/log.webp",
  warning: "/assets/nongcalljai/mascot-icons/warning.webp",
  bot: "/assets/nongcalljai/mascot-icons/bot.webp",
  happy: "/assets/nongcalljai/mascot-icons/happy.webp",
  copy: "/assets/nongcalljai/mascot-icons/copy.webp",
  eye: "/assets/nongcalljai/mascot-icons/eye.webp",
  slider: "/assets/nongcalljai/mascot-icons/slider.webp",
  send: "/assets/nongcalljai/mascot-icons/send.webp",
  file: "/assets/nongcalljai/mascot-icons/file.webp",
  pill: "/assets/nongcalljai/mascot-icons/pill.webp",
  menu: "/assets/nongcalljai/mascot-icons/menu.webp",
  qr: "/assets/nongcalljai/mascot-icons/qr.webp",
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
      loading="eager"
      decoding="async"
      draggable={false}
      whileHover={{ scale: 1.15, rotate: [-3, 3, -3, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    />
  );
}
