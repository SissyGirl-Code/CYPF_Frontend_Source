import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

function optimizedImage(url, width = 520, height = 347) {
  if (!url) return url;
  if (/\.svg(?:\?|#|$)/i.test(url) || url.startsWith("data:")) return url;
  const source = url.replace(/^https?:\/\/chooseyourpetfood\.com/, "");
  const encoded = encodeURIComponent(source);
  return `/.netlify/images?url=${encoded}&w=${width}&h=${height}&fit=cover&fm=webp&q=72`;
}

const HIDDEN_ARTICLE_CATEGORIES = new Set(["methodology", "transparency"]);

export default function KnowledgePreview() {
  const { data: articles = [] } = useQuery({
    queryKey: ["recent-articles"],
    queryFn: async () => {
      const items = await base44.entities.Article.filter({ published: true }, "-created_date", 12);
      return items
        .filter((article) => !HIDDEN_ARTICLE_CATEGORIES.has(article.category))
        .slice(0, 3);
    },
  });

  if (articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Knowledge Ledger</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Nutritional Intelligence</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link to={`/articles/${article.id}`} className="group block">
              <div className="bg-card rounded-lg border border-border/60 overflow-hidden hover:shadow-md transition-shadow">
                {article.image_url && (
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src={optimizedImage(article.image_url)}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {article.category && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {article.category}
                      </Badge>
                    )}
                    {article.read_time && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {article.read_time} min
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/articles" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Explore all articles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
