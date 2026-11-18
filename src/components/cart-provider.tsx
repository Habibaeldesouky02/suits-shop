"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { SHOP, type Fit, type Size } from "@/lib/config";
import { getProduct } from "@/lib/products";

export type CartItem = {
  productId: string;
  colorId: string;
  size: Size;
  fit: Fit;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  /** False during server rendering and the first paint, before the saved cart is read. */
  ready: boolean;
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "fastsuit-cart";
const EMPTY: CartItem[] = [];
const CartContext = createContext<CartContextValue | null>(null);

export function cartKey(item: Pick<CartItem, "productId" | "colorId" | "size" | "fit">) {
  return `${item.productId}|${item.colorId}|${item.size}|${item.fit}`;
}

function clampQuantity(n: number) {
  return Math.max(1, Math.min(SHOP.maxQuantityPerItem, Math.floor(n)));
}

/* ---- A tiny store that keeps the cart in localStorage (and in sync across tabs) ---- */

const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;

function readCart(): CartItem[] {
  if (cache) return cache;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    // Drop anything that no longer exists in the catalogue.
    cache = Array.isArray(saved) ? saved.filter((i: CartItem) => getProduct(i.productId)) : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function writeCart(update: (items: CartItem[]) => CartItem[]) {
  cache = update(readCart());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage can be unavailable (private mode); the cart still works for this visit.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCart, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const addItem = useCallback((item: CartItem) => {
    writeCart((current) => {
      const key = cartKey(item);
      if (current.some((i) => cartKey(i) === key)) {
        return current.map((i) =>
          cartKey(i) === key ? { ...i, quantity: clampQuantity(i.quantity + item.quantity) } : i,
        );
      }
      return [...current, { ...item, quantity: clampQuantity(item.quantity) }];
    });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    writeCart((current) => current.map((i) => (cartKey(i) === key ? { ...i, quantity: clampQuantity(quantity) } : i)));
  }, []);

  const removeItem = useCallback((key: string) => {
    writeCart((current) => current.filter((i) => cartKey(i) !== key));
  }, []);

  const clear = useCallback(() => writeCart(() => []), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + (getProduct(i.productId)?.price ?? 0) * i.quantity, 0);
    return { items, ready, count, subtotal, addItem, updateQuantity, removeItem, clear };
  }, [items, ready, addItem, updateQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
