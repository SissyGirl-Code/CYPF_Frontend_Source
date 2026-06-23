import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductCard from "../products/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => base44.entities.Product.filter({ featured: true }, "-created_date", 6),
  });

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Curated Selection</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Editor's Picks</h2>
        </div>
        <Link to="/products" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View all products <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}