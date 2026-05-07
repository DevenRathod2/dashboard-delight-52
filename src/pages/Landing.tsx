import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import {
  Camera, Sparkles, ScanFace, CloudUpload, Heart, Users, Shield, Zap,
  Wand2, Image as ImageIcon, Palette, Film, ArrowRight, Check, Star,
  Sun, Moon, PlayCircle, ChevronRight, Quote, Globe, LockKeyhole,
  MessageSquare, BarChart3, Layers, Infinity as InfinityIcon
} from "lucide-react";
import heroImg from "@/assets/landing-hero.jpg";
import shot1 from "@/assets/landing-showcase-1.jpg";
import shot2 from "@/assets/landing-showcase-2.jpg";
import shot3 from "@/assets/landing-showcase-3.jpg";

const features = [
  { icon: ScanFace, title: "AI Face Recognition", desc: "Auto-tag every guest across thousands of photos in seconds. Clients find themselves instantly.", tint: "from-primary to-primary-glow" },
  { icon: Heart, title: "Smart Selections", desc: "AI ranks the best shots. Clients heart their favorites in a beautiful gallery — no spreadsheets.", tint: "from-pink-500 to-rose-400" },
  { icon: CloudUpload, title: "Unlimited Cloud Storage", desc: "RAW-safe, lightning-fast uploads with global CDN delivery and automatic backups.", tint: "from-info to-cyan-400" },
  { icon: Users, title: "Client Management", desc: "Leads, contracts, invoices and galleries — every client in one elegant CRM.", tint: "from-success to-emerald-400" },
  { icon: Palette, title: "Color Grading Studio", desc: "Pro-grade presets and tone controls. Apply your signature look in one click.", tint: "from-warning to-orange-400" },
  { icon: Film, title: "Motion Reels", desc: "Turn galleries into shareable reels for Instagram, TikTok and Reels — auto-synced to music.", tint: "from-purple-500 to-fuchsia-500" },
  { icon: Shield, title: "Password-Protected Galleries", desc: "Bank-grade security with watermarks, expiring links and download controls.", tint: "from-slate-500 to-zinc-400" },
  { icon: Zap, title: "Automation Workflows", desc: "Trigger emails, reminders and delivery sequences. Spend zero minutes on admin.", tint: "from-amber-500 to-yellow-400" },
];

const stats = [
  { value: "12k+", label: "Photographers" },
  { value: "48M", label: "Photos delivered" },
  { value: "99.99%", label: "Uptime" },
  { value: "4.9★", label: "Average rating" },
];

const steps = [
  { n: "01", title: "Upload", desc: "Drag, drop and let our edge uploader handle thousands of RAWs and JPEGs.", icon: CloudUpload },
  { n: "02", title: "AI Organize", desc: "Faces detected, scenes grouped, top picks ranked — automatically.", icon: Wand2 },
  { n: "03", title: "Share", desc: "Send a branded gallery link. Clients select, comment and download.", icon: Globe },
  { n: "04", title: "Deliver", desc: "Auto-package finals, generate invoices and close the loop.", icon: Sparkles },
];

const plans = [
  { name: "Starter", price: "₹0", period: "free forever", features: ["3 active events", "50 GB storage", "AI face search (limited)", "Client galleries", "Email support"], cta: "Start free" },
  { name: "Studio", price: "₹1,499", period: "per month", features: ["Unlimited events", "1 TB storage", "Full AI suite", "Branded galleries", "Smart selections", "Priority support"], cta: "Start 14-day trial", popular: true },
  { name: "Agency", price: "₹3,999", period: "per month", features: ["Unlimited everything", "10 TB storage", "Team collaboration", "White-label portal", "Advanced analytics", "Dedicated manager"], cta: "Talk to sales" },
];

const testimonials = [
  { quote: "Lensly cut my post-production time in half. AI face search alone is worth the subscription — clients are blown away.", name: "Aanya Kapoor", role: "Wedding Photographer · Mumbai", initials: "AK" },
  { quote: "We deliver 40+ events a month. The smart selection flow turned our client experience into a competitive advantage.", name: "Michael Chen", role: "Studio Owner · Singapore", initials: "MC" },
  { quote: "Beautiful UI. Bulletproof storage. The motion reels feature paid for itself in social media bookings.", name: "Sara Diaz", role: "Portrait Photographer · Madrid", initials: "SD" },
];

const faqs = [
  { q: "How fast is the AI face recognition?", a: "Most galleries are scanned in under a minute. We process up to 10,000 photos in parallel on our GPU cluster." },
  { q: "Do my clients need an account?", a: "No. Galleries open with a magic link or access code. Your client experience stays branded and frictionless." },
  { q: "Where are my photos stored?", a: "On encrypted multi-region object storage with automatic backups. You retain full ownership at all times." },
  { q: "Can I cancel anytime?", a: "Yes. Plans are month-to-month. Your galleries and exports remain accessible during your billing period." },
];

const Section = ({ id, eyebrow, title, sub, children }: { id?: string; eyebrow?: string; title: React.ReactNode; sub?: string; children: React.ReactNode }) => (
  <section id={id} className="relative py-20 lg:py-28">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        {eyebrow && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase mb-4">{eyebrow}</span>}
        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">{title}</h2>
        {sub && <p className="text-muted-foreground mt-4 text-lg">{sub}</p>}
      </div>
      {children}
    </div>
  </section>
);

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute top-[40%] right-[-10%] size-[600px] rounded-full bg-info/10 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[600px] rounded-full bg-primary-glow/10 blur-[160px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Camera className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-base leading-none">Lensly</p>
              <p className="text-[10px] text-muted-foreground mt-1">Studio Suite</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
            <a href="#showcase" className="hover:text-foreground transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary transition-colors">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Button asChild variant="ghost" size="sm" className="rounded-xl hidden sm:inline-flex">
              <Link to="/">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
              <Link to="/">Open Dashboard <ArrowRight className="size-3.5" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 lg:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 border border-border/60 backdrop-blur-md text-xs">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">New · AI Face Search 2.0 — 5× faster</span>
            <ChevronRight className="size-3 text-muted-foreground" />
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight mt-6 leading-[0.95]">
            The studio OS for <br className="hidden md:block" />
            <span className="gradient-text">modern photographers</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload, organize with AI, share stunning galleries, and let clients select their favorites — all in one beautifully designed platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow h-12 px-7">
              <Link to="/">Start free — no card needed <ArrowRight className="size-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl h-12 px-7 backdrop-blur-md bg-card/40">
              <PlayCircle className="size-4" /> Watch 60s demo
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Trusted by 12,000+ photographers · 4.9 ★ on Capterra</p>
        </div>

        {/* Hero visual */}
        <div className="relative max-w-6xl mx-auto px-6 mt-16">
          <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-elevated">
            <img src={heroImg} alt="Lensly photographer dashboard with AI face recognition" width={1600} height={1200} className="w-full h-auto" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
          {/* Floating chips */}
          <div className="hidden md:flex absolute -left-4 top-1/3 px-4 py-3 rounded-2xl glass shadow-card items-center gap-3 animate-fade-up">
            <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center"><ScanFace className="size-4 text-white" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Faces detected</p>
              <p className="font-bold text-sm">1,248 in 42s</p>
            </div>
          </div>
          <div className="hidden md:flex absolute -right-4 bottom-1/4 px-4 py-3 rounded-2xl glass shadow-card items-center gap-3 animate-fade-up">
            <div className="size-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 grid place-items-center"><Heart className="size-4 text-white" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Client picks</p>
              <p className="font-bold text-sm">+412 selected</p>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="max-w-5xl mx-auto px-6 mt-20">
          <p className="text-center text-xs text-muted-foreground tracking-widest uppercase mb-6">Studios shipping with Lensly</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
            {["AURORA", "MOMENTO", "VANTAGE", "STILLBLOOM", "NORTH&CO", "LUMEN"].map((l) => (
              <span key={l} className="font-display font-bold text-lg tracking-widest text-muted-foreground">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-aurora border border-border/60 p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-extrabold text-4xl md:text-5xl gradient-text">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <Section id="features" eyebrow="Features" title={<>Everything a modern <span className="gradient-text">studio</span> needs</>} sub="From the first lead to the final deliverable — built for the way real photographers work.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all">
              <div className={`absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br ${f.tint} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />
              <div className={`relative inline-flex size-11 rounded-xl bg-gradient-to-br ${f.tint} items-center justify-center text-white shadow-card mb-4`}>
                <f.icon className="size-5" />
              </div>
              <h3 className="font-display font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Spotlight: AI Face */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase">AI Spotlight</span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mt-4">Your clients find themselves <span className="gradient-text">in seconds</span>.</h2>
            <p className="text-muted-foreground mt-4 text-lg">Lensly's face recognition scans entire weddings and corporate events in under a minute. Guests upload a selfie and instantly see every photo they appear in.</p>
            <ul className="mt-6 space-y-3">
              {["GPU-accelerated, processed in parallel", "99.2% accuracy across lighting conditions", "Privacy-first: faces never leave your account"].map((t) => (
                <li key={t} className="flex items-start gap-3"><div className="mt-0.5 size-5 rounded-full bg-success/20 text-success grid place-items-center"><Check className="size-3" /></div><span className="text-sm">{t}</span></li>
              ))}
            </ul>
            <Button asChild className="mt-8 rounded-xl bg-gradient-primary shadow-glow"><Link to="/studio/face-recognition">Try Face Search <ArrowRight className="size-4" /></Link></Button>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-border/60 shadow-elevated">
              <img src={shot1} alt="Wedding photo with AI face recognition" width={800} height={1000} loading="lazy" className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-6 -left-6 px-5 py-4 rounded-2xl glass shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <ScanFace className="size-4 text-primary" />
                <p className="text-xs font-semibold">3 people detected</p>
              </div>
              <div className="flex -space-x-2">
                {["A", "R", "S"].map((i) => <div key={i} className="size-8 rounded-full bg-gradient-primary border-2 border-card grid place-items-center text-[11px] font-bold text-primary-foreground">{i}</div>)}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl glass shadow-card">
              <p className="text-[10px] text-muted-foreground">Match confidence</p>
              <p className="font-display font-bold text-2xl gradient-text">99.2%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <Section id="workflow" eyebrow="How it works" title={<>From shoot to delivery in <span className="gradient-text">4 steps</span></>} sub="A workflow your team will actually love. No more spreadsheets, scattered Drive links or endless WhatsApp threads.">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-extrabold text-3xl gradient-text">{s.n}</span>
                <s.icon className="size-5 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              {i < steps.length - 1 && <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40" />}
            </div>
          ))}
        </div>
      </Section>

      {/* Showcase */}
      <Section id="showcase" eyebrow="Showcase" title={<>Built for every <span className="gradient-text">moment</span></>} sub="Weddings, corporate events, portraits, birthdays — Lensly adapts to your style.">
        <div className="grid md:grid-cols-3 gap-5">
          {[{img: shot1, t: "Weddings", n: "1,240 photos · 12 collections"}, {img: shot2, t: "Corporate", n: "512 photos · 4 collections"}, {img: shot3, t: "Celebrations", n: "295 photos · 3 collections"}].map((c) => (
            <div key={c.t} className="group relative rounded-3xl overflow-hidden border border-border/60 shadow-card hover:shadow-elevated transition-all">
              <img src={c.img} alt={c.t} width={800} height={800} loading="lazy" className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display font-bold text-xl">{c.t}</p>
                <p className="text-xs text-muted-foreground">{c.n}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Why us */}
      <Section eyebrow="Why Lensly" title={<>Designed for studios that <span className="gradient-text">scale</span></>}>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: LockKeyhole, t: "Bank-grade security", d: "AES-256 encryption, SOC 2 ready, GDPR compliant." },
            { icon: BarChart3, t: "Insightful analytics", d: "Track gallery views, selections, conversions and revenue." },
            { icon: Layers, t: "White-label ready", d: "Your brand. Your domain. Your client experience." },
            { icon: MessageSquare, t: "Built-in messaging", d: "Comment threads on photos. No more email back-and-forth." },
            { icon: InfinityIcon, t: "Unlimited galleries", d: "Pay for storage, never per event or per client." },
            { icon: ImageIcon, t: "RAW + JPEG support", d: "Preserve quality with smart preview generation." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md p-6">
              <div className="size-10 rounded-xl bg-primary/10 grid place-items-center text-primary mb-4"><b.icon className="size-5" /></div>
              <h3 className="font-display font-bold">{b.t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{b.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section eyebrow="Loved by photographers" title={<>What studios are <span className="gradient-text">saying</span></>}>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card relative">
              <Quote className="size-6 text-primary/40 mb-4" />
              <p className="text-sm leading-relaxed">{t.quote}</p>
              <div className="flex gap-0.5 mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-warning text-warning" />)}
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/60">
                <div className="size-10 rounded-xl gradient-primary grid place-items-center text-sm font-bold text-primary-foreground">{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing" eyebrow="Pricing" title={<>Simple plans, <span className="gradient-text">unfair value</span></>} sub="Start free. Upgrade when your studio is ready. Cancel anytime.">
        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-3xl border p-6 ${p.popular ? "border-primary/50 bg-gradient-card shadow-glow" : "border-border/60 bg-card/40"}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase shadow-glow">Most Popular</span>}
              <h3 className="font-display font-bold text-xl">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display font-extrabold text-4xl">{p.price}</span>
                <span className="text-sm text-muted-foreground">/{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="size-4 text-success mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`w-full mt-6 rounded-xl ${p.popular ? "bg-gradient-primary shadow-glow" : ""}`} variant={p.popular ? "default" : "outline"}>
                <Link to="/">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Questions, answered">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md p-5 hover:bg-card/60 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-semibold">{f.q}</span>
                <ChevronRight className="size-4 text-muted-foreground group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-aurora border border-border/60 p-12 lg:p-16 text-center">
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-info/20 blur-3xl" />
            <div className="relative">
              <Sparkles className="size-8 text-primary mx-auto mb-4" />
              <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight">Ready to <span className="gradient-text">delight</span> your clients?</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Join thousands of photographers shipping faster, looking better and getting booked more often.</p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-xl bg-gradient-primary shadow-glow h-12 px-7"><Link to="/">Start your free trial <ArrowRight className="size-4" /></Link></Button>
                <Button variant="outline" size="lg" className="rounded-xl h-12 px-7">Book a demo</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">No credit card required · 14-day Studio trial · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="size-9 rounded-xl gradient-primary grid place-items-center shadow-glow"><Camera className="size-5 text-primary-foreground" /></div>
              <p className="font-display font-bold">Lensly</p>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">The studio operating system for photographers who care about craft and client experience.</p>
          </div>
          {[
            { h: "Product", l: ["Features", "Pricing", "Studio", "Changelog"] },
            { h: "Company", l: ["About", "Blog", "Careers", "Contact"] },
            { h: "Legal", l: ["Privacy", "Terms", "Security", "GDPR"] },
          ].map((c) => (
            <div key={c.h}>
              <p className="font-semibold text-sm mb-3">{c.h}</p>
              <ul className="space-y-2">
                {c.l.map((i) => <li key={i}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{i}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 Lensly Studio Suite. Crafted with care.</p>
          <p className="text-xs text-muted-foreground">Made for photographers, by photographers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
