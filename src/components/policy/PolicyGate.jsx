import { useId, useState } from "react";
import { usePolicy } from "../../context/PolicyContext.jsx";
import styles from "./PolicyGate.module.css";

export default function PolicyGate({ onAccepted }) {
  const { accepted, setAccepted, signature, setSignature } = usePolicy();
  const checkboxId = useId();
  const [touched, setTouched] = useState(false);

  const disabled = !accepted || signature.trim().length < 5;

  return (
    <div className={styles.card}>
      <h1 className={styles.h1}>Condiciones de entrega por dron</h1>

      <ol className={styles.list}>
        <li>
          Recoge tu pedido <b>en el punto indicado</b> del merendero.
        </li>
        <li>
          <b>No toques el dron</b> hasta que deje la comida en el suelo.
        </li>
        <li>
          Una vez el dron inicia la marcha, <b>no puedes acceder</b> al área
          delimitada.
        </li>
        <li>
          El vuelo solo se ejecuta si esta política está{" "}
          <b>aceptada y firmada</b>.
        </li>
      </ol>

      <label htmlFor={checkboxId} className={styles.check}>
        <input
          id={checkboxId}
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span>Acepto las condiciones de entrega y seguridad.</span>
      </label>

      <label className={styles.label}>
        Firma (nombre y apellidos)
        <input
          className={styles.input}
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Ej. Alba Riera"
        />
        {touched && signature.trim().length < 5 && (
          <span className={styles.hintError}>
            La firma debe tener al menos 5 caracteres.
          </span>
        )}
      </label>

      <button
        className={styles.btn}
        disabled={disabled}
        onClick={() => onAccepted?.()}
      >
        Guardar aceptación
      </button>
    </div>
  );
}
