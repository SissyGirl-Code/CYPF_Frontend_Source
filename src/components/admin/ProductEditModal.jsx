import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Trash2 } from "lucide-react";

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
  { key: "grain",   label: "Grain" },
];

const EMPTY_PRODUCT = {
  name: "", brand: "", animal_type: "dog", life_stage: "adult",
  health_focus: "general_wellness", food_type: "kibble", quality_tier: "good",
  description: "", image_url: "", protein_pct: "", fat_pct: "", fiber_pct: "",
  calories_per_cup: "", is_grain_free: false, has_artificial_preservatives: false,
  is_single_protein: false,
  rating: "", price_range: "", top_ingredients: [], allergens: [], affiliate_links: [], featured: false,
  report_status: "not_started", overall_evidence_confidence: "preliminary",
  nutritional_adequacy_status: "unknown", digestibility_confidence: "unknown", research_support_level: "unknown",
  feeding_trial_status: "unknown", aafco_statement: "", full_ingredient_list: "", full_guaranteed_analysis: "",
  life_stage_claim: "", manufacturer: "", formulated_by: "", digestibility_data: "",
  sourcing_transparency: "", manufacturing_transparency: "", recall_history: "", official_product_url: "",
  known_facts: "", missing_information: "", cypf_summary: "", transparency_score: "", marketing_integrity_score: "", research_notes: "",
};

export default function ProductEditModal({ product, onClose, onSaved }) {
  const isNew = !product;
  const [form, setForm] = useState(product ? { ...product } : { ...EMPTY_PRODUCT });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        protein_pct: data.protein_pct !== "" ? Number(data.protein_pct) : null,
        fat_pct: data.fat_pct !== "" ? Number(data.fat_pct) : null,
        fiber_pct: data.fiber_pct !== "" ? Number(data.fiber_pct) : null,
        calories_per_cup: data.calories_per_cup !== "" ? Number(data.calories_per_cup) : null,
        rating: data.rating !== "" ? Number(data.rating) : null,
        transparency_score: data.transparency_score !== "" ? Number(data.transparency_score) : null,
        marketing_integrity_score: data.marketing_integrity_score !== "" ? Number(data.marketing_integrity_score) : null,
      };
      return isNew
        ? base44.entities.Product.create(payload)
        : base44.entities.Product.update(product.id, payload);
    },
    onSuccess: onSaved,
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Ingredients helpers
  const updateIngredient = (idx, field, val) => {
    const arr = [...(form.top_ingredients || [])];
    arr[idx] = { ...arr[idx], [field]: val };
    set("top_ingredients", arr);
  };
  const addIngredient = () => set("top_ingredients", [...(form.top_ingredients || []), { name: "", benefit: "" }]);
  const removeIngredient = (idx) => set("top_ingredients", form.top_ingredients.filter((_, i) => i !== idx));

  // Allergens helpers (checkbox-based)
  const allergenSet = new Set((form.allergens || []).map(a => a.toLowerCase()));

  const toggleAllergen = (key) => {
    const current = new Set((form.allergens || []).map(a => a.toLowerCase()));
    if (current.has(key)) { current.delete(key); } else { current.add(key); }
    set("allergens", Array.from(current));
  };

  const allChecked = ALLERGEN_OPTIONS.every(o => allergenSet.has(o.key));
  const toggleAll = () => {
    if (allChecked) { set("allergens", []); }
    else { set("allergens", ALLERGEN_OPTIONS.map(o => o.key)); }
  };

  // Affiliate links helpers
  const updateLink = (idx, field, val) => {
    const arr = [...(form.affiliate_links || [])];
    arr[idx] = { ...arr[idx], [field]: val };
    set("affiliate_links", arr);
  };
  const addLink = () => set("affiliate_links", [...(form.affiliate_links || []), { retailer: "", url: "", price: "" }]);
  const removeLink = (idx) => set("affiliate_links", form.affiliate_links.filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-card rounded-xl border border-border w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold">{isNew ? "Add New Product" : `Edit: ${product.name}`}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Basic Info */}
          <Section title="Basic Info">
            <Field label="Product Name">
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Salmon & Sweet Potato Recipe" />
            </Field>
            <Field label="Brand">
              <Input value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="e.g. Orijen" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Animal">
                <Select value={form.animal_type} onValueChange={v => set("animal_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Life Stage">
                <Select value={form.life_stage} onValueChange={v => set("life_stage", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puppy_kitten">Puppy / Kitten</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="all_stages">All Life Stages</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Food Type">
                <Select value={form.food_type} onValueChange={v => set("food_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kibble">Kibble</SelectItem>
                    <SelectItem value="canned">Canned</SelectItem>
                    <SelectItem value="frozen">Freeze-Dried</SelectItem>
                    <SelectItem value="gently_cooked">Gently Cooked</SelectItem>
                    <SelectItem value="raw">Raw</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Quality Tier">
                <Select value={form.quality_tier} onValueChange={v => set("quality_tier", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">◇ Good</SelectItem>
                    <SelectItem value="better">◆ Better</SelectItem>
                    <SelectItem value="best">★ Best</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Health Focus">
                <Select value={form.health_focus} onValueChange={v => set("health_focus", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_wellness">General Wellness</SelectItem>
                    <SelectItem value="weight_management">Weight Management</SelectItem>
                    <SelectItem value="joint_health">Joint Health</SelectItem>
                    <SelectItem value="digestive">Digestive</SelectItem>
                    <SelectItem value="skin_coat">Skin & Coat</SelectItem>
                    <SelectItem value="high_protein">High Protein</SelectItem>
                    <SelectItem value="grain_free">Grain Free</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Rating (0–5)">
                <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set("rating", e.target.value)} placeholder="e.g. 4.5" />
              </Field>
            </div>
            <Field label="Price Range">
              <Input value={form.price_range} onChange={e => set("price_range", e.target.value)} placeholder="e.g. $50–$70 / 25 lb" />
            </Field>
            <Field label="Image URL">
              <Input value={form.image_url} onChange={e => set("image_url", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Description">
              <Textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the product..." />
            </Field>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.is_grain_free} onChange={e => set("is_grain_free", e.target.checked)} />
                Grain-Free
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.has_artificial_preservatives} onChange={e => set("has_artificial_preservatives", e.target.checked)} />
                Has Artificial Preservatives
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.is_single_protein} onChange={e => set("is_single_protein", e.target.checked)} />
                Single Protein / Main Ingredient
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.featured} onChange={e => set("featured", e.target.checked)} />
                Featured
              </label>
            </div>
          </Section>

          {/* Nutrition */}
          <Section title="Nutritional Info">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Protein %">
                <Input type="number" value={form.protein_pct} onChange={e => set("protein_pct", e.target.value)} placeholder="e.g. 32" />
              </Field>
              <Field label="Fat %">
                <Input type="number" value={form.fat_pct} onChange={e => set("fat_pct", e.target.value)} placeholder="e.g. 18" />
              </Field>
              <Field label="Fiber %">
                <Input type="number" value={form.fiber_pct} onChange={e => set("fiber_pct", e.target.value)} placeholder="e.g. 4" />
              </Field>
              <Field label="Calories / Cup">
                <Input type="number" value={form.calories_per_cup} onChange={e => set("calories_per_cup", e.target.value)} placeholder="e.g. 370" />
              </Field>
            </div>
          </Section>

          {/* Ingredients */}
          <Section title="Top Ingredients">
            <div className="space-y-2">
              {(form.top_ingredients || []).map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <Input value={ing.name} onChange={e => updateIngredient(idx, "name", e.target.value)} placeholder="Ingredient name" className="flex-1" />
                  <Input value={ing.benefit} onChange={e => updateIngredient(idx, "benefit", e.target.value)} placeholder="Benefit" className="flex-1" />
                  <button onClick={() => removeIngredient(idx)} className="text-muted-foreground hover:text-destructive mt-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add Ingredient
              </Button>
            </div>
          </Section>

          {/* Allergens */}
          <Section title="Allergens Present">
            <p className="text-xs text-muted-foreground -mt-1 mb-2">Check every allergen this product <strong>contains</strong>. Unchecked = free of that allergen.</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer border-b border-border pb-2">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                All of the above (contains all common allergens)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 pt-1">
                {ALLERGEN_OPTIONS.map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allergenSet.has(opt.key)}
                      onChange={() => toggleAllergen(opt.key)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* Evidence & Transparency */}
          <Section title="Evidence & Transparency Report">
            <p className="text-xs text-muted-foreground -mt-1 mb-2">These fields control the public CYPF report card. Unknowns are allowed and should be marked honestly.</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Report Status">
                <Select value={form.report_status || "not_started"} onValueChange={v => set("report_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="preliminary">Preliminary</SelectItem>
                    <SelectItem value="needs_research">Needs Research</SelectItem>
                    <SelectItem value="needs_verification">Needs Verification</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Evidence Confidence">
                <Select value={form.overall_evidence_confidence || "preliminary"} onValueChange={v => set("overall_evidence_confidence", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="moderate_high">Moderate-High</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                    <SelectItem value="preliminary">Preliminary</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Nutritional Adequacy">
                <Select value={form.nutritional_adequacy_status || "unknown"} onValueChange={v => set("nutritional_adequacy_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                    <SelectItem value="needs_verification">Needs Verification</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Digestibility Confidence">
                <Select value={form.digestibility_confidence || "unknown"} onValueChange={v => set("digestibility_confidence", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                    <SelectItem value="not_publicly_available">Not Publicly Available</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Research Support Level">
                <Select value={form.research_support_level || "unknown"} onValueChange={v => set("research_support_level", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="emerging">Emerging</SelectItem>
                    <SelectItem value="insufficient">Insufficient</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Feeding Trial Status">
                <Select value={form.feeding_trial_status || "unknown"} onValueChange={v => set("feeding_trial_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">Unknown</SelectItem>
                    <SelectItem value="formulated_to_meet_aafco">Formulated to Meet AAFCO</SelectItem>
                    <SelectItem value="animal_feeding_tests">Animal Feeding Tests</SelectItem>
                    <SelectItem value="not_publicly_disclosed">Not Publicly Disclosed</SelectItem>
                    <SelectItem value="company_confirmed">Company Confirmed</SelectItem>
                    <SelectItem value="needs_verification">Needs Verification</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Official Product URL">
              <Input value={form.official_product_url || ""} onChange={e => set("official_product_url", e.target.value)} placeholder="https://..." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Manufacturer / Distributor">
                <Input value={form.manufacturer || ""} onChange={e => set("manufacturer", e.target.value)} placeholder="Company shown on label" />
              </Field>
              <Field label="Formulated By">
                <Input value={form.formulated_by || ""} onChange={e => set("formulated_by", e.target.value)} placeholder="DACVN, PhD, internal team, not disclosed..." />
              </Field>
            </div>
            <Field label="AAFCO Statement">
              <Textarea rows={2} value={form.aafco_statement || ""} onChange={e => set("aafco_statement", e.target.value)} />
            </Field>
            <Field label="Full Ingredient List">
              <Textarea rows={3} value={form.full_ingredient_list || ""} onChange={e => set("full_ingredient_list", e.target.value)} />
            </Field>
            <Field label="Full Guaranteed Analysis">
              <Textarea rows={3} value={form.full_guaranteed_analysis || ""} onChange={e => set("full_guaranteed_analysis", e.target.value)} />
            </Field>
            <Field label="Digestibility Data">
              <Textarea rows={2} value={form.digestibility_data || ""} onChange={e => set("digestibility_data", e.target.value)} placeholder="Public data, or note Not Publicly Available" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Transparency Score (0-100)">
                <Input type="number" min="0" max="100" value={form.transparency_score || ""} onChange={e => set("transparency_score", e.target.value)} />
              </Field>
              <Field label="Marketing Integrity Score (0-100)">
                <Input type="number" min="0" max="100" value={form.marketing_integrity_score || ""} onChange={e => set("marketing_integrity_score", e.target.value)} />
              </Field>
            </div>
            <Field label="Sourcing Transparency">
              <Textarea rows={2} value={form.sourcing_transparency || ""} onChange={e => set("sourcing_transparency", e.target.value)} />
            </Field>
            <Field label="Manufacturing Transparency">
              <Textarea rows={2} value={form.manufacturing_transparency || ""} onChange={e => set("manufacturing_transparency", e.target.value)} />
            </Field>
            <Field label="Recall History">
              <Textarea rows={2} value={form.recall_history || ""} onChange={e => set("recall_history", e.target.value)} />
            </Field>
            <Field label="What We Know">
              <Textarea rows={3} value={form.known_facts || ""} onChange={e => set("known_facts", e.target.value)} />
            </Field>
            <Field label="What Is Unknown / Not Publicly Available">
              <Textarea rows={3} value={form.missing_information || ""} onChange={e => set("missing_information", e.target.value)} />
            </Field>
            <Field label="CYPF Summary">
              <Textarea rows={3} value={form.cypf_summary || ""} onChange={e => set("cypf_summary", e.target.value)} />
            </Field>
            <Field label="Internal Research Notes">
              <Textarea rows={2} value={form.research_notes || ""} onChange={e => set("research_notes", e.target.value)} />
            </Field>
          </Section>

          {/* Affiliate Links */}
          <Section title="Affiliate Links">
            <div className="space-y-2">
              {(form.affiliate_links || []).map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input value={link.retailer} onChange={e => updateLink(idx, "retailer", e.target.value)} placeholder="Retailer (e.g. Amazon)" className="w-28" />
                  <Input value={link.url} onChange={e => updateLink(idx, "url", e.target.value)} placeholder="URL" className="flex-1" />
                  <Input value={link.price} onChange={e => updateLink(idx, "price", e.target.value)} placeholder="Price" className="w-20" />
                  <button onClick={() => removeLink(idx)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addLink} className="gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add Link
              </Button>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
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