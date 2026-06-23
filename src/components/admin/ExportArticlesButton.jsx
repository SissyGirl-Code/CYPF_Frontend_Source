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

function buildCSV(articles) {
  const headers = ["Title", "Slug", "Category", "Excerpt", "Read Time (min)", "Published", "Content"];

  const escape = (val) => {
    if (val == null) return "";
    const str = String(val);
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const rows = articles.map((a) => [
    escape(a.title),
    escape(a.slug),
    escape(a.category),
    escape(a.excerpt),
    escape(a.read_time),
    escape(a.published ? "Yes" : "No"),
    escape(a.content),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
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

export default function ExportArticlesButton() {
  const [exporting, setExporting] = useState(false);

  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles-export"],
    queryFn: () => base44.entities.Article.list("-created_date", 1000),
  });

  const handleExport = (format) => {
    setExporting(true);
    const date = new Date().toISOString().slice(0, 10);
    try {
      if (format === "csv") {
        downloadFile(buildCSV(articles), `articles-${date}.csv`, "text/csv;charset=utf-8;");
      } else if (format === "json") {
        downloadFile(JSON.stringify(articles, null, 2), `articles-${date}.json`, "application/json");
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={exporting || articles.length === 0}>
          <Download className="w-4 h-4" />
          Export ({articles.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
          <FileText className="w-4 h-4" />
          CSV — Excel / Numbers
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2">
          <FileText className="w-4 h-4" />
          JSON — Raw Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}