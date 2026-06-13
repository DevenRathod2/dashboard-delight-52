import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (data: EventFormData) => void;
}

export interface EventFormData {
  clientId?: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  clientEmail?: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  location: string;
  description?: string;
  coverImage?: File | null;
}

interface ExistingClient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  events: number;
}

const EXISTING_CLIENTS: ExistingClient[] = [
  { id: "c1", firstName: "Deven", lastName: "Rathod", phone: "8788887676", email: "deven@studio.in", events: 1 },
  { id: "c2", firstName: "Yash", lastName: "Nasale", phone: "+918788887373", email: "yash@studio.in", events: 1 },
  { id: "c3", firstName: "Amit", lastName: "Chaluripagaar", phone: "8788887373", email: "amit@studio.in", events: 1 },
  { id: "c4", firstName: "Priya", lastName: "Sharma", phone: "9988776655", email: "priya@studio.in", events: 3 },
  { id: "c5", firstName: "Rohan", lastName: "Mehta", phone: "9822582423", email: "rohan@studio.in", events: 2 },
];

const initial: EventFormData = {
  clientFirstName: "",
  clientLastName: "",
  clientPhone: "",
  clientEmail: "",
  eventName: "",
  eventType: "",
  eventDate: "",
  location: "",
  description: "",
  coverImage: null,
};

export const CreateEventDialog = ({ open, onOpenChange, onCreated }: CreateEventDialogProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<EventFormData>(initial);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [clientMode, setClientMode] = useState<"existing" | "new">("existing");
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof EventFormData>(k: K, v: EventFormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => {
    setForm(initial);
    setStep(1);
    setCoverPreview(null);
    setClientMode("existing");
    setClientSearch("");
    setSelectedClientId(null);
  };

  const handleClose = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const handleFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please choose an image.", variant: "destructive" });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Too large", description: "Max 8MB.", variant: "destructive" });
      return;
    }
    set("coverImage", file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const pickClient = (c: ExistingClient) => {
    setSelectedClientId(c.id);
    setForm((p) => ({
      ...p,
      clientId: c.id,
      clientFirstName: c.firstName,
      clientLastName: c.lastName,
      clientPhone: c.phone,
      clientEmail: c.email ?? "",
    }));
  };

  const filteredClients = EXISTING_CLIENTS.filter((c) => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    );
  });

  const canNext =
    clientMode === "existing"
      ? !!selectedClientId
      : form.clientFirstName.trim() &&
        form.clientLastName.trim() &&
        form.clientPhone.trim();

  const canCreate =
    form.eventName.trim() && form.eventType.trim() && form.eventDate.trim() && form.location.trim();

  const submit = () => {
    if (!canCreate) return;
    onCreated?.(form);
    toast({ title: "Event created", description: `${form.eventName} has been added.` });
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-border/60 gap-0">
        {/* Top accent header */}
        <div className="relative bg-gradient-aurora border-b border-border/60 p-6">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <DialogHeader className="relative space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
              <Camera className="size-3.5" /> New Event
            </div>
            <DialogTitle className="font-display text-2xl">
              {step === 1 ? "Add client details" : "Event information"}
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Who is this event for? We'll link the gallery to this client."
                : "Tell us about the shoot — date, place, and vibe."}
            </DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="relative mt-5 flex items-center gap-3">
            {[1, 2].map((s, i) => {
              const active = step === s;
              const done = step > s;
              return (
                <div key={s} className="flex items-center gap-3 flex-1">
                  <div
                    className={cn(
                      "flex items-center gap-2 text-xs font-medium transition-colors",
                      active || done ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "size-7 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-all",
                        done && "bg-primary text-primary-foreground border-primary",
                        active && "bg-primary/15 text-primary border-primary",
                        !active && !done && "bg-background border-border",
                      )}
                    >
                      {done ? <Check className="size-3.5" /> : s}
                    </div>
                    <span className="hidden sm:inline">
                      {s === 1 ? "Client" : "Event"}
                    </span>
                  </div>
                  {i === 0 && (
                    <div className="flex-1 h-px bg-border relative overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 bg-primary transition-all duration-500",
                          step === 2 ? "w-full" : "w-0",
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Segmented toggle */}
              <div className="inline-flex p-1 bg-secondary/60 border border-border/60 rounded-xl w-full sm:w-auto">
                {([
                  { id: "existing", label: "Existing client", icon: Users },
                  { id: "new", label: "New client", icon: UserPlus },
                ] as const).map((opt) => {
                  const active = clientMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setClientMode(opt.id);
                        if (opt.id === "new") {
                          setSelectedClientId(null);
                          setForm((p) => ({
                            ...p,
                            clientId: undefined,
                            clientFirstName: "",
                            clientLastName: "",
                            clientPhone: "",
                            clientEmail: "",
                          }));
                        }
                      }}
                      className={cn(
                        "flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 h-9 rounded-lg text-xs font-medium transition-all",
                        active
                          ? "bg-background shadow-sm text-foreground border border-border/60"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <opt.icon className="size-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {clientMode === "existing" ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Search by name, phone, or email..."
                      className="pl-9 h-10 rounded-lg"
                    />
                  </div>
                  <div className="max-h-[320px] overflow-y-auto rounded-xl border border-border/60 divide-y divide-border/40 bg-secondary/20">
                    {filteredClients.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No clients found.{" "}
                        <button
                          type="button"
                          className="text-primary font-medium hover:underline"
                          onClick={() => setClientMode("new")}
                        >
                          Add new
                        </button>
                      </div>
                    ) : (
                      filteredClients.map((c) => {
                        const active = selectedClientId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => pickClient(c)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                              active
                                ? "bg-primary/10"
                                : "hover:bg-secondary/50",
                            )}
                          >
                            <div className={cn(
                              "size-9 rounded-lg grid place-items-center text-xs font-bold shrink-0",
                              active
                                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                                : "bg-secondary text-foreground",
                            )}>
                              {c.firstName[0]}{c.lastName[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">
                                {c.firstName} {c.lastName}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {c.phone}{c.email ? ` · ${c.email}` : ""}
                              </p>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {c.events} {c.events === 1 ? "event" : "events"}
                            </span>
                            {active && (
                              <div className="size-5 rounded-full bg-primary text-primary-foreground grid place-items-center shrink-0">
                                <Check className="size-3" />
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First name" icon={User} required>
                    <Input
                      value={form.clientFirstName}
                      onChange={(e) => set("clientFirstName", e.target.value)}
                      placeholder="Aanya"
                    />
                  </Field>
                  <Field label="Last name" required>
                    <Input
                      value={form.clientLastName}
                      onChange={(e) => set("clientLastName", e.target.value)}
                      placeholder="Sharma"
                    />
                  </Field>
                  <Field label="WhatsApp / Phone" icon={Phone} required>
                    <Input
                      value={form.clientPhone}
                      onChange={(e) => set("clientPhone", e.target.value)}
                      placeholder="+91 98765 43210"
                      inputMode="tel"
                    />
                  </Field>
                  <Field label="Email" icon={Mail} hint="Optional">
                    <Input
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) => set("clientEmail", e.target.value)}
                      placeholder="client@email.com"
                    />
                  </Field>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Event name" required>
                  <Input
                    value={form.eventName}
                    onChange={(e) => set("eventName", e.target.value)}
                    placeholder="Aanya & Rohan Wedding"
                  />
                </Field>
              </div>
              <Field label="Event type" required>
                <Select value={form.eventType} onValueChange={(v) => set("eventType", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="pre-wedding">Pre-Wedding</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Event date" icon={Calendar} required>
                <Input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => set("eventDate", e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Location" icon={MapPin} required>
                  <Input
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Taj Lake Palace, Udaipur"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description" hint="Optional">
                  <Textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="A short note about the event, mood, or special requests..."
                    rows={3}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Cover image <span className="text-muted-foreground/70">(Optional)</span>
                </Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {coverPreview ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-border/60 aspect-[16/8]">
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverPreview(null);
                        set("coverImage", null);
                      }}
                      className="absolute top-3 right-3 size-8 rounded-full bg-background/80 backdrop-blur-md border border-border/60 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-3 right-3 px-3 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-xs font-medium hover:bg-background transition-colors"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFile(e.dataTransfer.files?.[0]);
                    }}
                    className={cn(
                      "w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 py-10 text-center",
                      dragOver
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/40",
                    )}
                  >
                    <div className="size-11 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
                      <ImagePlus className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Drag & drop an image</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        or click to browse · PNG, JPG up to 8MB
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border/60 bg-secondary/30">
          {step === 1 ? (
            <Button variant="ghost" onClick={() => handleClose(false)}>
              Cancel
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="size-4" /> Back
            </Button>
          )}

          {step === 1 ? (
            <Button
              disabled={!canNext}
              onClick={() => setStep(2)}
              className="bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              Next <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              disabled={!canCreate}
              onClick={submit}
              className="bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              <Check className="size-4" /> Create Event
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({
  label,
  hint,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
    {children}
  </div>
);

export default CreateEventDialog;
