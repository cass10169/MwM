"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  id: string;
  variantId?: string;
  slug: string;
  title: string;
  material: string;
  size: string;
  finish?: string;
  frame?: string;
  price: number;
  quantity: number;
};
type CartContextValue = {
  items: CartLine[];
  count: number;
  ready: boolean;
  addItem: (item: Omit<CartLine, "id" | "quantity">) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "mwm-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        setItems(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
      } catch {
        setItems([]);
      }
      setReady(true);
    });
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, ready]);
  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (item) =>
        setItems((current) => {
          const key =
            item.variantId ?? `${item.slug}-${item.material}-${item.size}-${item.finish ?? ""}-${item.frame ?? ""}`;
          const existing = current.find((line) => line.id === key);
          return existing
            ? current.map((line) => (line.id === key ? { ...line, quantity: line.quantity + 1 } : line))
            : [...current, { ...item, id: key, quantity: 1 }];
        }),
      removeItem: (id) => setItems((current) => current.filter((line) => line.id !== id)),
      setQuantity: (id, quantity) =>
        setItems((current) =>
          quantity < 1
            ? current.filter((line) => line.id !== id)
            : current.map((line) => (line.id === id ? { ...line, quantity } : line)),
        ),
      clear: () => setItems([]),
    }),
    [items, ready],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
