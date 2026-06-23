import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function HeroText({ centered = false }) {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 ${centered ? 'text-center' : ''}`}
      >
        Longevity
        <br />
        <span className="italic text-primary">Begins at</span>
        <br />
        the Bowl
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`text-base text-muted-foreground max-w-sm mb-8 leading-relaxed ${centered ? 'mx-auto text-center' : 'ml-auto'}`}
      >
        We deconstruct pet food marketing to reveal raw nutritional truth. 
        Every product is analyzed ingredient-by-ingredient so you can make informed decisions for your companion's health.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`flex flex-wrap gap-4 ${centered ? 'justify-center' : 'justify-end'}`}
      >
        <Link to="/products">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 px-8">
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/articles">
          <Button size="lg" variant="outline" className="font-semibold">
            Read the Science
          </Button>
        </Link>
      </motion.div>
    </>
  );
}

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative overflow-hidden">
      {/* Tablet: centered layout */}
      <div className="hidden md:block lg:hidden relative min-h-[100vh]">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Dog and cat together in a warm sunlit kitchen"
            className="w-full h-full object-cover"
            style={{ objectPosition: '40% 70%' }}
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-md text-center px-8">
            <HeroText centered />
          </div>
        </div>
      </div>

      {/* Desktop: full-bleed image behind text, text on RIGHT, animals on LEFT */}
      <div className="hidden lg:block relative min-h-[100vh]">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Dog and cat together in a warm sunlit kitchen"
            className="w-full h-full object-cover"
            style={{ objectPosition: '40% 70%' }}
          />
          {/* Upper-right text backdrop only */}
          <div className="absolute inset-y-0 right-0 w-[50%] bg-gradient-to-l from-background/90 via-background/50 to-transparent" />
        </div>
        <div className="absolute top-60 left-[42%] z-10 w-[45%]">
          <div className="max-w-md text-right ml-auto">
            <HeroText />
          </div>
        </div>
      </div>

      {/* Mobile: stacked layout — text on top, image below */}
      <div className="md:hidden flex flex-col">
        <div className="bg-background px-6 pt-12 pb-8">
          <HeroText />
        </div>
        <div className="w-full h-64 overflow-hidden">
          <img
            src={heroImage}
            alt="Dog and cat together in a warm sunlit kitchen"
            className="w-full h-full object-cover"
            style={{ objectPosition: '80% 40%' }}
          />
        </div>
      </div>
    </section>
  );
}