import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Menu, ShoppingBag, Sparkles, X, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pandora | Coleção com finalização em platina" },
      { name: "description", content: "Conheça 19 joias da nova coleção Pandora com acabamento em platina: pulseiras, charms, anéis e colares." },
    ],
  }),
  component: HomePage,
});

type Product = { id: number; name: string; description: string; category: string; kind: string; price: string };
const products: Product[] = [
  { id: 1, name: "Pulseira de Malha Brilhante", description: "Pedras transparentes e fecho delicado de coração.", category: "Pulseiras", kind: "bracelet", price: "R$ 899,00" },
  { id: 2, name: "Charm Coração Curvo", description: "Linhas suaves para celebrar o amor.", category: "Charms de coração", kind: "heart", price: "R$ 329,00" },
  { id: 3, name: "Charm Coração Fosco", description: "Acabamento acetinado e design contemporâneo.", category: "Charms de coração", kind: "heart", price: "R$ 329,00" },
  { id: 4, name: "Charm Coração Azul", description: "Um toque de azul com brilho delicado.", category: "Charms de coração", kind: "blue", price: "R$ 359,00" },
  { id: 5, name: "Charm Coração Personalizável", description: "Uma peça para guardar sua própria história.", category: "Charms de coração", kind: "custom", price: "R$ 349,00" },
  { id: 6, name: "Charm Estrela", description: "Um pequeno brilho inspirado no céu.", category: "Charms temáticos", kind: "star", price: "R$ 329,00" },
  { id: 7, name: "Charm Planeta Azul", description: "Um universo de cor para levar com você.", category: "Charms temáticos", kind: "planet", price: "R$ 359,00" },
  { id: 8, name: "Charm Yeti de Neve", description: "Um personagem divertido em versão joia.", category: "Charms temáticos", kind: "snow", price: "R$ 379,00" },
  { id: 9, name: "Charm Personagem Especial", description: "Um detalhe lúdico para sua coleção.", category: "Charms temáticos", kind: "character", price: "R$ 359,00" },
  { id: 10, name: "Charm Azevinho Natalino", description: "Folhas e brilho para celebrar a temporada.", category: "Charms natalinos", kind: "holly", price: "R$ 329,00" },
  { id: 11, name: "Charm Dachshund", description: "Um companheiro encantador em forma de charm.", category: "Charms natalinos", kind: "dog", price: "R$ 359,00" },
  { id: 12, name: "Charm Hortelã-Pimenta", description: "Um toque festivo inspirado nos doces natalinos.", category: "Charms natalinos", kind: "candy", price: "R$ 329,00" },
  { id: 13, name: "Charm Floco de Neve", description: "Brilho delicado inspirado no inverno.", category: "Charms natalinos", kind: "snowflake", price: "R$ 329,00" },
  { id: 14, name: "Charm Presente Especial", description: "Um presente simbólico para momentos únicos.", category: "Charms natalinos", kind: "gift", price: "R$ 329,00" },
  { id: 15, name: "Anel Tiara de Estrelas", description: "Uma peça delicada com inspiração celestial.", category: "Anéis", kind: "ring", price: "R$ 499,00" },
  { id: 16, name: "Anel Flor de Cerejeira da Mulan", description: "Uma criação especial inspirada na parceria Disney x Pandora.", category: "Anéis", kind: "flower", price: "R$ 529,00" },
  { id: 17, name: "Colar de Malha Brilhante", description: "Fecho de coração e acabamento luminoso em platina.", category: "Colares", kind: "necklace", price: "R$ 799,00" },
  { id: 18, name: "Charm Coração Duplo", description: "Dois corações em uma composição romântica.", category: "Charms de coração", kind: "double", price: "R$ 359,00" },
  { id: 19, name: "Charm Estrela Cadente", description: "Um símbolo de sonhos e novos começos.", category: "Charms temáticos", kind: "shooting", price: "R$ 349,00" },
];

function JewelryArt({ kind }: { kind: string }) {
  const heart = <path d="M100 145 C35 95 48 45 82 52 C99 55 100 72 100 72 C100 72 105 53 123 52 C158 48 166 99 100 145Z" />;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Ilustração decorativa de joia" className="h-full w-full">
      <defs>
        <linearGradient id="silver" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff" /><stop offset=".45" stopColor="#aeb5bd" /><stop offset=".72" stopColor="#fff" /><stop offset="1" stopColor="#8b929a" /></linearGradient>
        <radialGradient id="blue"><stop stopColor="#d8f3ff" /><stop offset="1" stopColor="#3989bd" /></radialGradient>
      </defs>
      <ellipse cx="100" cy="174" rx="58" ry="8" fill="#d8d3cc" opacity=".45" />
      <g fill="url(#silver)" stroke="#858b92" strokeWidth="2" strokeLinejoin="round">
        {kind === "bracelet" || kind === "necklace" ? <><ellipse cx="100" cy="100" rx="62" ry="39" fill="none" strokeWidth="10" /><ellipse cx="100" cy="100" rx="62" ry="39" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 5" />{heart}</> : null}
        {kind === "heart" || kind === "custom" || kind === "double" ? heart : null}
        {kind === "blue" ? <><path d="M100 145 C35 95 48 45 82 52 C99 55 100 72 100 72 C100 72 105 53 123 52 C158 48 166 99 100 145Z" fill="url(#blue)" /><path d="M100 145 C35 95 48 45 82 52 C99 55 100 72 100 72" fill="none" stroke="#e9f8ff" strokeWidth="3" /></> : null}
        {kind === "star" || kind === "shooting" ? <path d="M100 35 L116 78 L160 80 L126 108 L137 151 L100 126 L63 151 L74 108 L40 80 L84 78Z" /> : null}
        {kind === "planet" ? <><circle cx="100" cy="95" r="43" fill="url(#blue)" /><ellipse cx="100" cy="95" rx="70" ry="19" fill="none" stroke="#aeb5bd" strokeWidth="9" transform="rotate(-24 100 95)" /></> : null}
        {kind === "ring" ? <><ellipse cx="100" cy="117" rx="48" ry="23" fill="none" strokeWidth="13" /><path d="M100 38 L112 62 L100 78 L88 62Z" /></> : null}
        {kind === "flower" ? <><circle cx="100" cy="96" r="14" fill="#e7a9bd" />{[0,60,120,180,240,300].map((a) => <ellipse key={a} cx="100" cy="65" rx="15" ry="27" fill="#f4cbd8" transform={`rotate(${a} 100 96)`} />)}</> : null}
        {kind === "holly" ? <><path d="M100 100 C42 42 32 105 82 117 C45 157 105 165 112 119 C154 151 178 92 119 91Z" fill="#9bb89d" /><circle cx="98" cy="104" r="12" fill="#b94e58" /><circle cx="120" cy="115" r="11" fill="#b94e58" /></> : null}
        {kind === "dog" ? <><ellipse cx="100" cy="108" rx="43" ry="27" /><circle cx="142" cy="91" r="23" /><path d="M126 74 Q103 38 117 96Z" /><path d="M74 126 L68 151 M126 126 L132 151" fill="none" strokeWidth="10" /></> : null}
        {kind === "candy" ? <><path d="M75 130 Q40 75 88 56 Q133 38 129 84 Q125 111 95 126" fill="none" strokeWidth="17" /><path d="M72 84 L112 108 M85 61 L125 83" fill="none" stroke="#c77b86" strokeWidth="8" /></> : null}
        {kind === "snow" || kind === "snowflake" ? <><path d="M100 42 V153 M52 70 L148 126 M52 126 L148 70" fill="none" strokeWidth="9" strokeLinecap="round" /><circle cx="100" cy="97" r="13" /></> : null}
        {kind === "gift" ? <><rect x="55" y="78" width="90" height="72" rx="8" /><path d="M100 78 V150 M55 102 H145" fill="none" stroke="#b77c85" strokeWidth="9" /><path d="M100 78 C60 58 72 35 92 54 L100 78 C130 37 151 59 100 78Z" fill="#c98c96" /></> : null}
        {kind === "character" ? <><circle cx="100" cy="96" r="42" /><circle cx="85" cy="91" r="5" fill="#555" /><circle cx="115" cy="91" r="5" fill="#555" /><path d="M85 115 Q100 128 115 115" fill="none" stroke="#777" strokeWidth="4" /></> : null}
      </g>
      <g fill="#fff" opacity=".9"><circle cx="55" cy="45" r="3" /><circle cx="151" cy="53" r="2" /><circle cx="150" cy="145" r="3" /></g>
      <circle cx="100" cy="27" r="5" fill="url(#silver)" stroke="#8b929a" />
    </svg>
  );
}

function HomePage() {
  const [cart, setCart] = useState<number[]>([]);
  const [category, setCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = ["Todos", "Pulseiras", "Charms de coração", "Charms temáticos", "Charms natalinos", "Anéis", "Colares"];
  const visibleProducts = useMemo(() => category === "Todos" ? products : products.filter((p) => p.category === category), [category]);
  const addToCart = (id: number) => setCart((items) => [...items, id]);
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-[#242321]">
      <div className="bg-[#242321] px-4 py-2 text-center text-[10px] tracking-[.22em] text-white">ELEGÂNCIA EM CADA DETALHE · NOVA COLEÇÃO COM FINALIZAÇÃO EM PLATINA</div>
      <header className="sticky top-0 z-30 border-b border-[#e9e4de] bg-[#fbfaf8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 hover:bg-[#eeeae5]"><Menu size={20} /></button>
          <a href="#" className="font-serif text-3xl tracking-[.18em]">Pandora<span className="align-top text-xs">®</span></a>
          <button onClick={() => document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" })} className="relative rounded-full p-2 hover:bg-[#eeeae5]" aria-label="Ver sacola"><ShoppingBag size={20} />{cart.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#242321] text-[10px] text-white">{cart.length}</span>}</button>
        </div>
        {menuOpen && <div className="border-t border-[#e9e4de] px-6 py-4 text-center text-sm"><a href="#colecao" onClick={() => setMenuOpen(false)}>A coleção</a><span className="mx-5">·</span><a href="#diferencial" onClick={() => setMenuOpen(false)}>O diferencial</a></div>}
      </header>

      <section className="relative overflow-hidden bg-[#eeeae5]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 md:grid-cols-2 md:py-24">
          <div className="relative z-10">
            <p className="mb-5 text-[10px] uppercase tracking-[.3em] text-[#82796f]">Uma nova forma de brilhar</p>
            <h1 className="max-w-xl font-serif text-4xl leading-[1.12] md:text-6xl">Conheça a nova coleção Pandora – <i>Finalização em Platina</i></h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#66615b] md:text-base">A Pandora apresenta uma nova geração de joias com acabamento em platina, combinando sofisticação, brilho e inovação.</p>
            <a href="#colecao" className="mt-8 inline-flex items-center gap-4 bg-[#242321] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white transition hover:bg-[#55504a]">Descubra a coleção <ArrowRight size={15} /></a>
          </div>
          <div className="relative mx-auto flex h-[310px] w-full max-w-[500px] items-center justify-center md:h-[430px]">
            <div className="absolute h-[270px] w-[270px] rounded-full border border-white/80 md:h-[370px] md:w-[370px]" />
            <div className="absolute h-[220px] w-[220px] rounded-full bg-white/50 blur-2xl md:h-[300px] md:w-[300px]" />
            <div className="relative z-10 h-[290px] w-[290px] drop-shadow-xl md:h-[410px] md:w-[410px]"><JewelryArt kind="bracelet" /></div>
            <span className="absolute bottom-5 right-4 font-serif text-sm italic text-[#82796f]">Brilho que conta histórias</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20" id="colecao">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#9b8d7e]">Encontre sua peça</p><h2 className="mt-2 font-serif text-3xl md:text-4xl">A coleção</h2><p className="mt-2 text-sm text-[#77716b]">19 opções para expressar sua personalidade.</p></div>
          <div className="flex items-center gap-2 text-xs text-[#6f6962]"><ShoppingBag size={16} /> {cart.length} {cart.length === 1 ? "item" : "itens"} na sacola</div>
        </div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap border px-4 py-2 text-[10px] uppercase tracking-[.12em] transition ${category === item ? "border-[#242321] bg-[#242321] text-white" : "border-[#ddd7cf] text-[#625d57] hover:border-[#242321]"}`}>{item}</button>)}</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => <article key={product.id} className="group border border-[#e9e4de] bg-white">
            <div className="relative aspect-square overflow-hidden bg-[#f1efeb] p-5 md:p-8"><div className="h-full w-full transition duration-500 group-hover:scale-105"><JewelryArt kind={product.kind} /></div><span className="absolute left-3 top-3 bg-white/80 px-2 py-1 text-[9px] uppercase tracking-widest text-[#77716b]">Platina</span><button aria-label={`Favoritar ${product.name}`} className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-[#77716b] hover:text-[#a56b76]"><Heart size={15} /></button></div>
            <div className="p-4"><p className="text-[9px] uppercase tracking-[.15em] text-[#9b8d7e]">{product.category}</p><h3 className="mt-2 min-h-[42px] font-serif text-base leading-5">{product.name}</h3><p className="mt-2 min-h-[42px] text-[11px] leading-5 text-[#77716b]">{product.description}</p><div className="mt-4 flex items-center justify-between gap-2"><span className="text-sm font-medium">{product.price}</span><button onClick={() => addToCart(product.id)} className="flex items-center gap-1 bg-[#242321] px-3 py-2 text-[9px] uppercase tracking-wider text-white hover:bg-[#55504a]"><ShoppingBag size={12} /> Adicionar</button></div></div>
          </article>)}
        </div>
        {visibleProducts.length === 0 && <p className="py-12 text-center text-sm text-[#77716b]">Nenhuma peça encontrada nesta categoria.</p>}
      </section>

      <section id="diferencial" className="bg-[#eeeae5] px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="mx-auto h-[280px] w-[280px] md:h-[380px] md:w-[380px]"><JewelryArt kind="necklace" /></div>
          <div><p className="text-[10px] uppercase tracking-[.25em] text-[#9b8d7e]">Inovação e cuidado</p><h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">O diferencial da coleção</h2><p className="mt-6 text-sm leading-7 text-[#625d57]">As peças são apresentadas com uma liga metálica exclusiva da Pandora e revestimento em platina, desenvolvidos para oferecer brilho duradouro, resistência à oxidação e propriedades hipoalergênicas.</p><p className="mt-4 text-sm leading-7 text-[#625d57]">Uma coleção que une design contemporâneo, delicadeza e personalidade, trazendo novas possibilidades para quem ama joias e acessórios sofisticados.</p><a href="#colecao" className="mt-8 inline-flex items-center gap-3 border-b border-[#242321] pb-2 text-[10px] uppercase tracking-[.2em]">Explore as peças <ArrowRight size={14} /></a></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 text-center md:py-20"><Sparkles className="mx-auto text-[#a99b8d]" size={22} /><h2 className="mt-4 font-serif text-3xl md:text-4xl">Seu brilho, sua história</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77716b]">Descubra detalhes que transformam momentos em lembranças. Escolha suas peças favoritas e crie combinações únicas.</p><a href="#colecao" className="mt-7 inline-flex items-center gap-3 bg-[#242321] px-7 py-4 text-[10px] uppercase tracking-[.2em] text-white hover:bg-[#55504a]">Ver coleção completa <ArrowRight size={15} /></a></section>
      <footer className="border-t border-[#e9e4de] bg-white px-6 py-8 text-center"><a href="#" className="font-serif text-2xl tracking-[.18em]">Pandora</a><p className="mt-3 text-[10px] tracking-wider text-[#99918a]">DESIGN · BRILHO · PERSONALIDADE</p><p className="mt-5 text-[10px] text-[#aaa39c]">Página demonstrativa de coleção. Ilustrações decorativas criadas para esta página.</p></footer>
      {cart.length > 0 && <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-[#242321] px-5 py-4 text-white shadow-xl"><Check size={16} /><span className="text-xs">{cart.length} {cart.length === 1 ? "item adicionado" : "itens adicionados"} à sacola</span><button onClick={() => setCart([])} aria-label="Limpar sacola"><X size={15} /></button></div>}
    </main>
  );
}
