import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Menu, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life Pandora | Coleção com finalização em platina" },
      { name: "description", content: "Conheça 19 joias da nova coleção Pandora com acabamento em platina: pulseiras, charms, anéis e colares." },
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
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw1411f3dc/productimages/main_rect_center/534971C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://br.pandora.net/pt/lancamentos-red/pulseira-de-malha-brilhante-com-fecho-de-corac%C3%A3o-/534971C01.html"
  },
  {
    "id": 2,
    "name": "Charm Dachshund de Natal",
    "description": "Charm de cachorro com detalhes festivos e opala sintética.",
    "category": "Charms natalinos",
    "price": "R$ 35,78",
    "kind": "dog",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwbf6e8cc0/productimages/main_rect_center/734970C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/dangle-charms/christmas-dachshund-dangle-charm/734970C01.html"
  },
  {
    "id": 3,
    "name": "Charm Yeti Nevado",
    "description": "Personagem Yeti em acabamento de platina.",
    "category": "Charms temáticos",
    "price": "R$ 35,78",
    "kind": "snow",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwa681c507/productimages/main_rect_center/735058C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/charms/snowy-yeti-charm/735058C01.html"
  },
  {
    "id": 4,
    "name": "Charm Azevinho de Natal",
    "description": "Charm com folhas de azevinho para celebrar a temporada.",
    "category": "Charms natalinos",
    "price": "R$ 35,78",
    "kind": "holly",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwa4f2cdf4/productimages/main_rect_center/734974C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/charms/christmas-holly-charm/734974C01.html"
  },
  {
    "id": 5,
    "name": "Anel Flor de Cerejeira da Mulan",
    "description": "Peça especial da colaboração Disney x Pandora.",
    "category": "Anéis",
    "price": "R$ 35,78",
    "kind": "flower",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw432fdfde/productimages/main_rect_center/135027C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/rings/statement-rings/disney-mulan-cherry-blossom-ring/135027C01.html"
  },
  {
    "id": 6,
    "name": "Charm Hortelã-Pimenta Vermelha",
    "description": "Charm de vidro Murano com inspiração natalina.",
    "category": "Charms natalinos",
    "price": "R$ 35,78",
    "kind": "candy",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw8584ae06/productimages/main_rect_center/735071C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/charms/red-peppermint-murano-glass-charm/735071C01.html"
  },
  {
    "id": 7,
    "name": "Charm Holiday Joy Vazado",
    "description": "Charm vazado com detalhes inspirados nas festas.",
    "category": "Charms natalinos",
    "price": "R$ 35,78",
    "kind": "gift",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwfb7094cf/productimages/main_rect_center/735064C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/charms/holiday-joy-openwork-charm/735064C01.html"
  },
  {
    "id": 8,
    "name": "Charm Hortelã-Pimenta Verde",
    "description": "Charm de vidro Murano em versão verde festiva.",
    "category": "Charms natalinos",
    "price": "R$ 35,78",
    "kind": "candy",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw2bc69654/productimages/main_rect_center/735071C02_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/charms/green-peppermint-murano-glass-charm/735071C02.html"
  },
  {
    "id": 9,
    "name": "Anel Tiara de Estrelas",
    "description": "Anel delicado com inspiração celestial.",
    "category": "Anéis",
    "price": "R$ 35,78",
    "kind": "ring",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw70fce4ad/productimages/main_rect_center/134946C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/rings/statement-rings/tiara-stars-ring/134946C01.html"
  },
  {
    "id": 10,
    "name": "Colar de Corrente Snake",
    "description": "Colar de malha com acabamento em platina.",
    "category": "Colares",
    "price": "R$ 35,78",
    "kind": "necklace",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw27bcad76/productimages/main_rect_center/314563C00_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/necklaces/chain-necklaces/pandora-moments-snake-chain-necklace--platinum-plated/314563C00.html"
  },
  {
    "id": 11,
    "name": "Charm Pendente Mistletoe",
    "description": "Pingente de azevinho com visual delicado.",
    "category": "Charms natalinos",
    "price": "R$ 35,78",
    "kind": "holly",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw71385fce/productimages/main_rect_center/735066C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/dangle-charms/mistletoe-dangle-charm/735066C01.html"
  },
  {
    "id": 12,
    "name": "Charm Estrela Vazado",
    "description": "Charm com desenho de estrela e acabamento luminoso.",
    "category": "Charms temáticos",
    "price": "R$ 35,78",
    "kind": "star",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw15224b6b/productimages/main_rect_center/735034C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/charms/star-openwork-charm/735034C01.html"
  },
  {
    "id": 13,
    "name": "Charm Coração Roxo Gravável",
    "description": "Coração com esmaltação brilhante e verso personalizável.",
    "category": "Charms de coração",
    "price": "R$ 35,78",
    "kind": "heart",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw251a2801/productimages/main_rect_center/735088C02_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/dangle-charms/engravable-purple-heart-dangle-charm/735088C02.html"
  },
  {
    "id": 14,
    "name": "Colar de Malha Brilhante",
    "description": "Colar com fecho de coração e malha brilhante.",
    "category": "Colares",
    "price": "R$ 35,78",
    "kind": "necklace",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwb8d3b849/productimages/main_rect_center/335080C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/necklaces/chain-necklaces/heart-clasp-sparkling-mesh-necklace/335080C01.html"
  },
  {
    "id": 15,
    "name": "Charm Coração Vermelho Gravável",
    "description": "Coração vermelho cintilante com verso personalizável.",
    "category": "Charms de coração",
    "price": "R$ 35,78",
    "kind": "heart",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwef9caea9/productimages/main_rect_center/735088C03_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/dangle-charms/engravable-red-heart-dangle-charm/735088C03.html"
  },
  {
    "id": 16,
    "name": "Charm Coração Azul Gravável",
    "description": "Coração azul com brilho delicado e verso personalizável.",
    "category": "Charms de coração",
    "price": "R$ 35,78",
    "kind": "heart",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw2da70ff6/productimages/main_rect_center/735088C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/dangle-charms/engravable-blue-heart-dangle-charm/735088C01.html"
  },
  {
    "id": 17,
    "name": "Charm Planeta Azul Celestial",
    "description": "Charm inspirado no universo com esmaltação azul.",
    "category": "Charms temáticos",
    "price": "R$ 35,78",
    "kind": "planet",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwe6c4ef62/productimages/main_rect_center/735038C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/charms/celestial-blue-planet-charm/735038C01.html"
  },
  {
    "id": 18,
    "name": "Charm Coração Azul Abaulado",
    "description": "Coração azul com acabamento escovado e esmaltação.",
    "category": "Charms de coração",
    "price": "R$ 35,78",
    "kind": "heart",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw8ecf4240/productimages/main_rect_center/735075C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://us.pandora.net/en/charms/dangle-charms/blue-puffy-heart-dangle-charm/735075C01.html"
  },
  {
    "id": 19,
    "name": "Charm Coração Fosco Abaulado",
    "description": "Coração com acabamento fosco escovado e argola polida.",
    "category": "Charms de coração",
    "price": "R$ 35,78",
    "kind": "heart",
    "image": "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw109a9d12/productimages/main_rect_center/734908C00_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384",
    "link": "https://br.pandora.net/pt/lancamentos-red/charm-pendente-de-corac%C3%A3o-curvo-fosco/734908C00.html"
  }
];

function HomePage() {
  const { add } = useCart();
  const navigate = useNavigate();
  const [category, setCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = ["Todos", "Pulseiras", "Charms de coração", "Charms temáticos", "Charms natalinos", "Anéis", "Colares"];
  const visibleProducts = useMemo(() => category === "Todos" ? products : products.filter((p) => p.category === category), [category]);
  return (
    <main className="min-h-screen bg-[#fff9fb] text-[#46343d]">
      <div className="bg-[#46343d] px-4 py-2 text-center text-[10px] tracking-[.22em] text-white">ELEGÂNCIA EM CADA DETALHE · NOVA COLEÇÃO COM FINALIZAÇÃO EM PLATINA</div>
      <header className="sticky top-0 z-30 border-b border-[#f0dce5] bg-[#fff9fb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 hover:bg-[#f9e8ef]"><Menu size={20} /></button>
          <a href="#" className="font-serif text-2xl font-semibold tracking-[.18em]">LIFE <span className="text-[#b77f98]">PANDORA</span></a>
          <a href="#colecao" className="rounded-full p-2 hover:bg-[#f9e8ef]" aria-label="Ver coleção"><ShoppingBag size={20} /></a>
        </div>
        {menuOpen && <div className="border-t border-[#f0dce5] px-6 py-4 text-center text-sm"><a href="#colecao" onClick={() => setMenuOpen(false)}>A coleção</a><span className="mx-5">·</span><a href="#diferencial" onClick={() => setMenuOpen(false)}>O diferencial</a></div>}
      </header>

      <section className="relative overflow-hidden bg-[#f9e8ef]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-[1.05fr_.95fr] md:gap-16 md:py-24">
          <div className="relative z-10">
            <p className="mb-5 text-[10px] uppercase tracking-[.3em] text-[#987b89]">Uma nova forma de brilhar</p>
            <h1 className="max-w-xl font-serif text-4xl leading-[1.12] md:text-6xl">Conheça a nova coleção Pandora – <i>Finalização em Platina</i></h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#66615b] md:text-base">A Pandora apresenta uma nova geração de joias com acabamento em platina, combinando sofisticação, brilho e inovação.</p>
            <a href="#colecao" className="mt-8 inline-flex items-center gap-4 bg-[#46343d] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white transition hover:bg-[#765968]">Descubra a coleção <ArrowRight size={15} /></a>
          </div>
          <div className="relative mx-auto flex h-[340px] w-full max-w-[500px] items-center justify-center md:h-[500px]">
            <div className="absolute h-[270px] w-[270px] rounded-full border border-white/80 md:h-[370px] md:w-[370px]" />
            <div className="absolute h-[220px] w-[220px] rounded-full bg-white/50 blur-2xl md:h-[300px] md:w-[300px]" />
            <div className="relative z-10 h-[320px] w-[320px] drop-shadow-xl md:h-[460px] md:w-[460px]"><img src={products[0].image} alt={products[0].name} className="h-full w-full object-contain" /></div>
            <span className="absolute bottom-5 right-4 font-serif text-sm italic text-[#987b89]">Brilho que conta histórias</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20" id="colecao">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#b58b9d]">Encontre sua peça</p><h2 className="mt-2 font-serif text-3xl md:text-4xl">A coleção</h2><p className="mt-2 text-sm text-[#8b7781]">19 opções para expressar sua personalidade.</p></div>
          <p className="text-xs tracking-wide text-[#6f6962]">19 peças selecionadas</p>
        </div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap border px-4 py-2 text-[10px] uppercase tracking-[.12em] transition ${category === item ? "border-[#46343d] bg-[#46343d] text-white" : "border-[#ddd7cf] text-[#806a75] hover:border-[#46343d]"}`}>{item}</button>)}</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => <article key={product.id} className="group overflow-hidden border border-[#f0dce5] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,38,30,0.09)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#fff3f7]">
              <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-0 transition-transform duration-700 ease-out group-hover:scale-[1.08]" />
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
          <div className="mx-auto h-[280px] w-[280px] md:h-[380px] md:w-[380px]"><img src={products[13].image} alt={products[13].name} loading="lazy" className="h-full w-full object-contain mix-blend-multiply" /></div>
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#b58b9d]">Inovação e cuidado</p><h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">O diferencial da coleção</h2><p className="mt-6 text-sm leading-7 text-[#806a75]">As peças são apresentadas com uma liga metálica exclusiva da Pandora e revestimento em platina, desenvolvidos para oferecer brilho duradouro, resistência à oxidação e propriedades hipoalergênicas.</p><p className="mt-4 text-sm leading-7 text-[#806a75]">Uma coleção que une design contemporâneo, delicadeza e personalidade, trazendo novas possibilidades para quem ama joias e acessórios sofisticados.</p><a href="#colecao" className="mt-8 inline-flex items-center gap-3 border-b border-[#46343d] pb-2 text-[10px] uppercase tracking-[.2em]">Explore as peças <ArrowRight size={14} /></a></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 text-center md:py-20"><Sparkles className="mx-auto text-[#a99b8d]" size={22} /><h2 className="mt-4 font-serif text-3xl md:text-4xl">Seu brilho, sua história</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#8b7781]">Descubra detalhes que transformam momentos em lembranças. Escolha suas peças favoritas e crie combinações únicas.</p><a href="#colecao" className="mt-7 inline-flex items-center gap-3 bg-[#46343d] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-[#765968]">Ver coleção completa <ArrowRight size={15} /></a></section>
      <footer className="border-t border-[#f0dce5] bg-white px-6 py-8 text-center"><a href="#" className="font-serif text-2xl font-semibold tracking-[.18em]">LIFE PANDORA</a><p className="mt-3 text-[10px] tracking-wider text-[#99918a]">DESIGN · BRILHO · PERSONALIDADE</p><p className="mt-5 text-[10px] text-[#aaa39c]">Página demonstrativa de coleção. Fotografias de produtos disponibilizadas nas páginas oficiais da Pandora.</p></footer>
    </main>
  );
}
