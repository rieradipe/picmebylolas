const MOCK = true;

const mockProducts = [
  {
    id: "f47a-001",
    sku: "SKU-BOC-001",
    name: "Bocadillo mixto",
    slug: "bocadillo-mixto",
    priceCents: 450,
    category: { name: "comida" }, // ← objeto con name
    imageUrl: "", // o una URL real
    stock: 12, // ← número
    available: true, // ← boolean
  },
  {
    id: "f47a-002",
    sku: "SKU-BEB-002",
    name: "Agua 50cl",
    slug: "agua-50cl",
    priceCents: 120,
    category: { name: "bebida" },
    imageUrl: "",
    stock: 50,
    available: true,
  },
  {
    id: "f47a-003",
    sku: "SKU-HIG-003",
    name: "Toallitas bebé",
    slug: "toallitas-bebe",
    priceCents: 290,
    category: { name: "higiene" },
    imageUrl: "",
    stock: 0, // para ver el estado “Agotado”
    available: false,
  },
  {
    id: "f47a-004",
    sku: "SKU-CUR-004",
    name: "Tiritas (10u)",
    slug: "tiritas-10",
    priceCents: 230,
    category: { name: "curas" },
    imageUrl: "",
    stock: 7,
    available: true,
  },
];

// Si más adelante el backend devuelve otra forma (p.ej. category como string),
// adaptar aquí con un mapper:
function mapFromBackend(p) {
  return {
    ...p,
    category:
      typeof p.category === "string" ? { name: p.category } : p.category,
    stock: typeof p.stock === "number" ? p.stock : 0,
    available:
      typeof p.available === "boolean" ? p.available : (p.stock ?? 0) > 0,
  };
}

export const Api = {
  async listProducts() {
    if (MOCK) return mockProducts;
    // const res = await fetch(import.meta.env.VITE_API_URL + "/api/products");
    // if (!res.ok) throw new Error("Error productos");
    // const data = await res.json();
    // return Array.isArray(data) ? data.map(mapFromBackend) : [];
  },
};
