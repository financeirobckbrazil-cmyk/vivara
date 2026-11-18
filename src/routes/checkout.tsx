import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Copy, Loader2, Sparkles, ShieldCheck, Check, Search, UserRound, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL, getProduct } from "@/lib/products";
import { createPixPayment, checkPixStatus } from "@/lib/pingupag.functions";
import { createPaidTracking } from "@/lib/tracking.functions";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";



export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Life Pandora" }] }),
  component: CheckoutPage,
});

type Shipping = { id: string; label: string; eta: string; price: number; free?: boolean };
const SHIPPING: Shipping[] = [
  { id: "sedex", label: "Sedex (Recomendado)", eta: "de 2 até 3 dias", price: 19.90 },
  { id: "jadlog", label: "JadLog Package", eta: "de 5 até 7 dias", price: 12.90 },
  { id: "pac", label: "PAC - Correios", eta: "de 7 até 10 dias", price: 0, free: true },
];

const BUMPS = [
  {
    id: "colar-prata-cravejado",
    eyebrow: "OFERTA ESPECIAL",
    title: "Colar de prata com brilho cravejado",
    desc: "Um toque delicado de brilho para complementar suas pulseiras e deixar sua composição ainda mais elegante.",
    price: 48.45,
    image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwb8d3b849/productimages/main_rect_center/335080C01_RGB.jpg?bgcolor=F7F7F7&q=90&sfrm=png&sw=1200",
    imageAlt: "Colar prateado Pandora com malha brilhante e fecho de coração",
    tag: "BRILHO QUE COMPLETA SEU VISUAL",
  },
  {
    id: "kit-limpeza",
    eyebrow: "MAIS ESCOLHIDO",
    title: "Kit de limpeza para joias",
    desc: "Conjunto de cuidado com solução de limpeza, escova macia e flanela para suas peças.",
    price: 49.87,
    image: "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw0b1f9cf1/productimages/singlepackshot/CARE_KIT_JAR_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200",
    imageAlt: "Kit de limpeza para joias Pandora",
    tag: "CUIDE DAS SUAS PEÇAS",
  },
  {
    id: "flanela-polimento",
    eyebrow: "CUIDADO EXTRA",
    title: "Flanela macia para polimento",
    desc: "Flanela delicada para remover marcas do dia a dia e devolver o brilho às suas joias.",
    price: 19.90,
    image: "https://laatukoru.fi/cdn/shop/files/Pandora_puhdistusliina_A001.jpg?v=1759136280&width=1024",
    imageAlt: "Flanela rosa clara para polimento de joias",
    tag: "MANTENHA O BRILHO DAS SUAS PEÇAS",
  },
];

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCpf = (value: string) =>
  onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

function CheckoutPage() {
  const { items, total, count } = useCart();
  const hasNonBraceletProduct = items.some((item) => {
    const product = getProduct(item.id);
    if (!product) return true;
    if (/pulseira/i.test(product.name)) return false;
    if (/charm/i.test(product.name) && item.bonusQty) return false;
    return true;
  });
  const existingAddonIds = new Set(items.map((item) => item.id));
  const visibleBumps = hasNonBraceletProduct ? BUMPS.filter((b) => !existingAddonIds.has(b.id)) : [];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bumps, setBumps] = useState<Record<string, boolean>>({});
  const [shipping, setShipping] = useState<string>("");
  const [customer, setCustomer] = useState({ nome: "", cpf: "", tel: "", email: "" });
  const [address, setAddress] = useState({ cep: "", numero: "", rua: "", bairro: "", cidade: "", estado: "" });
  const [cepLoading, setCepLoading] = useState(false);

  const handleCepChange = async (raw: string) => {
    const masked = raw.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
    setAddress((a) => ({ ...a, cep: masked }));
    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) {
      setCepLoading(true);
      try {
        const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const d = await r.json();
        if (!d.erro) {
          setAddress((a) => ({
            ...a,
            rua: d.logradouro || a.rua,
            bairro: d.bairro || a.bairro,
            cidade: d.localidade || a.cidade,
            estado: d.uf || a.estado,
          }));
        }
      } catch {}
      setCepLoading(false);
    }
  };

  const bumpsTotal = visibleBumps.reduce((s, b) => s + (bumps[b.id] ? b.price : 0), 0);
  const shippingPrice = SHIPPING.find((s) => s.id === shipping)?.price ?? 0;
  const grandTotal = total + bumpsTotal + shippingPrice;

  const cpfComplete = onlyDigits(customer.cpf).length === 11;
  const cpfValid = cpfComplete;
  const step1Valid = customer.nome.trim().length >= 2 && cpfValid && onlyDigits(customer.tel).length >= 10 && isValidEmail(customer.email);
  const step2Valid = address.cep && address.numero && address.rua && address.bairro && address.cidade && address.estado && shipping;

  const pixFn = useServerFn(createPixPayment);
  const statusFn = useServerFn(checkPixStatus);
  const trackingFn = useServerFn(createPaidTracking);
  const [pixLoading, setPixLoading] = useState(false);
  const [pix, setPix] = useState<{ qrCodeImage: string | null; copyPaste: string | null; externalId: string | null } | null>(null);
  const [paid, setPaid] = useState(false);
  const [tracking, setTracking] = useState<{ trackingId: string; trackingUrl: string; emailSent: boolean } | null>(null);
  const [trackingSaving, setTrackingSaving] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const paidRef = useRef(false);

  const savePaidTracking = useCallback(async () => {
    if (!pix?.externalId || tracking || trackingSaving) return;
    setTrackingSaving(true);
    setTrackingError("");
    try {
      const result = await trackingFn({
        data: {
          externalId: pix.externalId,
          customer: { name: customer.nome, email: customer.email },
          items: items.map((item) => ({
            name: getProduct(item.id)?.name || item.id,
            quantity: item.qty + (item.bonusQty ?? 0),
            size: item.size,
          })),
          total: grandTotal,
          shippingMethod: SHIPPING.find((option) => option.id === shipping)?.label || shipping,
          address: {
            cep: address.cep,
            street: address.rua,
            number: address.numero,
            neighborhood: address.bairro,
            city: address.cidade,
            state: address.estado,
          },
        },
      });
      setTracking(result);
      if (result.emailSent) toast.success("Link de rastreio enviado para seu e-mail!");
      else toast.warning("Rastreio criado. O envio de e-mail ainda precisa ser configurado.");
    } catch (error: any) {
      setTrackingError(error?.message || "Não foi possível criar o rastreio agora.");
    } finally {
      setTrackingSaving(false);
    }
  }, [pix?.externalId, tracking, trackingSaving, trackingFn, customer.nome, customer.email, items, grandTotal, shipping, address]);

  useEffect(() => {
    if (!pix?.externalId) return;
    let stopped = false;
    const timer = setInterval(async () => {
      if (stopped || paidRef.current) return;
      try {
        const externalId = pix.externalId;
        if (!externalId) return;
        const r = await statusFn({ data: { externalId } });
        if (r.status === "paid") {
          stopped = true;
          paidRef.current = true;
          clearInterval(timer);
          setPaid(true);
          toast.success("Pagamento confirmado!");
          await savePaidTracking();
        }
      } catch {
        /* segue tentando */
      }
    }, 3000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [pix?.externalId, statusFn, savePaidTracking]);

  const handlePix = async () => {
    if (!step1Valid) {
      toast.error("Confira nome, CPF, telefone e e-mail antes de gerar o PIX.");
      return;
    }

    setPixLoading(true);
    try {
      const res = await pixFn({
        data: {
          amount: grandTotal,
          customer: {
            name: customer.nome,
            email: customer.email,
            cpf: customer.cpf,
            phone: customer.tel,
          },
        },
      });
      setPix({ qrCodeImage: res.qrCodeImage, copyPaste: res.copyPaste, externalId: res.externalId });
      toast.success("PIX gerado! Pague no app do seu banco.");
    } catch (e: any) {
      toast.error(e?.message || "Erro ao gerar PIX.");
    } finally {
      setPixLoading(false);
    }
  };


  const copyPixCode = () => {
    if (!pix?.copyPaste) return;
    navigator.clipboard.writeText(pix.copyPaste);
    toast.success("Código copiado!");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-6">Sua sacola está vazia.</p>
          <Link to="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 text-sm tracking-[0.2em] uppercase rounded-sm">
            Voltar à loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9fb] flex flex-col">
      <div className="bg-[#211b18] px-4 py-2 text-center text-[9px] font-medium tracking-[0.2em] text-white/90 uppercase">
        Finalização segura · Seus dados protegidos
      </div>
      <header className="border-b border-[#f0dce5] bg-white px-5 sm:px-8">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between sm:h-[88px]">
          <Link to="/" aria-label="PANDORA - início" className="inline-flex items-center justify-center"><span className="relative inline-flex items-center font-sans text-[29px] font-semibold tracking-[-.055em] text-[#241c20] sm:text-[39px]">
            PAND<span className="relative inline-block">O<span className="absolute -top-[13px] left-1/2 -translate-x-1/2 sm:-top-[16px]"><svg width="19" height="13" viewBox="0 0 19 13" fill="none" aria-hidden="true"><path d="M1.5 3.2L5.4 7.1L9.5 1.3L13.6 7.1L17.5 3.2L15.7 11H3.3L1.5 3.2Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round"/><circle cx="1.5" cy="2" r="1" fill="currentColor"/><circle cx="9.5" cy="1.4" r="1" fill="currentColor"/><circle cx="17.5" cy="2" r="1" fill="currentColor"/></svg></span></span>RA
          </span></Link>
          <div className="flex items-center gap-3 text-[#30252a] sm:gap-6">
            <Link to="/" hash="colecao" aria-label="Buscar produtos" className="rounded-full p-2 hover:bg-[#fff1f5]"><Search className="h-6 w-6" strokeWidth={1.5} /></Link>
            <Link to="/compras" aria-label="Minha conta" className="rounded-full p-2 hover:bg-[#fff1f5]"><UserRound className="h-6 w-6" strokeWidth={1.5} /></Link>
            <Link to="/carrinho" aria-label="Sacola" className="rounded-full p-2 hover:bg-[#fff1f5]"><ShoppingBag className="h-7 w-7" strokeWidth={1.5} /></Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-7 sm:py-9">
        <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-[#f9e8ef] via-[#fff9fb] to-[#f4dce7] px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] text-[#b77f98] uppercase"><Sparkles className="h-3.5 w-3.5" /> Falta pouco para sua joia chegar</p>
              <h1 className="mt-2 font-serif text-2xl tracking-[0.08em] text-[#28221e] sm:text-3xl">Finalizar pedido</h1>
              <p className="mt-2 text-xs text-[#74685d]">{count} {count === 1 ? "item selecionado" : "itens selecionados"} · Revise seus dados e escolha a entrega</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2.5 text-xs text-[#63584e] shadow-sm">
              <Lock className="h-3.5 w-3.5" /> Checkout protegido
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { n: 1, label: "Seus dados" },
            { n: 2, label: "Entrega" },
            { n: 3, label: "Pagamento" },
          ].map((s) => (
            <div key={s.n} className="space-y-2">
              <div className={`h-1 rounded-full ${step >= s.n ? "bg-foreground" : "bg-border"}`} />
              <p className={`text-[10px] sm:text-xs ${step >= s.n ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {/* Mini items list */}
            <ul className="space-y-3">
              {items.map((item) => {
                const product = getProduct(item.id);
                if (!product) return null;
                return (
                  <li key={`${item.id}-${item.size}`} className="border border-border bg-card rounded-md p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-secondary/40 rounded-sm flex-shrink-0 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Tamanho: {item.size} · Qtd paga: {item.qty}{(item.bonusQty ?? 0) > 0 ? ` · + ${item.bonusQty} grátis` : ""}</p>
                    </div>
                    <span className="text-price font-semibold text-sm">{formatBRL(product.price * item.qty)}</span>
                  </li>
                );
              })}
            </ul>

            {/* STEP 1 */}
            <section className="border border-border bg-card rounded-md p-5 sm:p-7">
              <StepHeader n={1} active={step >= 1} title="DADOS DO CLIENTE" />
              {step >= 1 && (
                <div className="mt-6 space-y-4">
                  <Field label="Nome completo">
                    <input value={customer.nome} onChange={(e) => setCustomer({ ...customer, nome: e.target.value })} placeholder="Nome e Sobrenome" className="ck-input" />
                  </Field>
                  <Field label="CPF">
                    <input
                      value={customer.cpf}
                      onChange={(e) => setCustomer({ ...customer, cpf: formatCpf(e.target.value) })}
                      placeholder="000.000.000-00"
                      className="ck-input"
                      inputMode="numeric"
                      maxLength={14}
                      aria-invalid={cpfComplete && !cpfValid}
                      aria-describedby="cpf-error"
                    />
                    {cpfComplete && !cpfValid && (
                      <p id="cpf-error" className="mt-1 text-xs text-destructive" role="alert">
                        CPF inválido. Confira os números digitados.
                      </p>
                    )}
                  </Field>
                  <Field label="Telefone com DDD">
                    <input value={customer.tel} onChange={(e) => setCustomer({ ...customer, tel: formatPhone(e.target.value) })} placeholder="(00) 00000-0000" className="ck-input" inputMode="numeric" maxLength={15} />
                  </Field>
                  <Field label="E-mail">
                    <input value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value.trim() })} placeholder="seu@email.com" className="ck-input" type="email" />
                  </Field>
                  {step === 1 && (
                    <button disabled={!step1Valid} onClick={() => setStep(2)} className="w-full py-4 bg-secondary text-muted-foreground tracking-[0.2em] text-sm uppercase rounded-sm disabled:opacity-60 enabled:bg-foreground enabled:text-background touch-manipulation">
                      Continuar
                    </button>
                  )}
                </div>
              )}
            </section>




            {/* STEP 2 */}
            {step >= 2 && (
              <section className="border border-border bg-card rounded-md p-5 sm:p-7">
                <StepHeader n={2} active title="ENDEREÇO E FRETE" />
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-[1fr_120px] gap-4">
                    <Field label="CEP"><input value={address.cep} onChange={(e) => handleCepChange(e.target.value)} placeholder={cepLoading ? "Buscando..." : "00000-000"} className="ck-input" inputMode="numeric" /></Field>
                    <Field label="Número"><input value={address.numero} onChange={(e) => setAddress({ ...address, numero: e.target.value })} placeholder="Nº" className="ck-input" /></Field>
                  </div>
                  <Field label="Rua"><input value={address.rua} onChange={(e) => setAddress({ ...address, rua: e.target.value })} className="ck-input" /></Field>
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Bairro"><input value={address.bairro} onChange={(e) => setAddress({ ...address, bairro: e.target.value })} className="ck-input" /></Field>
                    <Field label="Cidade"><input value={address.cidade} onChange={(e) => setAddress({ ...address, cidade: e.target.value })} className="ck-input" /></Field>
                    <Field label="Estado"><input value={address.estado} onChange={(e) => setAddress({ ...address, estado: e.target.value })} className="ck-input" /></Field>
                  </div>

                  {address.cep && address.numero && address.rua && address.bairro && address.cidade && address.estado && (
                    <div className="pt-2">
                      <h3 className="text-foreground text-sm font-semibold tracking-[0.15em]">OPÇÕES DE FRETE</h3>
                      <div className="mt-3 space-y-3">
                        {SHIPPING.map((s) => (
                          <label key={s.id} className={`flex items-center gap-4 border rounded-sm p-4 cursor-pointer ${shipping === s.id ? "border-foreground" : "border-border"}`}>
                            <input type="radio" name="ship" checked={shipping === s.id} onChange={() => setShipping(s.id)} className="accent-foreground" />
                            <div className="flex-1">
                              <div className="text-sm text-foreground font-medium">{s.label}</div>
                              <div className="text-xs text-muted-foreground">{s.eta}</div>
                            </div>
                            <div className={`text-sm font-semibold ${s.free ? "text-price" : "text-foreground"}`}>{s.free ? "Grátis" : formatBRL(s.price)}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <button disabled={!step2Valid} onClick={() => setStep(3)} className="w-full py-4 bg-secondary text-muted-foreground tracking-[0.2em] text-sm uppercase rounded-sm disabled:opacity-60 enabled:bg-foreground enabled:text-background touch-manipulation">
                      Continuar
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* STEP 3 */}
            {step >= 3 && (
              <section className="border border-border bg-card rounded-md p-5 sm:p-7">
                <StepHeader n={3} active title="PAGAMENTO VIA PIX" />
                <div className="mt-6 text-center">
                  {paid ? (
                    <div className="py-6 space-y-3">
                      <div className="mx-auto w-14 h-14 rounded-full bg-[#f5e3eb] text-[#9d5e7d] flex items-center justify-center text-2xl">✓</div>
                      <h3 className="text-lg font-bold text-foreground">Pagamento aprovado!</h3>
                      <p className="text-sm text-muted-foreground">Seu pedido foi confirmado. Estamos preparando seu acompanhamento.</p>
                      {trackingSaving && <p className="text-xs text-[#987184]">Criando seu link de rastreio...</p>}
                      {tracking && (
                        <div className="mt-4 rounded-xl border border-[#efd8e3] bg-[#fff7fa] p-4">
                          <p className="text-sm font-semibold text-[#513b46]">Seu rastreio está pronto!</p>
                          <p className="mt-1 text-xs text-[#927b87]">{tracking.emailSent ? "Também enviamos o link para seu e-mail." : "Salve este link para acompanhar seu pedido."}</p>
                          <Link to="/rastreio/$trackingId" params={{ trackingId: tracking.trackingId }} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#513b46] px-4 py-3 text-xs font-semibold tracking-widest text-white">ACOMPANHAR MEU PEDIDO <span>→</span></Link>
                        </div>
                      )}
                      {trackingError && (
                        <div className="rounded-lg bg-[#fff2f3] p-3 text-left">
                          <p className="text-xs text-red-700">{trackingError}</p>
                          <button onClick={savePaidTracking} className="mt-2 text-xs font-semibold text-[#8d526e] underline">Tentar criar rastreio novamente</button>
                        </div>
                      )}
                    </div>
                  ) : (
                  <>
                  <div className="text-sm text-muted-foreground">
                    Total: <span className="text-foreground font-bold text-base">{formatBRL(grandTotal)}</span>
                  </div>

                  {!pix && (
                    <button
                      onClick={handlePix}
                      disabled={pixLoading}
                      className="w-full mt-4 py-4 bg-[hsl(142_71%_45%)] text-white tracking-[0.2em] text-sm uppercase rounded-sm font-medium hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {pixLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {pixLoading ? "Gerando..." : "Gerar pagamento via PIX"}
                    </button>
                  )}

                  {pix && (
                    <div className="mt-5 space-y-4">
                      {pix.qrCodeImage ? (
                        <div className="flex justify-center">
                          <img
                            src={pix.qrCodeImage.startsWith("data:") ? pix.qrCodeImage : `data:image/png;base64,${pix.qrCodeImage}`}
                            alt="QR Code PIX"
                            className="w-56 h-56 border border-border rounded-sm bg-white p-2"
                          />
                        </div>
                      ) : pix.copyPaste ? (
                        <div className="flex justify-center">
                          <div className="bg-white p-3 border border-border rounded-sm">
                            <QRCodeSVG value={pix.copyPaste} size={220} level="M" />
                          </div>
                        </div>
                      ) : null}
                      {pix.copyPaste && (
                        <>
                          <p className="text-xs text-muted-foreground">PIX Copia e Cola</p>
                          <textarea
                            readOnly
                            value={pix.copyPaste}
                            className="w-full h-24 p-2 text-xs border border-border rounded-sm font-mono break-all"
                          />
                          <button
                            onClick={copyPixCode}
                            className="w-full py-3 bg-foreground text-background tracking-[0.15em] text-xs uppercase rounded-sm flex items-center justify-center gap-2"
                          >
                            <Copy className="h-3 w-3" /> Copiar código
                          </button>
                        </>
                      )}
                      <p className="text-xs text-muted-foreground">Após o pagamento, o pedido é confirmado automaticamente.</p>
                    </div>
                  )}
                  </>
                  )}
                </div>
              </section>
            )}

            <Link to="/carrinho" className="inline-block text-sm text-foreground underline underline-offset-4">Voltar à sacola</Link>
          </div>

          {/* RESUMO */}
          <aside className="sticky top-5 rounded-xl border border-[#f0dce5] bg-white p-5 shadow-[0_12px_40px_rgba(46,35,25,0.06)] sm:p-6 h-fit space-y-5">
            <h2 className="text-foreground text-sm tracking-[0.15em] font-semibold">RESUMO DO PEDIDO</h2>

            <div className="space-y-3 text-sm pb-5 border-b border-border">
              <div className="flex justify-between">
                <span className="text-primary">Subtotal ({count} {count === 1 ? "item" : "itens"})</span>
                <span className="text-foreground">{formatBRL(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary">Frete</span>
                <span className="text-muted-foreground">{shipping ? (shippingPrice === 0 ? "Grátis" : formatBRL(shippingPrice)) : "Selecione o frete"}</span>
              </div>
              {bumpsTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-primary">Adicionais</span>
                  <span className="text-foreground">{formatBRL(bumpsTotal)}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-br from-[#513b46] to-[#815c70] p-4 text-white shadow-sm">
                <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.22em] text-[#f4dce7] uppercase"><Sparkles className="h-3.5 w-3.5" /> Um mimo para suas joias</p>
                <p className="mt-2 font-serif text-lg leading-snug">Aproveite para cuidar ainda melhor das suas peças</p>
                <p className="mt-1 text-xs leading-relaxed text-white/75">Adicionais exclusivos para completar seu pedido. Você escolhe se deseja incluir.</p>
              </div>
              {visibleBumps.map((b, index) => (
                <label
                  key={b.id}
                  className={`group relative block cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${bumps[b.id] ? "border-[#b77f98] ring-2 ring-[#d7a9bd]/30" : "border-[#f0dce5] hover:border-[#d7a9bd]"}`}
                >
                  <div className="relative flex h-28 items-center justify-center overflow-hidden bg-[#fff3f7] sm:h-32">
                    <img src={b.image} alt={b.imageAlt} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = b.id === "kit-limpeza" ? "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw0b1f9cf1/productimages/singlepackshot/CARE_KIT_JAR_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200" : b.id === "flanela-polimento" ? "https://laatukoru.fi/cdn/shop/files/Pandora_puhdistusliina_A001.jpg?v=1759136280&width=1024" : "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwb8d3b849/productimages/main_rect_center/335080C01_RGB.jpg?bgcolor=F7F7F7&q=90&sfrm=png&sw=1200"; }} className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[8px] font-semibold tracking-[0.13em] text-[#987184] shadow-sm">{b.eyebrow}</span>
                    {b.id === "kit-limpeza" && <span className="absolute right-3 top-3 rounded-full bg-[#513b46] px-2.5 py-1 text-[8px] font-semibold tracking-wider text-white">KIT COMPLETO</span>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[8px] font-semibold tracking-[0.14em] text-[#b58b9d]">{b.tag}</p>
                        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-[#46343d]">{b.title}</h3>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-[#927b87]">{b.desc}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[8px] uppercase tracking-wider text-[#b58b9d]">Por apenas</p>
                        <p className="mt-1 text-lg font-bold tracking-tight text-[#46343d]">{formatBRL(b.price)}</p>
                      </div>
                    </div>
                    <div className={`mt-4 flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${bumps[b.id] ? "bg-[#f8e8ef] text-[#694b5b]" : "bg-[#513b46] text-white group-hover:bg-[#c87898]"}`}>
                      {bumps[b.id] ? <><Check className="h-3.5 w-3.5" /> Adicionado ao pedido</> : "Quero aproveitar esta oferta"}
                    </div>
                    <input
                      type="checkbox"
                      checked={!!bumps[b.id]}
                      onChange={(e) => setBumps({ ...bumps, [b.id]: e.target.checked })}
                      className="sr-only"
                      aria-label={`Adicionar ${b.title} por ${formatBRL(b.price)}`}
                    />
                  </div>
                </label>
              ))}
            </div>




            <div className="flex justify-between items-baseline pt-2 border-t border-border">
              <span className="text-foreground font-semibold">Total</span>
              <span className="text-foreground font-semibold text-lg">{formatBRL(grandTotal)}</span>
            </div>

            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Compra 100% segura
            </p>
          </aside>
        </div>
      </main>

      <style>{`
        .ck-input { width:100%; height:44px; border:1px solid var(--primary); border-radius:4px; padding:0 12px; font-size:14px; background:transparent; color: var(--foreground); outline:none; }
        .ck-input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px var(--ring); }
      `}</style>
    </div>
  );
}

function StepHeader({ n, active, title }: { n: number; active: boolean; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{n}</span>
      <h2 className="text-foreground text-sm sm:text-base font-semibold tracking-[0.15em]">{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-primary mb-1.5">{label}</label>
      {children}
    </div>
  );
}
