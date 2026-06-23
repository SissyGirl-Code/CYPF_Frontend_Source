import { AlertTriangle, ShieldCheck } from "lucide-react";

// Common allergens with display labels and colors
const ALLERGEN_META = {
  chicken:  { label: "Chicken",  color: "bg-amber-100 text-amber-800 border-amber-300" },
  beef:     { label: "Beef",     color: "bg-red-100 text-red-800 border-red-300" },
  lamb:     { label: "Lamb",     color: "bg-orange-100 text-orange-800 border-orange-300" },
  fish:     { label: "Fish",     color: "bg-sky-100 text-sky-800 border-sky-300" },
  wheat:    { label: "Wheat",    color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  corn:     { label: "Corn",     color: "bg-lime-100 text-lime-800 border-lime-300" },
  soy:      { label: "Soy",      color: "bg-green-100 text-green-800 border-green-300" },
  dairy:    { label: "Dairy",    color: "bg-blue-100 text-blue-800 border-blue-300" },
  eggs:     { label: "Eggs",     color: "bg-purple-100 text-purple-800 border-purple-300" },
  pork:     { label: "Pork",     color: "bg-pink-100 text-pink-800 border-pink-300" },
  potato:   { label: "Potato",   color: "bg-stone-100 text-stone-800 border-stone-300" },
};

export default function AllergenPanel({ allergens, topIngredients }) {
  const hasAllergens = allergens && allergens.length > 0;
  const hasIngredients = topIngredients && topIngredients.length > 0;

  if (!hasAllergens && !hasIngredients) return null;

  return (
    <div className="mb-10 space-y-6">
      {/* Key Ingredients */}
      {hasIngredients && (
        <div>
          <h2 className="font-heading text-xl font-semibold mb-4">Key Ingredients</h2>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {topIngredients.map((ing, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 px-5 py-4 ${i < topIngredients.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{ing.name}</p>
                  {ing.benefit && (
                    <p className="text-xs text-muted-foreground mt-0.5">{ing.benefit}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergen section */}
      <div>
        <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Common Allergens
        </h2>

        {hasAllergens ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs text-amber-700 mb-4 font-medium">
              This product contains or may contain the following common allergens. Always consult your veterinarian if your pet has known sensitivities.
            </p>
            <div className="flex flex-wrap gap-2">
              {allergens.map((allergen) => {
                const meta = ALLERGEN_META[allergen.toLowerCase()] || {
                  label: allergen,
                  color: "bg-muted text-foreground border-border",
                };
                return (
                  <span
                    key={allergen}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${meta.color}`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-5 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
            <p className="text-sm text-accent font-medium">No common allergens listed for this product.</p>
          </div>
        )}
      </div>
    </div>
  );
}