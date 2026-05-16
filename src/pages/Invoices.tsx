import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  FileText,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Trash2,
  Eye,
  Download,
  TrendingUp,
  AlertCircle,
  Receipt,
  Package,
  Pencil,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

type Status = "DRAFT" | "SENT" | "PAID" | "OVERDUE";
type DiscountType = "NONE" | "PERCENT" | "FIXED";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  taxRate: number;
  category: string;
  createdAt: string;
}

const CATALOG_KEY = "lensly.catalog.v1";

const seedCatalog = (): CatalogItem[] => [
  { id: "c1", name: "Wedding Photography — 2 Day Package", description: "Full coverage, 2 photographers, edited gallery", unitPrice: 120000, taxRate: 18, category: "Wedding", createdAt: new Date().toISOString() },
  { id: "c2", name: "Cinematic Highlight Reel", description: "3-5 min cinematic film with licensed music", unitPrice: 35000, taxRate: 18, category: "Video", createdAt: new Date().toISOString() },
  { id: "c3", name: "Pre-Wedding Shoot", description: "Half-day outdoor session, 100+ edited photos", unitPrice: 25000, taxRate: 18, category: "Wedding", createdAt: new Date().toISOString() },
  { id: "c4", name: "Photo Album (Premium)", description: "30 page premium hard-bound album", unitPrice: 8000, taxRate: 12, category: "Print", createdAt: new Date().toISOString() },
  { id: "c5", name: "Corporate Event Coverage", description: "Up to 6 hours, edited gallery within 5 days", unitPrice: 45000, taxRate: 18, category: "Corporate", createdAt: new Date().toISOString() },
];

const emptyCatalogItem = (): CatalogItem => ({
  id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  description: "",
  unitPrice: 0,
  taxRate: 18,
  category: "General",
  createdAt: new Date().toISOString(),
});

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  taxLabel: "GST" | "SALES_TAX" | "VAT";
  language: string;
  notes: string;
  terms: string;
  referralCode: string;
  discountType: DiscountType;
  discountValue: number;
  items: LineItem[];
  status: Status;
  amountPaid: number;
  createdAt: string;
}

const STORAGE_KEY = "lensly.invoices.v1";

const seedInvoices = (): Invoice[] => [
  {
    id: "inv_1",
    invoiceNumber: "INV-2026-001",
    clientName: "Priya Sharma",
    clientEmail: "priya@studio.in",
    billingAddress: "12 Marine Drive, Mumbai, MH 400001",
    issueDate: "2026-04-12",
    dueDate: "2026-04-26",
    currency: "INR",
    taxLabel: "GST",
    language: "en",
    notes: "Thank you for choosing us!",
    terms: "Payment due within 14 days.",
    referralCode: "",
    discountType: "PERCENT",
    discountValue: 5,
    items: [
      { id: "1", description: "Wedding Photography — 2 Day Package", quantity: 1, unitPrice: 120000, taxRate: 18 },
      { id: "2", description: "Cinematic Highlight Reel", quantity: 1, unitPrice: 35000, taxRate: 18 },
    ],
    status: "PAID",
    amountPaid: 171810,
    createdAt: "2026-04-12T10:00:00Z",
  },
  {
    id: "inv_2",
    invoiceNumber: "INV-2026-002",
    clientName: "Amit Chaluripagaar",
    clientEmail: "amit@studio.in",
    billingAddress: "Pune, MH",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    currency: "INR",
    taxLabel: "GST",
    language: "en",
    notes: "",
    terms: "Net 14",
    referralCode: "",
    discountType: "NONE",
    discountValue: 0,
    items: [
      { id: "1", description: "Corporate Event Coverage", quantity: 1, unitPrice: 45000, taxRate: 18 },
    ],
    status: "SENT",
    amountPaid: 0,
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "inv_3",
    invoiceNumber: "INV-2026-003",
    clientName: "Yash Nasale",
    clientEmail: "yash@studio.in",
    billingAddress: "Bengaluru, KA",
    issueDate: "2026-04-20",
    dueDate: "2026-05-04",
    currency: "INR",
    taxLabel: "GST",
    language: "en",
    notes: "",
    terms: "",
    referralCode: "REF-YN",
    discountType: "FIXED",
    discountValue: 2000,
    items: [
      { id: "1", description: "Pre-Wedding Shoot", quantity: 1, unitPrice: 25000, taxRate: 18 },
      { id: "2", description: "Photo Album (Premium)", quantity: 1, unitPrice: 8000, taxRate: 12 },
    ],
    status: "OVERDUE",
    amountPaid: 0,
    createdAt: "2026-04-20T11:30:00Z",
  },
];

const formatMoney = (n: number, currency = "INR") => {
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(0)}`;
  }
};

const computeTotals = (inv: Pick<Invoice, "items" | "discountType" | "discountValue">) => {
  const subtotal = inv.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const discount =
    inv.discountType === "PERCENT"
      ? (subtotal * (inv.discountValue || 0)) / 100
      : inv.discountType === "FIXED"
      ? inv.discountValue || 0
      : 0;
  const taxableBase = Math.max(subtotal - discount, 0);
  // Distribute discount proportionally for tax math
  const tax = inv.items.reduce((s, it) => {
    const lineSub = it.quantity * it.unitPrice;
    const share = subtotal > 0 ? lineSub / subtotal : 0;
    const lineAfterDiscount = lineSub - discount * share;
    return s + (lineAfterDiscount * (it.taxRate || 0)) / 100;
  }, 0);
  const grandTotal = taxableBase + tax;
  return { subtotal, discount, tax, grandTotal };
};

const statusStyles: Record<Status, string> = {
  DRAFT: "bg-muted text-muted-foreground border-border",
  SENT: "bg-info/15 text-info border-info/30",
  PAID: "bg-success/15 text-success border-success/30",
  OVERDUE: "bg-destructive/15 text-destructive border-destructive/30",
};

const emptyItem = (): LineItem => ({
  id: Math.random().toString(36).slice(2),
  description: "",
  quantity: 1,
  unitPrice: 0,
  taxRate: 18,
});

const blankInvoice = (count: number): Invoice => ({
  id: `inv_${Date.now()}`,
  invoiceNumber: `INV-2026-${String(count + 1).padStart(3, "0")}`,
  clientName: "",
  clientEmail: "",
  billingAddress: "",
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  currency: "INR",
  taxLabel: "GST",
  language: "en",
  notes: "",
  terms: "Payment due within 14 days.",
  referralCode: "",
  discountType: "NONE",
  discountValue: 0,
  items: [emptyItem()],
  status: "DRAFT",
  amountPaid: 0,
  createdAt: new Date().toISOString(),
});

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: any;
  tone: "primary" | "success" | "warning" | "info" | "destructive";
}) => (
  <div className="relative overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-border/60 p-5 shadow-card">
    <div
      className={`absolute -top-10 -right-10 size-32 rounded-full blur-3xl pointer-events-none bg-${tone}/20`}
    />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-display font-bold text-2xl mt-2">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      </div>
      <div className={`size-10 rounded-xl grid place-items-center bg-${tone}/15 text-${tone}`}>
        <Icon className="size-5" />
      </div>
    </div>
  </div>
);

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Status>("ALL");
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewing, setViewing] = useState<Invoice | null>(null);
  const [draft, setDraft] = useState<Invoice | null>(null);

  // Catalog state
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogDraft, setCatalogDraft] = useState<CatalogItem | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [pickerForLineId, setPickerForLineId] = useState<string | null>(null);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setInvoices(JSON.parse(raw));
      } else {
        const seeded = seedInvoices();
        setInvoices(seeded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      }
    } catch {
      setInvoices(seedInvoices());
    }
  }, []);

  // Persist
  useEffect(() => {
    if (invoices.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  // Catalog: load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CATALOG_KEY);
      if (raw) {
        setCatalog(JSON.parse(raw));
      } else {
        const seeded = seedCatalog();
        setCatalog(seeded);
        localStorage.setItem(CATALOG_KEY, JSON.stringify(seeded));
      }
    } catch {
      setCatalog(seedCatalog());
    }
  }, []);

  // Catalog: persist
  useEffect(() => {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
  }, [catalog]);

  // Catalog handlers
  const openCatalog = () => {
    setCatalogDraft(null);
    setCatalogOpen(true);
  };
  const startNewCatalog = () => setCatalogDraft(emptyCatalogItem());
  const startEditCatalog = (item: CatalogItem) => setCatalogDraft({ ...item });
  const saveCatalog = () => {
    if (!catalogDraft) return;
    if (!catalogDraft.name.trim()) {
      toast.error("Item name is required");
      return;
    }
    setCatalog((prev) => {
      const exists = prev.find((p) => p.id === catalogDraft.id);
      return exists ? prev.map((p) => (p.id === catalogDraft.id ? catalogDraft : p)) : [catalogDraft, ...prev];
    });
    toast.success("Catalog item saved");
    setCatalogDraft(null);
  };
  const deleteCatalog = (id: string) => {
    setCatalog((prev) => prev.filter((p) => p.id !== id));
    toast.success("Catalog item deleted");
  };
  const applyCatalogToLine = (lineId: string, item: CatalogItem) => {
    setDraft((d) =>
      d
        ? {
            ...d,
            items: d.items.map((it) =>
              it.id === lineId
                ? { ...it, description: item.name + (item.description ? ` — ${item.description}` : ""), unitPrice: item.unitPrice, taxRate: item.taxRate }
                : it,
            ),
          }
        : d,
    );
    setPickerForLineId(null);
    toast.success(`Added "${item.name}"`);
  };

  const filteredCatalog = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [catalog, catalogSearch]);

  const stats = useMemo(() => {
    const totals = invoices.map((i) => ({ ...i, ...computeTotals(i) }));
    const revenue = totals.filter((i) => i.status === "PAID").reduce((s, i) => s + i.grandTotal, 0);
    const pending = totals
      .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
      .reduce((s, i) => s + (i.grandTotal - i.amountPaid), 0);
    const overdue = totals.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + i.grandTotal, 0);
    const drafts = invoices.filter((i) => i.status === "DRAFT").length;
    return { revenue, pending, overdue, drafts, count: invoices.length };
  }, [invoices]);

  const filtered = useMemo(() => {
    return invoices
      .filter((i) => (statusFilter === "ALL" ? true : i.status === statusFilter))
      .filter((i) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.clientName.toLowerCase().includes(q) ||
          i.clientEmail.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [invoices, search, statusFilter]);

  const openCreate = () => {
    setDraft(blankInvoice(invoices.length));
    setEditorOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    setDraft(JSON.parse(JSON.stringify(inv)));
    setEditorOpen(true);
  };

  const saveDraft = (status: Status = "DRAFT") => {
    if (!draft) return;
    if (!draft.clientName.trim()) {
      toast.error("Client name is required");
      return;
    }
    if (draft.items.length === 0 || draft.items.every((i) => !i.description.trim())) {
      toast.error("Add at least one line item");
      return;
    }
    const next = { ...draft, status };
    setInvoices((prev) => {
      const exists = prev.find((p) => p.id === next.id);
      return exists ? prev.map((p) => (p.id === next.id ? next : p)) : [next, ...prev];
    });
    setEditorOpen(false);
    setDraft(null);
    toast.success(status === "SENT" ? "Invoice sent to client" : "Invoice saved");
  };

  const markPaid = (inv: Invoice) => {
    const totals = computeTotals(inv);
    setInvoices((prev) =>
      prev.map((p) =>
        p.id === inv.id ? { ...p, status: "PAID", amountPaid: totals.grandTotal } : p,
      ),
    );
    toast.success(`${inv.invoiceNumber} marked as paid`);
  };

  const remove = (inv: Invoice) => {
    setInvoices((prev) => prev.filter((p) => p.id !== inv.id));
    toast.success("Invoice deleted");
  };

  // ---------- Editor helpers ----------
  const updateDraft = <K extends keyof Invoice>(key: K, value: Invoice[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  };
  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setDraft((d) =>
      d ? { ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) } : d,
    );
  };
  const addItem = () =>
    setDraft((d) => (d ? { ...d, items: [...d.items, emptyItem()] } : d));
  const removeItem = (id: string) =>
    setDraft((d) => (d ? { ...d, items: d.items.filter((it) => it.id !== id) } : d));

  const draftTotals = draft ? computeTotals(draft) : null;
  const viewingTotals = viewing ? computeTotals(viewing) : null;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Billing"
        title={
          <>
            Client <span className="gradient-text">Invoices</span>
          </>
        }
        description="Create, send, and track invoices for every shoot. Discounts, taxes, and balance due — handled."
        actions={
          <Button
            size="lg"
            onClick={openCreate}
            className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="size-4 mr-1.5" /> New Invoice
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={formatMoney(stats.revenue)}
          hint={`${invoices.filter((i) => i.status === "PAID").length} paid invoices`}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Pending Amount"
          value={formatMoney(stats.pending)}
          hint="Awaiting payment"
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Overdue"
          value={formatMoney(stats.overdue)}
          hint="Past due date"
          icon={AlertCircle}
          tone="destructive"
        />
        <StatCard
          label="Drafts"
          value={String(stats.drafts)}
          hint={`${stats.count} total invoices`}
          icon={FileText}
          tone="info"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="size-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice #, client name or email..."
            className="pl-11 h-12 rounded-2xl bg-card/60 border-border/60 backdrop-blur-md"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-12 px-4 rounded-2xl text-sm font-medium border transition-all ${
                statusFilter === s
                  ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                  : "bg-card/60 border-border/60 backdrop-blur-md hover:bg-secondary"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice list */}
      <div className="rounded-3xl bg-card/60 backdrop-blur-xl border border-border/60 overflow-hidden shadow-card">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs uppercase tracking-widest text-muted-foreground border-b border-border/60 bg-secondary/30">
          <div className="col-span-3">Invoice</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Issue / Due</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Receipt className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">No invoices yet</p>
            <p className="text-sm text-muted-foreground">Create your first invoice to get started.</p>
          </div>
        )}

        {filtered.map((inv) => {
          const totals = computeTotals(inv);
          return (
            <div
              key={inv.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-primary/20 grid place-items-center text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{inv.invoiceNumber}</p>
                  <Badge
                    variant="outline"
                    className={`mt-1 text-[10px] font-medium border ${statusStyles[inv.status]}`}
                  >
                    {inv.status}
                  </Badge>
                </div>
              </div>
              <div className="col-span-3">
                <p className="font-medium text-sm">{inv.clientName}</p>
                <p className="text-xs text-muted-foreground truncate">{inv.clientEmail}</p>
              </div>
              <div className="col-span-2 text-sm">
                <p>{inv.issueDate}</p>
                <p className="text-xs text-muted-foreground">Due {inv.dueDate}</p>
              </div>
              <div className="col-span-2 text-right">
                <p className="font-display font-bold">{formatMoney(totals.grandTotal, inv.currency)}</p>
                {inv.status !== "PAID" && (
                  <p className="text-xs text-muted-foreground">
                    Bal {formatMoney(totals.grandTotal - inv.amountPaid, inv.currency)}
                  </p>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => setViewing(inv)} className="rounded-lg">
                  <Eye className="size-4" />
                </Button>
                {inv.status !== "PAID" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => markPaid(inv)}
                    className="rounded-lg text-success"
                    title="Mark as paid"
                  >
                    <CheckCircle2 className="size-4" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => openEdit(inv)} className="rounded-lg">
                  <Send className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(inv)}
                  className="rounded-lg text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- Editor Dialog ---------------- */}
      <Dialog open={editorOpen} onOpenChange={(o) => !o && setEditorOpen(false)}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/60">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {draft && invoices.find((i) => i.id === draft.id) ? "Edit Invoice" : "Create Invoice"}
            </DialogTitle>
          </DialogHeader>

          {draft && draftTotals && (
            <div className="space-y-6">
              {/* Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Invoice #</Label>
                  <Input
                    value={draft.invoiceNumber}
                    onChange={(e) => updateDraft("invoiceNumber", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    value={draft.issueDate}
                    onChange={(e) => updateDraft("issueDate", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={draft.dueDate}
                    onChange={(e) => updateDraft("dueDate", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Bill to */}
              <div className="rounded-2xl bg-secondary/40 border border-border/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Bill To</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Client Name *</Label>
                    <Input
                      value={draft.clientName}
                      onChange={(e) => updateDraft("clientName", e.target.value)}
                      placeholder="Priya Sharma"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Client Email</Label>
                    <Input
                      type="email"
                      value={draft.clientEmail}
                      onChange={(e) => updateDraft("clientEmail", e.target.value)}
                      placeholder="client@email.com"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Billing Address</Label>
                    <Textarea
                      value={draft.billingAddress}
                      onChange={(e) => updateDraft("billingAddress", e.target.value)}
                      placeholder="Street, City, State, Postal code"
                      className="mt-1.5 min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* Currency / tax / language */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select value={draft.currency} onValueChange={(v) => updateDraft("currency", v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR ₹</SelectItem>
                      <SelectItem value="USD">USD $</SelectItem>
                      <SelectItem value="EUR">EUR €</SelectItem>
                      <SelectItem value="GBP">GBP £</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tax Label</Label>
                  <Select
                    value={draft.taxLabel}
                    onValueChange={(v) => updateDraft("taxLabel", v as Invoice["taxLabel"])}
                  >
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GST">GST</SelectItem>
                      <SelectItem value="SALES_TAX">Sales Tax</SelectItem>
                      <SelectItem value="VAT">VAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={draft.language} onValueChange={(v) => updateDraft("language", v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Referral Code</Label>
                  <Input
                    value={draft.referralCode}
                    onChange={(e) => updateDraft("referralCode", e.target.value)}
                    placeholder="optional"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Line items */}
              <div className="rounded-2xl border border-border/60 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-secondary/40 text-xs uppercase tracking-widest text-muted-foreground">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-1 text-right">Tax %</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {draft.items.map((it) => {
                  const lineTotal = it.quantity * it.unitPrice;
                  return (
                    <div
                      key={it.id}
                      className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-border/40 items-center"
                    >
                      <Input
                        className="col-span-5"
                        placeholder="Service or package..."
                        value={it.description}
                        onChange={(e) => updateItem(it.id, { description: e.target.value })}
                      />
                      <Input
                        type="number"
                        min={0}
                        className="col-span-2 text-right"
                        value={it.quantity}
                        onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) || 0 })}
                      />
                      <Input
                        type="number"
                        min={0}
                        className="col-span-2 text-right"
                        value={it.unitPrice}
                        onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) || 0 })}
                      />
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="col-span-1 text-right"
                        value={it.taxRate}
                        onChange={(e) => updateItem(it.id, { taxRate: Number(e.target.value) || 0 })}
                      />
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="text-sm font-medium">
                          {formatMoney(lineTotal, draft.currency)}
                        </span>
                        <button
                          onClick={() => removeItem(it.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <XCircle className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={addItem}
                  className="w-full px-4 py-3 border-t border-border/40 text-sm font-medium text-primary hover:bg-primary/5 flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" /> Add line item
                </button>
              </div>

              {/* Totals + discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Discount</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Select
                        value={draft.discountType}
                        onValueChange={(v) => updateDraft("discountType", v as DiscountType)}
                      >
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="PERCENT">Percent %</SelectItem>
                          <SelectItem value="FIXED">Fixed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={0}
                        disabled={draft.discountType === "NONE"}
                        value={draft.discountValue}
                        onChange={(e) => updateDraft("discountValue", Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Notes to Client</Label>
                    <Textarea
                      value={draft.notes}
                      onChange={(e) => updateDraft("notes", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Terms</Label>
                    <Textarea
                      value={draft.terms}
                      onChange={(e) => updateDraft("terms", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-aurora border border-border/60 p-5 h-fit">
                  <div className="flex justify-between text-sm py-1.5">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatMoney(draftTotals.subtotal, draft.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-destructive">
                      −{formatMoney(draftTotals.discount, draft.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5">
                    <span className="text-muted-foreground">
                      {draft.taxLabel === "GST" ? "GST" : draft.taxLabel === "VAT" ? "VAT" : "Sales Tax"}
                    </span>
                    <span className="font-medium">{formatMoney(draftTotals.tax, draft.currency)}</span>
                  </div>
                  <div className="border-t border-border/60 my-2" />
                  <div className="flex justify-between py-1.5">
                    <span className="font-semibold">Grand Total</span>
                    <span className="font-display font-bold text-xl">
                      {formatMoney(draftTotals.grandTotal, draft.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1.5">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <Input
                      type="number"
                      min={0}
                      value={draft.amountPaid}
                      onChange={(e) => updateDraft("amountPaid", Number(e.target.value) || 0)}
                      className="w-32 h-8 text-right"
                    />
                  </div>
                  <div className="flex justify-between py-1.5 mt-1">
                    <span className="font-semibold">Balance Due</span>
                    <span className="font-display font-bold text-lg text-warning">
                      {formatMoney(Math.max(draftTotals.grandTotal - draft.amountPaid, 0), draft.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => saveDraft("DRAFT")}>
              Save Draft
            </Button>
            <Button
              onClick={() => saveDraft("SENT")}
              className="bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              <Send className="size-4 mr-1.5" /> Save & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- Viewer Dialog ---------------- */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/60">
          {viewing && viewingTotals && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl flex items-center gap-3">
                  {viewing.invoiceNumber}
                  <Badge variant="outline" className={`text-xs border ${statusStyles[viewing.status]}`}>
                    {viewing.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-2xl bg-gradient-aurora border border-border/60 p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                    <p className="font-display font-bold text-lg mt-1">Lensly Studio</p>
                    <p className="text-sm text-muted-foreground">studio@lensly.in</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Bill To</p>
                    <p className="font-semibold mt-1">{viewing.clientName}</p>
                    <p className="text-sm text-muted-foreground">{viewing.clientEmail}</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">
                      {viewing.billingAddress}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Issue date</p>
                    <p className="font-medium">{viewing.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due date</p>
                    <p className="font-medium">{viewing.dueDate}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-secondary/40 text-xs uppercase tracking-widest text-muted-foreground">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Unit</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {viewing.items.map((it) => (
                  <div key={it.id} className="grid grid-cols-12 gap-2 px-4 py-2.5 border-t border-border/40 text-sm">
                    <div className="col-span-6">{it.description}</div>
                    <div className="col-span-2 text-right">{it.quantity}</div>
                    <div className="col-span-2 text-right">{formatMoney(it.unitPrice, viewing.currency)}</div>
                    <div className="col-span-2 text-right font-medium">
                      {formatMoney(it.quantity * it.unitPrice, viewing.currency)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="ml-auto w-full md:w-72 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatMoney(viewingTotals.subtotal, viewing.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-destructive">−{formatMoney(viewingTotals.discount, viewing.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {viewing.taxLabel === "GST" ? "GST" : viewing.taxLabel === "VAT" ? "VAT" : "Sales Tax"}
                  </span>
                  <span>{formatMoney(viewingTotals.tax, viewing.currency)}</span>
                </div>
                <div className="border-t border-border/60 my-1" />
                <div className="flex justify-between font-display font-bold text-lg">
                  <span>Grand Total</span>
                  <span>{formatMoney(viewingTotals.grandTotal, viewing.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span>{formatMoney(viewing.amountPaid, viewing.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold text-warning">
                  <span>Balance Due</span>
                  <span>
                    {formatMoney(Math.max(viewingTotals.grandTotal - viewing.amountPaid, 0), viewing.currency)}
                  </span>
                </div>
              </div>

              {viewing.notes && (
                <div className="text-sm">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Notes</p>
                  <p>{viewing.notes}</p>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button variant="ghost" onClick={() => window.print()}>
                  <Download className="size-4 mr-1.5" /> Print / PDF
                </Button>
                {viewing.status !== "PAID" && (
                  <Button
                    onClick={() => {
                      markPaid(viewing);
                      setViewing(null);
                    }}
                    className="bg-success text-success-foreground hover:bg-success/90"
                  >
                    <CheckCircle2 className="size-4 mr-1.5" /> Mark as Paid
                  </Button>
                )}
                <Button
                  onClick={() => {
                    openEdit(viewing);
                    setViewing(null);
                  }}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Send className="size-4 mr-1.5" /> Edit / Resend
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Invoices;
