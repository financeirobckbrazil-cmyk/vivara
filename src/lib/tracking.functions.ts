import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_BASE = "https://app.pingupag.com/api/v1";
const stages = [
  "Pedido recebido",
  "Pedido em separação",
  "Pedido separado",
  "Pedido pronto para ser enviado",
  "Pedido enviado",
  "Pedido na cidade destino",
  "Pedido em rota de entrega",
  "Pedido entregue",
] as const;

const itemSchema = z.object({
  name: z.string().min(1).max(160),
  quantity: z.number().int().min(1).max(100),
  size: z.string().max(40).optional(),
});

const createSchema = z.object({
  externalId: z.string().min(1).max(160),
  customer: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(200),
  }),
  items: z.array(itemSchema).min(1).max(60),
  total: z.number().positive().max(100000),
  shippingMethod: z.string().min(1).max(100),
  address: z.object({
    cep: z.string().max(12),
    street: z.string().max(180),
    number: z.string().max(30),
    neighborhood: z.string().max(100),
    city: z.string().max(100),
    state: z.string().max(2),
  }),
});

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Configuração ausente no servidor: ${name}`);
  return value;
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const base = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const key = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Tracking database error", response.status, detail.slice(0, 500));
    throw new Error("Não foi possível salvar os dados do rastreio.");
  }
  return response.status === 204 ? null : response.json();
}

async function isPaymentPaid(externalId: string) {
  const apiKey = requiredEnv("PINGUPAG_API_KEY");
  const response = await fetch(
    `${API_BASE}/check_status.php?hash=${encodeURIComponent(externalId)}`,
    { headers: { "X-API-Key": apiKey, Accept: "application/json" } },
  );
  if (!response.ok) return false;
  const raw = await response.text();
  let data: any = {};
  try { data = JSON.parse(raw); } catch {}
  const status = String(data?.status ?? data?.payment_status ?? "").toLowerCase();
  return status === "paid" || status === "approved" || data?.paid === true;
}

function trackingUrl(id: string) {
  const base = (process.env["APP_URL"] || "https://life-pandora.vercel.app").replace(/\/$/, "");
  return `${base}/rastreio/${id}`;
}

export const createPaidTracking = createServerFn({ method: "POST" })
  .validator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    if (!(await isPaymentPaid(data.externalId))) {
      throw new Error("O pagamento ainda não foi confirmado pela Pingupag.");
    }

    const existing = await supabaseRequest(
      `life_pandora_tracking?select=id,payment_id&payment_id=eq.${encodeURIComponent(data.externalId)}&limit=1`,
    );
    let order = Array.isArray(existing) ? existing[0] : null;

    if (!order) {
      const inserted = await supabaseRequest("life_pandora_tracking", {
        method: "POST",
        body: JSON.stringify({
          payment_id: data.externalId,
          customer_name: data.customer.name,
          customer_email: data.customer.email,
          order_items: data.items,
          order_total: data.total,
          shipping_method: data.shippingMethod,
          shipping_address: data.address,
          paid_at: new Date().toISOString(),
        }),
      });
      order = Array.isArray(inserted) ? inserted[0] : null;
    }
    if (!order?.id) throw new Error("Pedido confirmado, mas não foi possível criar o rastreio.");

    const url = trackingUrl(order.id);
    let emailSent = false;
    const resendKey = process.env["RESEND_API_KEY"];
    const from = process.env["TRACKING_FROM_EMAIL"];
    if (resendKey && from) {
      const rows = stages.map((stage, index) =>
        `<li style="padding:8px 0;color:#5a4650">${index + 1}. ${stage} <span style="color:#ad7f94">— Dia ${index + 1}</span></li>`,
      ).join("");
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [data.customer.email],
          subject: "Seu pedido Life Pandora foi confirmado 💗",
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#46343d"><h1 style="font-weight:400">Obrigada pela sua compra, ${data.customer.name.replace(/[<>&"]/g, "")}!</h1><p>Seu pagamento foi confirmado. Acompanhe as etapas previstas para seu pedido:</p><ol>${rows}</ol><p><a href="${url}" style="display:inline-block;background:#513b46;color:white;padding:14px 22px;text-decoration:none">ACOMPANHAR MEU PEDIDO</a></p><p style="font-size:12px;color:#927b87">Este cronograma é uma previsão de processamento e transporte, não substitui os eventos oficiais da transportadora.</p></div>`,
        }),
      });
      emailSent = emailResponse.ok;
      if (!emailSent) console.error("Tracking email error", emailResponse.status, (await emailResponse.text()).slice(0, 500));
    }

    return { trackingId: order.id as string, trackingUrl: url, emailSent };
  });

export const getTrackingOrder = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ trackingId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const rows = await supabaseRequest(
      `life_pandora_tracking?select=id,customer_name,order_items,order_total,shipping_method,shipping_address,paid_at,delivered_at&id=eq.${data.trackingId}&limit=1`,
    );
    const order = Array.isArray(rows) ? rows[0] : null;
    if (!order) throw new Error("Pedido não encontrado.");
    const paidAt = new Date(order.paid_at);
    const elapsedDays = Math.max(0, Math.floor((Date.now() - paidAt.getTime()) / 86400000));
    const delivered = Boolean(order.delivered_at);\n    const currentStage = delivered ? 7 : Math.min(6, elapsedDays);
    return {
      id: order.id as string,
      customerName: order.customer_name as string,
      items: order.order_items as z.infer<typeof itemSchema>[],
      total: Number(order.order_total),
      shippingMethod: order.shipping_method as string,
      address: order.shipping_address as { city?: string; state?: string },
      paidAt: order.paid_at as string,
      currentStage,
      stages: stages.map((label, index) => ({
        label,
        day: index + 1,
        completed: index <= currentStage,
        current: index === currentStage,
        expectedAt: new Date(paidAt.getTime() + index * 86400000).toISOString(),
      })),
    };
  });
