import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useFavorites } from "@/hooks/useFavorites";
import ProductCard from "@/components/products/ProductCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Favorites() {
  const { favorites } = useFavorites();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["all-products-favs"],
    queryFn: () => base44.entities.Product.list("-created_date", 1000),
  });

  const favorited = products.filter((p) => favorites.has(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Your List</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground flex items-center gap-3">
          <Heart className="w-9 h-9 fill-primary text-primary" /> Saved Favorites
        </h1>
        <p className="text-muted-foreground mt-3">Products you've saved for later review.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />)}
        </div>
      ) : favorited.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-lg border border-border">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No favorites saved yet.</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Tap the heart icon on any product to save it here.</p>
          <Link to="/products" className="text-primary hover:underline text-sm">Browse Products →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorited.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}