import ProductCard from "./ProductCard.jsx";
import styles from "./ProductsGrid.module.css";

export default function ProductsGrid({ products = [], onAdd }) {
  if (!products?.length) return <p>No hay productos.</p>;

  return (
    <div className={styles.grid} role="list" aria-label="Listado de productos">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}
