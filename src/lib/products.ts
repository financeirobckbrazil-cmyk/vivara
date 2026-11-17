


export type Product = {
  id: string;
  name: string;
  image: string;
  oldPrice?: number;
  price: number;
};

export const products: Product[] = [
  { id: "infinito", name: "Pulseira Life Coração em Prata 925 com Pedras Incolores", image: "/images/products/bracelet-1.webp", oldPrice: 420, price: 35.78 },
  { id: "enigma", name: "Pulseira Life Coração em Prata 925", image: "/images/products/bracelet-2.webp", oldPrice: 610, price: 35.78 },
  { id: "forms", name: "Pulseira Life Love Coração em Prata 925 com Pedras Azuis", image: "/images/products/bracelet-3.webp", oldPrice: 550, price: 35.78 },
  { id: "cupido", name: "Pulseira Life Sua História em Prata 925", image: "/images/products/bracelet-4.webp", oldPrice: 450, price: 35.78 },
  { id: "trancado", name: "Kit Pulseira Estrela Pingente Pegada Life", image: "/images/products/bracelet-5.webp", oldPrice: 399, price: 35.78 },
  { id: "gota", name: "Pulseira Life Cadeado em Prata 925", image: "/images/products/bracelet-1.webp", oldPrice: 690, price: 35.78 },
  { id: "coracao", name: "Pulseira Life em Prata 925", image: "/images/products/bracelet-2.webp", oldPrice: 499, price: 35.78 },
  { id: "love", name: "Pulseira Pandora Life Prata Fecho Coração", image: "/images/products/bracelet-3.webp", oldPrice: 527, price: 35.78 },
  
  { id: "pandora-1", name: "Pulseira de Malha Brilhante", image: "/images/products/bracelet-1.webp", price: 35.78 },
  { id: "pandora-2", name: "Charm Dachshund de Natal", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-3", name: "Charm Yeti Nevado", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-4", name: "Charm Azevinho de Natal", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-5", name: "Anel Flor de Cerejeira da Mulan", image: "/images/products/ring-1.webp", price: 35.78 },
  { id: "pandora-6", name: "Charm Hortelã-Pimenta Vermelha", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-7", name: "Charm Holiday Joy Vazado", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-8", name: "Charm Hortelã-Pimenta Verde", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-9", name: "Anel Tiara de Estrelas", image: "/images/products/ring-2.webp", price: 35.78 },
  { id: "pandora-10", name: "Colar de Corrente Snake", image: "/images/products/necklace-1.webp", price: 35.78 },
  { id: "pandora-11", name: "Charm Pendente Mistletoe", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-12", name: "Charm Estrela Vazado", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-13", name: "Charm Coração Roxo Gravável", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-14", name: "Colar de Malha Brilhante", image: "/images/products/necklace-2.webp", price: 35.78 },
  { id: "pandora-15", name: "Charm Coração Vermelho Gravável", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-16", name: "Charm Coração Azul Gravável", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-17", name: "Charm Planeta Azul Celestial", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-18", name: "Charm Coração Azul Abaulado", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-19", name: "Charm Coração Fosco Abaulado", image: "/images/products/bracelet-2.webp", price: 35.78 },
  { id: "pandora-20", name: "Pulseira Life Coração em Prata 925", image: "/images/products/bracelet-2.webp", oldPrice: 610, price: 35.78 },
  { id: "pandora-21", name: "Pulseira Life Love em Prata 925", image: "/images/products/bracelet-3.webp", oldPrice: 550, price: 35.78 },
  { id: "pandora-22", name: "Pulseira Life com Fecho Coração", image: "/images/products/bracelet-4.webp", oldPrice: 450, price: 35.78 },
  { id: "pandora-23", name: "Pulseira Life em Prata 925", image: "/images/products/bracelet-5.webp", oldPrice: 399, price: 35.78 },
];

export const formatBRL = (v: number) => {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getProduct = (id: string) => products.find((p) => p.id === id);
