import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Plus, Trash2 } from "lucide-react";

const ALLERGEN_OPTIONS = [
  { key: "chicken", label: "Chicken" },
  { key: "beef",    label: "Beef" },
  { key: "lamb",    label: "Lamb" },
  { key: "fish",    label: "Fish / Salmon" },
  { key: "wheat",   label: "Wheat" },
  { key: "corn",    label: "Corn" },
  { key: "soy",     label: "Soy" },
  { key: "dairy",   label: "Dairy" },
  { key: "eggs",    label: "Eggs" },
];

// Modes: "add" = add these allergens, "remove" = remove these allergens, "replace" = set exactly these
const MODE_OPTIONS = [
  { value: "add",     label: "Add to existing" },
  { value: "remove",  label: "Remove from existing" },
  { value: "replace", label: "Replace entirely" },
];

export default function BulkEditModal({ productIds, products, onClose, onSaved }) {
  const selectedProducts = products.filter(p => productIds.includes(p.id));

  const [allergenMode, setAllergenMode] = useState("add");
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [ingredientMode, setIngredientMode] = useState("add");
  const [ingredientInputs, setIngredientInputs] = useState([{ name: "", benefit: "" }]);
  const [isGrainFree, setIsGrainFree] = useState(null); // null = no change
  const [isSingleProtein, setIsSingleProtein] = useState(null);

  const toggleAllergen = (key) =>
    setSelectedAllergens(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const updateIngredient = (idx, field, val) => {
    const arr = [...ingredientInputs];
    arr[idx] = { ...arr[idx], [field]: val };
    setIngredientInputs(arr);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const validIngredients = ingredientInputs.filter(i => i.name.trim());
      await Promise.all(
        selectedProducts.map(product => {
          const updates = {};

          // Allergens
          if (selectedAllergens.length > 0) {
            const current = new Set((product.allergens || []).map(a => a.toLowerCase()));
            if (allergenMode === "add") {
              selectedAllergens.forEach(a => current.add(a));
              updates.allergens = Array.from(current);
            } else if (allergenMode === "remove") {
              selectedAllergens.forEach(a => current.delete(a));
              updates.allergens = Array.from(current);
            } else {
              updates.allergens = [...selectedAllergens];
            }
          }

          // Ingredients
          if (validIngredients.length > 0) {
            if (ingredientMode === "add") {
              updates.top_ingredients = [...(product.top_ingredients || []), ...validIngredients];
            } else if (ingredientMode === "replace") {
              updates.top_ingredients = validIngredients;
            }
          }

          // Boolean flags
          if (isGrainFree !== null) updates.is_grain_free = isGrainFree;
          if (isSingleProtein !== null) updates.is_single_protein = isSingleProtein;

          return Object.keys(updates).length > 0
            ? base44.entities.Product.update(product.id, updates)
            : Promise.resolve();
        })
      );
    },
    onSuccess: onSaved,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-card rounded-xl border border-border w-full max-w-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-heading text-xl font-bold">Bulk Edit Tags</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Updating <strong>{selectedProducts.length}</strong> product{selectedProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Selected products list */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Selected Products</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedProducts.map(p => (
                <span key={p.id} className="text-xs bg-muted px-2 py-1 rounded-md text-foreground">
                  {p.brand} — {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Allergen section */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Allergens</p>
            <div className="flex gap-2 mb-3">
              {MODE_OPTIONS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setAllergenMode(m.value)}
                  className={`px-3 py-1 text-xs rounded-md font-medium border transition-all ${
                    allergenMode === m.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
              {ALLERGEN_OPTIONS.map(opt => (
                <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAllergens.includes(opt.key)}
                    onChange={() => toggleAllergen(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Ingredients section */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Top Ingredients</p>
            <div className="flex gap-2 mb-3">
              {[{ value: "add", label: "Add to existing" }, { value: "replace", label: "Replace entirely" }].map(m => (
                <button
                  key={m.value}
                  onClick={() => setIngredientMode(m.value)}
                  className={`px-3 py-1 text-xs rounded-md font-medium border transition-all ${
                    ingredientMode === m.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {ingredientInputs.map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input value={ing.name} onChange={e => updateIngredient(idx, "name", e.target.value)} placeholder="Ingredient name" className="flex-1" />
                  <Input value={ing.benefit} onChange={e => updateIngredient(idx, "benefit", e.target.value)} placeholder="Benefit (optional)" className="flex-1" />
                  {ingredientInputs.length > 1 && (
                    <button onClick={() => setIngredientInputs(prev => prev.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setIngredientInputs(prev => [...prev, { name: "", benefit: "" }])} className="gap-1">
                <Plus className="w-3 h-3" /> Add Row
              </Button>
            </div>
          </div>

          {/* Boolean flags */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Flags (leave unset to keep existing value)</p>
            <div className="space-y-2">
              <TriStateToggle label="Grain-Free" value={isGrainFree} onChange={setIsGrainFree} />
              <TriStateToggle label="Single Protein" value={isSingleProtein} onChange={setIsSingleProtein} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : `Apply to ${selectedProducts.length} Products`}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TriStateToggle({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-32">{label}</span>
      <div className="flex gap-1">
        {[{ val: null, text: "No change" }, { val: true, text: "Yes" }, { val: false, text: "No" }].map(opt => (
          <button
            key={String(opt.val)}
            onClick={() => onChange(opt.val)}
            className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
              value === opt.val
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}