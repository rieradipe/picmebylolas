// src/pages/policyPage/PolicyPage.jsx
import { usePolicy } from "../../context/PolicyContext.jsx";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PolicyPage.module.css";
import {
  FaClipboardList,
  FaHelicopter,
  FaUtensils,
  FaCreditCard,
  FaHandsHelping,
  FaExclamationTriangle,
} from "react-icons/fa";

const PolicyPage = () => {
  // 👉 Hooks y estado: SIEMPRE fuera del JSX del return
  const checkboxId = useId();
  const { accepted, setAccepted, signature, setSignature } = usePolicy();
  const [touched, setTouched] = useState(false);
  const firmaOk = (signature || "").trim().length >= 5;
  const nav = useNavigate();
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Políticas de Uso</h1>

      {/* Caja superior con el formulario de aceptación */}
      <section
        aria-labelledby="policy-accept-title"
        style={{
          margin: "12px 0 20px",
          padding: 16,
          border: "1px solid var(--color-line)",
          borderRadius: 12,
          background: "#fff",
          maxWidth: 680,
        }}
      >
        <h2 id="policy-accept-title" style={{ marginTop: 0 }}>
          Aceptación de condiciones de entrega por dron
        </h2>

        <ol style={{ paddingLeft: 18, color: "var(--color-muted)" }}>
          <li>Recoge tu pedido en el punto seguro indicado.</li>
          <li>No toques el dron hasta que deje la comida.</li>
          <li>
            No accedas al área delimitada una vez el dron inicie la marcha.
          </li>
          <li>
            El vuelo solo se ejecuta si aceptas y <b>firmas</b> estas
            condiciones.
          </li>
        </ol>

        <label
          htmlFor={checkboxId}
          style={{ display: "flex", gap: 8, marginTop: 12 }}
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span>Acepto las condiciones de entrega y seguridad.</span>
        </label>

        <div style={{ marginTop: 10 }}>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
            Firma (nombre y apellidos)
          </label>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Ej. Alba Riera"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid var(--color-line)",
            }}
          />
          {touched && !firmaOk && (
            <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 6 }}>
              La firma debe tener al menos 5 caracteres.
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              setTouched(true);
              if (accepted && firmaOk) {
                nav("/cart");
              }
            }}
            disabled={!accepted || !firmaOk}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid var(--color-line)",
              background:
                accepted && firmaOk ? "var(--color-verde)" : "#e5e7eb",
              color: accepted && firmaOk ? "#fff" : "#374151",
              cursor: accepted && firmaOk ? "pointer" : "not-allowed",
            }}
            title={
              accepted && firmaOk
                ? "Aceptación guardada"
                : "Marca y firma para continuar"
            }
          >
            Guardar aceptación
          </button>

          <span style={{ fontSize: 13, color: "var(--color-muted)" }}>
            * Se guarda localmente para poder pagar.
          </span>
        </div>
      </section>

      {/* Resto de la página informativa */}
      <section className={styles.grid}>
        <article className={styles.article}>
          <h2>
            <FaClipboardList className={styles.icons} /> Normas Generales
          </h2>
          <ul>
            <li>
              Regístrate con tus <strong>datos reales</strong>.
            </li>
            <li>
              Mantén tus <strong>credenciales seguras</strong> (no las
              compartas).
            </li>
            <li>
              Actualiza tu <strong>información</strong> en todo momento.
            </li>
          </ul>
        </article>

        <article className={styles.article}>
          <h2>
            <FaHelicopter className={styles.icons} /> Uso del Dron
          </h2>
          <ul>
            <li>El dron dejará tu pedido en el punto seguro asignado.</li>
            <li>No se puede tocar el dron hasta que complete la entrega.</li>
            <li>El vuelo solo inicia si aceptas estas políticas.</li>
          </ul>
        </article>

        <article className={styles.article}>
          <h2>
            <FaUtensils className={styles.icons} /> Solicitud de pedidos
          </h2>
          <p>
            Puedes añadir productos al carrito desde la sección{" "}
            <strong>Solicitar Comida</strong>.
          </p>
          <p>
            El pago es <strong>seguro</strong>.
          </p>
          <p>
            Los productos están limitados a{" "}
            <strong>comida rápida sin alcohol</strong> y{" "}
            <strong>artículos de higiene básica</strong>.
          </p>
        </article>

        <article className={styles.article}>
          <h2>
            <FaCreditCard className={styles.icons} /> Condiciones de Pago
          </h2>
          <ul>
            <li>
              Se realiza una <strong>preautorización</strong> al confirmar el
              pedido y el <strong>cargo final</strong> cuando el dron inicia el
              vuelo.
            </li>
            <li>
              Puedes cancelar sin coste antes del inicio del vuelo; tras el
              despegue no es cancelable.
            </li>
            <li>
              <strong>Reembolsos</strong> solo por no entrega o pedido
              incorrecto/incompleto (proporcional).
            </li>
            <li>
              Precios con <strong>IVA</strong>; verás gastos de servicio/entrega
              antes de pagar.
            </li>
            <li>
              <strong>Pago seguro</strong>: procesado por proveedor certificado
              y datos cifrados.
            </li>
          </ul>
        </article>

        <article className={styles.article}>
          <h2>
            <FaHandsHelping className={styles.icons} /> Solicitud de ayuda
          </h2>
          <ul>
            <li>
              En caso de emergencia, usa el <strong>botón de ayuda</strong> del
              mapa.
            </li>
            <li>
              Nuestro dron o el equipo designado acudirá al{" "}
              <strong>punto seguro</strong>.
            </li>
          </ul>
        </article>

        <article className={styles.article}>
          <h2>
            <FaExclamationTriangle className={styles.icons} /> Seguridad y
            Responsabilidad
          </h2>
          <p>
            Respeta las <strong>zonas de aterrizaje</strong>.
          </p>
          <p>
            No entres en <strong>áreas restringidas</strong> después de iniciar
            un vuelo.
          </p>
          <p>
            La empresa <strong>no se responsabiliza</strong> por el
            incumplimiento de estas normas.
          </p>
        </article>
      </section>
    </main>
  );
};

export default PolicyPage;
