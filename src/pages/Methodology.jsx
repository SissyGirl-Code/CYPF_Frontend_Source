import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function optimizedImage(url, width = 520, height = 347) {
  if (!url) return url;
  if (/\.svg(?:\?|#|$)/i.test(url) || url.startsWith("data:")) return url;
  const source = url.replace(/^https?:\/\/chooseyourpetfood\.com/, "");
  const encoded = encodeURIComponent(source);
  return `/.netlify/images?url=${encoded}&w=${width}&h=${height}&fit=cover&fm=webp&q=72`;
}

const methodologySteps = [
  {
    num: "01",
    title: "Ingredient Deconstruction",
    description:
      "We begin by deconstructing every single ingredient listed on the label. We identify protein sources, fillers, and potential allergens to ensure your pet receives a balanced and safe nutritional profile.",
  },
  {
    num: "02",
    title: "Marketing Truth Detection",
    description:
      "We analyze marketing claims like 'premium' and 'natural' against actual nutritional data. We reveal the hidden truths behind these labels to help you make informed decisions.",
  },
  {
    num: "03",
    title: "Scientific Nutritional Audit",
    description:
      "Using veterinary standards and nutritional databases, we verify that the food meets the specific biological needs of dogs and cats, focusing on longevity and vitality.",
  },
  {
    num: "04",
    title: "Transparency Report Generation",
    description:
      "We compile all findings into a comprehensive, transparent report. This detailed breakdown empowers you with the knowledge to choose the best food for your companion.",
  },
];

const marketingTerms = [
  {
    num: "01",
    term: "Superfood",
    description:
      "A marketing term with no nutritional basis. We analyze the actual protein and fiber content instead.",
  },
  {
    num: "02",
    term: "Complete & Balanced",
    description:
      "Regulatory language, not nutritional truth. We verify every nutrient against veterinary standards.",
  },
  {
    num: "03",
    term: "Organic",
    description:
      "Often a marketing label for 'natural' or 'non-GMO'. We focus on ingredient sourcing and transparency.",
  },
  {
    num: "04",
    term: "Life Stage Formula",
    description:
      "Marketing jargon for 'different for puppies'. We provide individualized nutritional guides for every stage.",
  },
];

const transitionSteps = [
  {
    num: "01",
    title: "Gradual Shift Protocol",
    description:
      "Introduce new ingredients over a 7–10 day period to prevent digestive upset and allow your pet's system to adapt.",
  },
  {
    num: "02",
    title: "Hydration Priority",
    description:
      "Ensure fresh water is always available. Transitioning diets can affect hydration levels, so monitor your pet's water intake closely.",
  },
  {
    num: "03",
    title: "Monitor for Changes",
    description:
      "Keep a daily log of your pet's energy levels, appetite, and stool quality. This data helps you verify the nutritional benefits of the new food.",
  },
  {
    num: "04",
    title: "Consult Your Vet",
    description:
      "Always consult with your veterinarian before making significant dietary changes, especially if your pet has pre-existing health conditions.",
  },
];

export default function Methodology() {
  const { data: methodologyArticles = [], isLoading: isLoadingMethodologyArticles } = useQuery({
    queryKey: ["methodology-articles"],
    queryFn: () => base44.entities.Article.filter({ published: true, category: "methodology" }, "-created_date", 20),
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">How We Work</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Our Analysis Methodology</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          A structured, science-backed process for evaluating every product in our database — ingredient by ingredient.
        </p>
      </motion.div>

      {/* CYPF Methodology Library */}
      {(isLoadingMethodologyArticles || methodologyArticles.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">CYPF Methodology Library</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">How CYPF Evaluates Pet Food</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              These are framework pieces about our rating process, evidence standards, and how we judge science-based pet food claims.
            </p>
          </div>

          {isLoadingMethodologyArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {methodologyArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link to={`/articles/${article.id}`} className="group block h-full">
                    <div className="bg-card rounded-lg border border-border/60 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                      {article.image_url && (
                        <div className="aspect-[3/2] overflow-hidden">
                          <img
                            src={optimizedImage(article.image_url)}
                            alt={article.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs capitalize">Methodology</Badge>
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
                          Read methodology <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Analysis Methodology Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="divide-y divide-border border-t border-border">
          {methodologySteps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 py-10"
            >
              <div className="font-mono text-primary font-semibold text-sm">[{step.num}]</div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">{step.title}</h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Marketing Deconstruction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24 rounded-xl bg-foreground text-background p-8 md:p-14"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Marketing Deconstruction</h2>
        <p className="text-background/70 mb-12 max-w-lg">
          Decoding the language of pet food advertising to reveal the truth behind every label.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {marketingTerms.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <p className="font-mono text-primary text-sm font-semibold mb-2">[{item.num}]</p>
              <h3 className="font-heading text-2xl font-bold line-through text-background/80 mb-3 leading-tight">
                {item.term}
              </h3>
              <p className="text-background/65 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* The Transition Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl bg-accent/10 border border-accent/20 p-8 md:p-14"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">The Transition Path</h2>
            <p className="text-muted-foreground leading-relaxed">
              Changing your pet's diet is a significant step toward longevity. We provide a structured, transparent
              approach to ensure a smooth and healthy shift.
            </p>
          </div>
          <div className="space-y-8">
            {transitionSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <p className="font-mono text-accent font-semibold text-sm mb-1">[ {step.num} ]</p>
                <h3 className="font-heading text-xl font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 text-center bg-card rounded-xl border border-border p-10"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Apply the Knowledge</p>
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Explore Our Rated Products</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
          Every product in our database has been put through this exact process. Browse the results.
        </p>
        <Link to="/products">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold">
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
