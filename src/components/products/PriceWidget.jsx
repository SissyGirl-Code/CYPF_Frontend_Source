import { ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PriceWidget({ affiliateLinks = [], productName }) {
  if (!affiliateLinks || affiliateLinks.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-heading text-lg font-semibold mb-2">Price Intelligence</h3>
        <p className="text-sm text-muted-foreground">No retailer links available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="font-heading text-lg font-semibold text-foreground">Price Intelligence</h3>
        <p className="text-xs text-muted-foreground mt-1">Compare prices across trusted retailers</p>
      </div>

      <div className="p-5 space-y-3">
        {affiliateLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center justify-between p-3 rounded-md border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{link.retailer}</p>
              {link.price && (
                <p className="text-lg font-heading font-bold text-foreground">{link.price}</p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>

      {affiliateLinks[0] && (
        <div className="p-5 border-t border-border">
          <a href={affiliateLinks[0].url} target="_blank" rel="noopener noreferrer nofollow">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
              <ShoppingCart className="w-4 h-4" />
              Secure Best Price
            </Button>
          </a>
          <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
            Affiliate link — we may earn a commission
          </p>
        </div>
      )}
    </div>
  );
}