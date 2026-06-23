import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductCard from "../components/products/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, BookOpen, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FOOD_TYPE_LABELS = {
  kibble: "Kibble",
  canned: "Canned",
  frozen: "Freeze-Dried",
  gently_cooked: "Gently Cooked",
  raw: "Raw / Flash Frozen",
};

const TIER_LABELS = {
  good: "◇ Good",
  better: "◆ Better",
  best: "★ Best",
};

const ALLERGEN_OPTIONS = [
  { key: "chicken", label: "Chicken-Free" },
  { key: "beef",    label: "Beef-Free" },
  { key: "lamb",    label: "Lamb-Free" },
  { key: "fish",    label: "Fish-Free" },
  { key: "wheat",   label: "Wheat-Free" },
  { key: "corn",    label: "Corn-Free" },
  { key: "soy",     label: "Soy-Free" },
  { key: "dairy",   label: "Dairy-Free" },
  { key: "eggs",    label: "Egg-Free" },
];

// Grain-free uses the dedicated boolean field, not the allergens array
const GRAIN_FREE_KEY = "grain";

export default function Products() {
  const params = new URLSearchParams(window.location.search);

  const [search, setSearch] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [animalFilter, setAnimalFilter] = useState(params.get("animal") || "all");
  const [lifeStageFilter, setLifeStageFilter] = useState(params.get("life_stage") || "all");
  const [healthFilter, setHealthFilter] = useState(params.get("health") || "all");
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [allergenFreeFilters, setAllergenFreeFilters] = useState([]);

  const toggleAllergen = (key) => {
    setAllergenFreeFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => base44.entities.Product.list("-created_date", 1000),
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
      if (ingredientSearch) {
        const term = ingredientSearch.toLowerCase();
        const inIngredients = (p.top_ingredients || []).some(i => i.name?.toLowerCase().includes(term) || i.benefit?.toLowerCase().includes(term));
        const inDescription = p.description?.toLowerCase().includes(term);
        if (!inIngredients && !inDescription) return false;
      }
      if (animalFilter !== "all" && p.animal_type !== animalFilter) return false;
      if (lifeStageFilter !== "all" && p.life_stage !== lifeStageFilter) return false;
      if (healthFilter !== "all" && p.health_focus !== healthFilter) return false;
      if (foodTypeFilter !== "all" && p.food_type !== foodTypeFilter) return false;
      if (tierFilter !== "all" && p.quality_tier !== tierFilter) return false;
      if (evidenceFilter !== "all" && p.overall_evidence_confidence !== evidenceFilter) return false;
      // Allergen-free filters
      if (allergenFreeFilters.length > 0) {
        // Grain-free uses the dedicated boolean field
        if (allergenFreeFilters.includes(GRAIN_FREE_KEY) && !p.is_grain_free) return false;
        // All other allergens use exact key match against the allergens array
        const productAllergens = new Set((p.allergens || []).map((a) => a.toLowerCase()));
        for (const key of allergenFreeFilters) {
          if (key === GRAIN_FREE_KEY) continue;
          if (productAllergens.has(key)) return false;
        }
      }
      return true;
    }).sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
  }, [products, search, animalFilter, lifeStageFilter, healthFilter, foodTypeFilter, tierFilter, evidenceFilter, allergenFreeFilters]);

  const hasActiveFilters = animalFilter !== "all" || lifeStageFilter !== "all" || healthFilter !== "all" || foodTypeFilter !== "all" || tierFilter !== "all" || evidenceFilter !== "all" || search || ingredientSearch || allergenFreeFilters.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Product Library</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">All Products</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Every product analyzed ingredient-by-ingredient. Filter by food type, quality tier, and your pet's specific needs.
          </p>
        </div>
        <Link to="/food-type-guide">
          <Button variant="outline" className="gap-2 shrink-0">
            <BookOpen className="w-4 h-4" />
            Food Type Guide
          </Button>
        </Link>
      </motion.div>

      {/* Tier & Food Type quick-select */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="inline-flex flex-wrap h-auto gap-1 items-center rounded-lg bg-muted p-1 text-muted-foreground">
          {["all", "good", "better", "best"].map((t) => {
            const isActive = tierFilter === t;
            const activeClass = {
              all: isActive ? "bg-background text-foreground shadow" : "",
              good: isActive ? "bg-background text-slate-700 shadow" : "",
              better: isActive ? "bg-background text-primary shadow" : "",
              best: isActive ? "bg-background text-accent shadow" : "",
            }[t];
            const inactiveColor = {
              all: "",
              good: "text-slate-600",
              better: "text-primary/70",
              best: "text-accent/70",
            }[t];
            return (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-semibold ring-offset-background transition-all ${activeClass} ${!isActive ? inactiveColor : ""}`}
              >
                {t === "all" ? "All Tiers" : t === "best" ? "★ Best" : t === "better" ? "◆ Better" : "◇ Good"}
              </button>
            );
          })}
        </div>
        <div className="h-8 w-px bg-border self-center mx-1" />
        <div className="inline-flex flex-wrap h-auto gap-1 items-center rounded-lg bg-muted p-1 text-muted-foreground">
          {["all", "kibble", "canned", "frozen", "gently_cooked", "raw"].map((ft) => {
            const isActive = foodTypeFilter === ft;
            return (
              <button
                key={ft}
                onClick={() => setFoodTypeFilter(ft)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all ${
                  isActive ? "bg-background text-foreground shadow" : ""
                }`}
              >
                {ft === "all" ? "All Types" : FOOD_TYPE_LABELS[ft]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">More Filters</span>
          {hasActiveFilters && (
            <button
              className="ml-auto text-xs text-primary hover:underline"
              onClick={() => { setSearch(""); setIngredientSearch(""); setAnimalFilter("all"); setLifeStageFilter("all"); setHealthFilter("all"); setFoodTypeFilter("all"); setTierFilter("all"); setEvidenceFilter("all"); setAllergenFreeFilters([]); }}
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={animalFilter} onValueChange={setAnimalFilter}>
            <SelectTrigger><SelectValue placeholder="Animal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Animals</SelectItem>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
            </SelectContent>
          </Select>
          <Select value={lifeStageFilter} onValueChange={setLifeStageFilter}>
            <SelectTrigger><SelectValue placeholder="Life Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="puppy_kitten">Puppy / Kitten</SelectItem>
              <SelectItem value="adult">Adult</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="all_stages">All Life Stages</SelectItem>
            </SelectContent>
          </Select>
          <Select value={healthFilter} onValueChange={setHealthFilter}>
            <SelectTrigger><SelectValue placeholder="Health Focus" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Health</SelectItem>
              <SelectItem value="general_wellness">General Wellness</SelectItem>
              <SelectItem value="weight_management">Weight Management</SelectItem>
              <SelectItem value="joint_health">Joint Health</SelectItem>
              <SelectItem value="digestive">Digestive</SelectItem>
              <SelectItem value="skin_coat">Skin & Coat</SelectItem>
              <SelectItem value="high_protein">High Protein</SelectItem>
              <SelectItem value="grain_free">Grain Free</SelectItem>
            </SelectContent>
          </Select>
          <Select value={evidenceFilter} onValueChange={setEvidenceFilter}>
            <SelectTrigger><SelectValue placeholder="Evidence" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Evidence</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="moderate_high">Moderate-High</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="preliminary">Preliminary</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ingredient or keyword..."
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Allergen-free filters */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Avoid Allergens</span>
            <span className="text-xs text-muted-foreground">(show only products free of selected ingredients)</span>
          </div>
          <div className="inline-flex flex-wrap h-auto gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
            {/* Grain-free uses the is_grain_free boolean field */}
            {[{ key: GRAIN_FREE_KEY, label: "Grain-Free" }, ...ALLERGEN_OPTIONS].map((opt) => {
              const active = allergenFreeFilters.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => toggleAllergen(opt.key)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold ring-offset-background transition-all ${
                    active ? "bg-background text-accent shadow" : ""
                  }`}
                >
                  {active ? "✓ " : ""}{opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground font-medium">No products found matching your filters.</p>
          <button className="text-sm text-primary hover:underline mt-2" onClick={() => { setSearch(""); setIngredientSearch(""); setAnimalFilter("all"); setLifeStageFilter("all"); setHealthFilter("all"); setFoodTypeFilter("all"); setTierFilter("all"); setAllergenFreeFilters([]); }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}