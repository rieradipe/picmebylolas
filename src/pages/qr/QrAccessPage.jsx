// src/pages/qr/QrAccessPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QR_KEY = "pm:qr:status";
const today = () => new Date().toISOString().slice(0, 10);

export default function QrAccessPage() {
  const [personas, setPersonas] = useState(1);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // si ya está validado hoy, mostrar estado
    try {
      const data = JSON.parse(localStorage.getItem(QR_KEY));
      if (data && data.validated && data.date === today()) {
        setPersonas(data.persons || 1);
        setValidated(true);
      }
    } catch {}
  }, []);

  const validateNow = () => {
    const p = Math.max(1, parseInt(personas, 10) || 1);
    const token = `qr:${today()}:${Math.random().toString(36).slice(2, 8)}`;
    const status = { validated: true, date: today(), persons: p, token };
    try {
      localStorage.setItem(QR_KEY, JSON.stringify(status));
    } catch {}
    setValidated(true);
  };

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h1>Validación de acceso (QR)</h1>

      {!validated ? (
        <section
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <p style={{ marginTop: 0 }}>
            (Mock) Aquí un operario escanearía tu QR. Para la demo, indica
            cuántas personas sois y pulsa <b>Validar</b>. Esta validación solo
            vale <b>hoy</b>.
          </p>

          <label style={{ display: "block", marginTop: 8 }}>
            Personas
            <input
              type="number"
              min="1"
              value={personas}
              onChange={(e) => setPersonas(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: 6,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </label>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              onClick={validateNow}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "var(--color-verde)",
                color: "#fff",
              }}
            >
              Validar
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#f3f4f6",
              }}
            >
              Volver al mapa
            </button>
          </div>
        </section>
      ) : (
        <section
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <h2 style={{ marginTop: 0 }}>QR validado para hoy ✅</h2>
          <p style={{ margin: "6px 0" }}>
            Personas registradas: <b>{personas}</b>
          </p>
          <small style={{ color: "#6b7280" }}>
            A medianoche se borra automáticamente. Con esta validación podrás
            solicitar ayuda (SOS).
          </small>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#f3f4f6",
              }}
            >
              Volver al mapa
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
