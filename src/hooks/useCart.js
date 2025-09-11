import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useCart() {
  const [items, setItems] = useLocalStorage("pm:cart:items", []);

  const add = useCallback(
    (p, qty = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex((it) => it.id === p.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) };
          return next;
        }
        return [
          ...prev,
          {
            id: p.id,
            sku: p.sku,
            name: p.name,
            priceCents: p.priceCents,
            imageUrl: p.imageUrl,
            qty,
          },
        ];
      });
    },
    [setItems]
  );

  const setQty = useCallback(
    (id, qty) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, Math.min(99, qty)) } : it
        )
      );
    },
    [setItems]
  );

  const remove = useCallback(
    (id) => {
      setItems((prev) => prev.filter((it) => it.id !== id));
    },
    [setItems]
  );
  const clear = useCallback(() => setItems([]), [setItems]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + it.priceCents * it.qty, 0);
    const shipping = items.length ? 250 : 0; // mock 2,50€
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items]);

  return { items, add, setQty, remove, clear, totals };
}
