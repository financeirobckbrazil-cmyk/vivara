


export type Product = {
  id: string;
  name: string;
  image: string;
  oldPrice?: number;
  price: number;
};

export const products: Product[] = [
  { id: "infinito", name: "Pulseira Life Coração em Prata 925 com Pedras Incolores", image: "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200", oldPrice: 420, price: 35.78 },
  { id: "enigma", name: "Pulseira Life Coração em Prata 925", image: "https://image.rakuten.co.jp/onemore/cabinet/002/pd-590728-d.jpg", oldPrice: 610, price: 35.78 },
  { id: "forms", name: "Pulseira Life Love Coração em Prata 925 com Pedras Azuis", image: "https://www.giftandwrap.co.uk/cdn/shop/files/1603205960-49831400.jpg?v=1760453284&width=3840", oldPrice: 550, price: 35.78 },
  { id: "cupido", name: "Pulseira Life Sua História em Prata 925", image: "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200", oldPrice: 450, price: 35.78 },
  { id: "trancado", name: "Kit Pulseira Estrela Pingente Pegada Life", image: "https://image.rakuten.co.jp/onemore/cabinet/002/pd-590728-d.jpg", oldPrice: 399, price: 35.78 },
  { id: "gota", name: "Pulseira Life Cadeado em Prata 925", image: "https://www.giftandwrap.co.uk/cdn/shop/files/1603205960-49831400.jpg?v=1760453284&width=3840", oldPrice: 690, price: 35.78 },
  { id: "coracao", name: "Pulseira Life em Prata 925", image: "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200", oldPrice: 499, price: 35.78 },
  { id: "love", name: "Pulseira Pandora Life Prata Fecho Coração", image: "https://image.rakuten.co.jp/onemore/cabinet/002/pd-590728-d.jpg", oldPrice: 527, price: 35.78 },
  
  { id: "pandora-1", name: "Pulseira de Malha Brilhante", image: "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200", price: 35.78 },
  { id: "pandora-2", name: "Charm Casa de Gengibre", image: "https://erp-image.sgliteasset.com/_next/image?q=100&url=https%3A%2F%2Fcdn1.sgliteasset.com%2Fpandoram%2Fimages%2Fproduct%2Fproduct-5166958%2FwUTYyms969a0f26e2d87a_1772155502.jpg&w=3840", price: 35.78 },
  { id: "pandora-3", name: "Charm Murano Magia de Natal", image: "https://laatukoru.fi/cdn/shop/files/Pandora_Moments_Christmas_Magic_Murano_Glass_hela_hopea_793597C00.jpg?v=1765638585", price: 35.78 },
  { id: "pandora-4", name: "Charm Globo de Neve", image: "https://pancharmbracelets.com/cdn/shop/products/HIGH_792369C01_RGB.jpg?v=1666724772", price: 35.78 },
  { id: "pandora-5", name: "Anel Flor de Cerejeira da Mulan", image: "https://pandora.lucerneluxe.com/cdn/shop/files/HIGH_RGB_193801C01_RGB_1024x1024%402x.jpg?v=1749657602", price: 35.78 },
  { id: "pandora-6", name: "Charm Árvore de Natal", image: "https://br.pandora.net/dw/image/v2/BLTN_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw629b81fa/productimages/main_rect_center/764248C01_RGB.jpg?bgcolor=F7F7F7&q=90&sfrm=png&sw=1200", price: 35.78 },
  { id: "pandora-9", name: "Anel Tiara de Estrelas", image: "https://pandoraeg.com/cdn/shop/files/PandoraSterlingsilverringwithclearcubiczirconia190050C01_3.jpg?v=1754942745&width=2362", price: 35.78 },
  { id: "pandora-10", name: "Colar de Corrente Snake", image: "https://pandora-eshop.jo/cdn/shop/files/WEB_393099C01_RGB.png?v=1754776761&width=2048", price: 35.78 },
  { id: "pandora-14", name: "Colar de Malha Brilhante", image: "https://laatukoru.fi/cdn/shop/files/Pandora_Timeless_Elevated_Heart_kaulakoru_hopea_398425C0_45.jpg?v=1747904947", price: 35.78 },

  { id: "colar-prata-cravejado", name: "Colar de prata com brilho cravejado", image: "https://us.pandora.net/dw/image/v2/AAVX_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwb8d3b849/productimages/main_rect_center/335080C01_RGB.jpg?bgcolor=F7F7F7&q=90&sfrm=png&sw=1200", price: 48.45 },
  { id: "kit-limpeza", name: "Kit de limpeza para joias", image: "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw0b1f9cf1/productimages/singlepackshot/CARE_KIT_JAR_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200", price: 49.87 },
  { id: "flanela-polimento", name: "Flanela macia para polimento", image: "https://laatukoru.fi/cdn/shop/files/Pandora_puhdistusliina_A001.jpg?v=1759136280&width=1024", price: 19.90 },
  { id: "pandora-20", name: "Pulseira Life Coração em Prata 925", image: "https://image.rakuten.co.jp/onemore/cabinet/002/pd-590728-d.jpg", oldPrice: 610, price: 35.78 },
  { id: "pandora-21", name: "Pulseira Life Love em Prata 925", image: "https://www.giftandwrap.co.uk/cdn/shop/files/1603205960-49831400.jpg?v=1760453284&width=3840", oldPrice: 550, price: 35.78 },
  { id: "pandora-22", name: "Pulseira Life com Fecho Coração", image: "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200", oldPrice: 450, price: 35.78 },
  { id: "pandora-23", name: "Pulseira Life em Prata 925", image: "https://image.rakuten.co.jp/onemore/cabinet/002/pd-590728-d.jpg", oldPrice: 399, price: 35.78 },
];

export const formatBRL = (v: number) => {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getProduct = (id: string) => products.find((p) => p.id === id);
