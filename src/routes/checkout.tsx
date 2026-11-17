import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Copy, Loader2 } from "lucide-react";
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
  { id: "anel-pave-gota", title: "Anel Life Pavê Gota em Prata 925 com Zircônia Incolor por apenas R$ 33,90", desc: "Leve também o Anel Life Pavê Gota com desconto exclusivo no checkout.", price: 33.9 },
  { id: "colar", title: "Adicionar Colar Petite Infinito em Prata 925 por apenas R$ 67,90", desc: "Leve também o Colar do Infinito com desconto exclusivo no checkout.", price: 67.9 },
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary px-6 sm:px-10 py-5 flex items-center justify-between">
        <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] text-brand font-semibold">VIVARA</span>
        <img src={logoLife} alt="Life" className="h-8 sm:h-10 w-auto" />
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-foreground text-xl sm:text-2xl tracking-[0.15em] font-medium">CHECKOUT</h1>
        <p className="text-primary text-sm mt-1 pb-4 border-b border-border">
          {count} {count === 1 ? "item" : "itens"} na sacola
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
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
          <aside className="border border-border bg-card rounded-md p-6 h-fit space-y-5">
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

            <div className="space-y-3">
              {BUMPS.map((b) => (
                <label key={b.id} className="flex gap-3 border border-dashed border-border rounded-sm p-3 cursor-pointer">
                  <input type="checkbox" checked={!!bumps[b.id]} onChange={(e) => setBumps({ ...bumps, [b.id]: e.target.checked })} className="mt-1 accent-foreground" />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{b.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{b.desc}</div>
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
