import { Link } from "react-router-dom";
import { Star, ArrowRight, Leaf, ShieldCheck, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FoodTypeBadge, QualityTierBadge } from "./FoodTypeBadge";
import { EvidenceConfidenceBadge, ReportStatusBadge } from "./EvidenceBadges";
import { useFavorites } from "@/hooks/useFavorites";
function optimizedImage(url, width = 480, height = 360) {
  if (!url) return url;
  if (/\.svg(?:\?|#|$)/i.test(url) || url.startsWith("data:")) return url;
  const source = url.replace(/^https?:\/\/chooseyourpetfood\.com/, "");
  const encoded = encodeURIComponent(source);
  return `/.netlify/images?url=${encoded}&w=${width}&h=${height}&fit=cover&fm=webp&q=72`;
}

export default function ProductCard({ product, index = 0 }) {
  const { isFavorite, toggle } = useFavorites();
  const faved = isFavorite(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="bg-card rounded-lg border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {product.image_url ? (
              <img
  src={optimizedImage(product.image_url)}
  alt={product.name}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {product.quality_tier && <QualityTierBadge tier={product.quality_tier} />}
              {product.food_type && <FoodTypeBadge type={product.food_type} />}
            </div>
            {product.featured && (
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs">
                Editor's Pick
              </Badge>
            )}
            <button
              onClick={(e) => { e.preventDefault(); toggle(product.id); }}
              className="absolute bottom-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white shadow transition-all"
              aria-label={faved ? "Remove from favorites" : "Save to favorites"}
            >
              <Heart className={`w-4 h-4 transition-colors ${faved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
            </button>
          </div>

          <div className="p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {product.brand}
            </p>
            <h3 className="font-heading text-lg font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-3 mb-3">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              )}
              {product.is_grain_free && (
                <div className="flex items-center gap-1 text-accent">
                  <Leaf className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Grain-Free</span>
                </div>
              )}
              {!product.has_artificial_preservatives && (
                <div className="flex items-center gap-1 text-accent">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Clean</span>
                </div>
              )}
            </div>

            {product.protein_pct && (
              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                <span>Protein {product.protein_pct}%</span>
                {product.fat_pct && <span>Fat {product.fat_pct}%</span>}
                {product.fiber_pct && <span>Fiber {product.fiber_pct}%</span>}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mb-3">
              <EvidenceConfidenceBadge confidence={product.overall_evidence_confidence} size="xs" />
              <ReportStatusBadge status={product.report_status} size="xs" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <span className="text-sm font-semibold text-foreground">{product.price_range || "View Prices"}</span>
              <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}