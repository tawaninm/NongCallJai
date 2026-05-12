import type { RiskLevel } from "@/lib/mock-data";

const styles: Record<RiskLevel, string> = {
  green: "risk-badge-green",
  yellow: "risk-badge-yellow",
  red: "risk-badge-red",
};

const labels: Record<RiskLevel, string> = {
  green: "เขียว",
  yellow: "เหลือง",
  red: "แดง",
};

export function RiskBadge({ level, showLabel = true }: { level: RiskLevel; showLabel?: boolean }) {
  return (
    <span className={styles[level]}>
      <span
        className={`mr-1 inline-block h-2 w-2 rounded-full ${level === "green" ? "bg-risk-green" : level === "yellow" ? "bg-risk-yellow" : "bg-risk-red"}`}
      />
      {showLabel && labels[level]}
    </span>
  );
}
