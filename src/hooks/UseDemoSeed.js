import { useEffect } from "react";

export default function useDemoSeed() {
  useEffect(() => {
    // inventario
    const invKey = "pm:inventory";
    if (!localStorage.getItem(invKey)) {
      const inv = [
        {
          id: "sku-bocadillo",
          name: "Bocadillo mixto",
          stock: 24,
          priceCents: 450,
        },
        { id: "sku-agua", name: "Agua 50cl", stock: 60, priceCents: 120 },
        { id: "sku-kit", name: "Kit higiene", stock: 15, priceCents: 350 },
      ];
      localStorage.setItem(invKey, JSON.stringify(inv));
    }

    // pedidos
    const ordKey = "pm:orders";
    if (!localStorage.getItem(ordKey)) {
      const now = Date.now();
      const orders = [
        {
          id: "PM-" + (now - 1).toString(36).toUpperCase(),
          zone: "A",
          status: "pendiente",
          items: [{ id: "sku-bocadillo", name: "Bocadillo mixto", qty: 2 }],
          totalCents: 900,
          createdAt: now - 1000 * 60 * 8,
        },
        {
          id: "PM-" + (now - 2).toString(36).toUpperCase(),
          zone: "C",
          status: "preparando",
          items: [{ id: "sku-agua", name: "Agua 50cl", qty: 3 }],
          totalCents: 360,
          createdAt: now - 1000 * 60 * 14,
        },
      ];
      localStorage.setItem(ordKey, JSON.stringify(orders));
    }

    // usuarios (para admin)
    const usrKey = "pm:users";
    if (!localStorage.getItem(usrKey)) {
      const users = [
        { id: "u1", name: "alba", email: "alba@example.com", role: "USER" },
        {
          id: "u2",
          name: "camarero",
          email: "staff@example.com",
          role: "CAMARERO",
        },
        { id: "u3", name: "admin", email: "admin@example.com", role: "ADMIN" },
      ];
      localStorage.setItem(usrKey, JSON.stringify(users));
    }
  }, []);
}
