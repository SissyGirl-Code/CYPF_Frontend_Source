import { motion } from "framer-motion";
import { Microscope, Shield, Heart } from "lucide-react";

const pillars = [
  {
    icon: Microscope,
    title: "Ingredient Forensics",
    desc: "Every product is deconstructed to its raw nutritional components. No marketing fluff.",
  },
  {
    icon: Shield,
    title: "Editorial Independence",
    desc: "Our ratings are never influenced by affiliate partnerships. Science drives every recommendation.",
  },
  {
    icon: Heart,
    title: "Longevity Focus",
    desc: "We evaluate nutrition through the lens of long-term health outcomes, not just palatability.",
  },
];

export default function TrustBanner({ ingredientImage }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={ingredientImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Our Philosophy</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Biological Honesty
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-2xl mx-auto text-base">
            We believe that true pet health is built on transparency. Our mission is to deconstruct the marketing noise and reveal the nutritional truth behind every ingredient. By providing authoritative analysis and educational guides, we empower you to make informed decisions that extend your pet's life and well-being.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}