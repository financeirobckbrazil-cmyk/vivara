import { createServerFn } from "@tanstack/react-start";

// ---------- helpers (server-side only usage) ----------
function randomDigits(len: number) {
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 10);
  return out;
}

function generateCpf(): string {
  const n: number[] = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const calc = (base: number[], startWeight: number) => {
    const sum = base.reduce((acc, d, i) => acc + d * (startWeight - i), 0);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calc(n, 10);
  const d2 = calc([...n, d1], 11);
  return [...n, d1, d2].join("");
}

const FIRST = ["Ana", "Bruno", "Carla", "Diego", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João"];
const LAST = ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Costa", "Almeida", "Rodrigues", "Lima", "Martins"];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] as string;

// ---------- create_pix ----------
export const createPix = createServerFn({ method: "POST" })
  .inputValidator((input: { amountCents?: number }) => {
    const raw = Number(input?.amountCents ?? 0);
    const amountCents = Number.isFinite(raw) ? Math.round(raw) : 0;
    if (amountCents < 100 || amountCents > 5_000_000) {
      throw new Error("Valor inválido");
    }
    return { amountCents };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["PINGUPAG_API_KEY"];
    const productHash = process.env["PINGUPAG_PRODUCT_HASH"];
    if (!apiKey || !productHash) {
      return { ok: false as const, error: "Pagamento indisponível no momento." };
    }

    const ts = Date.now();
    const payload = {
      amount: data.amountCents,
      productHash,
      customer: {
        name: `${pick(FIRST)} ${pick(LAST)}`,
        email: `cliente_${ts}_${randomDigits(4)}@email.com`,
        document: generateCpf(),
        phone: `11${randomDigits(9)}`,
      },
    };

    try {
      const res = await fetch("https://app.pingupag.com/api/v1/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json: Record<string, unknown> = {};
      try {
        json = JSON.parse(text) as Record<string, unknown>;
      } catch {
        json = {};
      }

      if (!res.ok) {
        console.error("pingupag create error", res.status, text.slice(0, 500));
        return { ok: false as const, error: "Não foi possível gerar o Pix. Tente novamente." };
      }

      const dig = (obj: unknown, keys: string[]): string | null => {
        if (!obj || typeof obj !== "object") return null;
        const rec = obj as Record<string, unknown>;
        for (const k of keys) {
          const v = rec[k];
          if (typeof v === "string" && v.length > 0) return v;
        }
        for (const v of Object.values(rec)) {
          if (v && typeof v === "object") {
            const found = dig(v, keys);
            if (found) return found;
          }
        }
        return null;
      };

      const qrCode = dig(json, ["qrcode", "qrCode", "qr_code", "pixCode", "copy_paste", "emv", "payload"]);
      const externalId = dig(json, ["hash", "externalId", "external_id", "id", "transactionId", "transaction_id"]);

      if (!qrCode || !externalId) {
        console.error("pingupag unexpected payload", text.slice(0, 500));
        return { ok: false as const, error: "Resposta inválida do gateway." };
      }

      return { ok: true as const, qrCode, externalId, amountCents: data.amountCents };
    } catch (err) {
      console.error("pingupag create exception", err);
      return { ok: false as const, error: "Falha de conexão com o gateway." };
    }
  });

// ---------- check_status ----------
export const checkPixStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { externalId: string }) => {
    const externalId = String(input?.externalId ?? "").trim();
    if (!externalId || externalId.length > 128) throw new Error("Transação inválida");
    return { externalId };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["PINGUPAG_API_KEY"];
    const upsellUrl = process.env["PINGUPAG_UPSELL_URL"];
    if (!apiKey) return { status: "pending" as const };

    try {
      const res = await fetch(
        `https://app.pingupag.com/api/v1/check_status.php?hash=${encodeURIComponent(data.externalId)}`,
        { headers: { "X-API-Key": apiKey } },
      );
      const text = await res.text();
      const paid = /"?status"?\s*[:=]?\s*"?(paid|approved|APPROVED|PAID)"?/.test(text) || text.trim() === "paid";

      if (paid && upsellUrl) {
        return { status: "paid" as const, redirect_url: upsellUrl };
      }
      if (paid) return { status: "paid" as const };
      return { status: "pending" as const };
    } catch (err) {
      console.error("pingupag status exception", err);
      return { status: "pending" as const };
    }
  });
