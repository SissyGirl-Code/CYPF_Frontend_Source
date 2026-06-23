import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import ArticleEditModal from "./ArticleEditModal";
import ExportArticlesButton from "./ExportArticlesButton";

const CATEGORY_STYLES = {
  nutrition: "bg-emerald-100 text-emerald-700",
  health: "bg-blue-100 text-blue-700",
  ingredients: "bg-amber-100 text-amber-700",
  guides: "bg-purple-100 text-purple-700",
  breeds: "bg-rose-100 text-rose-700",
};

const SECTION_TABS = [
  { value: "articles", label: "Articles", categories: ["nutrition", "health", "ingredients"] },
  { value: "breeds", label: "Breeds", categories: ["breeds"] },
  { value: "guides", label: "Guides", categories: ["guides"] },
];

function ArticleTable({ articles, onEdit, onDelete }) {
  if (articles.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No entries found.</div>;
  }
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60 border-b border-border">
            <th className="text-left p-4 font-semibold">Title</th>
            <th className="text-left p-4 font-semibold hidden sm:table-cell">Category</th>
            <th className="text-left p-4 font-semibold hidden md:table-cell">Status</th>
            <th className="text-left p-4 font-semibold hidden lg:table-cell">Read Time</th>
            <th className="text-right p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-muted/20 transition-colors">
              <td className="p-4">
                <div className="font-medium text-foreground line-clamp-1">{article.title}</div>
                {article.excerpt && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{article.excerpt}</div>}
              </td>
              <td className="p-4 hidden sm:table-cell">
                {article.category && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${CATEGORY_STYLES[article.category] || "bg-muted text-muted-foreground"}`}>
                    {article.category}
                  </span>
                )}
              </td>
              <td className="p-4 hidden md:table-cell">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${article.published ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                  {article.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="p-4 hidden lg:table-cell text-muted-foreground">{article.read_time ? `${article.read_time} min` : "—"}</td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(article)} className="gap-1">
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => { if (confirm(`Delete "${article.title}"?`)) onDelete(article.id); }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminArticlesTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("articles");
  const [editingArticle, setEditingArticle] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => base44.entities.Article.list("-created_date", 500),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    queryClient.invalidateQueries({ queryKey: ["articles"] });
  };

  const activeCategories = SECTION_TABS.find((t) => t.value === section)?.categories || [];

  const filtered = articles.filter((a) => {
    const matchesSection = activeCategories.includes(a.category);
    const matchesSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase());
    return matchesSection && matchesSearch;
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <Tabs value={section} onValueChange={(v) => { setSection(v); setSearch(""); }}>
          <TabsList className="flex flex-wrap h-auto gap-1">
            {SECTION_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({articles.filter((a) => t.categories.includes(a.category)).length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <ExportArticlesButton />
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Article
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder={`Search ${section}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}</div>
      ) : (
        <ArticleTable
          articles={filtered}
          onEdit={setEditingArticle}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}

      {(editingArticle || isCreating) && (
        <ArticleEditModal
          article={editingArticle}
          onClose={() => { setEditingArticle(null); setIsCreating(false); }}
          onSaved={() => { invalidate(); setEditingArticle(null); setIsCreating(false); }}
        />
      )}
    </>
  );
}