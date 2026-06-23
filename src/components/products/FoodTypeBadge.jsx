import { Flame, Package, Snowflake, Leaf, Drumstick } from "lucide-react";

const config = {
  kibble: {
    label: "Kibble",
    icon: Package,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  canned: {
    label: "Canned",
    icon: Flame,
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  frozen: {
    label: "Freeze-Dried",
    icon: Snowflake,
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  gently_cooked: {
    label: "Gently Cooked",
    icon: Leaf,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  raw: {
    label: "Raw / Flash Frozen",
    icon: Drumstick,
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

const tierConfig = {
  good: { label: "Good", className: "bg-slate-100 text-slate-700 border-slate-200" },
  better: { label: "Better", className: "bg-primary/10 text-primary border-primary/20" },
  best: { label: "Best", className: "bg-accent/15 text-accent border-accent/25" },
};

export function FoodTypeBadge({ type, size = "sm" }) {
  const c = config[type];
  if (!c) return null;
  const Icon = c.icon;
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const iconSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${textSize} ${c.className}`}>
      <Icon className={iconSize} />
      {c.label}
    </span>
  );
}

export function QualityTierBadge({ tier, size = "sm" }) {
  const c = tierConfig[tier];
  if (!c) return null;
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${textSize} ${c.className}`}>
      {tier === "best" && "★ "}
      {c.label}
    </span>
  );
}