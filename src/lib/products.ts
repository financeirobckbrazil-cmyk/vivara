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
  oldPrice?: number;
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
  
  { id: "pandora-1", name: "Pulseira de Malha Brilhante", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw1411f3dc/productimages/main_rect_center/534971C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-2", name: "Charm Dachshund de Natal", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwbf6e8cc0/productimages/main_rect_center/734970C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-3", name: "Charm Yeti Nevado", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwa681c507/productimages/main_rect_center/735058C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-4", name: "Charm Azevinho de Natal", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwa4f2cdf4/productimages/main_rect_center/734974C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-5", name: "Anel Flor de Cerejeira da Mulan", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw432fdfde/productimages/main_rect_center/135027C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-6", name: "Charm Hortelã-Pimenta Vermelha", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw8584ae06/productimages/main_rect_center/735071C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-7", name: "Charm Holiday Joy Vazado", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwfb7094cf/productimages/main_rect_center/735064C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-8", name: "Charm Hortelã-Pimenta Verde", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw2bc69654/productimages/main_rect_center/735071C02_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-9", name: "Anel Tiara de Estrelas", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw70fce4ad/productimages/main_rect_center/134946C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-10", name: "Colar de Corrente Snake", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw27bcad76/productimages/main_rect_center/314563C00_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-11", name: "Charm Pendente Mistletoe", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw71385fce/productimages/main_rect_center/735066C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-12", name: "Charm Estrela Vazado", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw15224b6b/productimages/main_rect_center/735034C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-13", name: "Charm Coração Roxo Gravável", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw251a2801/productimages/main_rect_center/735088C02_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-14", name: "Colar de Malha Brilhante", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwb8d3b849/productimages/main_rect_center/335080C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-15", name: "Charm Coração Vermelho Gravável", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwef9caea9/productimages/main_rect_center/735088C03_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-16", name: "Charm Coração Azul Gravável", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw2da70ff6/productimages/main_rect_center/735088C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-17", name: "Charm Planeta Azul Celestial", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwe6c4ef62/productimages/main_rect_center/735038C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-18", name: "Charm Coração Azul Abaulado", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw8ecf4240/productimages/main_rect_center/735075C01_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
  { id: "pandora-19", name: "Charm Coração Fosco Abaulado", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw109a9d12/productimages/main_rect_center/734908C00_RGB.jpg?bgcolor=F7F7F7&q=70&sfrm=png&sw=384", price: 35.78 },
];

export const formatBRL = (v: number) => {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getProduct = (id: string) => products.find((p) => p.id === id);
