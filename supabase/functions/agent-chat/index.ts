import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { convertToModelMessages, streamText, tool, stepCountIs } from "npm:ai@7";
import { z } from "npm:zod@3";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "gallery";

const rid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 8)}`;

const SYSTEM = `You are Lens, the AI studio manager inside the Lensly photography SaaS dashboard.

You help photographers run their whole studio through chat: creating clients and events, adding
collections, uploading photos/videos/folders, sharing personalised client gallery links, creating
and sending invoices, and reviewing billing & storage usage.

Rules:
- This is a DEMO workspace: your tools simulate the real dashboard actions and return realistic
  demo data. Never claim you connected to external systems, and never invent tool results.
- Be proactive and guide the user through the natural workflow:
  client -> event -> collection -> upload media -> share gallery -> invoice.
  After each completed step, suggest the next one in one short line.
- Ask only for the details you really need; sensibly infer or suggest the rest.
- Keep replies short, warm and skimmable. Use markdown, bold key values, and avoid repeating
  data that the tool card already shows.
- Amounts default to INR unless the user says otherwise.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const parsed = z
      .object({ sessionId: z.string().min(1).max(200), messages: z.array(z.any()) })
      .safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { sessionId, messages } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // persist the latest user message
    const last = messages[messages.length - 1];
    if (last?.role === "user") {
      const { error } = await supabase.from("agent_messages").insert({
        session_id: sessionId,
        message_id: last.id ?? null,
        role: "user",
        parts: last.parts ?? [],
      });
      if (error) console.error("persist user message failed:", error.message);
    }

    const gateway = createLovableAiGatewayProvider(apiKey);

    const tools = {
      create_client: tool({
        description: "Create a new client in the studio CRM.",
        inputSchema: z.object({
          firstName: z.string(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
        }),
        execute: async ({ firstName, lastName, phone, email }) => ({
          id: rid("cli"),
          name: [firstName, lastName].filter(Boolean).join(" "),
          phone: phone ?? "—",
          email: email ?? "—",
          createdAt: new Date().toISOString(),
        }),
      }),

      create_event: tool({
        description: "Create a shoot/event for a client.",
        inputSchema: z.object({
          name: z.string(),
          client: z.string(),
          type: z.string().optional(),
          date: z.string().optional(),
          location: z.string().optional(),
        }),
        execute: async ({ name, client, type, date, location }) => ({
          id: rid("evt"),
          name,
          client,
          type: type ?? "Wedding",
          date: date ?? new Date().toISOString().slice(0, 10),
          location: location ?? "—",
          status: "Not Started",
        }),
      }),

      create_collection: tool({
        description: "Create a collection (album) inside an event.",
        inputSchema: z.object({ event: z.string(), name: z.string() }),
        execute: async ({ event, name }) => ({
          id: slug(name),
          name,
          event,
          photos: 0,
          videos: 0,
        }),
      }),

      upload_media: tool({
        description:
          "Upload images, videos or a folder into a collection. Returns a completed upload summary with progress.",
        inputSchema: z.object({
          collection: z.string(),
          source: z.enum(["images", "videos", "folder"]),
          count: z.number().optional(),
          quality: z.enum(["compressed", "original"]).optional(),
        }),
        execute: async ({ collection, source, count, quality }) => {
          const files = count ?? (source === "videos" ? 4 : 120);
          const perFile = source === "videos" ? 84 : 6.4;
          return {
            collection,
            source,
            quality: quality ?? "compressed",
            files,
            uploaded: files,
            failed: 0,
            sizeMb: Math.round(files * perFile),
            durationSec: Math.max(4, Math.round(files * 0.35)),
            progress: 100,
          };
        },
      }),

      share_gallery: tool({
        description:
          "Publish a gallery and generate a personalised share URL + access code for the client.",
        inputSchema: z.object({
          event: z.string(),
          client: z.string(),
          expiresInDays: z.number().optional(),
        }),
        execute: async ({ event, client, expiresInDays }) => ({
          event,
          client,
          url: `https://gallery.lensly.studio/${slug(client)}/${slug(event)}`,
          accessCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
          expiresInDays: expiresInDays ?? 90,
          downloadEnabled: true,
        }),
      }),

      create_invoice: tool({
        description: "Create an invoice for a client with line items.",
        inputSchema: z.object({
          client: z.string(),
          event: z.string().optional(),
          currency: z.string().optional(),
          dueDate: z.string().optional(),
          items: z.array(
            z.object({
              description: z.string(),
              quantity: z.number().optional(),
              price: z.number(),
              taxPercent: z.number().optional(),
            }),
          ),
          discount: z.number().optional(),
        }),
        execute: async ({ client, event, currency, dueDate, items, discount }) => {
          const lines = items.map((i) => {
            const qty = i.quantity ?? 1;
            const sub = qty * i.price;
            const tax = (sub * (i.taxPercent ?? 0)) / 100;
            return { ...i, quantity: qty, subtotal: sub, tax };
          });
          const subtotal = lines.reduce((a, l) => a + l.subtotal, 0);
          const tax = lines.reduce((a, l) => a + l.tax, 0);
          const disc = discount ?? 0;
          return {
            number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`,
            client,
            event: event ?? "—",
            currency: currency ?? "INR",
            status: "Draft",
            dueDate: dueDate ?? new Date(Date.now() + 12096e5).toISOString().slice(0, 10),
            items: lines,
            subtotal,
            tax,
            discount: disc,
            total: subtotal + tax - disc,
          };
        },
      }),

      send_invoice: tool({
        description: "Send an existing invoice to the client over email / WhatsApp.",
        inputSchema: z.object({
          invoiceNumber: z.string(),
          client: z.string(),
          channel: z.enum(["email", "whatsapp", "both"]).optional(),
        }),
        execute: async ({ invoiceNumber, client, channel }) => ({
          invoiceNumber,
          client,
          channel: channel ?? "email",
          status: "Sent",
          sentAt: new Date().toISOString(),
          payLink: `https://pay.lensly.studio/${invoiceNumber.toLowerCase()}`,
        }),
      }),

      get_billing_usage: tool({
        description: "Fetch the studio's current plan, storage and usage metrics.",
        inputSchema: z.object({}),
        execute: async () => ({
          plan: "Studio Pro",
          renewsOn: new Date(Date.now() + 18 * 864e5).toISOString().slice(0, 10),
          storageUsedGb: 312,
          storageTotalGb: 500,
          eventsThisMonth: 14,
          galleriesShared: 26,
          aiCreditsUsed: 4820,
          aiCreditsTotal: 10000,
          revenueThisMonth: 486000,
          pendingAmount: 92500,
          currency: "INR",
        }),
      }),

      list_events: tool({
        description: "List recent events in the studio workspace.",
        inputSchema: z.object({ limit: z.number().optional() }),
        execute: async ({ limit }) => ({
          events: [
            { name: "Aanya & Rohan Wedding", client: "Deven Rathod", date: "2026-04-24", status: "Selection Submitted", photos: 1240 },
            { name: "EventBit Corp Gala", client: "Yash Nasale", date: "2026-04-25", status: "In Progress", photos: 248 },
            { name: "Maya's 5th Birthday", client: "Priya Sharma", date: "2026-04-22", status: "Not Started", photos: 0 },
            { name: "TechSummit Keynote", client: "Acme Inc.", date: "2026-04-20", status: "Completed", photos: 512 },
          ].slice(0, limit ?? 4),
        }),
      }),
    };

    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      system: SYSTEM,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(50),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      headers: corsHeaders,
      onFinish: async ({ responseMessage }) => {
        const { error } = await supabase.from("agent_messages").insert({
          session_id: sessionId,
          message_id: responseMessage.id ?? null,
          role: "assistant",
          parts: responseMessage.parts ?? [],
        });
        if (error) console.error("persist assistant message failed:", error.message);
      },
    });
  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
