import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "nutrition",
  image_url: "",
  read_time: "",
  published: false,
};

export default function ArticleEditModal({ article, onClose, onSaved }) {
  const isNew = !article;
  const [form, setForm] = useState(article ? { ...article } : { ...EMPTY });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Auto-generate slug from title if creating new
  const handleTitleChange = (val) => {
    set("title", val);
    if (isNew) {
      set("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        read_time: data.read_time !== "" ? Number(data.read_time) : null,
      };
      return isNew
        ? base44.entities.Article.create(payload)
        : base44.entities.Article.update(article.id, payload);
    },
    onSuccess: onSaved,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-card rounded-xl border border-border w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold">{isNew ? "New Article" : `Edit: ${article.title}`}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <Field label="Title">
            <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. Why Protein Quality Matters" />
          </Field>

          <Field label="Slug (URL key)">
            <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="e.g. why-protein-quality-matters" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onValueChange={v => set("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="ingredients">Ingredients</SelectItem>
                  <SelectItem value="guides">Guides</SelectItem>
                  <SelectItem value="breeds">Breeds</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Read Time (minutes)">
              <Input type="number" min="1" value={form.read_time} onChange={e => set("read_time", e.target.value)} placeholder="e.g. 5" />
            </Field>
          </div>

          <Field label="Cover Image URL">
            <Input value={form.image_url} onChange={e => set("image_url", e.target.value)} placeholder="https://..." />
          </Field>

          <Field label="Excerpt (short summary)">
            <Textarea rows={2} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="A short description shown on the articles list..." />
          </Field>

          <Field label="Content (Markdown supported)">
            <Textarea
              rows={14}
              value={form.content}
              onChange={e => set("content", e.target.value)}
              placeholder={`# Heading\n\nWrite your article content here. Markdown is supported.\n\n## Sub-heading\n\nParagraph text...`}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Supports Markdown: **bold**, *italic*, # headings, - lists, [links](url)</p>
          </Field>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={!!form.published} onChange={e => set("published", e.target.checked)} />
            <span>Published <span className="text-muted-foreground text-xs">(unpublished articles won't appear on the site)</span></span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : isNew ? "Create Article" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      {children}
    </div>
  );
}