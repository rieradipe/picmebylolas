import { createContext, useContext, useMemo, useState } from "react";
const CartCtx = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  function add(product, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          qty,
        },
      ];
    });
  }
  function remove(id) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }
  function inc(id) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  }
  function dec(id) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
    );
  }

  const totalCents = useMemo(
    () => items.reduce((acc, i) => acc + i.priceCents * i.qty, 0),
    [items]
  );
  const value = { items, add, remove, inc, dec, totalCents };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
