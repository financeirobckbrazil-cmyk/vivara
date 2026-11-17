
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Life Vivara — Pulseiras e Joias" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <section className="bg-secondary/40 px-4 py-16 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
          Coleção Life
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl text-brand">
          Joias para contar a sua história
        </h1>
        <p className="mt-5 text-muted-foreground">
          Descubra peças especiais para todos os momentos.
        </p>
        <a href="#colecao" className="inline-block mt-8 bg-primary text-primary-foreground px-8 py-3">
          Ver coleção
        </a>
      </section>

      <section id="colecao" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl text-brand">Pulseiras Life</h2>
          <Link to="/carrinho" className="text-brand flex gap-2">
            <ShoppingBag /> Minha sacola
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="text-center py-10 bg-secondary/30">
        <h2 className="font-serif text-2xl text-brand">Precisa de ajuda?</h2>
        <Link to="/contato" className="inline-block mt-4 underline">
          Fale conosco
        </Link>
      </section>
    </SiteLayout>
  );
}
