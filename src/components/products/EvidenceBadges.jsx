import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ClipboardCheck, AlertCircle, SearchCheck } from "lucide-react";

const confidenceConfig = {
  high: { label: "High Evidence", className: "bg-green-100 text-green-800 border-green-200" },
  moderate_high: { label: "Moderate-High Evidence", className: "bg-lime-100 text-lime-800 border-lime-200" },
  moderate: { label: "Moderate Evidence", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  low: { label: "Low Evidence", className: "bg-orange-100 text-orange-800 border-orange-200" },
  unknown: { label: "Unknown Evidence", className: "bg-gray-100 text-gray-700 border-gray-200" },
  preliminary: { label: "Preliminary Evidence", className: "bg-amber-100 text-amber-800 border-amber-200" },
};

const statusConfig = {
  not_started: { label: "Not Reviewed", className: "bg-gray-100 text-gray-700 border-gray-200" },
  preliminary: { label: "Preliminary Report", className: "bg-amber-100 text-amber-800 border-amber-200" },
  needs_research: { label: "Needs Research", className: "bg-orange-100 text-orange-800 border-orange-200" },
  needs_verification: { label: "Needs Verification", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  reviewed: { label: "Reviewed", className: "bg-blue-100 text-blue-800 border-blue-200" },
  published: { label: "Published Report", className: "bg-green-100 text-green-800 border-green-200" },
};

function clean(value) {
  return value || "unknown";
}

export function EvidenceConfidenceBadge({ confidence, size = "sm" }) {
  const c = confidenceConfig[clean(confidence)] || confidenceConfig.unknown;
  return (
    <Badge variant="outline" className={`${c.className} ${size === "xs" ? "text-[10px] px-1.5 py-0" : "text-xs"}`}>
      <ShieldCheck className="w-3 h-3 mr-1" /> {c.label}
    </Badge>
  );
}

export function ReportStatusBadge({ status, size = "sm" }) {
  const c = statusConfig[clean(status)] || statusConfig.not_started;
  const Icon = status === "published" || status === "reviewed" ? ClipboardCheck : status === "needs_research" ? SearchCheck : AlertCircle;
  return (
    <Badge variant="outline" className={`${c.className} ${size === "xs" ? "text-[10px] px-1.5 py-0" : "text-xs"}`}>
      <Icon className="w-3 h-3 mr-1" /> {c.label}
    </Badge>
  );
}

export function evidenceLabel(value) {
  return (confidenceConfig[value] || confidenceConfig.unknown).label;
}

export function reportStatusLabel(value) {
  return (statusConfig[value] || statusConfig.not_started).label;
}
