import HeroSection from "../components/home/HeroSection";
import QuickFind from "../components/home/QuickFind";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrustBanner from "../components/home/TrustBanner";
import KnowledgePreview from "../components/home/KnowledgePreview";

const HERO_IMAGE = "https://media.base44.com/images/public/69fcdd6b91dd8bf71099f815/5c6046e8f_generated_image.png";
const INGREDIENT_IMAGE = "https://media.base44.com/images/public/69fcdd6b91dd8bf71099f815/06cb9956c_generated_f3b99119.png";

export default function Home() {
  return (
    <div>
      <HeroSection heroImage={HERO_IMAGE} />
      <QuickFind />
      <FeaturedProducts />
      <TrustBanner ingredientImage={INGREDIENT_IMAGE} />
      <KnowledgePreview />
    </div>
  );
}