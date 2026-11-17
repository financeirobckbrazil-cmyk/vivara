import { useRef, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { type Product, formatBRL } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const SIZES = ["12", "14", "16", "18", "20", "22"];

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const router = useRouter();
  const [size, setSize] = useState("");
  const firedRef = useRef(false);

  const handleAdd = () => {
    if (firedRef.current) return;
    if (!size) {
      toast.error("Selecione um tamanho");
      return;
    }
    firedRef.current = true;
    add(product.id, size);
    navigate({ to: "/carrinho" });
  };


  const handleSizeChange = (value: string) => {
    setSize(value);
    // pré-carrega a rota do carrinho assim que o tamanho é escolhido
    if (value) void router.preloadRoute({ to: "/carrinho" }).catch(() => {});
  };


  return (
    <article className="border border-border bg-card rounded-sm overflow-hidden">
      <div className="aspect-square bg-secondary/40 flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://au.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dw9e2949dc/productimages/singlepackshot/590719_V2_RGB.jpg?bgcolor=F5F5F5&sfrm=png&sh=1200&sm=fit&sw=1200"; }}
          loading="lazy"
          width={1024}
          height={1024}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-5 space-y-4">
        <h2 className="text-foreground text-sm leading-snug">{product.name}</h2>
        <div className="space-y-1">
          <div className="text-muted-foreground line-through text-sm">{formatBRL(product.oldPrice)}</div>
          <div className="text-price font-semibold text-2xl">{formatBRL(product.price)}</div>
        </div>
        <select
          value={size}
          onChange={(e) => handleSizeChange(e.target.value)}
          style={{ touchAction: "manipulation" }}
          className="w-full border border-input bg-background rounded-sm px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Tamanho: Selecione</option>
          {SIZES.map((s) => (
            <option key={s} value={s}>
              Tamanho {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          style={{ touchAction: "manipulation" }}
          className="w-full bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.2em] uppercase font-medium hover:opacity-90 transition-opacity rounded-sm"
        >
          Adicionar à sacola
        </button>
      </div>
    </article>
  );
}
