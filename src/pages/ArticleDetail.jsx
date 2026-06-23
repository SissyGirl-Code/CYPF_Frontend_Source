import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ArticleDetail() {
  const urlParts = window.location.pathname.split("/");
  const articleId = urlParts[urlParts.length - 1];

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const articles = await base44.entities.Article.filter({ id: articleId });
      return articles[0];
    },
    enabled: !!articleId,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="h-64 bg-muted rounded-lg animate-pulse mb-8" />
        <div className="h-8 bg-muted rounded animate-pulse mb-4 w-2/3" />
        <div className="h-4 bg-muted rounded animate-pulse mb-2 w-full" />
        <div className="h-4 bg-muted rounded animate-pulse mb-2 w-5/6" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link to="/articles" className="text-primary hover:underline text-sm mt-2 inline-block">Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
      <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Knowledge Ledger
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {article.image_url && (
          <div className="aspect-[2/1] rounded-lg overflow-hidden mb-8">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          {article.category && (
            <Badge variant="secondary" className="capitalize">{article.category}</Badge>
          )}
          {article.read_time && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" /> {article.read_time} min read
            </span>
          )}
          {article.created_date && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> {format(new Date(article.created_date), "MMM d, yyyy")}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary pl-4">
            {article.excerpt}
          </p>
        )}

        {article.content && (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="font-heading text-3xl font-bold mt-10 mb-4 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="font-heading text-2xl font-semibold mt-8 mb-3 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="font-heading text-xl font-semibold mt-6 mb-2 text-foreground">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-foreground/90 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 ml-6 list-disc text-foreground/90 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal text-foreground/90 space-y-1">{children}</ol>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary pl-4 my-6 italic text-muted-foreground">{children}</blockquote>
                ),
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        )}
      </motion.article>
    </div>
  );
}