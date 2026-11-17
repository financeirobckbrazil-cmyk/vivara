import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Copy, Loader2, Sparkles, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL, getProduct } from "@/lib/products";
import { createPixPayment, checkPixStatus } from "@/lib/pingupag.functions";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import logoLife from "@/assets/life-vivara-logo.png";



export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Life Vivara" }] }),
  component: CheckoutPage,
});

type Shipping = { id: string; label: string; eta: string; price: number; free?: boolean };
const SHIPPING: Shipping[] = [
  { id: "sedex", label: "Sedex (Recomendado)", eta: "de 2 até 3 dias", price: 33.71 },
  { id: "jadlog", label: "JadLog Package", eta: "de 5 até 7 dias", price: 22.89 },
  { id: "pac", label: "PAC - Correios", eta: "de 7 até 10 dias", price: 0, free: true },
];

const BUMPS = [
  {
    id: "flanela-prata",
    eyebrow: "CUIDADO ESPECIAL",
    title: "Flanela dupla para polimento",
    desc: "Ajuda a manter suas joias limpas e com aparência brilhante no dia a dia.",
    price: 14.87,
    image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwf5bdc892/productimages/main_rect_center/CARE_KIT_POLISHING_CLOTH_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    imageAlt: "Flanela dupla para polimento de joias Pandora",
    tag: "PEQUENO CUIDADO, GRANDE DIFERENÇA",
  },
  {
    id: "kit-limpeza",
    eyebrow: "MAIS ESCOLHIDO",
    title: "Kit de limpeza para joias",
    desc: "Conjunto de cuidado com solução de limpeza, escova macia e flanela para suas peças.",
    price: 49.87,
    image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw6ea1f0c9/productimages/main_rect_center/CARE_KIT_JAR_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    imageAlt: "Kit de limpeza para joias Pandora",
    tag: "CUIDE DAS SUAS PEÇAS",
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

  const bumpsTotal = BUMPS.reduce((s, b) => s + (bumps[b.id] ? b.price : 0), 0);
  const shippingPrice = SHIPPING.find((s) => s.id === shipping)?.price ?? 0;
  const grandTotal = total + bumpsTotal + shippingPrice;

  const cpfComplete = onlyDigits(customer.cpf).length === 11;
  const cpfValid = cpfComplete;
  const step1Valid = customer.nome.trim().length >= 2 && cpfValid && onlyDigits(customer.tel).length >= 10 && isValidEmail(customer.email);
  const step2Valid = address.cep && address.numero && address.rua && address.bairro && address.cidade && address.estado && shipping;

  const pixFn = useServerFn(createPixPayment);
  const statusFn = useServerFn(checkPixStatus);
  const [pixLoading, setPixLoading] = useState(false);
  const [pix, setPix] = useState<{ qrCodeImage: string | null; copyPaste: string | null; externalId: string | null } | null>(null);
  const [paid, setPaid] = useState(false);
  const paidRef = useRef(false);

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
        }
      } catch {
        /* segue tentando */
      }
    }, 3000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [pix?.externalId, statusFn]);

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
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="bg-[#211b18] px-4 py-2 text-center text-[9px] font-medium tracking-[0.2em] text-white/90 uppercase">
        Finalização segura · Seus dados protegidos
      </div>
      <header className="border-b border-[#eee7df] bg-white px-5 py-4 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-[0.18em] text-[#28221e] sm:text-2xl">LIFE <span className="text-[#a58a70]">VIVARA</span></Link>
          <img src={logoLife} alt="Life" className="h-8 w-auto sm:h-10" />
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f6f3ef] px-3 py-2 text-[10px] font-medium text-[#63584e]"><ShieldCheck className="h-3.5 w-3.5" /> Ambiente protegido</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-7 sm:py-9">
        <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-[#f2ece5] via-[#faf7f3] to-[#eee5dc] px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] text-[#9a785d] uppercase"><Sparkles className="h-3.5 w-3.5" /> Falta pouco para sua joia chegar</p>
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
                      <p className="text-xs text-muted-foreground mt-1">Tamanho: {item.size} · Qtd: {item.qty}</p>
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
                    <div className="py-6 space-y-2">
                      <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(142_71%_45%)] text-white flex items-center justify-center text-2xl">✓</div>
                      <h3 className="text-lg font-bold text-foreground">Pagamento aprovado!</h3>
                      <p className="text-sm text-muted-foreground">Recebemos seu PIX. Em breve você receberá a confirmação por e-mail.</p>
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
          <aside className="sticky top-5 rounded-xl border border-[#e8e0d8] bg-white p-5 shadow-[0_12px_40px_rgba(46,35,25,0.06)] sm:p-6 h-fit space-y-5">
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
              <div className="rounded-xl bg-gradient-to-br from-[#29211d] to-[#514034] p-4 text-white shadow-sm">
                <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.22em] text-[#e8cdb2] uppercase"><Sparkles className="h-3.5 w-3.5" /> Um mimo para suas joias</p>
                <p className="mt-2 font-serif text-lg leading-snug">Aproveite para cuidar ainda melhor das suas peças</p>
                <p className="mt-1 text-xs leading-relaxed text-white/75">Adicionais exclusivos para completar seu pedido. Você escolhe se deseja incluir.</p>
              </div>
              {BUMPS.map((b, index) => (
                <label
                  key={b.id}
                  className={`group relative block cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${bumps[b.id] ? "border-[#9a785d] ring-2 ring-[#c9ad91]/30" : "border-[#e8e0d8] hover:border-[#c9ad91]"}`}
                >
                  <div className="relative flex h-28 items-center justify-center overflow-hidden bg-[#f7f5f2] sm:h-32">
                    <img src={b.image} alt={b.imageAlt} loading="lazy" className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[8px] font-semibold tracking-[0.13em] text-[#77624f] shadow-sm">{b.eyebrow}</span>
                    {index === 1 && <span className="absolute right-3 top-3 rounded-full bg-[#29211d] px-2.5 py-1 text-[8px] font-semibold tracking-wider text-white">KIT COMPLETO</span>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[8px] font-semibold tracking-[0.14em] text-[#a18770]">{b.tag}</p>
                        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-[#29231f]">{b.title}</h3>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-[#81766d]">{b.desc}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[8px] uppercase tracking-wider text-[#9a8b7e]">Por apenas</p>
                        <p className="mt-1 text-lg font-bold tracking-tight text-[#29231f]">{formatBRL(b.price)}</p>
                      </div>
                    </div>
                    <div className={`mt-4 flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${bumps[b.id] ? "bg-[#e9e1d8] text-[#4e3c2e]" : "bg-[#29211d] text-white group-hover:bg-[#5c493a]"}`}>
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
