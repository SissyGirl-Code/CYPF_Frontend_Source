import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Dog, Cat, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function QuickFind() {
  const navigate = useNavigate();
  const [animal, setAnimal] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [health, setHealth] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (animal) params.set("animal", animal);
    if (lifeStage) params.set("life_stage", lifeStage);
    if (health) params.set("health", health);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 relative z-20"
    >
      <div className="bg-card rounded-lg border border-border shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Quick Find</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Find the perfect nutrition match for your pet in seconds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={animal} onValueChange={setAnimal}>
            <SelectTrigger>
              <SelectValue placeholder="Animal Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
            </SelectContent>
          </Select>

          <Select value={lifeStage} onValueChange={setLifeStage}>
            <SelectTrigger>
              <SelectValue placeholder="Life Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="puppy_kitten">Puppy / Kitten</SelectItem>
              <SelectItem value="adult">Adult</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="all_stages">All Stages</SelectItem>
            </SelectContent>
          </Select>

          <Select value={health} onValueChange={setHealth}>
            <SelectTrigger>
              <SelectValue placeholder="Health Focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general_wellness">General Wellness</SelectItem>
              <SelectItem value="weight_management">Weight Management</SelectItem>
              <SelectItem value="joint_health">Joint Health</SelectItem>
              <SelectItem value="digestive">Digestive Health</SelectItem>
              <SelectItem value="skin_coat">Skin & Coat</SelectItem>
              <SelectItem value="high_protein">High Protein</SelectItem>
              <SelectItem value="grain_free">Grain Free</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
            <Search className="w-4 h-4" />
            Find Foods
          </Button>
        </div>
      </div>
    </motion.section>
  );
}