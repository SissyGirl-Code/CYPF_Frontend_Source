import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Articles() {
  const params = new URLSearchParams(window.location.search);
  const [category, setCategory] = useState(params.get("category") || "all");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => base44.entities.Article.filter({ published: true }, "-created_date", 500),
  });

  const CATEGORY_ORDER = { nutrition: 0, health: 1, ingredients: 2, breeds: 3, guides: 4 };

  const filtered = useMemo(() => {
    const list = category === "all" ? articles : articles.filter((a) => a.category === category);
    if (category !== "all") return list;
    return [...list].sort((a, b) => {
      const orderA = CATEGORY_ORDER[a.category] ?? 99;
      const orderB = CATEGORY_ORDER[b.category] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.created_date) - new Date(a.created_date);
    });
  }, [articles, category]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Knowledge Ledger</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Nutrition &amp; Breeds</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Deep-dive articles and information on ingredients, nutrition science, and breeds, in order to make informed choices for your pet's longevity.
        </p>
      </motion.div>

      <Tabs value={category} onValueChange={setCategory} className="mb-8">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="breeds">Breeds</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No articles found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/articles/${article.id}`} className="group block h-full">
                <div className="bg-card rounded-lg border border-border/60 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  {article.image_url && (
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      {article.category && (
                        <Badge variant="secondary" className="text-xs capitalize">{article.category}</Badge>
                      )}
                      {article.read_time && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" /> {article.read_time} min
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors leading-tight mb-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-primary font-medium mt-4">
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}