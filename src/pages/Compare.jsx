import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Check, X, ArrowRight, Package, Flame, Snowflake, Leaf, Drumstick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FOOD_TYPE_CONFIG = {
  kibble:        { label: "Kibble",         icon: Package,   color: "bg-amber-100 text-amber-700 border-amber-300",   dot: "bg-amber-400" },
  canned:        { label: "Canned",         icon: Flame,     color: "bg-orange-100 text-orange-700 border-orange-300", dot: "bg-orange-400" },
  frozen:        { label: "Frozen",         icon: Snowflake, color: "bg-sky-100 text-sky-700 border-sky-300",         dot: "bg-sky-400" },
  gently_cooked: { label: "Gently Cooked",  icon: Leaf,      color: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-400" },
  raw:           { label: "Raw",            icon: Drumstick, color: "bg-rose-100 text-rose-700 border-rose-300",      dot: "bg-rose-400" },
};

const TIER_CONFIG = {
  good:   { label: "Good",   style: "bg-slate-100 text-slate-700 border-slate-300",     rank: 1 },
  better: { label: "Better", style: "bg-primary/10 text-primary border-primary/30",     rank: 2 },
  best:   { label: "Best",   style: "bg-accent/10 text-accent border-accent/30 font-bold", rank: 3 },
};

// Nutritional tier: how good is this food type?
const FOOD_TYPE_RANK = { kibble: 1, canned: 2, frozen: 3, gently_cooked: 4, raw: 5 };

const TIER_RANK = { good: 1, better: 2, best: 3 };

function FoodTypeBadge({ type }) {
  const cfg = FOOD_TYPE_CONFIG[type];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

function QualityTierBadge({ tier }) {
  const cfg = TIER_CONFIG[tier];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs ${cfg.style}`}>
      {tier === "best" ? "★ " : tier === "better" ? "◆ " : "◇ "}{cfg.label}
    </span>
  );
}

function ScoreBar({ label, value, max, unit = "", winner }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${winner ? "text-accent" : "text-foreground"}`}>{value != null ? `${value}${unit}` : "—"}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${winner ? "bg-accent" : "bg-primary/40"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ProductColumn({ product, otherProduct, side }) {
  if (!product) {
    return (
      <div className="flex-1 rounded-xl border-2 border-dashed border-border bg-muted/20 flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-muted-foreground">Select a product</p>
      </div>
    );
  }

  const maxProtein = Math.max(product.protein_pct || 0, otherProduct?.protein_pct || 0);
  const maxFat = Math.max(product.fat_pct || 0, otherProduct?.fat_pct || 0);
  const maxFiber = Math.max(product.fiber_pct || 0, otherProduct?.fiber_pct || 0);
  const maxCal = Math.max(product.calories_per_cup || 0, otherProduct?.calories_per_cup || 0);

  const isWinner = (myVal, otherVal, higherIsBetter = true) => {
    if (myVal == null || otherVal == null) return false;
    return higherIsBetter ? myVal > otherVal : myVal < otherVal;
  };

  const myFoodRank = FOOD_TYPE_RANK[product.food_type] || 0;
  const otherFoodRank = FOOD_TYPE_RANK[otherProduct?.food_type] || 0;
  const myTierRank = TIER_RANK[product.quality_tier] || 0;
  const otherTierRank = TIER_RANK[otherProduct?.quality_tier] || 0;

  const foodTypeWinner = otherProduct && myFoodRank > otherFoodRank;
  const tierWinner = otherProduct && myTierRank > otherTierRank;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: side === "right" ? 0.1 : 0 }}
      className="flex-1 rounded-xl border-2 border-border bg-card overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">🐾</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {product.rating && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1 text-xs font-bold">
            <Star className="w-3 h-3 fill-primary text-primary" />
            {product.rating}
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Header */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{product.brand}</p>
          <h3 className="font-heading text-xl font-bold text-foreground mt-0.5 leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Tier & Food Type */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Classification</p>
          <div className="flex flex-wrap gap-2">
            <div className={`relative ${foodTypeWinner ? "ring-2 ring-accent rounded-full" : ""}`}>
              <FoodTypeBadge type={product.food_type} />
              {foodTypeWinner && <span className="absolute -top-2 -right-2 text-[10px] bg-accent text-accent-foreground rounded-full px-1">▲</span>}
            </div>
            <div className={`relative ${tierWinner ? "ring-2 ring-accent rounded-full" : ""}`}>
              <QualityTierBadge tier={product.quality_tier} />
              {tierWinner && <span className="absolute -top-2 -right-2 text-[10px] bg-accent text-accent-foreground rounded-full px-1">▲</span>}
            </div>
          </div>
          {foodTypeWinner && (
            <p className="text-[11px] text-accent font-medium">↑ Higher nutritional format</p>
          )}
          {tierWinner && !foodTypeWinner && (
            <p className="text-[11px] text-accent font-medium">↑ Higher quality tier</p>
          )}
        </div>

        {/* Key Benefits */}
        {product.top_ingredients && product.top_ingredients.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Benefits</p>
            <ul className="space-y-1.5">
              {product.top_ingredients.slice(0, 4).map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  <span><span className="font-medium">{ing.name}</span>{ing.benefit ? ` — ${ing.benefit}` : ""}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nutrition */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Nutrition</p>
          <div className="space-y-3">
            <ScoreBar label="Protein" value={product.protein_pct} max={maxProtein} unit="%" winner={isWinner(product.protein_pct, otherProduct?.protein_pct)} />
            <ScoreBar label="Fat" value={product.fat_pct} max={maxFat} unit="%" winner={isWinner(product.fat_pct, otherProduct?.fat_pct)} />
            <ScoreBar label="Fiber" value={product.fiber_pct} max={maxFiber} unit="%" />
            <ScoreBar label="Calories/cup" value={product.calories_per_cup} max={maxCal} unit=" kcal" />
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center gap-1.5 p-2 rounded-md border ${product.is_grain_free ? "bg-accent/5 border-accent/20 text-accent" : "bg-muted/40 border-border text-muted-foreground"}`}>
            {product.is_grain_free ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            Grain Free
          </div>
          <div className={`flex items-center gap-1.5 p-2 rounded-md border ${!product.has_artificial_preservatives ? "bg-accent/5 border-accent/20 text-accent" : "bg-muted/40 border-border text-muted-foreground"}`}>
            {!product.has_artificial_preservatives ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            No Preservatives
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-semibold text-foreground">{product.price_range || "—"}</span>
          <Link to={`/products/${product.id}`}>
            <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
              Full Analysis <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Compare() {
  const urlParams = new URLSearchParams(window.location.search);
  const preselect = urlParams.get("a") || "";
  const [selectedIds, setSelectedIds] = useState([preselect, ""]);

  const { data: products = [] } = useQuery({
    queryKey: ["all-products-compare"],
    queryFn: () => base44.entities.Product.list("-created_date", 100),
  });

  const [productA, productB] = useMemo(() => {
    return selectedIds.map((id) => products.find((p) => String(p.id) === id) || null);
  }, [selectedIds, products]);

  const handleSelect = (index, value) => {
    const updated = [...selectedIds];
    updated[index] = value;
    setSelectedIds(updated);
  };

  // Determine overall winner
  const getVerdict = () => {
    if (!productA || !productB) return null;
    let scoreA = 0, scoreB = 0;
    const foodA = FOOD_TYPE_RANK[productA.food_type] || 0;
    const foodB = FOOD_TYPE_RANK[productB.food_type] || 0;
    const tierA = TIER_RANK[productA.quality_tier] || 0;
    const tierB = TIER_RANK[productB.quality_tier] || 0;
    if (foodA > foodB) scoreA += 2; else if (foodB > foodA) scoreB += 2;
    if (tierA > tierB) scoreA += 2; else if (tierB > tierA) scoreB += 2;
    if ((productA.protein_pct || 0) > (productB.protein_pct || 0)) scoreA += 1; else scoreB += 1;
    if (!productA.has_artificial_preservatives) scoreA += 1;
    if (!productB.has_artificial_preservatives) scoreB += 1;
    if (productA.is_grain_free) scoreA += 0.5;
    if (productB.is_grain_free) scoreB += 0.5;
    if (scoreA > scoreB) return { winner: productA, reason: "higher food type tier, quality rating, and nutritional profile" };
    if (scoreB > scoreA) return { winner: productB, reason: "higher food type tier, quality rating, and nutritional profile" };
    return { winner: null, reason: "both products are closely matched" };
  };

  const verdict = getVerdict();

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Head-to-Head</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Compare Pet Foods</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Pick two products to compare their food type tier, quality rating, key benefits, and nutritional breakdown side by side.
        </p>
      </motion.div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[0, 1].map((idx) => (
          <Select key={idx} value={selectedIds[idx]} onValueChange={(v) => handleSelect(idx, v)}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder={`Choose Product ${idx === 0 ? "A" : "B"}`} />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={String(p.id)} disabled={selectedIds[1 - idx] === String(p.id)}>
                  {p.brand} — {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Verdict Banner */}
      {verdict && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-8 rounded-xl border p-4 text-sm font-medium text-center ${
            verdict.winner
              ? "bg-accent/10 border-accent/30 text-accent"
              : "bg-muted border-border text-muted-foreground"
          }`}
        >
          {verdict.winner
            ? <>Our analysis recommends <strong>{verdict.winner.brand} {verdict.winner.name}</strong> — {verdict.reason}.</>
            : <>These products are closely matched — choose based on your pet's specific needs.</>
          }
        </motion.div>
      )}

      {/* Comparison Columns */}
      <div className="flex flex-col sm:flex-row gap-6">
        <ProductColumn product={productA} otherProduct={productB} side="left" />

        <div className="hidden sm:flex flex-col items-center justify-center gap-2 shrink-0">
          <div className="w-px flex-1 bg-border" />
          <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full w-8 h-8 flex items-center justify-center">VS</span>
          <div className="w-px flex-1 bg-border" />
        </div>
        <div className="sm:hidden text-center text-xs font-bold text-muted-foreground">— VS —</div>

        <ProductColumn product={productB} otherProduct={productA} side="right" />
      </div>
    </div>
  );
}