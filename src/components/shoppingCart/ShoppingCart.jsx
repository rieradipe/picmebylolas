import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { usePolicy } from "../../context/PolicyContext.jsx";
import Swal from "sweetalert2";
import styles from "./ShoppingCart.module.css";

function formatCents(c) {
  const cents = Number.isFinite(c) ? c : 0;
  return (cents / 100).toFixed(2) + " €";
}

export default function ShoppingCart({ checkout, checkoutValid }) {
  const { items, inc, dec, remove, totalCents, clear } = useCart();
  const { accepted, signature } = usePolicy();

  const firmaOk = (signature || "").trim().length >= 5;
  const canPay =
    items.length > 0 && accepted === true && firmaOk && checkoutValid === true;

  const doPay = async () => {
    if (!canPay) return;

    const orderId = "PM-" + Date.now().toString(36).toUpperCase();
    const etaMinutes = 8 + Math.floor(Math.random() * 7);

    const payload = {
      zone: localStorage.getItem("pm:order:zone") || null,
      instructionsAccepted: true,
      contact: {
        nombre: (checkout?.nombre || "").trim(),
        apellidos: (checkout?.apellidos || "").trim(),
        email: (checkout?.email || "").trim(),
      },
      items: items.map((it) => ({
        id: it.id,
        sku: it.sku,
        name: it.name,
        qty: it.qty,
        priceCents: it.priceCents,
      })),
      totalCents,
      orderId,
      etaMinutes,
    };

    console.log("Pedido simulado:", payload);

    await Swal.fire({
      icon: "success",
      title: "¡Pedido confirmado!",
      html: `
        <div style="text-align:left">
          <p><b>Nº de pedido:</b> ${orderId}</p>
          <p><b>Entrega estimada:</b> ~ ${etaMinutes} min</p>
          <p>Recoge tu pedido en el <b>punto seguro</b> de la zona seleccionada.</p>
        </div>
      `,
      confirmButtonText: "Aceptar",
      background: "#fff",
    });

    if (typeof clear === "function") clear();
    window.dispatchEvent(new Event("pm:reset-product-qty"));
  };

  if (!items.length) return <p>Tu carrito está vacío.</p>;

  return (
    <section className={styles.wrap}>
      {items.map((it) => (
        <div key={it.id} className={styles.item}>
          <div>
            <strong>{it.name}</strong>
            <div className={styles.priceMuted}>
              {formatCents(it.priceCents)} × {it.qty}
            </div>
          </div>
          <div className={styles.qtyWrap}>
            <button onClick={() => dec(it.id)} aria-label={`Restar ${it.name}`}>
              −
            </button>
            <span aria-live="polite">{it.qty}</span>
            <button onClick={() => inc(it.id)} aria-label={`Sumar ${it.name}`}>
              ＋
            </button>
            <button
              onClick={() => remove(it.id)}
              aria-label={`Quitar ${it.name}`}
            >
              Quitar
            </button>
          </div>
        </div>
      ))}

      <h3 className={styles.total}>Total: {formatCents(totalCents)}</h3>

      {!accepted && (
        <p role="alert" className={`${styles.alert} ${styles.alertWarn}`}>
          Debes aceptar la política antes de pagar.{" "}
          <Link
            to="/policy"
            style={{ textDecoration: "underline", fontWeight: 600 }}
          >
            Ir a Política
          </Link>
        </p>
      )}

      {accepted && !firmaOk && (
        <p className={`${styles.alert} ${styles.alertError}`}>
          La firma de la política es obligatoria.
        </p>
      )}

      {accepted && firmaOk && checkoutValid === false && (
        <p className={`${styles.alert} ${styles.alertError}`}>
          Completa nombre, apellidos y un email válido para continuar.
        </p>
      )}

      <div className={styles.cta}>
        <button
          onClick={doPay}
          disabled={!canPay}
          aria-live="polite"
          className={`${styles.payBtn} ${!canPay ? styles.payBtnDisabled : ""}`}
          title={canPay ? "Proceder al pago" : "Requisitos pendientes"}
        >
          Pagar
        </button>
      </div>
    </section>
  );
}
