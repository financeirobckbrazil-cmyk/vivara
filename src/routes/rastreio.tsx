import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, PackageSearch, Sparkles } from "lucide-react";

export const Route = createFileRoute("/rastreio")({
  head: () => ({ meta: [{ title: "Rastreie seu pedido — Life Pandora" }] }),
  component: TrackingLookupPage,
});

function TrackingLookupPage() {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = trackingId.trim().replace(/^#/, "");
    if (!code) return;
    navigate({ to: "/rastreio/$trackingId", params: { trackingId: code } });
  }

  return (
    <main className="min-h-screen bg-[#fff8fb] text-[#493640]">
      <header className="border-b border-[#f1dce6] bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <Link to="/" aria-label="Life Pandora - início" className="font-sans text-3xl font-semibold tracking-[-.055em] text-[#241c20]">PANDORA</Link>
          <Link to="/compras" className="text-xs tracking-widest text-[#916f80] hover:text-[#513b46]">MINHAS COMPRAS</Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col px-4 py-12 sm:px-7 sm:py-20">
        <div className="rounded-2xl border border-[#f0d8e3] bg-gradient-to-r from-[#f9e8ef] via-white to-[#f6e2eb] p-7 sm:p-10">
          <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[.24em] text-[#b77f98]"><Sparkles size={14}/> LIFE PANDORA · ACOMPANHAMENTO</p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl">Acompanhe seu pedido</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#8a7480]">Consulte o andamento da sua compra e acompanhe cada etapa até a entrega.</p>

          <form onSubmit={submit} className="mt-8 rounded-xl border border-[#f0d8e3] bg-white p-5 shadow-sm sm:p-6">
            <label htmlFor="tracking-code" className="mb-2 block text-xs font-semibold tracking-wider text-[#775b69]">CÓDIGO DE RASTREIO</label>
            <input id="tracking-code" value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder="Cole aqui o código recebido por e-mail" autoComplete="off" className="w-full rounded-lg border border-[#ead8e1] bg-[#fffafd] px-4 py-3 text-sm outline-none transition focus:border-[#c98eaa] focus:ring-2 focus:ring-[#f5e0e9]" />
            <button type="submit" disabled={!trackingId.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#d58eaa] px-5 py-3 text-xs font-semibold tracking-[.15em] text-white transition hover:bg-[#bd7897] disabled:cursor-not-allowed disabled:opacity-50">
              RASTREAR PEDIDO <ArrowRight size={15}/>
            </button>
          </form>
        </div>

        <div className="mt-6 flex gap-4 rounded-xl border border-[#f0d8e3] bg-white p-5">
          <PackageSearch className="mt-1 shrink-0 text-[#b77f98]" size={23}/>
          <div>
            <h2 className="font-serif text-lg">Onde encontro meu código?</h2>
            <p className="mt-1 text-sm leading-6 text-[#8a7480]">Após a confirmação do pagamento, enviamos o link e o código de acompanhamento para o e-mail informado na compra. Abra o link recebido ou cole o código acima.</p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-[#a58f9a]">Ainda não recebeu o e-mail? Verifique sua caixa de spam ou entre em contato com nosso atendimento.</p>
      </section>

      <footer className="border-t border-[#f0dce5] bg-white py-8 text-center"><p className="font-serif text-lg font-semibold tracking-[.18em]">PANDORA</p><p className="mt-2 text-[9px] tracking-widest text-[#a58f9a]">DESIGN · BRILHO · PERSONALIDADE</p></footer>
    </main>
  );
}
