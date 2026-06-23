import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Beaker, Info } from "lucide-react";

export default function IngredientMatrix({ ingredients = [] }) {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Beaker className="w-4 h-4 text-primary" />
        <h3 className="font-heading text-lg font-semibold">Ingredient Forensic</h3>
      </div>
      <div className="space-y-2">
        <TooltipProvider>
          {ingredients.map((ing, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-4 p-4 rounded-md border border-border/60 bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-help group">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-heading font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{ing.name}</p>
                      <div className="h-[0.5px] bg-border mt-1" />
                    </div>
                    <Info className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm font-medium mb-1">{ing.name}</p>
                  <p className="text-xs text-muted-foreground">{ing.benefit || "Essential nutrient for overall health."}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}