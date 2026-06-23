import { ExternalLink, ShieldCheck, SearchCheck, Building2 } from "lucide-react";
import { EvidenceConfidenceBadge, ReportStatusBadge } from "./EvidenceBadges";

const labelMap = {
  high: "High",
  moderate_high: "Moderate-High",
  moderate: "Moderate",
  low: "Low",
  unknown: "Unknown",
  preliminary: "Preliminary",
  needs_verification: "Needs Verification",
  not_publicly_available: "Not Publicly Available",
  insufficient: "Insufficient",
  emerging: "Emerging",
  formulated_to_meet_aafco: "Formulated to Meet AAFCO Profiles",
  animal_feeding_tests: "AAFCO Animal Feeding Tests",
  not_publicly_disclosed: "Not Publicly Disclosed",
  company_confirmed: "Company Confirmed",
};

function display(value, fallback = "Not publicly available / not yet reviewed.") {
  if (value === null || value === undefined || value === "") return fallback;
  return labelMap[value] || String(value).replaceAll("_", " ");
}

function SourceList({ title, sources = [] }) {
  const list = Array.isArray(sources) ? sources : [];
  if (!list.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        {list.map((source, index) => (
          <a
            key={`${source.url}-${index}`}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 rounded-md border border-border bg-background p-3 text-sm hover:border-primary/40 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>
              <span className="font-medium text-foreground">{source.label || source.publisher || "Source"}</span>
              {source.publisher && <span className="text-muted-foreground"> — {source.publisher}</span>}
              {source.verification_status && (
                <span className="block text-xs text-muted-foreground capitalize mt-0.5">
                  {source.source_type?.replaceAll("_", " ")} · {source.verification_status?.replaceAll("_", " ")}
                </span>
              )}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function EvidenceReport({ product }) {
  if (!product) return null;

  const hasReport = product.report_id || product.transparency_report_id || product.overall_evidence_confidence || product.report_status;
  if (!hasReport) return null;

  const productSources = product.product_evidence_sources || product.evidence_sources || [];
  const brandSources = product.brand_evidence_sources || [];

  return (
    <section className="mt-10 rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">CYPF Transparency Report</p>
            <h2 className="font-heading text-2xl font-bold">Evidence & Transparency Report</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              What CYPF currently knows, what remains unknown, and how much verified evidence supports this product report.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <EvidenceConfidenceBadge confidence={product.overall_evidence_confidence} />
            <ReportStatusBadge status={product.report_status} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {product.cypf_summary && (
          <div className="rounded-lg bg-secondary/50 border border-border p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> CYPF Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.cypf_summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Metric label="Nutritional Adequacy" value={display(product.nutritional_adequacy_status)} />
          <Metric label="Digestibility Confidence" value={display(product.digestibility_confidence)} />
          <Metric label="Research Support" value={display(product.research_support_level)} />
          <Metric label="Feeding Trial Status" value={display(product.feeding_trial_status)} />
          <Metric label="Product Sources" value={`${product.product_source_count ?? product.source_count ?? 0}`} />
          <Metric label="Verified Sources" value={`${product.total_verified_source_count ?? product.verified_source_count ?? 0}`} />
        </div>

        {product.parent_company && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Brand Context</h3>
            <p className="text-sm text-muted-foreground"><strong>Parent Company:</strong> {product.parent_company}</p>
            {product.brand_transparency_summary && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{product.brand_transparency_summary}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextBlock title="What We Know" text={product.known_facts} />
          <TextBlock title="What Is Unknown / Not Publicly Available" text={product.missing_information} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextBlock title="AAFCO Statement" text={product.aafco_statement} />
          <TextBlock title="Manufacturer / Formulator" text={[product.manufacturer, product.formulated_by].filter(Boolean).join(" · ")} />
          <TextBlock title="Full Guaranteed Analysis" text={product.full_guaranteed_analysis} />
          <TextBlock title="Sourcing & Manufacturing" text={[product.sourcing_transparency, product.manufacturing_transparency].filter(Boolean).join("\n\n")} />
        </div>

        <div className="space-y-4">
          <SourceList title="Product Evidence Sources" sources={productSources} />
          <SourceList title="Brand Evidence Sources" sources={brandSources} />
          {!productSources.length && !brandSources.length && (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground flex items-center gap-2">
              <SearchCheck className="w-4 h-4" /> No source URLs have been added yet. This report is still preliminary.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}

function TextBlock({ title, text }) {
  return (
    <div className="rounded-lg border border-border p-4 bg-background">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
        {text || "Not publicly available / not yet reviewed."}
      </p>
    </div>
  );
}
