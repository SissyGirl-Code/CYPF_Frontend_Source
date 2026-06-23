import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://media.base44.com/images/public/69fcdd6b91dd8bf71099f815/9f311d85c_chooseyourpetfood_LOGO_8h_light_outline_Cropped.png"
                alt="chooseyourpetfood logo"
                className="flex-shrink-0 h-[56px] w-auto"
                style={{mixBlendMode: 'multiply', background: 'transparent'}}
              />
              <div className="relative flex flex-col items-start leading-none">
                <div className="flex items-baseline gap-0">
                  <span style={{fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: '#6b7f4a', letterSpacing: '-0.02em'}}>choose</span>
                  <span style={{fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: '#b85c1a', letterSpacing: '-0.02em'}}>your</span>
                  <span style={{fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: '#b85c1a', letterSpacing: '-0.02em'}}>pet</span>
                  <span style={{fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: '#6b7f4a', letterSpacing: '-0.02em'}}>food</span>
                  <span style={{fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: '#6b7f4a', letterSpacing: '-0.01em', paddingBottom: '1px'}}>.com</span>
                </div>
                <svg width="100%" height="8" viewBox="0 0 260 10" preserveAspectRatio="none" style={{marginTop: '2px'}}>
                  <path d="M10 8 Q130 -2 250 8" stroke="#c8901a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Empowering pet owners with transparent, science-backed nutritional guidance. 
              Every recommendation is rooted in ingredient analysis, not marketing claims.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-6">
              Affiliate Disclosure: We earn commissions from qualifying purchases through our retail partner links. 
              This doesn't affect our editorial independence or product ratings.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 uppercase tracking-wider text-foreground">Explore</h4>
            <div className="space-y-2.5">
              <Link to="/products" className="block text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link>
              <Link to="/compare" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Compare Foods</Link>
              <Link to="/articles" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Knowledge Ledger</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 uppercase tracking-wider text-foreground">Categories</h4>
            <div className="space-y-2.5">
              <Link to="/products?animal=dog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Dog Food</Link>
              <Link to="/products?animal=cat" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Cat Food</Link>
              <Link to="/articles?category=nutrition" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Nutrition Guides</Link>
              <Link to="/articles?category=ingredients" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Ingredient Science</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} chooseyourpetfood.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}