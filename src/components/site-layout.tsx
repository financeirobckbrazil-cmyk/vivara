import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User } from "lucide-react";
import { type ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground text-center text-xs sm:text-sm py-2.5 px-4 tracking-wide uppercase">
        Frete grátis em compras a partir de R$699.
      </div>

      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <span aria-hidden="true" className="text-brand p-2 -ml-2">
            <Menu className="h-6 w-6" />
          </span>

          <Link to="/" className="flex items-center">
            <span className="font-serif text-2xl font-semibold tracking-[0.18em] text-brand">LIFE <span className="text-[#a58a70]">PANDORA</span></span>
          </Link>

          <div className="flex items-center gap-3 text-brand">
            <span aria-hidden="true" className="p-1">
              <User className="h-5 w-5" />
            </span>
            <span aria-hidden="true" className="p-1">
              <ShoppingBag className="h-5 w-5" />
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-brand text-brand-foreground mt-16 py-8 px-4 text-center text-sm">
        <span className="mb-4 inline-block font-serif text-2xl font-semibold tracking-[0.18em] text-white">LIFE PANDORA</span>
        <p className="opacity-80">© {new Date().getFullYear()} Life Pandora. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
