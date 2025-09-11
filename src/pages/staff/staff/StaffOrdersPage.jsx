import { useEffect, useState } from "react";
import styles from "./StaffOrdersPage.module.css";

const ORDERS_KEY = "pm:orders";

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      setOrders(raw ? JSON.parse(raw) : []);
    } catch {
      setOrders([]);
    }
  }, []);

  const save = (next) => {
    setOrders(next);
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    } catch {}
  };

  const changeStatus = (id, status) => {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    save(next);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Pedidos · Staff</h1>

      {!orders.length && <p className={styles.empty}>No hay pedidos.</p>}

      {orders.map((o) => (
        <article key={o.id} className={styles.card}>
          <header className={styles.cardHeader}>
            <div className={styles.idZone}>
              <span className={styles.orderId}>#{o.id}</span>
              <span className={styles.zone}>
                Zona <b>{o.zone}</b>
              </span>
            </div>

            <span
              className={`${styles.status} ${
                o.status === "entregado" ? styles.sDelivered : styles.sDefault
              }`}
            >
              {o.status}
            </span>
          </header>

          <ul className={styles.items}>
            {o.items.map((it) => (
              <li key={it.id}>
                <span>{it.name}</span>
                <span className={styles.qty}>× {it.qty}</span>
              </li>
            ))}
          </ul>

          {o.status !== "entregado" ? (
            <div className={styles.actions}>
              <button
                className={styles.btn}
                onClick={() => changeStatus(o.id, "pendiente")}
              >
                Pendiente
              </button>
              <button
                className={styles.btn}
                onClick={() => changeStatus(o.id, "preparando")}
              >
                Preparando
              </button>
              <button
                className={styles.btn}
                onClick={() => changeStatus(o.id, "enviado")}
              >
                Enviado
              </button>
              <button
                className={styles.btn}
                onClick={() => changeStatus(o.id, "entregado")}
              >
                Marcar como entregado
              </button>
            </div>
          ) : (
            <div className={styles.deliveredBadge} aria-live="polite">
              <span className={styles.check} aria-hidden>
                ✅
              </span>
              Pedido entregado
            </div>
          )}
        </article>
      ))}
    </main>
  );
}
