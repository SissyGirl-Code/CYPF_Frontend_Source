import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const topics = [
  {
    num: "01",
    title: "Essential Amino Acids",
    description: "Decoding the building blocks for muscle repair and longevity.",
    detail:
      "Amino acids like taurine, lysine, and methionine are critical for heart function, immune response, and lean muscle development. Many commercial foods under-report true amino acid bioavailability after heat processing.",
  },
  {
    num: "02",
    title: "Omega Fatty Acids",
    description: "The truth behind skin health and coat shine.",
    detail:
      "Omega-3 (DHA/EPA) and Omega-6 fatty acids must be in the correct ratio. Too much Omega-6 without adequate Omega-3 drives chronic inflammation. Cold-pressed oils and fish meals retain more active fatty acids than rendered alternatives.",
  },
  {
    num: "03",
    title: "Mineral Balance",
    description: "Understanding calcium, phosphorus, and bone density.",
    detail:
      "The calcium-to-phosphorus ratio directly impacts skeletal integrity, especially in large-breed puppies and senior dogs. High-phosphorus diets without adequate calcium accelerate bone resorption and can stress the kidneys.",
  },
  {
    num: "04",
    title: "Vital Nutrients",
    description: "The critical role of taurine and antioxidants.",
    detail:
      "Taurine deficiency has been linked to dilated cardiomyopathy (DCM) in dogs, particularly on grain-free diets. Antioxidants like Vitamin E and selenium help neutralize free radicals and support immune system longevity.",
  },
  {
    num: "05",
    title: "Protein Quality",
    description: "Analyzing protein sources for optimal digestion.",
    detail:
      "Not all protein is equal. Whole named meats (e.g., 'chicken') are more bioavailable than 'meat meal' or 'by-product meal'. Biological value (BV) scores help rank how efficiently a protein source is used by the body.",
  },
  {
    num: "06",
    title: "Digestive Health",
    description: "The importance of fiber and gut microbiome support.",
    detail:
      "Prebiotic fibers like chicory root, psyllium husk, and beet pulp feed beneficial gut bacteria. A healthy microbiome is strongly correlated with immunity, mood, and nutrient absorption efficiency.",
  },
];

export default function NutritionScience() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">The Science</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Nutrition Science</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          The biochemical foundations of pet nutrition — what really matters inside the bag, can, or bowl.
        </p>
        <div className="w-12 h-0.5 bg-accent mt-6" />
      </motion.div>

      {/* Topic List */}
      <div className="space-y-0">
        {topics.map((topic, idx) => (
          <motion.div
            key={topic.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.07 }}
            className="group border-b border-border py-10 grid grid-cols-1 md:grid-cols-[80px_1fr_2fr] gap-4 md:gap-8 items-start hover:bg-muted/20 transition-colors px-2 rounded-sm"
          >
            <div className="text-primary font-mono font-semibold text-lg">{topic.num}</div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-1">{topic.title}</h2>
              <p className="text-muted-foreground text-sm">{topic.description}</p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed hidden md:block">{topic.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Mobile detail expansion fallback — show detail below on small screens */}
      <div className="md:hidden mt-4 space-y-6">
        {topics.map((topic) => (
          <div key={topic.num + "-detail"} className="bg-card rounded-lg border border-border p-4">
            <p className="font-mono text-primary text-xs font-semibold mb-1">{topic.num} — {topic.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{topic.detail}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 text-center bg-card rounded-xl border border-border p-10"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Put It Into Practice</p>
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">See How Products Score</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
          We apply these nutritional frameworks to every product we review. Browse the full database.
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