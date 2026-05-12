import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "green" | "yellow" | "red" | "teal";
  onClick?: () => void;
}

const variantStyles = {
  default: "border-border",
  green: "border-l-4 border-l-risk-green",
  yellow: "border-l-4 border-l-risk-yellow",
  red: "border-l-4 border-l-risk-red",
  teal: "border-l-4 border-l-teal",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`stat-card ${variantStyles[variant]} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
    </div>
  );
}
