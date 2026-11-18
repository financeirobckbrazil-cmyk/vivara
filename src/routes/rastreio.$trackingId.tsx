import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Clock3, MapPin, Package, Truck, Sparkles, AlertCircle } from "lucide-react";
import { getTrackingOrder } from "@/lib/tracking.functions";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/rastreio/$trackingId")({
  head: () => ({ meta: [{ title: "Rastreie seu pedido — Life Pandora" }] }),
  component: TrackingPage,
});

type TrackingData = Awaited<ReturnType<typeof getTrackingOrder>>;

function TrackingPage() {
  const { trackingId } = Route.useParams();
  const getOrder = useServerFn(getTrackingOrder);
  const [order, setOrder] = useState<TrackingData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getOrder({ data: { trackingId } })
      .then((data) => { if (active) setOrder(data); })
      .catch(() => { if (active) setError("Não encontramos esse pedido. Confira o link enviado no e-mail."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [getOrder, trackingId]);

  return (
    <main className="min-h-screen bg-[#fff8fb] text-[#493640]">
      <header className="border-b border-[#f1dce6] bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <Link to="/" aria-label="Life Pandora - início" className="relative font-sans text-3xl font-semibold tracking-[-.055em] text-[#241c20]">
            PAND<span className="relative inline-block">O<span className="absolute -top-3 left-1/2 -translate-x-1/2"><svg width="19" height="13" viewBox="0 0 19 13" fill="none" aria-hidden="true"><path d="M1.5 3.2L5.4 7.1L9.5 1.3L13.6 7.1L17.5 3.2L15.7 11H3.3L1.5 3.2Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round"/></svg></span></span>RA
          </Link>
          <Link to="/compras" className="text-xs tracking-widest text-[#916f80] hover:text-[#513b46]">MINHAS COMPRAS</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-7 sm:py-14">
        <div className="mb-8 rounded-2xl border border-[#f0d8e3] bg-gradient-to-r from-[#f9e8ef] via-white to-[#f6e2eb] p-6 sm:p-9">
          <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[.24em] text-[#b77f98]"><Sparkles size={14}/> LIFE PANDORA · ACOMPANHAMENTO</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Acompanhe seu pedido</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8a7480]">Cada detalhe da sua compra, do nosso cuidado até a chegada à sua casa.</p>
        </div>

        {loading && <div className="rounded-xl border border-[#f0d8e3] bg-white p-10 text-center text-sm text-[#987d8b]">Carregando informações do seu pedido...</div>}
        {!loading && error && <div className="rounded-xl border border-[#f0d8e3] bg-white p-8 text-center"><AlertCircle className="mx-auto mb-3 text-[#bd7897]" size={30}/><p>{error}</p><Link to="/" className="mt-5 inline-block text-sm underline">Voltar à loja</Link></div>}

        {order && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoCard label="PEDIDO" value={order.id.slice(0, 8).toUpperCase()} icon={<Package size={18}/>} />
              <InfoCard label="PAGAMENTO" value="Confirmado via PIX" icon={<Check size={18}/>} />
              <InfoCard label="DESTINO" value={[order.address.city, order.address.state].filter(Boolean).join(" / ") || "Endereço informado"} icon={<MapPin size={18}/>} />
            </div>

            <section className="mt-6 rounded-2xl border border-[#f0d8e3] bg-white p-5 shadow-[0_12px_36px_rgba(85,55,70,.05)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f3e4ea] pb-5">
                <div><p className="text-[10px] font-semibold tracking-[.2em] text-[#b77f98]">STATUS DO PEDIDO</p><h2 className="mt-1 font-serif text-2xl">{order.stages[order.currentStage]?.label}</h2></div>
                <span className="rounded-full bg-[#f9e8ef] px-3 py-1.5 text-[10px] font-semibold text-[#a45f82]">ETAPA {order.currentStage + 1} DE 8</span>
              </div>
              <div className="mt-7">
                {order.stages.map((stage, index) => (
                  <div key={stage.label} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < order.stages.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-14px)] w-px ${stage.completed ? "bg-[#d7a2b8]" : "bg-[#eee2e8]"}`}/>}
                    <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${stage.completed ? "border-[#bd83a0] bg-[#f8e6ee] text-[#9d5e7d]" : "border-[#eadde3] bg-white text-[#c9b9c1]"}`}>
                      {stage.completed ? <Check size={15}/> : <span className="text-xs">{index + 1}</span>}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm ${stage.current ? "font-bold text-[#513b46]" : stage.completed ? "font-medium text-[#6d5962]" : "text-[#b9aab1]"}`}>{stage.label}</h3>
                        {stage.current && <span className="rounded-full bg-[#f8e8ef] px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#a45f82]">ATUAL</span>}
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#a58f9a]"><Clock3 size={11}/> {index === 0 ? "1º dia" : `${index + 1}º dia`} · {new Date(stage.expectedAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-7 rounded-xl bg-[#fff6f9] p-4 text-xs leading-5 text-[#967e89]">As etapas são uma previsão automática de processamento em oito dias corridos a partir da confirmação do pagamento. A página não recebe eventos em tempo real da transportadora; prazos podem variar conforme a operação logística.</p>
            </section>

            <section className="mt-6 rounded-2xl border border-[#f0d8e3] bg-white p-5 sm:p-7">
              <h2 className="font-serif text-xl">Resumo da compra</h2>
              <div className="mt-4 divide-y divide-[#f3e4ea]">
                {order.items.map((item, index) => <div key={index} className="flex justify-between gap-4 py-3 text-sm"><span>{item.name} <span className="text-[#a58f9a]">× {item.quantity}{item.size ? ` · ${item.size}` : ""}</span></span></div>)}
              </div>
              <div className="mt-3 flex justify-between border-t border-[#f3e4ea] pt-4 text-sm"><span className="text-[#947d88]">Total pago</span><strong>{formatBRL(order.total)}</strong></div>
              <p className="mt-2 text-xs text-[#a58f9a]">Envio: {order.shippingMethod}</p>
            </section>
          </>
        )}
      </section>
      <footer className="border-t border-[#f0dce5] bg-white py-8 text-center"><p className="font-serif text-lg font-semibold tracking-[.18em]">PANDORA</p><p className="mt-2 text-[9px] tracking-widest text-[#a58f9a]">DESIGN · BRILHO · PERSONALIDADE</p></footer>
    </main>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-xl border border-[#f0d8e3] bg-white p-4"><div className="flex items-center gap-2 text-[#b77f98]">{icon}<span className="text-[9px] font-semibold tracking-[.18em]">{label}</span></div><p className="mt-2 text-sm font-semibold text-[#513b46]">{value}</p></div>;
}
