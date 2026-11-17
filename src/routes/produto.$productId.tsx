import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Heart, Lock, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Menu, Search, UserRound, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatBRL, getProduct, products } from "@/lib/products";

export const Route = createFileRoute("/produto/$productId")({
  head: () => ({ meta: [{ title: "Detalhes do produto — Life Pandora" }] }),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const { add, addWithBonus, count } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Único");
  const [activeImage, setActiveImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [selectedCharms, setSelectedCharms] = useState<Record<string, number>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fff9fb] px-6 text-center">
        <p className="font-serif text-3xl text-[#46343d]">Produto não encontrado</p>
        <p className="mt-3 text-sm text-[#8b7781]">Este item pode ter sido removido da coleção.</p>
        <Link to="/" className="mt-7 bg-[#46343d] px-6 py-3 text-xs uppercase tracking-[.16em] text-white">Voltar à loja</Link>
      </main>
    );
  }

  const isRing = /anel/i.test(product.name);
  const isBracelet = /pulseira/i.test(product.name);
  const isCharm = /^charm/i.test(product.name);
  const isNonBracelet = !isBracelet && !isCharm;
  const addonOptions = ["colar-prata-cravejado", "kit-limpeza", "flanela-polimento"].map((id) => products.find((item) => item.id === id)).filter((item): item is (typeof products)[number] => Boolean(item));
  const charmIds = ["pandora-2", "pandora-3", "pandora-4", "pandora-6"];
  const charmOptions = charmIds.map((id) => products.find((item) => item.id === id)).filter((item): item is (typeof products)[number] => Boolean(item));
  const sizes = isRing ? ["16", "18", "20", "22"] : ["Único"];
  const images = [product.image];
  const related = products.filter((item) => item.id !== product.id && !item.name.toLowerCase().startsWith("charm")).slice(0, 4);
  const category = /anel/i.test(product.name) ? "Anéis" : /colar/i.test(product.name) ? "Colares" : /pulseira/i.test(product.name) ? "Pulseiras" : "Charms";
  const imageFallback = /pulseira/i.test(product.name) ? "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200" : /anel/i.test(product.name) ? "https://pandoraeg.com/cdn/shop/files/PandoraSterlingsilverringwithclearcubiczirconia190050C01_3.jpg?v=1754942745&width=2362" : /colar/i.test(product.name) ? "https://www.marcolino.pt/content/uploads/maingallery/697976_17087744779.jpg" : "https://www.trendjuwelier.nl/media/catalog/product/cache/2/image/1000x/7/9/pandora-moments-792015-hartjes-bedel-van-zilver-graveerbaar-1.png";
  const charmFallback = "https://www.trendjuwelier.nl/media/catalog/product/cache/2/image/1000x/7/9/pandora-moments-792015-hartjes-bedel-van-zilver-graveerbaar-1.png";

  const addSelectedAddons = () => {
    Object.entries(selectedAddons).forEach(([id, selected]) => {
      if (selected) add(id, "Único");
    });
  };

  const addSelectedCharms = () => {
    Object.entries(selectedCharms).forEach(([id, qty]) => {
      if (qty > 0) addWithBonus(id, "Único", qty);
    });
  };

  const addToBag = () => {
    for (let i = 0; i < quantity; i += 1) add(product.id, selectedSize);
    if (isBracelet) addSelectedCharms();
    if (isNonBracelet) addSelectedAddons();
    toast.success(isBracelet ? "Pulseira e charms adicionados à sacola." : isNonBracelet ? "Produto e adicionais adicionados à sacola." : "Produto adicionado à sacola.");
  };

  const buyNow = () => {
    for (let i = 0; i < quantity; i += 1) add(product.id, selectedSize);
    if (isBracelet) addSelectedCharms();
    if (isNonBracelet) addSelectedAddons();
    navigate({ to: "/checkout" });
  };

  return (
    <main className="min-h-screen bg-[#fff9fb] text-[#46343d]">
      <div className="bg-[#46343d] px-4 py-2 text-center text-[9px] font-medium uppercase tracking-[.2em] text-white">Life Pandora · Descubra sua próxima peça favorita</div>
      <header className="sticky top-0 z-30 border-b border-[#f0dce5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:h-[88px] sm:px-8">
          <Link to="/" aria-label="Início" className="rounded-full p-2 text-[#30252a] hover:bg-[#fff1f5]"><Menu size={27} strokeWidth={1.5} /></Link>
          <Link to="/" aria-label="PANDORA - início" className="inline-flex items-center justify-center"><span className="relative inline-flex items-center font-sans text-[29px] font-semibold tracking-[-.055em] text-[#241c20] sm:text-[39px]">
            PAND<span className="relative inline-block">O<span className="absolute -top-[13px] left-1/2 -translate-x-1/2 sm:-top-[16px]"><svg width="19" height="13" viewBox="0 0 19 13" fill="none" aria-hidden="true"><path d="M1.5 3.2L5.4 7.1L9.5 1.3L13.6 7.1L17.5 3.2L15.7 11H3.3L1.5 3.2Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round"/><circle cx="1.5" cy="2" r="1" fill="currentColor"/><circle cx="9.5" cy="1.4" r="1" fill="currentColor"/><circle cx="17.5" cy="2" r="1" fill="currentColor"/></svg></span></span>RA
          </span></Link>
          <div className="flex items-center gap-3 text-[#30252a] sm:gap-6">
            <Link to="/" hash="colecao" aria-label="Buscar produtos" className="rounded-full p-2 hover:bg-[#fff1f5]"><Search size={26} strokeWidth={1.5} /></Link>
            <Link to="/compras" aria-label="Minha conta" className="rounded-full p-2 hover:bg-[#fff1f5]"><UserRound size={26} strokeWidth={1.5} /></Link>
            <Link to="/carrinho" aria-label="Sacola" className="rounded-full p-2 hover:bg-[#fff1f5]"><ShoppingBag size={27} strokeWidth={1.5} /></Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 md:pt-10">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.12em] text-[#a88b98]">
          <Link to="/" className="hover:text-[#46343d]">Início</Link><span>/</span><Link to="/" hash="colecao" className="hover:text-[#46343d]">Coleção</Link><span>/</span><span className="text-[#46343d]">{category}</span>
        </nav>

        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,.88fr)] lg:gap-16">
          <section className="grid gap-3 sm:grid-cols-[76px_minmax(0,1fr)]">
            <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
              {images.map((image, index) => (
                <button key={image + index} onClick={() => setActiveImage(index)} aria-label={`Ver imagem ${index + 1}`} className={`h-[68px] w-[68px] overflow-hidden border bg-white p-1 transition ${activeImage === index ? "border-[#b77f98]" : "border-[#f0dce5]"}`}>
                  <img src={image} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = imageFallback; }} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
            <div className="order-1 flex aspect-[4/5] max-h-[720px] items-center justify-center overflow-hidden bg-[#fff1f5] sm:order-2">
              <img src={images[activeImage]} alt={product.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = imageFallback; }} className="h-full w-full object-contain p-3 sm:p-7" />
            </div>
          </section>

          <section className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] uppercase tracking-[.24em] text-[#b58b9d]">{category} · Coleção selecionada</p>
            <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              {product.oldPrice && <span className="text-sm text-[#a88b98] line-through">{formatBRL(product.oldPrice)}</span>}
              <span className="text-2xl font-semibold tracking-tight">{formatBRL(product.price)}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#8b8178]">Preço anunciado</span>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#806a75]">{product.name} com design delicado e acabamento pensado para compor combinações especiais. Uma peça para expressar seu estilo no dia a dia ou em ocasiões marcantes.</p>

            {isRing && <div className="mt-7">
              <div className="mb-3 flex items-center justify-between"><label className="text-[10px] font-semibold uppercase tracking-[.17em]">Selecione o aro</label><span className="text-[10px] text-[#a88b98]">Guia de medidas</span></div>
              <div className="flex flex-wrap gap-2">{sizes.map((size) => <button key={size} onClick={() => setSelectedSize(size)} className={`h-11 min-w-11 border px-3 text-xs transition ${selectedSize === size ? "border-[#46343d] bg-[#46343d] text-white" : "border-[#e8cbd8] bg-white hover:border-[#46343d]"}`}>{size}</button>)}</div>
            </div>}

            <div className="mt-7">
              <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[.17em]">Quantidade</label>
              <div className="inline-flex h-12 items-center border border-[#e8cbd8] bg-white">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" className="h-full px-4 hover:bg-[#f9edf2]"><Minus size={14} /></button>
                <span className="min-w-10 text-center text-sm tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} aria-label="Aumentar quantidade" className="h-full px-4 hover:bg-[#f9edf2]"><Plus size={14} /></button>
              </div>
            </div>

            {isNonBracelet && <section className="mt-6 rounded-xl border border-[#ead5df] bg-white p-3 sm:p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a45f82]">Complete seu pedido</p>
                  <h2 className="mt-1 font-serif text-lg text-[#46343d]">Adicionais especiais</h2>
                  <p className="mt-1 text-[10px] text-[#806a75]">Selecione os itens que deseja incluir. Opcional.</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#fff1f6] px-2.5 py-1 text-[9px] font-semibold text-[#a45f82]">3 ofertas</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {addonOptions.map((addon) => {
                  const selected = !!selectedAddons[addon.id];
                  return <label key={addon.id} className={`overflow-hidden rounded-lg border cursor-pointer transition ${selected ? "border-[#b77f98] ring-1 ring-[#d7a9bd]" : "border-[#f0dce5]"}`}>
                    <div className="aspect-square bg-[#fff3f7] p-1.5">
                      <img src={addon.image} alt={addon.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://www.marcolino.pt/content/uploads/maingallery/697976_17087744779.jpg"; }} className="h-full w-full object-contain" />
                    </div>
                    <div className="p-2">
                      <p className="min-h-8 text-[9px] leading-4 text-[#46343d]">{addon.name}</p>
                      <p className="mt-1 text-[10px] font-semibold text-[#46343d]">{formatBRL(addon.price)}</p>
                      <span className={`mt-2 flex items-center justify-center rounded-md px-1 py-2 text-[8px] font-semibold uppercase tracking-wide ${selected ? "bg-[#f8e8ef] text-[#694b5b]" : "bg-[#513b46] text-white"}`}>{selected ? "Selecionado" : "Adicionar"}</span>
                    </div>
                    <input type="checkbox" className="sr-only" checked={selected} onChange={(e) => setSelectedAddons((state) => ({ ...state, [addon.id]: e.target.checked }))} />
                  </label>;
                })}
              </div>
            </section>}

            {isBracelet && <section className="mt-6 rounded-xl border border-[#ead5df] bg-white p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#a45f82]">Oferta especial</p>
                  <h2 className="mt-1 font-serif text-lg text-[#46343d]">Escolha seus charms</h2>
                  <p className="mt-1 text-[10px] text-[#806a75]">Compre 1 e ganhe outro igual grátis.</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#fff1f6] px-2.5 py-1 text-[9px] font-semibold text-[#a45f82]">4 opções</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {charmOptions.map((charm) => {
                  const qty = selectedCharms[charm.id] ?? 0;
                  return <div key={charm.id} className={`overflow-hidden rounded-lg border ${qty > 0 ? "border-[#b77f98] ring-1 ring-[#d7a9bd]" : "border-[#f0dce5]"}`}>
                    <div className="aspect-square bg-[#fff3f7] p-1.5">
                      <img src={charm.image} alt={charm.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = charmFallback; }} className="h-full w-full object-contain" />
                    </div>
                    <div className="p-2">
                      <p className="min-h-8 text-[10px] leading-4 text-[#46343d]">{charm.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[#46343d]">{formatBRL(charm.price)}</p>
                      <p className="mt-0.5 text-[8px] font-semibold text-[#a45f82]">+ 1 grátis</p>
                      <div className="mt-2 flex items-center justify-between">
                        <button type="button" aria-label={`Diminuir ${charm.name}`} onClick={() => setSelectedCharms((s) => ({ ...s, [charm.id]: Math.max(0, qty - 1) }))} className="h-7 w-7 rounded-full border border-[#e8cbd8] text-sm text-[#694b5b]">−</button>
                        <span className="text-[10px] font-semibold tabular-nums">{qty}</span>
                        <button type="button" aria-label={`Adicionar ${charm.name}`} onClick={() => setSelectedCharms((s) => ({ ...s, [charm.id]: Math.min(10, qty + 1) }))} className="h-7 w-7 rounded-full border border-[#e8cbd8] text-sm text-[#694b5b]">+</button>
                      </div>
                    </div>
                  </div>;
                })}
              </div>
            </section>}

            <div className="mt-7 grid gap-3">
              <button onClick={buyNow} className="flex h-14 items-center justify-center gap-3 bg-[#46343d] px-6 text-[10px] font-semibold uppercase tracking-[.2em] text-white transition hover:bg-[#51483f]">Comprar agora <ArrowRight size={15} /></button>
              <button onClick={addToBag} className="flex h-14 items-center justify-center gap-3 border border-[#46343d] bg-transparent px-6 text-[10px] font-semibold uppercase tracking-[.2em] transition hover:bg-[#f9e8ef]"><ShoppingBag size={15} /> Adicionar à sacola</button>
            </div>
            <button onClick={() => setFavorite((v) => !v)} className="mt-4 inline-flex items-center gap-2 py-2 text-xs text-[#806a75] hover:text-[#a56b76]"><Heart size={15} fill={favorite ? "currentColor" : "none"} /> {favorite ? "Adicionado aos favoritos" : "Adicionar aos favoritos"}</button>

            <div className="mt-8 divide-y divide-[#f0dce5] border-y border-[#f0dce5]">
              <div className="flex items-center gap-4 py-4"><Truck size={18} className="text-[#b58b9d]" /><div><p className="text-xs font-semibold">Entrega para todo o Brasil</p><p className="mt-1 text-[10px] text-[#a88b98]">Consulte as opções e prazos no checkout.</p></div></div>
              <div className="flex items-center gap-4 py-4"><ShieldCheck size={18} className="text-[#b58b9d]" /><div><p className="text-xs font-semibold">Compra protegida</p><p className="mt-1 text-[10px] text-[#a88b98]">Seus dados são tratados durante a finalização do pedido.</p></div></div>
              <div className="flex items-center gap-4 py-4"><Lock size={18} className="text-[#b58b9d]" /><div><p className="text-xs font-semibold">Pagamento seguro</p><p className="mt-1 text-[10px] text-[#a88b98]">Confira o total e as opções disponíveis antes de pagar.</p></div></div>
            </div>
          </section>
        </div>

        <section className="mt-20 border-t border-[#f0dce5] pt-12">
          <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.23em] text-[#b58b9d]">Complete sua combinação</p><h2 className="mt-2 font-serif text-3xl">Você também pode gostar</h2></div><Link to="/#colecao" className="hidden items-center gap-2 text-[10px] uppercase tracking-wider underline underline-offset-4 sm:flex">Ver coleção <ArrowRight size={13} /></Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {related.map((item) => <Link key={item.id} to="/produto/$productId" params={{ productId: item.id }} className="group border border-[#f0dce5] bg-white transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/5] overflow-hidden bg-[#fff1f5]"><img src={item.image} alt={item.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = /pulseira/i.test(item.name) ? imageFallback : /anel/i.test(item.name) ? "https://pandoraeg.com/cdn/shop/files/PandoraSterlingsilverringwithclearcubiczirconia190050C01_3.jpg?v=1754942745&width=2362" : /colar/i.test(item.name) ? "https://www.marcolino.pt/content/uploads/maingallery/697976_17087744779.jpg" : charmFallback; }} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" /></div>
              <div className="p-3 sm:p-4"><p className="font-serif text-sm leading-snug">{item.name}</p><p className="mt-3 text-sm font-semibold">{formatBRL(item.price)}</p><span className="mt-3 inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#82766b]">Ver produto <ArrowRight size={11} /></span></div>
            </Link>)}
          </div>
        </section>
      </div>

      <footer className="border-t border-[#f0dce5] bg-white px-6 py-8 text-center"><Link to="/" className="font-serif text-xl font-semibold tracking-[.16em]">LIFE PANDORA</Link><p className="mt-3 text-[9px] tracking-wider text-[#99918a]">DESIGN · BRILHO · PERSONALIDADE</p><p className="mt-4 text-[10px] text-[#aaa39c]">Loja independente. Não afiliada nem autorizada pela Pandora.</p></footer>
    </main>
  );
}
