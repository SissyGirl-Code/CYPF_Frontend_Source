import { motion } from "framer-motion";
import { Package, Flame, Snowflake, Leaf, Drumstick, Check, X, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const foodTypes = [
  {
    key: "kibble",
    icon: Package,
    label: "Kibble",
    subtitle: "Dry Extruded Food",
    color: "amber",
    bgClass: "bg-amber-50 border-amber-200",
    iconClass: "bg-amber-100 text-amber-700",
    accentClass: "text-amber-700",
    description:
      "The most widely fed format. Kibble is made by extruding a dough of ingredients under high heat and pressure, then drying it into shelf-stable pellets. Convenient and affordable, but the high-heat process degrades heat-sensitive nutrients like amino acids, omega fatty acids, and enzymes.",
    pros: [
      "Most affordable option per serving",
      "Longest shelf life (12–18 months)",
      "Dental abrasion may help reduce plaque",
      "Convenient to measure and store",
      "Widest brand and formula selection",
    ],
    cons: [
      "High-heat processing destroys heat-sensitive nutrients",
      "Low moisture content (~10%) may contribute to chronic dehydration",
      "Typically contains starches/fillers to hold pellet shape",
      "Rendered ingredients may be of lower quality",
      "Mycotoxin contamination risk in grains",
    ],
    best_for: "Budget-conscious owners, dogs/cats with no health issues, multi-pet households",
    brands: ["Purina Pro Plan", "Hill's Science Diet", "Royal Canin", "Iams", "Eukanuba", "Pedigree", "Kibbles 'n Bits", "Taste of the Wild", "Merrick", "Orijen", "Acana", "Fromm", "Wellness Complete", "Blue Buffalo", "Diamond Naturals", "Nutro", "Natural Balance", "4Health", "Victor", "SportMix"],
    tier_guidance: {
      good: "Purina One, Iams, Pedigree — meet AAFCO minimums, affordable",
      better: "Purina Pro Plan, Hill's Science Diet, Royal Canin — research-backed formulas",
      best: "Orijen, Acana, Fromm, Victor — high meat content, premium sourcing",
    },
  },
  {
    key: "canned",
    icon: Flame,
    label: "Canned",
    subtitle: "Wet / Pâté Food",
    color: "orange",
    bgClass: "bg-orange-50 border-orange-200",
    iconClass: "bg-orange-100 text-orange-700",
    accentClass: "text-orange-700",
    description:
      "Canned food is cooked inside sealed cans at high temperatures to achieve sterility. With ~70–80% moisture content, it's significantly more hydrating than kibble. The cooking process still degrades some nutrients, but the sealed environment prevents oxidation and preserves flavor.",
    pros: [
      "High moisture content (70–80%) supports urinary health",
      "Highly palatable — ideal for picky eaters",
      "Typically higher meat content than kibble",
      "Sealed process eliminates need for artificial preservatives",
      "Better for cats who naturally have low thirst drive",
    ],
    cons: [
      "Significantly more expensive per calorie",
      "Shorter shelf life once opened (3–5 days refrigerated)",
      "Heavy packaging creates environmental waste",
      "BPA concern with some can linings",
      "Can contribute to dental tartar without abrasion",
    ],
    best_for: "Cats, senior pets, pets with urinary issues, picky eaters, post-surgery recovery",
    brands: ["Fancy Feast", "Friskies", "9Lives", "Wellness CORE", "Blue Buffalo Homestyle", "Merrick Grain Free", "Weruva", "Tiki Cat", "Ziwi Peak", "Dave's Pet Food", "Nature's Logic", "Halo", "Castor & Pollux", "Nulo", "Instinct Original"],
    tier_guidance: {
      good: "Fancy Feast Classic, Friskies, 9Lives — affordable pâté with named proteins",
      better: "Wellness, Blue Buffalo Homestyle, Merrick — limited ingredients, quality meats",
      best: "Ziwi Peak, Weruva, Tiki Cat — air-dried/minimally processed, high meat %",
    },
  },
  {
    key: "frozen",
    icon: Snowflake,
    label: "Freeze-Dried",
    subtitle: "Freeze-Dried",
    color: "sky",
    bgClass: "bg-sky-50 border-sky-200",
    iconClass: "bg-sky-100 text-sky-700",
    accentClass: "text-sky-700",
    description:
      "Frozen food preserves nutrients without heat. Freeze-dried formats remove moisture via sublimation at low temperatures, locking in enzymes, vitamins, and amino acids. Standard frozen raw is simply raw meat blends flash-frozen to maintain freshness. Both formats offer superior nutrient retention.",
    pros: [
      "Freeze-drying preserves 97%+ of original nutrients",
      "No high-heat processing — enzymes and amino acids intact",
      "Excellent palatability",
      "Convenient freeze-dried format rehydrates easily",
      "Long shelf life when sealed (freeze-dried: 2+ years)",
    ],
    cons: [
      "Premium price point — highest cost per serving",
      "Requires freezer or cool storage",
      "Freeze-dried rehydration step adds prep time",
      "Risk of bacterial contamination if not handled correctly",
      "Not ideal for immunocompromised pets without veterinary guidance",
    ],
    best_for: "Health-focused owners, dogs/cats needing maximum nutrition, transition to raw",
    brands: ["Stella & Chewy's", "Primal Pet Foods", "Steve's Real Food", "Instinct Raw", "Northwest Naturals", "Raw Paws Pet Food", "Darwin's Natural Pet Products", "Small Batch", "Vital Essentials", "OC Raw Dog", "Nature's Variety", "Carnivore Minds"],
    tier_guidance: {
      good: "Instinct Raw Boost Mixers — freeze-dried toppers at accessible price",
      better: "Primal, Northwest Naturals — complete freeze-dried meals",
      best: "Stella & Chewy's, Vital Essentials — single-ingredient proteins, rigorous testing",
    },
  },
  {
    key: "gently_cooked",
    icon: Leaf,
    label: "Gently Cooked",
    subtitle: "Low-Temperature Cooked",
    color: "emerald",
    bgClass: "bg-emerald-50 border-emerald-200",
    iconClass: "bg-emerald-100 text-emerald-700",
    accentClass: "text-emerald-700",
    description:
      "The newest and fastest-growing category. Gently cooked foods use sous-vide, steam, or low-temperature batch cooking to pasteurize without destroying heat-sensitive nutrients. The result is a food with the safety of cooked meals and the nutrition density closer to raw.",
    pros: [
      "Low-heat preserves more nutrients than kibble or canned",
      "Pasteurized for safety — suitable for all households",
      "Whole food ingredients are visible and recognizable",
      "High palatability and digestibility",
      "Human-grade manufacturing in many brands",
    ],
    cons: [
      "Expensive — typically subscription-based delivery model",
      "Requires refrigeration (7–14 day shelf life)",
      "Less portable than kibble",
      "Subscription models may lack flexibility",
      "Relatively new category with less long-term research",
    ],
    best_for: "Health-conscious owners, senior dogs, dogs with digestive issues, owners wanting whole-food ingredients",
    brands: ["The Farmer's Dog", "Ollie", "Nom Nom (JustFoodForDogs)", "Spot & Tango", "PetPlate", "Jinx", "A Pup Above", "Chip", "Raised Right", "Human Grade Dog Food", "Evermore Pet Food"],
    tier_guidance: {
      good: "PetPlate, Spot & Tango Unkibble — lightly processed, affordable subscription",
      better: "Ollie, Nom Nom — human-grade, vet-formulated, WSAVA compliance",
      best: "The Farmer's Dog, A Pup Above — USDA-certified human-grade, peer-reviewed recipes",
    },
  },
  {
    key: "raw",
    icon: Drumstick,
    label: "Raw / Flash Frozen",
    subtitle: "Biologically Appropriate Raw Food (BARF)",
    color: "rose",
    bgClass: "bg-rose-50 border-rose-200",
    iconClass: "bg-rose-100 text-rose-700",
    accentClass: "text-rose-700",
    description:
      "Raw diets mimic the ancestral diet of wild canines and felines — unprocessed meat, organs, and bone. Advocates cite improved coat, smaller stools, and increased energy. Critics point to bacterial risks (Salmonella, E. coli) and nutritional imbalance in DIY preparations. Commercial raw has improved dramatically with rigorous testing.",
    pros: [
      "Closest to ancestral diet composition",
      "Highest bioavailability of nutrients — no heat degradation",
      "Naturally high moisture content",
      "Reduced stool volume and odor",
      "No synthetic preservatives, fillers, or binders",
    ],
    cons: [
      "Risk of Salmonella, E. coli — zoonotic risk to humans",
      "Not recommended for immunocompromised pets or owners",
      "DIY raw diets are frequently nutritionally unbalanced",
      "Requires careful handling, separate storage",
      "Most expensive format per calorie",
    ],
    best_for: "Experienced raw feeders, healthy adult dogs, high-performance/working dogs",
    brands: ["Primal Pet Foods", "Darwin's Natural Pet Products", "Raw Paws Pet Food", "Steve's Real Food", "Answers Pet Food", "Big Country Raw", "Tollden Farms", "Iron Will Raw", "Carnivore Minds", "Kiwi Kitchens", "Bold by Nature", "My Pet Carnivore"],
    tier_guidance: {
      good: "Raw Paws, My Pet Carnivore — single-source proteins at budget price points",
      better: "Primal, Steve's Real Food — HPP-treated for safety, complete & balanced",
      best: "Darwin's, Answers Pet Food — small-batch, third-party tested, whole-animal philosophy",
    },
  },
];

const colorMap = {
  amber: { dot: "bg-amber-400", border: "border-amber-300" },
  orange: { dot: "bg-orange-400", border: "border-orange-300" },
  sky: { dot: "bg-sky-400", border: "border-sky-300" },
  emerald: { dot: "bg-emerald-400", border: "border-emerald-300" },
  rose: { dot: "bg-rose-400", border: "border-rose-300" },
};

export default function FoodTypeGuide() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">The Format Encyclopedia</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Food Type Guide</h1>
        <p className="text-muted-foreground mt-3 max-w-3xl text-base leading-relaxed">
          Not all pet food is created equal — and the <em>format</em> matters as much as the ingredients. 
          Understand the science behind each type, their tradeoffs, and which tier brands belong to before you buy.
        </p>

        {/* Quick nav */}
        <div className="inline-flex flex-wrap h-auto gap-1 rounded-lg bg-muted p-1 mt-8">
          {foodTypes.map((ft) => {
            const Icon = ft.icon;
            return (
              <a key={ft.key} href={`#${ft.key}`} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-sm font-medium transition-all hover:shadow-sm ${ft.bgClass}`}>
                <Icon className="w-3.5 h-3.5" />
                {ft.label}
              </a>
            );
          })}
        </div>
      </motion.div>

      {/* Nutrition Hierarchy Ladder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="font-heading text-2xl font-bold mb-2">Nutrition Hierarchy</h2>
        <p className="text-sm text-muted-foreground mb-8">Ranked from lowest to highest nutritional quality based on processing level, moisture content, and bioavailability.</p>
        <div className="flex flex-col gap-0">
          {[
            { rank: 5, label: "Raw / Flash Frozen", subtitle: "Biologically Appropriate Raw Food", icon: Drumstick, bg: "bg-rose-500", bar: "w-full", note: "Highest bioavailability · Zero heat processing · Ancestral diet" },
            { rank: 4, label: "Gently Cooked", subtitle: "Low-Temperature / Sous-Vide", icon: Leaf, bg: "bg-emerald-500", bar: "w-5/6", note: "Near-raw nutrition · Pasteurized for safety · Human-grade ingredients" },
            { rank: 3, label: "Freeze-Dried", subtitle: "Freeze-Dried", icon: Snowflake, bg: "bg-sky-500", bar: "w-4/6", note: "Nutrient-dense · Enzymes preserved · No heat degradation" },
            { rank: 2, label: "Canned", subtitle: "Wet / Pâté", icon: Flame, bg: "bg-orange-500", bar: "w-3/6", note: "High moisture · Better than kibble · Some heat degradation" },
            { rank: 1, label: "Kibble", subtitle: "Dry Extruded", icon: Package, bg: "bg-amber-500", bar: "w-2/6", note: "Convenient & affordable · Lowest moisture · Highest heat processing" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <a key={item.rank} href={`#${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                className="group flex items-center gap-4 p-4 border border-border bg-card hover:bg-muted/30 transition-colors first:rounded-t-lg last:rounded-b-lg border-b-0 last:border-b"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.bg} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">— {item.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.bg} ${item.bar} transition-all`} />
                    </div>
                    <span className="text-[11px] text-muted-foreground hidden sm:block">{item.note}</span>
                  </div>
                </div>
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${item.bg}`}>
                  {item.rank}
                </div>
              </a>
            );
          })}
        </div>
      </motion.div>

      {/* Comparison Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="font-heading text-2xl font-bold mb-6">At-a-Glance Comparison</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left p-4 font-semibold border-b border-border">Format (lowest → best)</th>
                <th className="text-center p-4 font-semibold border-b border-border">Nutrient Retention</th>
                <th className="text-center p-4 font-semibold border-b border-border">Moisture</th>
                <th className="text-center p-4 font-semibold border-b border-border">Convenience</th>
                <th className="text-center p-4 font-semibold border-b border-border">Cost/Day</th>
                <th className="text-center p-4 font-semibold border-b border-border">Shelf Life</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { label: "Kibble", rank: "1 — Lowest", color: "amber", nutrient: "Low", moisture: "~10%", convenience: "★★★★★", cost: "$", shelf: "12–18 mo" },
                { label: "Canned", rank: "2", color: "orange", nutrient: "Medium", moisture: "70–80%", convenience: "★★★★", cost: "$$", shelf: "2–5 yr sealed" },
                { label: "Freeze-Dried", rank: "3", color: "sky", nutrient: "High", moisture: "Varies", convenience: "★★★", cost: "$$$", shelf: "1–2 yr frozen" },
                { label: "Gently Cooked", rank: "4", color: "emerald", nutrient: "Very High", moisture: "60–70%", convenience: "★★★★", cost: "$$$", shelf: "7–14 days" },
                { label: "Raw / Flash Frozen", rank: "5 — Best", color: "rose", nutrient: "Highest", moisture: "65–75%", convenience: "★★", cost: "$$$$", shelf: "2–4 days" },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorMap[row.color].dot}`} />
                      <span>{row.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-4">{row.rank}</span>
                  </td>
                  <td className="p-4 text-center">{row.nutrient}</td>
                  <td className="p-4 text-center text-muted-foreground">{row.moisture}</td>
                  <td className="p-4 text-center">{row.convenience}</td>
                  <td className="p-4 text-center font-semibold text-primary">{row.cost}</td>
                  <td className="p-4 text-center text-muted-foreground text-xs">{row.shelf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Individual type deep dives */}
      <div className="space-y-20">
        {foodTypes.map((ft, idx) => {
          const Icon = ft.icon;
          return (
            <motion.section
              key={ft.key}
              id={ft.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={`rounded-xl border-2 p-6 md:p-10 ${ft.bgClass}`}>
                <div className="flex flex-wrap items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${ft.iconClass}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className={`font-heading text-2xl md:text-3xl font-bold ${ft.accentClass}`}>{ft.label}</h2>
                    <p className="text-sm text-muted-foreground font-medium">{ft.subtitle}</p>
                  </div>
                </div>

                <p className="text-base text-foreground/90 leading-relaxed mb-8 max-w-3xl">{ft.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" /> Advantages
                    </h3>
                    <ul className="space-y-2">
                      {ft.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
                      <X className="w-4 h-4 text-destructive/60" /> Considerations
                    </h3>
                    <ul className="space-y-2">
                      {ft.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <X className="w-3.5 h-3.5 text-destructive/60 mt-0.5 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Good / Better / Best */}
                <div className="mb-8">
                  <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" /> Good · Better · Best
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["good", "better", "best"].map((tier) => {
                      const tierStyles = {
                        good: "bg-white/60 border-slate-200",
                        better: "bg-white/80 border-primary/30",
                        best: "bg-white border-accent/40",
                      };
                      const tierLabelStyles = {
                        good: "text-slate-600",
                        better: "text-primary",
                        best: "text-accent font-bold",
                      };
                      return (
                        <div key={tier} className={`rounded-lg border p-4 ${tierStyles[tier]}`}>
                          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${tierLabelStyles[tier]}`}>
                            {tier === "best" ? "★ Best" : tier === "better" ? "◆ Better" : "◇ Good"}
                          </p>
                          <p className="text-xs text-foreground/80 leading-relaxed">{ft.tier_guidance[tier]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-6">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Known Brands in This Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {ft.brands.map((b) => (
                      <span key={b} className="text-xs px-2.5 py-1 bg-white/70 rounded-full border border-border text-foreground/80">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`rounded-md p-3 bg-white/50 border border-current/10 text-sm`}>
                  <span className="font-semibold">Best for: </span>
                  <span className="text-foreground/80">{ft.best_for}</span>
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 text-center bg-card rounded-xl border border-border p-10"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">Ready to Choose?</p>
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Explore Our Product Ratings</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
          Now that you understand the formats, browse our full database — filter by food type, quality tier, animal, and health focus.
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