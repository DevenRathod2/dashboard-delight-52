import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check, X, Zap, Crown, Rocket, Sparkles, HelpCircle, Star,
  HardDrive, Users, Calendar, Image as ImageIcon, ScanFace, MessageSquare,
  Globe, Shield, Headphones, Palette,
} from "lucide-react";

type Billing = "monthly" | "yearly";

const plans = [
  {
    key: "starter",
    name: "Starter",
    icon: Zap,
    color: "info",
    tagline: "For solo photographers getting started.",
    monthly: 800,
    yearly: 8000,
    cta: "Start Free Trial",
    popular: false,
  },
  {
    key: "business",
    name: "Business",
    icon: Crown,
    color: "primary",
    tagline: "For growing studios with active client work.",
    monthly: 1600,
    yearly: 15360,
    cta: "Choose Business",
    popular: true,
  },
  {
    key: "studio",
    name: "Studio",
    icon: Rocket,
    color: "warning",
    tagline: "Unlimited scale for high-volume teams.",
    monthly: 3200,
    yearly: 30720,
    cta: "Go Studio",
    popular: false,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    icon: Sparkles,
    color: "primary-glow",
    tagline: "Custom limits, SSO, and dedicated success.",
    monthly: 0,
    yearly: 0,
    cta: "Contact Sales",
    popular: false,
    custom: true,
  },
];

type Cell = string | boolean | number;
interface Row { label: string; values: [Cell, Cell, Cell, Cell]; tip?: string; }
interface Section { title: string; icon: typeof Zap; color: string; rows: Row[]; }

const sections: Section[] = [
  {
    title: "Storage & Limits",
    icon: HardDrive,
    color: "info",
    rows: [
      { label: "Cloud Storage", values: ["50 GB", "500 GB", "2 TB", "Custom"] },
      { label: "Photos / Month", values: ["10,000", "100,000", "1,000,000", "Unlimited"] },
      { label: "Events / Month", values: ["20", "200", "Unlimited", "Unlimited"] },
      { label: "Active Clients", values: ["50", "400", "Unlimited", "Unlimited"] },
      { label: "Max Photo Size", values: ["25 MB", "50 MB", "100 MB", "Custom"] },
      { label: "Backup Retention", values: ["30 days", "90 days", "1 year", "Forever"] },
    ],
  },
  {
    title: "AI & Smart Tools",
    icon: ScanFace,
    color: "primary",
    rows: [
      { label: "AI Face Recognition", values: [false, "20K / mo", "100K / mo", "Unlimited"], tip: "Search photos by people's faces." },
      { label: "Smart Selections", values: [true, true, true, true] },
      { label: "Auto Color Grading", values: [false, true, true, true] },
      { label: "Motion Reels", values: [false, "10 / mo", "Unlimited", "Unlimited"] },
      { label: "Duplicate Detection", values: [true, true, true, true] },
      { label: "AI Quality Score", values: [false, true, true, true] },
    ],
  },
  {
    title: "Client Galleries",
    icon: ImageIcon,
    color: "success",
    rows: [
      { label: "Branded Galleries", values: [true, true, true, true] },
      { label: "Custom Domain", values: [false, false, true, true] },
      { label: "Password Protection", values: [true, true, true, true] },
      { label: "Download Limits", values: ["Basic", "Advanced", "Granular", "Granular"] },
      { label: "Watermarking", values: [false, true, true, true] },
      { label: "White-label Galleries", values: [false, false, true, true] },
    ],
  },
  {
    title: "Communication",
    icon: MessageSquare,
    color: "warning",
    rows: [
      { label: "Email Notifications", values: [true, true, true, true] },
      { label: "WhatsApp Messages", values: ["500 / mo", "5,000 / mo", "25,000 / mo", "Custom"] },
      { label: "Lead Forms", values: [1, 5, "Unlimited", "Unlimited"] },
      { label: "Client Portal", values: [true, true, true, true] },
    ],
  },
  {
    title: "Team & Collaboration",
    icon: Users,
    color: "info",
    rows: [
      { label: "Team Seats", values: [1, 5, 15, "Unlimited"] },
      { label: "Roles & Permissions", values: [false, true, true, true] },
      { label: "Activity Logs", values: [false, "30 days", "1 year", "Unlimited"] },
      { label: "SSO / SAML", values: [false, false, false, true] },
    ],
  },
  {
    title: "Support",
    icon: Headphones,
    color: "primary-glow",
    rows: [
      { label: "Email Support", values: [true, true, true, true] },
      { label: "Priority Support", values: [false, true, true, true] },
      { label: "Dedicated Manager", values: [false, false, true, true] },
      { label: "Onboarding Call", values: [false, true, true, true] },
      { label: "SLA Uptime", values: ["99%", "99.5%", "99.9%", "99.99%"] },
    ],
  },
];

const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

const Cell = ({ v, color }: { v: Cell; color: string }) => {
  if (typeof v === "boolean") {
    return v ? (
      <div className={`inline-flex size-7 rounded-full bg-${color}/15 text-${color} items-center justify-center`}>
        <Check className="size-4" />
      </div>
    ) : (
      <div className="inline-flex size-7 rounded-full bg-muted/40 text-muted-foreground items-center justify-center">
        <X className="size-4" />
      </div>
    );
  }
  return <span className="text-sm font-medium">{v}</span>;
};

const Pricing = () => {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Pricing"
        title={<>Compare <span className="gradient-text">every plan</span>, side by side</>}
        description="Pick the plan that fits your studio. Switch or cancel any time — no hidden fees."
        actions={
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  billing === b
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b}
                {b === "yearly" && <span className="ml-1.5 text-[10px] font-bold text-success">Save 20%</span>}
              </button>
            ))}
          </div>
        }
      />

      {/* Plan summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {plans.map((p) => {
          const price = p.custom ? "Custom" : formatINR(billing === "monthly" ? p.monthly : Math.round(p.yearly / 12));
          return (
            <div
              key={p.key}
              className={`relative rounded-3xl p-6 shadow-elevated overflow-hidden transition-all hover:-translate-y-1 ${
                p.popular ? "bg-gradient-card border-2 border-primary/60" : "bg-gradient-card border border-border/60"
              }`}
            >
              {p.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-primary text-primary-foreground shadow-glow border-0 gap-1">
                    <Star className="size-3" /> Popular
                  </Badge>
                </div>
              )}
              <div className={`absolute -top-20 -right-20 size-52 rounded-full bg-${p.color}/15 blur-3xl pointer-events-none`} />
              <div className="relative">
                <div className={`size-11 rounded-2xl bg-${p.color}/15 text-${p.color} grid place-items-center mb-4`}>
                  <p.icon className="size-5" />
                </div>
                <p className="font-display font-bold text-xl">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4 min-h-[32px]">{p.tagline}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display font-extrabold text-3xl">{price}</span>
                  {!p.custom && <span className="text-xs text-muted-foreground">/mo</span>}
                </div>
                {!p.custom && billing === "yearly" && (
                  <p className="text-[11px] text-success font-medium mb-4">Billed {formatINR(p.yearly)} yearly</p>
                )}
                {!p.custom && billing === "monthly" && (
                  <p className="text-[11px] text-muted-foreground mb-4">Billed monthly</p>
                )}
                {p.custom && <p className="text-[11px] text-muted-foreground mb-4">Tailored to your needs</p>}
                <Button
                  className={`w-full rounded-xl h-10 font-semibold ${
                    p.popular
                      ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {p.cta}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Comparison */}
      <div className="rounded-3xl bg-gradient-card border border-border/60 shadow-elevated overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="font-display font-bold text-2xl">Detailed comparison</p>
            <p className="text-sm text-muted-foreground mt-1">Every feature across every plan, with zero fine print.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HelpCircle className="size-4" /> Hover labels for details
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-md z-10">
              <tr className="border-b border-border/60">
                <th className="px-6 py-5 text-left text-xs uppercase tracking-widest text-muted-foreground font-medium w-[28%]">
                  Features
                </th>
                {plans.map((p) => (
                  <th key={p.key} className="px-4 py-5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`size-8 rounded-xl bg-${p.color}/15 text-${p.color} grid place-items-center`}>
                        <p.icon className="size-4" />
                      </div>
                      <span className="font-display font-bold">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {p.custom ? "Custom" : formatINR(billing === "monthly" ? p.monthly : Math.round(p.yearly / 12)) + "/mo"}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((sec) => (
                <>
                  <tr key={sec.title} className="bg-secondary/30">
                    <td colSpan={5} className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`size-7 rounded-lg bg-${sec.color}/15 text-${sec.color} grid place-items-center`}>
                          <sec.icon className="size-4" />
                        </div>
                        <span className="font-display font-bold text-sm uppercase tracking-widest">{sec.title}</span>
                      </div>
                    </td>
                  </tr>
                  {sec.rows.map((r, idx) => (
                    <tr key={sec.title + idx} className="border-t border-border/40 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-3.5 text-sm">
                        <span className="inline-flex items-center gap-1.5" title={r.tip}>
                          {r.label}
                          {r.tip && <HelpCircle className="size-3.5 text-muted-foreground" />}
                        </span>
                      </td>
                      {r.values.map((v, i) => (
                        <td key={i} className="px-4 py-3.5 text-center">
                          <Cell v={v} color={plans[i].color} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
              <tr className="border-t border-border/60 bg-secondary/20">
                <td className="px-6 py-5"></td>
                {plans.map((p) => (
                  <td key={p.key} className="px-4 py-5 text-center">
                    <Button
                      size="sm"
                      className={`rounded-xl w-full font-semibold ${
                        p.popular
                          ? "bg-gradient-primary text-primary-foreground shadow-glow"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {p.cta}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        {[
          { icon: Shield, title: "Secure by default", desc: "AES-256 encryption, daily backups, GDPR-ready." },
          { icon: Globe, title: "Global CDN", desc: "Galleries that load fast for clients anywhere." },
          { icon: Palette, title: "Made for studios", desc: "Built with feedback from 5,000+ photographers." },
        ].map((t) => (
          <div key={t.title} className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card relative overflow-hidden">
            <div className="absolute -top-16 -right-16 size-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="size-11 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow">
                <t.icon className="size-5" />
              </div>
              <div>
                <p className="font-display font-bold">{t.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-10 rounded-3xl bg-gradient-aurora border border-border/60 p-6 lg:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="font-display font-extrabold text-3xl tracking-tight">Pricing questions, answered</h2>
            <p className="text-muted-foreground mt-3">Still unsure? Talk to our team and we'll help you pick the right plan.</p>
            <Link to="/billing">
              <Button className="mt-5 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                Talk to Sales
              </Button>
            </Link>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "Can I switch plans later?", a: "Yes — upgrade or downgrade any time. We'll prorate the difference automatically." },
              { q: "Do you offer a free trial?", a: "All paid plans come with a 14-day free trial. No credit card required to start." },
              { q: "What payment methods do you accept?", a: "Cards, UPI, net-banking, and invoices for Studio + Enterprise plans." },
              { q: "Is my data safe?", a: "Yes. We use AES-256 encryption at rest, TLS in transit, and run daily encrypted backups." },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md p-5">
                <p className="font-semibold">{f.q}</p>
                <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
