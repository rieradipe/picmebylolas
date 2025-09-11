import { useState, useEffect } from "react";
import ShoppingCart from "../../components/shoppingCart/ShoppingCart.jsx";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const [checkout, setCheckout] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("pm:checkout")) || {
          nombre: "",
          apellidos: "",
          email: "",
        }
      );
    } catch {
      return { nombre: "", apellidos: "", email: "" };
    }
  });

  const [touched, setTouched] = useState({
    nombre: false,
    apellidos: false,
    email: false,
  });

  useEffect(() => {
    localStorage.setItem("pm:checkout", JSON.stringify(checkout));
  }, [checkout]);

  const isNameOk = (s) => (s || "").trim().length >= 2;
  const isEmailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((e || "").trim());

  const checkoutValid =
    isNameOk(checkout.nombre) &&
    isNameOk(checkout.apellidos) &&
    isEmailOk(checkout.email);

  return (
    <div className={styles.container}>
      <h1>Carrito</h1>

      <section aria-labelledby="checkout-title" className={styles.checkout}>
        <h2 id="checkout-title" className={styles.h2}>
          Datos para el pedido
        </h2>

        <div className={styles.grid}>
          <label>
            <span>Nombre</span>
            <input
              className={styles.input}
              value={checkout.nombre}
              onChange={(e) =>
                setCheckout({ ...checkout, nombre: e.target.value })
              }
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              autoComplete="given-name"
              aria-invalid={touched.nombre && !isNameOk(checkout.nombre)}
            />
            {touched.nombre && !isNameOk(checkout.nombre) && (
              <span className={styles.hintError}>
                Introduce al menos 2 caracteres.
              </span>
            )}
          </label>

          <label>
            <span>Apellidos</span>
            <input
              className={styles.input}
              value={checkout.apellidos}
              onChange={(e) =>
                setCheckout({ ...checkout, apellidos: e.target.value })
              }
              onBlur={() => setTouched((t) => ({ ...t, apellidos: true }))}
              autoComplete="family-name"
              aria-invalid={touched.apellidos && !isNameOk(checkout.apellidos)}
            />
            {touched.apellidos && !isNameOk(checkout.apellidos) && (
              <span className={styles.hintError}>
                Introduce al menos 2 caracteres.
              </span>
            )}
          </label>

          <label>
            <span>Email</span>
            <input
              className={styles.input}
              value={checkout.email}
              onChange={(e) =>
                setCheckout({ ...checkout, email: e.target.value })
              }
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoComplete="email"
              inputMode="email"
              aria-invalid={touched.email && !isEmailOk(checkout.email)}
            />
            {touched.email && !isEmailOk(checkout.email) && (
              <span className={styles.hintError}>
                Introduce un email válido (ej. nombre@dominio.com).
              </span>
            )}
          </label>
        </div>
      </section>

      <ShoppingCart checkout={checkout} checkoutValid={checkoutValid} />
    </div>
  );
}
