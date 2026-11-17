import { useMemo, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { Heart, Menu, ShoppingBag, Sparkles, ArrowRight, Search, UserRound } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life Pandora | Coleção com finalização em platina" },
      { name: "description", content: "Conheça a coleção de pulseiras, anéis e colares." },
    ],
  }),
  component: HomePage,
});

type Product = { id: number; name: string; description: string; category: string; kind: string; price: string; image: string; link: string };
const products: Product[] = [
  {
    "id": 1,
    "name": "Pulseira de Malha Brilhante",
    "description": "Pulseira com pedras transparentes e fecho de coração.",
    "category": "Pulseiras",
    "price": "R$ 35,78",
    "kind": "bracelet",
    "image": "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200",
    "link": "https://br.pandora.net/pt/lancamentos-red/pulseira-de-malha-brilhante-com-fecho-de-corac%C3%A3o-/534971C01.html"
  },
  {
    "id": 5,
    "name": "Anel Flor de Cerejeira da Mulan",
    "description": "Peça especial da colaboração Disney x Pandora.",
    "category": "Anéis",
    "price": "R$ 35,78",
    "kind": "flower",
    "image": "https://pandora.lucerneluxe.com/cdn/shop/files/HIGH_RGB_193801C01_RGB_1024x1024%402x.jpg?v=1749657602",
    "link": "https://us.pandora.net/en/rings/statement-rings/disney-mulan-cherry-blossom-ring/135027C01.html"
  },
  {
    "id": 9,
    "name": "Anel Tiara de Estrelas",
    "description": "Anel delicado com inspiração celestial.",
    "category": "Anéis",
    "price": "R$ 35,78",
    "kind": "ring",
    "image": "https://pandoraeg.com/cdn/shop/files/PandoraSterlingsilverringwithclearcubiczirconia190050C01_3.jpg?v=1754942745&width=2362",
    "link": "https://us.pandora.net/en/rings/statement-rings/tiara-stars-ring/134946C01.html"
  },
  {
    "id": 10,
    "name": "Colar de Corrente Snake",
    "description": "Colar de malha com acabamento em platina.",
    "category": "Colares",
    "price": "R$ 35,78",
    "kind": "necklace",
    "image": "https://pandora-eshop.jo/cdn/shop/files/WEB_393099C01_RGB.png?v=1754776761&width=2048",
    "link": "https://us.pandora.net/en/necklaces/chain-necklaces/pandora-moments-snake-chain-necklace--platinum-plated/314563C00.html"
  },
  {
    "id": 14,
    "name": "Colar de Malha Brilhante",
    "description": "Colar com fecho de coração e malha brilhante.",
    "category": "Colares",
    "price": "R$ 35,78",
    "kind": "necklace",
    "image": "https://laatukoru.fi/cdn/shop/files/Pandora_Timeless_Elevated_Heart_kaulakoru_hopea_398425C0_45.jpg?v=1747904947",
    "link": "https://us.pandora.net/en/necklaces/chain-necklaces/heart-clasp-sparkling-mesh-necklace/335080C01.html"
  },
  {
    "id": 20,
    "name": "Pulseira Life Coração em Prata 925",
    "description": "Pulseira delicada com acabamento prateado para criar combinações especiais.",
    "category": "Pulseiras",
    "price": "R$ 35,78",
    "kind": "bracelet",
    "image": "https://image.rakuten.co.jp/onemore/cabinet/002/pd-590728-d.jpg",
    "link": "#"
  },
  {
    "id": 21,
    "name": "Pulseira Life Love em Prata 925",
    "description": "Design elegante para usar sozinha ou combinar com seus charms favoritos.",
    "category": "Pulseiras",
    "price": "R$ 35,78",
    "kind": "bracelet",
    "image": "https://www.giftandwrap.co.uk/cdn/shop/files/1603205960-49831400.jpg?v=1760453284&width=3840",
    "link": "#"
  },
  {
    "id": 22,
    "name": "Pulseira Life com Fecho Coração",
    "description": "Uma peça clássica para personalizar com seus charms preferidos.",
    "category": "Pulseiras",
    "price": "R$ 35,78",
    "kind": "bracelet",
    "image": "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200",
    "link": "#"
  },
  {
    "id": 23,
    "name": "Pulseira Life em Prata 925",
    "description": "Pulseira versátil com brilho delicado para todas as ocasiões.",
    "category": "Pulseiras",
    "price": "R$ 35,78",
    "kind": "bracelet",
    "image": "https://image.rakuten.co.jp/onemore/cabinet/002/pd-590728-d.jpg",
    "link": "#"
  }
];

const imageFallback = (name: string) => /pulseira|bracelete/i.test(name) ? "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200" : /anel/i.test(name) ? "https://pandoraeg.com/cdn/shop/files/PandoraSterlingsilverringwithclearcubiczirconia190050C01_3.jpg?v=1754942745&width=2362" : /colar/i.test(name) ? "https://www.marcolino.pt/content/uploads/maingallery/697976_17087744779.jpg" : "https://www.trendjuwelier.nl/media/catalog/product/cache/2/image/1000x/7/9/pandora-moments-792015-hartjes-bedel-van-zilver-graveerbaar-1.png";

function HomePage() {
  const { add } = useCart();
  const navigate = useNavigate();
  const [category, setCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = ["Todos", "Pulseiras", "Anéis", "Colares"];
  const visibleProducts = useMemo(() => category === "Todos" ? products : products.filter((p) => p.category === category), [category]);
  return (
    <main className="min-h-screen bg-[#fff9fb] text-[#46343d]">
      <div className="bg-[#df91ad] px-4 py-2 text-center text-[10px] tracking-[.22em] text-white">ELEGÂNCIA EM CADA DETALHE · NOVA COLEÇÃO COM FINALIZAÇÃO EM PLATINA</div>
      <header className="sticky top-0 z-40 border-b border-[#f0dce5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:h-[88px] sm:px-8">
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2.5 text-[#30252a] transition hover:bg-[#fff1f5]"><Menu size={27} strokeWidth={1.5} /></button>
          <a href="#" aria-label="PANDORA - início" className="inline-flex items-center justify-center"><span className="relative inline-flex items-center font-sans text-[29px] font-semibold tracking-[-.055em] text-[#241c20] sm:text-[39px]">
            PAND<span className="relative inline-block">O<span className="absolute -top-[13px] left-1/2 -translate-x-1/2 sm:-top-[16px]"><svg width="19" height="13" viewBox="0 0 19 13" fill="none" aria-hidden="true"><path d="M1.5 3.2L5.4 7.1L9.5 1.3L13.6 7.1L17.5 3.2L15.7 11H3.3L1.5 3.2Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round"/><circle cx="1.5" cy="2" r="1" fill="currentColor"/><circle cx="9.5" cy="1.4" r="1" fill="currentColor"/><circle cx="17.5" cy="2" r="1" fill="currentColor"/></svg></span></span>RA
          </span></a>
          <div className="flex items-center gap-3 text-[#30252a] sm:gap-6">
            <a href="#colecao" aria-label="Buscar produtos" className="rounded-full p-2 transition hover:bg-[#fff1f5]"><Search size={26} strokeWidth={1.5} /></a>
            <a href="/compras" aria-label="Minha conta" className="rounded-full p-2 transition hover:bg-[#fff1f5]"><UserRound size={26} strokeWidth={1.5} /></a>
            <a href="/carrinho" aria-label="Sacola de compras" className="rounded-full p-2 transition hover:bg-[#fff1f5]"><ShoppingBag size={27} strokeWidth={1.5} /></a>
          </div>
        </div>
        {menuOpen && <div className="border-t border-[#f0dce5] bg-[#fff9fb] px-6 py-5 text-center text-sm text-[#46343d]"><a href="#colecao" onClick={() => setMenuOpen(false)}>A coleção</a><span className="mx-5 text-[#d7a9bd]">·</span><a href="#diferencial" onClick={() => setMenuOpen(false)}>O diferencial</a><span className="mx-5 text-[#d7a9bd]">·</span><a href="/contato">Contato</a></div>}
      </header>

      <section className="relative overflow-hidden bg-[#f9e8ef]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-[1.05fr_.95fr] md:gap-16 md:py-24">
          <div className="relative z-10">
            <p className="mb-5 text-[10px] uppercase tracking-[.3em] text-[#987b89]">Uma nova forma de brilhar</p>
            <h1 className="max-w-xl font-serif text-4xl leading-[1.12] md:text-6xl">Conheça a nova coleção Pandora – <i>Finalização em Platina</i></h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#66615b] md:text-base">A Pandora apresenta uma nova geração de joias com acabamento em platina, combinando sofisticação, brilho e inovação.</p>
            <a href="#colecao" className="mt-8 inline-flex items-center gap-4 bg-[#d98eaa] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white transition hover:bg-[#c87898]">Descubra a coleção <ArrowRight size={15} /></a>
          </div>
          <div className="relative mx-auto flex h-[340px] w-full max-w-[500px] items-center justify-center md:h-[500px]">
            <div className="absolute h-[270px] w-[270px] rounded-full border border-white/80 md:h-[370px] md:w-[370px]" />
            <div className="absolute h-[220px] w-[220px] rounded-full bg-white/50 blur-2xl md:h-[300px] md:w-[300px]" />
            <div className="relative z-10 h-[320px] w-[320px] drop-shadow-xl md:h-[460px] md:w-[460px]"><img src={products[0].image} alt={products[0].name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = imageFallback(products[0].name); }} className="h-full w-full object-contain" /></div>
            <span className="absolute bottom-5 right-4 font-serif text-sm italic text-[#987b89]">Brilho que conta histórias</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20" id="colecao">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#b58b9d]">Encontre sua peça</p><h2 className="mt-2 font-serif text-3xl md:text-4xl">A coleção</h2><p className="mt-2 text-sm text-[#8b7781]">9 opções para expressar sua personalidade.</p></div>
          <p className="text-xs tracking-wide text-[#6f6962]">9 peças selecionadas</p>
        </div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap border px-4 py-2 text-[10px] uppercase tracking-[.12em] transition ${category === item ? "border-[#46343d] bg-[#46343d] text-white" : "border-[#ddd7cf] text-[#806a75] hover:border-[#46343d]"}`}>{item}</button>)}</div>
        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-[#e8cbd8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#a45f82]">Presente especial</p><p className="mt-1 font-serif text-lg text-[#46343d]">Na compra de uma pulseira, compre 1 charm e ganhe outro igual grátis.</p></div>
          <span className="text-xs text-[#806a75]">Escolha seus charms na página da pulseira.</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => <article key={product.id} className="group overflow-hidden border border-[#f0dce5] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,38,30,0.09)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#fff3f7]">
              <img src={product.image} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = imageFallback(product.name); }} className="h-full w-full object-contain p-0 transition-transform duration-700 ease-out group-hover:scale-[1.08]" />
              <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-1.5 text-[9px] uppercase tracking-[.16em] text-[#8b7781]">Finalização em platina</span>
              <button aria-label={`Favoritar ${product.name}`} className="absolute right-3 top-3 rounded-full bg-white/90 p-2.5 text-[#8b7781] shadow-sm transition hover:text-[#a56b76]"><Heart size={15} /></button>
            </div>
            <div className="flex min-h-[190px] flex-col p-4 md:p-5">
              <p className="text-[9px] uppercase tracking-[.18em] text-[#b58b9d]">{product.category}</p>
              <button type="button" onClick={() => navigate({ to: "/produto/$productId", params: { productId: `pandora-${product.id}` } })} className="mt-2 min-h-[44px] text-left font-serif text-base leading-5 hover:underline md:text-[17px]">{product.name}</button>
              <p className="mt-2 flex-1 text-[11px] leading-5 text-[#8b7781]">{product.description}</p>
              <div className="mt-5 flex flex-col gap-3 border-t border-[#f9e8ef] pt-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[.16em] text-[#b58b9d]">Preço anunciado</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-[#46343d]">{product.price}</p>
                </div>
                <button type="button" onClick={() => navigate({ to: "/produto/$productId", params: { productId: `pandora-${product.id}` } })} className="inline-flex w-full items-center justify-center gap-2 bg-[#46343d] px-4 py-3 text-[10px] font-medium uppercase tracking-[.16em] text-white transition hover:bg-[#62584e]">Ver detalhes <ArrowRight size={13} /></button>
              </div>
            </div>
          </article>)}
        </div>
        {visibleProducts.length === 0 && <p className="py-12 text-center text-sm text-[#8b7781]">Nenhuma peça encontrada nesta categoria.</p>}
      </section>

      <section id="diferencial" className="bg-[#f9e8ef] px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="mx-auto h-[280px] w-[280px] md:h-[380px] md:w-[380px]"><img src={products.find((p) => p.category === "Colares")!.image} alt={products.find((p) => p.category === "Colares")!.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = imageFallback("Colar"); }} className="h-full w-full object-contain mix-blend-multiply" /></div>
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#b58b9d]">Inovação e cuidado</p><h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">O diferencial da coleção</h2><p className="mt-6 text-sm leading-7 text-[#806a75]">As peças são apresentadas com uma liga metálica exclusiva da Pandora e revestimento em platina, desenvolvidos para oferecer brilho duradouro, resistência à oxidação e propriedades hipoalergênicas.</p><p className="mt-4 text-sm leading-7 text-[#806a75]">Uma coleção que une design contemporâneo, delicadeza e personalidade, trazendo novas possibilidades para quem ama joias e acessórios sofisticados.</p><a href="#colecao" className="mt-8 inline-flex items-center gap-3 border-b border-[#46343d] pb-2 text-[10px] uppercase tracking-[.2em]">Explore as peças <ArrowRight size={14} /></a></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 text-center md:py-20"><Sparkles className="mx-auto text-[#a99b8d]" size={22} /><h2 className="mt-4 font-serif text-3xl md:text-4xl">Seu brilho, sua história</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#8b7781]">Descubra detalhes que transformam momentos em lembranças. Escolha suas peças favoritas e crie combinações únicas.</p><a href="#colecao" className="mt-7 inline-flex items-center gap-3 bg-[#46343d] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-[#765968]">Ver coleção completa <ArrowRight size={15} /></a></section>
      <footer className="border-t border-[#f0dce5] bg-white px-6 py-8 text-center"><a href="#" className="font-serif text-2xl font-semibold tracking-[.18em]">LIFE PANDORA</a><p className="mt-3 text-[10px] tracking-wider text-[#99918a]">DESIGN · BRILHO · PERSONALIDADE</p><p className="mt-5 text-[10px] text-[#aaa39c]">Imagens ilustrativas geradas para esta vitrine. Loja independente, sem vínculo oficial com a Pandora.</p></footer>
    </main>
  );
}
