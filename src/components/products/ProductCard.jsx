import { useState, useMemo, useEffect } from "react";
import styles from "./ProductCard.module.css";

const formatMoney = (cents) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    (cents ?? 0) / 100
  );

export default function ProductCard({ product, onAdd }) {
  // 👇 Desestructurar el producto (aquí se define `stock`, `name`, etc.)
  const {
    id,
    name,
    priceCents,
    imageUrl,
    available = true,
    stock,
    category,
  } = product || {};

  // 👇 Estado de disponibilidad
  const inStock = typeof stock === "number" ? stock > 0 : true;
  const disabled = !available || !inStock;

  // 👇 Máximo según stock (o 99)
  const maxQty = useMemo(
    () => (typeof stock === "number" ? Math.max(1, stock) : 99),
    [stock]
  );

  // 👇 Cantidad + modo “discreto”
  const [qty, setQty] = useState(0);
  const [showQty, setShowQty] = useState(false);

  const inc = () => {
    setShowQty(true);
    setQty((q) => Math.min(maxQty, q + 1));
  };

  const dec = () => {
    if (!showQty) return;
    setQty((q) => Math.max(0, q - 1));
  };

  const handleAdd = () => {
    if (disabled || qty === 0) return;
    onAdd?.(product, qty);
    // reset visual tras añadir
    setQty(0);
  };

  // (Opcional) reset global tras pagar
  useEffect(() => {
    const reset = () => setQty(0);
    window.addEventListener("pm:reset-product-qty", reset);
    return () => window.removeEventListener("pm:reset-product-qty", reset);
  }, []);

  return (
    <article
      key={id}
      className={styles.card}
      role="listitem"
      aria-disabled={disabled}
    >
      <header className={styles.header}>
        <h3 className={styles.title}>{name}</h3>
        {category?.name && (
          <span className={styles.badge}>{category.name}</span>
        )}
      </header>

      <div className={styles.media}>
        {imageUrl ? (
          <img
            className={styles.img}
            src={imageUrl}
            alt={name}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder} aria-label="Sin imagen"></div>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.price}>{formatMoney(priceCents)}</span>
        {typeof stock === "number" && (
          <span className={styles.stock} aria-live="polite">
            {stock > 0 ? `Stock: ${stock}` : "Agotado"}
          </span>
        )}
      </div>

      <div
        className={styles.qtyRow}
        aria-label={`Seleccionar cantidad de ${name}`}
      >
        <button
          className={`${styles.qtyBtn} ${styles.dec}`}
          onClick={dec}
          disabled={disabled || !showQty || qty <= 1}
          aria-label="Restar uno"
        >
          -
        </button>

        {/* número ocultable (no mueve el layout) */}
        <span
          className={`${styles.qty} ${!showQty ? styles.qtyHidden : ""}`}
          aria-live="polite"
        >
          {qty}
        </span>

        <button
          className={`${styles.qtyBtn} ${styles.inc}`}
          onClick={inc}
          disabled={disabled || qty >= maxQty}
          aria-label="Sumar uno"
        >
          +
        </button>
      </div>

      <footer className={styles.footer}>
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={disabled}
          aria-label={`Añadir ${qty} ${name} al carrito`}
        >
          Añadir {showQty ? qty : ""}
        </button>
      </footer>
    </article>
  );
}
