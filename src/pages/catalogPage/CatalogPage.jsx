// src/pages/catalogPage/CatalogPage.jsx
import { useEffect, useState } from "react";
import { Api } from "../../api/ProductsApi.js";
import { useCart } from "../../context/CartContext.jsx";
import Products from "../../components/products/ProductsGrid.jsx";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    Api.listProducts()
      .then((data) => {
        console.log("Productos mock:", data);
        setProducts(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px" }}>
      <h1>Catálogo</h1>
      <Products products={products} onAdd={add} />
      {!products.length && (
        <p style={{ color: "var(--color-muted)" }}>
          No hay productos disponibles.
        </p>
      )}
    </div>
  );
}
