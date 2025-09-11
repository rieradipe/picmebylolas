import { useEffect, useState } from "react";
import styles from "./InventoryPage.module.css";

const INV_KEY = "pm:inventory";

export default function InventoryPage() {
  const [inv, setInv] = useState([]);

  useEffect(() => {
    try {
      setInv(JSON.parse(localStorage.getItem(INV_KEY)) || []);
    } catch {
      setInv([]);
    }
  }, []);

  const save = (next) => {
    setInv(next);
    try {
      localStorage.setItem(INV_KEY, JSON.stringify(next));
    } catch {}
  };

  const changeStock = (id, delta) => {
    const next = inv.map((p) =>
      p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
    );
    save(next);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Inventario — Staff</h1>
      {!inv.length && <p className={styles.empty}>Inventario vacío.</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Producto</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inv.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.stock}</td>
              <td>{(p.priceCents / 100).toFixed(2)} €</td>
              <td className={styles.actions}>
                <button onClick={() => changeStock(p.id, -1)}>-1</button>
                <button onClick={() => changeStock(p.id, +1)}>+1</button>
                <button onClick={() => changeStock(p.id, +10)}>+10</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
