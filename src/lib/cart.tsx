import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products, type Product } from "./products";

export type CartItem = { id: string; size: string; qty: number };
export type Order = { id: string; date: string; items: CartItem[]; total: number };

type CartCtx = {
  items: CartItem[];
  orders: Order[];
  add: (id: string, size: string) => void;
  remove: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  clear: () => void;
  checkout: () => Order | null;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "life-vivara-cart";
const OKEY = "life-vivara-orders";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem(KEY);
      if (c) setItems(JSON.parse(c));
      const o = localStorage.getItem(OKEY);
      if (o) setOrders(JSON.parse(o));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem(OKEY, JSON.stringify(orders));
  }, [orders]);

  const add = (id: string, size: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id && i.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { id, size, qty: 1 }];
    });
  };

  const remove = (id: string, size: string) =>
    setItems((p) => p.filter((i) => !(i.id === id && i.size === size)));

  const setQty = (id: string, size: string, qty: number) =>
    setItems((p) =>
      p.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, qty) } : i)),
    );

  const clear = () => setItems([]);

  const lookup = (id: string): Product | undefined => products.find((p) => p.id === id);
  const total = items.reduce((sum, i) => sum + (lookup(i.id)?.price ?? 0) * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const checkout = (): Order | null => {
    if (items.length === 0) return null;
    const order: Order = {
      id: `LV${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
    };
    setOrders((p) => [order, ...p]);
    setItems([]);
    return order;
  };

  return (
    <Ctx.Provider value={{ items, orders, add, remove, setQty, clear, checkout, count, total }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
