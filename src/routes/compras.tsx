import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { useCart } from "@/lib/cart";
import { formatBRL, getProduct } from "@/lib/products";

export const Route = createFileRoute("/compras")({
  head: () => ({ meta: [{ title: "Minhas Compras — Life Vivara" }] }),
  component: ComprasPage,
});

function ComprasPage() {
  const { orders } = useCart();
  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-brand text-center mb-8">Minhas Compras</h1>
        {orders.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-sm bg-card">
            <p className="text-muted-foreground mb-6">Você ainda não fez nenhuma compra.</p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 text-sm tracking-[0.2em] uppercase rounded-sm"
            >
              Começar a comprar
            </Link>
          </div>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li key={order.id} className="border border-border bg-card rounded-sm p-5">
                <div className="flex justify-between items-baseline mb-4 pb-3 border-b border-border">
                  <div>
                    <div className="font-serif text-brand">Pedido {order.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-price font-semibold">{formatBRL(order.total)}</div>
                </div>
                <ul className="space-y-2">
                  {order.items.map((it, idx) => {
                    const p = getProduct(it.id);
                    if (!p) return null;
                    return (
                      <li key={idx} className="flex gap-3 text-sm">
                        <img src={p.image} alt="" loading="lazy" className="w-12 h-12 object-contain bg-secondary/40 rounded-sm" />
                        <div className="flex-1">
                          <div className="text-brand">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Tam. {it.size} · {it.qty}x · {formatBRL(p.price)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
