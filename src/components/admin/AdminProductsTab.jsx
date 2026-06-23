import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Search, Tags } from "lucide-react";
import ExportProductsButton from "./ExportProductsButton";
import ProductEditModal from "./ProductEditModal";
import BulkEditModal from "./BulkEditModal";
import { EvidenceConfidenceBadge, ReportStatusBadge } from "@/components/products/EvidenceBadges";

const TIER_STYLES = {
  good: "bg-slate-100 text-slate-700",
  better: "bg-primary/10 text-primary",
  best: "bg-accent/10 text-accent",
};

const FOOD_TYPES = ["all", "kibble", "canned", "frozen", "gently_cooked", "raw"];
const FOOD_TYPE_LABELS = {
  all: "All",
  kibble: "Kibble",
  canned: "Canned",
  frozen: "Frozen",
  gently_cooked: "Gently Cooked",
  raw: "Raw",
};

function ProductTable({ products, onEdit, onDelete, selectedIds, onToggleSelect, onToggleAll }) {
  if (products.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No products found.</div>;
  }
  const allSelected = products.length > 0 && products.every(p => selectedIds.has(p.id));
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60 border-b border-border">
            <th className="p-4 w-10">
              <input type="checkbox" checked={allSelected} onChange={() => onToggleAll(products)} className="cursor-pointer" />
            </th>
            <th className="text-left p-4 font-semibold">Product</th>
            <th className="text-left p-4 font-semibold hidden md:table-cell">Food Type</th>
            <th className="text-left p-4 font-semibold hidden sm:table-cell">Tier</th>
            <th className="text-left p-4 font-semibold hidden lg:table-cell">Rating</th>
            <th className="text-left p-4 font-semibold hidden xl:table-cell">Evidence</th>
            <th className="text-right p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <tr key={product.id} className={`hover:bg-muted/20 transition-colors ${selectedIds.has(product.id) ? "bg-primary/5" : ""}`}>
              <td className="p-4">
                <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => onToggleSelect(product.id)} className="cursor-pointer" />
              </td>
              <td className="p-4">
                <div className="font-medium text-foreground">{product.brand}</div>
                <div className="text-xs text-muted-foreground">{product.name}</div>
              </td>
              <td className="p-4 hidden md:table-cell text-muted-foreground capitalize">
                {FOOD_TYPE_LABELS[product.food_type] || product.food_type}
              </td>
              <td className="p-4 hidden sm:table-cell">
                {product.quality_tier && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIER_STYLES[product.quality_tier] || ""}`}>
                    {product.quality_tier}
                  </span>
                )}
              </td>
              <td className="p-4 hidden lg:table-cell text-muted-foreground">{product.rating ? `${product.rating}/5` : "—"}</td>
              <td className="p-4 hidden xl:table-cell">
                <div className="flex flex-col gap-1 items-start">
                  <EvidenceConfidenceBadge confidence={product.overall_evidence_confidence} size="xs" />
                  <ReportStatusBadge status={product.report_status} size="xs" />
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(product)} className="gap-1">
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => { if (confirm(`Delete "${product.name}"?`)) onDelete(product.id); }}>
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

export default function AdminProductsTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [animalType, setAnimalType] = useState("dog");
  const [foodType, setFoodType] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkEditing, setIsBulkEditing] = useState(false);

  const toggleSelect = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = (products) => {
    const allSelected = products.every(p => selectedIds.has(p.id));
    if (allSelected) {
      setSelectedIds(prev => { const next = new Set(prev); products.forEach(p => next.delete(p.id)); return next; });
    } else {
      setSelectedIds(prev => { const next = new Set(prev); products.forEach(p => next.add(p.id)); return next; });
    }
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => base44.entities.Product.list("-created_date", 1000),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
  };

  const byAnimal = products.filter((p) => p.animal_type === animalType);

  const filtered = byAnimal
    .filter((p) => {
      const matchesType = foodType === "all" || p.food_type === foodType;
      const matchesSearch = !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      const brandCmp = (a.brand || "").toLowerCase().localeCompare((b.brand || "").toLowerCase());
      if (brandCmp !== 0) return brandCmp;
      return (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase());
    });

  const countFor = (animal, type) =>
    type === "all"
      ? products.filter((p) => p.animal_type === animal).length
      : products.filter((p) => p.animal_type === animal && p.food_type === type).length;

  return (
    <>
      {/* Animal type top-level tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <Tabs value={animalType} onValueChange={(v) => { setAnimalType(v); setSearch(""); }}>
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="dog">
              Dog Food
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({products.filter((p) => p.animal_type === "dog").length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="cat">
              Cat Food
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({products.filter((p) => p.animal_type === "cat").length})
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <ExportProductsButton />
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Food type sub-tabs */}
      <Tabs value={foodType} onValueChange={(v) => { setFoodType(v); setSearch(""); }} className="mb-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {FOOD_TYPES.map((ft) => (
            <TabsTrigger key={ft} value={ft}>
              {FOOD_TYPE_LABELS[ft]}
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({countFor(animalType, ft)})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search + Bulk Edit */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${FOOD_TYPE_LABELS[foodType]} ${animalType} food...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {selectedIds.size > 0 && (
          <Button onClick={() => setIsBulkEditing(true)} className="gap-2 shrink-0">
            <Tags className="w-4 h-4" />
            Bulk Edit Tags ({selectedIds.size})
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}</div>
      ) : (
        <ProductTable
          products={filtered}
          onEdit={setEditingProduct}
          onDelete={(id) => deleteMutation.mutate(id)}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
        />
      )}

      {(editingProduct || isCreating) && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => { setEditingProduct(null); setIsCreating(false); }}
          onSaved={() => { invalidate(); setEditingProduct(null); setIsCreating(false); }}
        />
      )}

      {isBulkEditing && (
        <BulkEditModal
          productIds={Array.from(selectedIds)}
          products={products}
          onClose={() => setIsBulkEditing(false)}
          onSaved={() => { invalidate(); setIsBulkEditing(false); setSelectedIds(new Set()); }}
        />
      )}
    </>
  );
}