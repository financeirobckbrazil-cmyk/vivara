
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "sonner";
import "./styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Life Vivara" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <CartProvider>
          <Outlet />
          <Toaster richColors position="top-center" />
        </CartProvider>
        <Scripts />
      </body>
    </html>
  );
}
