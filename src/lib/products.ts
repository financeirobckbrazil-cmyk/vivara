import imgPulseira1 from "@/assets/pulseira-1.png.asset.json";
import imgPulseira2 from "@/assets/pulseira-2.png.asset.json";
import imgPulseira3 from "@/assets/pulseira-3.png.asset.json";
import imgPulseira4 from "@/assets/pulseira-4.png.asset.json";
import imgPulseira5 from "@/assets/pulseira-5.png.asset.json";
import imgPulseira6 from "@/assets/pulseira-6.png.asset.json";
import imgPulseira7 from "@/assets/pulseira-7.png.asset.json";
import imgPulseira8 from "@/assets/pulseira-8.png.asset.json";


export type Product = {
  id: string;
  name: string;
  image: string;
  oldPrice: number;
  price: number;
};

export const products: Product[] = [
  { id: "infinito", name: "Pulseira Life Coração em Prata 925 com Pedras Incolores", image: imgPulseira1.url, oldPrice: 420, price: 35.78 },
  { id: "enigma", name: "Pulseira Life Coração em Prata 925", image: imgPulseira2.url, oldPrice: 610, price: 35.78 },
  { id: "forms", name: "Pulseira Life Love Coração em Prata 925 com Pedras Azuis", image: imgPulseira3.url, oldPrice: 550, price: 35.78 },
  { id: "cupido", name: "Pulseira Life Sua História em Prata 925", image: imgPulseira4.url, oldPrice: 450, price: 35.78 },
  { id: "trancado", name: "Kit Pulseira Estrela Pingente Pegada Life", image: imgPulseira5.url, oldPrice: 399, price: 35.78 },
  { id: "gota", name: "Pulseira Life Cadeado em Prata 925", image: imgPulseira6.url, oldPrice: 690, price: 35.78 },
  { id: "coracao", name: "Pulseira Life em Prata 925", image: imgPulseira7.url, oldPrice: 499, price: 35.78 },
  { id: "love", name: "Pulseira Vivara Life Prata Fecho Coração", image: imgPulseira8.url, oldPrice: 527, price: 35.78 },
  
];

export const formatBRL = (v: number) => {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getProduct = (id: string) => products.find((p) => p.id === id);
