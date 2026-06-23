import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, Leaf, ShieldCheck, Flame, GitCompareArrows } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import IngredientMatrix from "../components/products/IngredientMatrix";
import AllergenPanel from "../components/products/AllergenPanel";
import PriceWidget from "../components/products/PriceWidget";
import EvidenceReport from "../components/products/EvidenceReport";
import { EvidenceConfidenceBadge, ReportStatusBadge } from "../components/products/EvidenceBadges";
import { FoodTypeBadge, QualityTierBadge } from "../components/products/FoodTypeBadge";

export default function ProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const urlParts = window.location.pathname.split("/");
  const productId = urlParts[urlParts.length - 1];

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/products" className="text-primary hover:underline text-sm mt-2 inline-block">Back to Products</Link>
      </div>
    );
  }

  const healthLabels = {
    weight_management: "Weight Management",
    joint_health: "Joint Health",
    digestive: "Digestive Health",
    skin_coat: "Skin & Coat",
    general_wellness: "General Wellness",
    high_protein: "High Protein",
    grain_free: "Grain Free",
  };

  const lifeStageLabels = {
    puppy_kitten: "Puppy / Kitten",
    adult: "Adult",
    senior: "Senior",
    all_stages: "All Life Stages",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <Link to={`/compare?a=${productId}`}>
          <Button variant="outline" className="gap-2 text-sm">
            <GitCompareArrows className="w-4 h-4" /> Compare with Another
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {product.image_url && (
              <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8 bg-muted">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">{product.brand}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {product.quality_tier && <QualityTierBadge tier={product.quality_tier} size="md" />}
              {product.food_type && <FoodTypeBadge type={product.food_type} size="md" />}
              <EvidenceConfidenceBadge confidence={product.overall_evidence_confidence} />
              <ReportStatusBadge status={product.report_status} />
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold">{product.rating}/5</span>
                </div>
              )}
              {product.animal_type && (
                <Badge variant="secondary" className="capitalize">{product.animal_type}</Badge>
              )}
              {product.life_stage && (
                <Badge variant="secondary">{lifeStageLabels[product.life_stage] || product.life_stage}</Badge>
              )}
              {product.health_focus && (
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  {healthLabels[product.health_focus] || product.health_focus}
                </Badge>
              )}
              {product.is_grain_free && (
                <Badge variant="outline" className="text-accent border-accent/30">
                  <Leaf className="w-3 h-3 mr-1" /> Grain-Free
                </Badge>
              )}
              {!product.has_artificial_preservatives && (
                <Badge variant="outline" className="text-accent border-accent/30">
                  <ShieldCheck className="w-3 h-3 mr-1" /> No Artificial Preservatives
                </Badge>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
            )}

            {/* Nutritional Breakdown */}
            {(product.protein_pct || product.fat_pct || product.fiber_pct) && (
              <div className="mb-10">
                <h2 className="font-heading text-xl font-semibold mb-4">Nutritional Profile</h2>
                <div className="space-y-4 bg-card rounded-lg border border-border p-6">
                  {product.protein_pct != null && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Protein</span>
                        <span className="text-muted-foreground">{product.protein_pct}%</span>
                      </div>
                      <Progress value={product.protein_pct} className="h-2" />
                    </div>
                  )}
                  {product.fat_pct != null && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Fat</span>
                        <span className="text-muted-foreground">{product.fat_pct}%</span>
                      </div>
                      <Progress value={product.fat_pct} className="h-2" />
                    </div>
                  )}
                  {product.fiber_pct != null && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Fiber</span>
                        <span className="text-muted-foreground">{product.fiber_pct}%</span>
                      </div>
                      <Progress value={product.fiber_pct * 5} className="h-2" />
                    </div>
                  )}
                  {product.calories_per_cup && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Flame className="w-4 h-4 text-primary" />
                      <span className="text-sm"><strong>{product.calories_per_cup}</strong> kcal/cup</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ingredient Matrix */}
            <IngredientMatrix ingredients={product.top_ingredients} />

            {/* Key Ingredients & Allergens */}
            <AllergenPanel allergens={product.allergens} topIngredients={product.top_ingredients} />

            <EvidenceReport product={product} />
          </motion.div>
        </div>

        {/* Sticky sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <PriceWidget affiliateLinks={product.affiliate_links} productName={product.name} />

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Affiliate Disclosure:</strong> Links above may earn us a commission at no extra cost to you. 
                Our ratings and analysis remain editorially independent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}