import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pandora — Coleção com Finalização em Platina" },
      { name: "description", content: "Conheça a nova coleção Pandora com acabamento em platina." },
    ],
  }),
  component: HomePage,
});

type ArtKind = "bracelet" | "heart" | "blue" | "star" | "planet" | "flower" | "ring" | "necklace";

function JewelryArt({ kind }: { kind: ArtKind }) {
  return (
    <svg viewBox="0 0 420 300" role="img" aria-label="Ilustração de joia em acabamento prateado" className="h-full w-full">
      <defs>
        <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".3" stopColor="#aeb5bd" />
          <stop offset=".52" stopColor="#fff" />
          <stop offset=".78" stopColor="#8d969f" />
          <stop offset="1" stopColor="#f9fbff" />
        </linearGradient>
        <radialGradient id="gem">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".5" stopColor="#d9e6f4" />
          <stop offset="1" stopColor="#8da9c8" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="255" rx="105" ry="9" fill="#8c9299" opacity=".15" />
      {kind === "bracelet" && <g fill="none" stroke="url(#silver)" strokeWidth="8">
        <ellipse cx="210" cy="145" rx="125" ry="70" transform="rotate(-12 210 145)" />
        {Array.from({length: 13}, (_, i) => <circle key={i} cx={96 + i * 19} cy={124 - Math.sin(i / 12 * Math.PI) * 28} r="5" fill="url(#gem)" stroke="#b7c1cc" strokeWidth="1" />)}
        <path d="M210 205 C192 188 179 174 185 160 C191 146 207 150 210 162 C216 149 232 146 238 160 C244 175 227 191 210 205Z" fill="url(#silver)" stroke="#929ba5" strokeWidth="2" />
      </g>}
      {kind === "heart" && <g>
        <path d="M210 228 C175 196 112 151 128 103 C143 60 193 74 210 111 C231 70 280 63 294 105 C311 153 248 200 210 228Z" fill="url(#silver)" stroke="#9ca5af" strokeWidth="3" />
        <path d="M210 210 C185 186 144 151 154 116" fill="none" stroke="#fff" strokeWidth="5" />
        <circle cx="210" cy="242" r="10" fill="none" stroke="url(#silver)" strokeWidth="6" />
      </g>}
      {kind === "blue" && <g>
        <path d="M210 230 C174 198 120 158 132 112 C144 68 193 75 210 111 C229 73 276 67 290 111 C304 155 247 198 210 230Z" fill="#a9c8e8" stroke="url(#silver)" strokeWidth="11" />
        <path d="M160 124 Q205 91 258 126" fill="none" stroke="#eaf4ff" strokeWidth="7" />
        <circle cx="210" cy="244" r="9" fill="none" stroke="url(#silver)" strokeWidth="6" />
      </g>}
      {kind === "star" && <path d="M210 55 L242 137 330 143 263 199 284 283 210 235 136 283 157 199 90 143 178 137Z" fill="url(#silver)" stroke="#9ca5af" strokeWidth="3" />}
      {kind === "planet" && <g>
        <circle cx="210" cy="150" r="67" fill="#9fc5e9" stroke="url(#silver)" strokeWidth="10" />
        <ellipse cx="210" cy="150" rx="124" ry="35" transform="rotate(-18 210 150)" fill="none" stroke="url(#silver)" strokeWidth="13" />
        <path d="M167 117 Q190 93 217 108 M184 183 Q218 202 244 178" fill="none" stroke="#e9f5ff" strokeWidth="8" strokeLinecap="round" />
      </g>}
      {kind === "flower" && <g>
        {Array.from({length: 5}, (_, i) => <ellipse key={i} cx="210" cy="91" rx="27" ry="48" transform={`rotate(${i * 72} 210 150)`} fill="#f2dce6" stroke="url(#silver)" strokeWidth="5" />)}
        <circle cx="210" cy="150" r="22" fill="#d6b9c8" stroke="url(#silver)" strokeWidth="6" />
        <path d="M210 208 v38" stroke="url(#silver)" strokeWidth="8" />
      </g>}
      {kind === "ring" && <g fill="none" stroke="url(#silver)" strokeWidth="15">
        <ellipse cx="210" cy="177" rx="96" ry="53" />
        <path d="M114 170 Q210 100 306 170" strokeWidth="7" />
        {Array.from({length: 7}, (_, i) => <path key={i} d="M210 63 l9 19 -9 19 -9-19Z" fill="url(#gem)" stroke="#aeb7c1" strokeWidth="2" transform={`translate(${(i - 3) * 25} ${Math.abs(i - 3) * 7})`} />)}
      </g>}
      {kind === "necklace" && <g fill="none" stroke="url(#silver)" strokeWidth="6">
        <path d="M80 45 Q105 245 210 245 Q315 245 340 45" />
        <path d="M210 246 C188 226 164 206 172 185 C180 164 202 171 210 188 C219 170 242 164 250 185 C258 207 232 229 210 246Z" fill="url(#silver)" stroke="#9ca5af" strokeWidth="3" />
      </g>}
    </svg>
  );
}

const pieces: { name: string; detail: string; kind: ArtKind; tag: string }[] = [
  { name: "Pulseira de Malha Brilhante", detail: "Pedras transparentes e fecho de coração.", kind: "bracelet", tag: "Destaque" },
  { name: "Charms de Coração", detail: "Modelos curvos, foscos e personalizáveis.", kind: "heart", tag: "Clássicos" },
  { name: "Charm Coração Azul", detail: "Um toque de cor com brilho delicado.", kind: "blue", tag: "Toque de cor" },
  { name: "Charm Estrela", detail: "Inspiração celestial para sua pulseira.", kind: "star", tag: "Temáticos" },
  { name: "Charm Planeta Azul", detail: "Um pequeno universo para levar com você.", kind: "planet", tag: "Temáticos" },
  { name: "Anel Flor de Cerejeira", detail: "Inspiração na Mulan, Disney x Pandora.", kind: "flower", tag: "Disney x Pandora" },
  { name: "Anel Tiara de Estrelas", detail: "Delicadeza com inspiração celestial.", kind: "ring", tag: "Anéis" },
  { name: "Colar de Malha Brilhante", detail: "Fecho de coração e acabamento em platina.", kind: "necklace", tag: "Destaque" },
];

function HomePage() {
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-[#242321]">
      <div className="bg-[#242321] px-4 py-2 text-center text-[10px] tracking-[.22em] text-white sm:text-xs">
        ELEGÂNCIA EM CADA DETALHE · NOVA COLEÇÃO COM FINALIZAÇÃO EM PLATINA
      </div>
      <header className="sticky top-0 z-20 border-b border-[#e9e5df] bg-[#fbfaf8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="font-serif text-2xl tracking-[.18em]">PANDORA<span className="text-[#a88b65]">.</span></a>
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[.18em] md:flex">
            <a href="#colecao" className="hover:text-[#9a7953]">A coleção</a>
            <a href="#diferencial" className="hover:text-[#9a7953]">Finalização em platina</a>
            <a href="#sobre" className="hover:text-[#9a7953]">Nossa inspiração</a>
