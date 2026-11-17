import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_BASE = "https://app.pingupag.com/api/v1";

const createSchema = z.object({
  amount: z.number().positive(),
  customer: z.object({
    name: z.string(),
    email: z.string(),
    cpf: z.string(),
    phone: z.string(),
  }),
});

export const createPixPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data: raw }) => {
    const name = raw.customer.name.trim();
    const email = raw.customer.email.trim().toLowerCase();
    const cpf = raw.customer.cpf.replace(/\D/g, "");
    const phone = raw.customer.phone.replace(/\D/g, "");

    if (name.length < 2) throw new Error("Informe o nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("E-mail inválido.");
    if (cpf.length !== 11) throw new Error("CPF inválido.");
    if (phone.length < 10) throw new Error("Telefone inválido.");

    const apiKey = process.env["PINGUPAG_API_KEY"];
    const productHash = process.env["PINGUPAG_PRODUCT_HASH"];
    if (!apiKey || !productHash) {
      throw new Error("Credenciais da Pingupag não configuradas.");
    }

    const payload = {
      amount: Math.round(raw.amount * 100),
      productHash,
      product_hash: productHash,
      payment_method: "pix",
      customer: { name, email, document: cpf, phone },
    };

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Pingupag network error", err);
      throw new Error("Não foi possível conectar ao provedor de pagamento. Tente novamente.");
    }

    const text = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      /* não json */
    }

    if (!res.ok || json?.status === "error") {
      console.error("Pingupag error", res.status, text);
      throw new Error(json?.message || json?.error || `Falha ao gerar PIX (status ${res.status}).`);
    }

    const qrCodeImage: string | undefined =
      json.qr_code_base64 || json.qr_code_image || json.qrCodeImage;
    const copyPaste: string | undefined =
      json.qr_code || json.pix_qr_code || json.copy_paste || json.brcode || json.code;
    const externalId: string | number | undefined =
      json.hash || json.external_id || json.externalId || json.transaction_id || json.id;

    return {
      externalId: externalId != null ? String(externalId) : null,
      qrCodeImage: qrCodeImage ?? null,
      copyPaste: copyPaste ?? null,
    };
  });

export const checkPixStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({ externalId: z.union([z.string(), z.number()]).transform((v) => String(v)) })
      .refine((v) => v.externalId.length > 0, { message: "ID inválido." })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["PINGUPAG_API_KEY"];
    if (!apiKey) throw new Error("Credenciais da Pingupag não configuradas.");

    let res: Response;
    try {
      res = await fetch(
        `${API_BASE}/check_status.php?hash=${encodeURIComponent(data.externalId)}`,
        { headers: { "X-API-Key": apiKey, Accept: "application/json" } },
      );
    } catch (err) {
      console.error("Pingupag status network error", err);
      return { status: "pending" as const };
    }

    const text = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      /* não json */
    }

    const status = String(json?.status ?? json?.payment_status ?? "").toLowerCase();
    const paid = status === "paid" || status === "approved" || json?.paid === true;

    if (paid) {
      return { status: "paid" as const };
    }
    return { status: "pending" as const };
  });
