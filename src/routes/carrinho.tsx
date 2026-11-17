import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, X, Lock, Search, UserRound, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL, getProduct } from "@/lib/products";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Minha Sacola — Life Pandora" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQty, total, count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-white px-5 sm:px-8">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between sm:h-[88px]">
          <Link to="/" className="font-sans text-[25px] font-semibold tracking-[-.045em] text-brand sm:text-[34px]">LIFE <span className="font-normal tracking-[-.055em]">PANDORA</span></Link>
          <div className="flex items-center gap-3 text-brand sm:gap-6">
            <Link to="/" hash="colecao" aria-label="Buscar produtos" className="rounded-full p-2 hover:bg-secondary"><Search className="h-6 w-6" strokeWidth={1.5} /></Link>
            <Link to="/compras" aria-label="Minha conta" className="rounded-full p-2 hover:bg-secondary"><UserRound className="h-6 w-6" strokeWidth={1.5} /></Link>
            <Link to="/carrinho" aria-label="Sacola" className="rounded-full p-2 hover:bg-secondary"><ShoppingBag className="h-7 w-7" strokeWidth={1.5} /></Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-foreground text-xl sm:text-2xl tracking-[0.15em] font-medium">MINHA SACOLA</h1>
        <p className="text-primary text-sm mt-1 pb-4 border-b border-border">
          {count} {count === 1 ? "item" : "itens"}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6">Sua sacola está vazia.</p>
            <Link to="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 text-sm tracking-[0.2em] uppercase rounded-sm">
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <ul className="space-y-4">
                {items.map((item) => {
                  const product = getProduct(item.id);
                  if (!product) return null;
                  return (
                    <li key={`${item.id}-${item.size}`} className="relative border border-border bg-card rounded-md p-4 sm:p-5 flex gap-4">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-secondary/40 rounded-sm flex-shrink-0 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h2 className="text-foreground text-sm sm:text-base leading-snug">{product.name}</h2>
                        <div className="mt-3 inline-flex items-center border border-border rounded-sm px-3 py-1.5 text-sm text-primary">
                          Tamanho: {item.size}
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-sm text-primary">Qtd:</span>
                          <div className="flex items-center border border-border rounded-sm">
                            <button onClick={() => setQty(item.id, item.size, item.qty - 1)} aria-label="Diminuir" className="p-2 text-foreground"><Minus className="h-3 w-3" /></button>
                            <span className="px-3 text-sm w-8 text-center">{item.qty}</span>
                            <button onClick={() => setQty(item.id, item.size, item.qty + 1)} aria-label="Aumentar" className="p-2 text-foreground"><Plus className="h-3 w-3" /></button>
                          </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-3">
                          {product.oldPrice && <span className="text-muted-foreground line-through text-sm">{formatBRL(product.oldPrice)}</span>}
                          <span className="text-price font-semibold">{formatBRL(product.price)}</span>
                        </div>
                      </div>
                      <button onClick={() => remove(item.id, item.size)} aria-label="Remover" className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <Link to="/" className="inline-block mt-6 text-sm text-foreground underline underline-offset-4">
                Continuar comprando
              </Link>
            </div>

            <aside className="border border-border bg-card rounded-md p-6 h-fit">
              <h2 className="text-foreground text-sm tracking-[0.15em] font-semibold">RESUMO DO PEDIDO</h2>
              <div className="mt-5 space-y-3 text-sm pb-5 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-primary">Subtotal ({count} {count === 1 ? "item" : "itens"})</span>
                  <span className="text-foreground">{formatBRL(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary">Frete</span>
                  <span className="text-muted-foreground">Calculado no checkout</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mt-5">
                <span className="text-foreground font-semibold">Total</span>
                <span className="text-foreground font-semibold text-lg">{formatBRL(total)}</span>
              </div>
              <button
                onClick={() => navigate({ to: "/checkout" })}
                className="w-full mt-5 bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase font-medium rounded-sm hover:opacity-90"
              >
                Prosseguir para o pagamento
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Compra 100% segura
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
