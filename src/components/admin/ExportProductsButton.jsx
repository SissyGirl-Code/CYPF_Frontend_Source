import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function buildCSV(products) {
  const headers = [
    "Brand", "Name", "Animal", "Food Type", "Quality Tier", "Life Stage",
    "Health Focus", "Rating", "Price Range", "Protein %", "Fat %", "Fiber %",
    "Cal/Cup", "Grain Free", "No Artificial Preservatives", "Single Protein",
    "Featured", "Allergens", "Top Ingredients",
  ];

  const escape = (val) => {
    if (val == null) return "";
    const str = String(val);
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const rows = products.map((p) => [
    escape(p.brand),
    escape(p.name),
    escape(p.animal_type),
    escape(p.food_type),
    escape(p.quality_tier),
    escape(p.life_stage),
    escape(p.health_focus),
    escape(p.rating),
    escape(p.price_range),
    escape(p.protein_pct),
    escape(p.fat_pct),
    escape(p.fiber_pct),
    escape(p.calories_per_cup),
    escape(p.is_grain_free ? "Yes" : "No"),
    escape(!p.has_artificial_preservatives ? "Yes" : "No"),
    escape(p.is_single_protein ? "Yes" : "No"),
    escape(p.featured ? "Yes" : "No"),
    escape((p.allergens || []).join("; ")),
    escape((p.top_ingredients || []).map((i) => `${i.name}${i.benefit ? ` (${i.benefit})` : ""}`).join("; ")),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function buildTSV(products) {
  // Tab-separated — paste directly into Google Sheets
  const headers = [
    "Brand", "Name", "Animal", "Food Type", "Quality Tier", "Life Stage",
    "Health Focus", "Rating", "Price Range", "Protein %", "Fat %", "Fiber %",
    "Cal/Cup", "Grain Free", "No Artificial Preservatives", "Single Protein",
    "Featured", "Allergens", "Top Ingredients",
  ];

  const escape = (val) => (val == null ? "" : String(val).replace(/\t/g, " "));

  const rows = products.map((p) => [
    escape(p.brand), escape(p.name), escape(p.animal_type), escape(p.food_type),
    escape(p.quality_tier), escape(p.life_stage), escape(p.health_focus),
    escape(p.rating), escape(p.price_range), escape(p.protein_pct),
    escape(p.fat_pct), escape(p.fiber_pct), escape(p.calories_per_cup),
    escape(p.is_grain_free ? "Yes" : "No"),
    escape(!p.has_artificial_preservatives ? "Yes" : "No"),
    escape(p.is_single_protein ? "Yes" : "No"),
    escape(p.featured ? "Yes" : "No"),
    escape((p.allergens || []).join("; ")),
    escape((p.top_ingredients || []).map((i) => `${i.name}${i.benefit ? ` (${i.benefit})` : ""}`).join("; ")),
  ]);

  return [headers.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n");
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportProductsButton() {
  const [exporting, setExporting] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => base44.entities.Product.list("-created_date", 1000),
  });

  const handleExport = (format) => {
    setExporting(true);
    const date = new Date().toISOString().slice(0, 10);
    try {
      if (format === "csv") {
        downloadFile(buildCSV(products), `products-${date}.csv`, "text/csv;charset=utf-8;");
      } else if (format === "tsv") {
        downloadFile(buildTSV(products), `products-${date}.tsv`, "text/tab-separated-values;charset=utf-8;");
      } else if (format === "json") {
        downloadFile(JSON.stringify(products, null, 2), `products-${date}.json`, "application/json");
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={exporting || products.length === 0}>
          <Download className="w-4 h-4" />
          Export ({products.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
          <FileText className="w-4 h-4" />
          CSV — Excel / Numbers
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("tsv")} className="gap-2">
          <FileText className="w-4 h-4" />
          TSV — Paste into Google Sheets
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2">
          <FileText className="w-4 h-4" />
          JSON — Raw Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}