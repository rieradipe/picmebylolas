// src/pages/mapPage/MapPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./MapPage.module.css";
import mapaImg from "../../assets/images/mapaInteractivo.png";

const QR_KEY = "pm:qr:status";
const today = () => new Date().toISOString().slice(0, 10);

const isQrValidToday = () => {
  try {
    const data = JSON.parse(localStorage.getItem(QR_KEY));
    return !!data && data.validated === true && data.date === today();
  } catch {
    return false;
  }
};

const getQrInfo = () => {
  try {
    return JSON.parse(localStorage.getItem(QR_KEY)) || null;
  } catch {
    return null;
  }
};

const clearQrIfExpired = () => {
  try {
    const data = JSON.parse(localStorage.getItem(QR_KEY));
    if (data && data.date !== today()) localStorage.removeItem(QR_KEY);
  } catch {}
};

const genId = () => Math.random().toString(36).slice(2, 8);

export default function MapPage() {
  const navigate = useNavigate();
  const qrOk = isQrValidToday();
  const qrInfo = getQrInfo();

  useEffect(() => {
    // Limpia validaciones de días anteriores
    clearQrIfExpired();
  }, []);

  // Ir a catálogo guardando la zona (A/B según tu mapa actual)
  const selectZone = (zone) => {
    try {
      localStorage.setItem("pm:order:zone", zone);
    } catch {}
    navigate("/catalog");
  };

  // SOS: solo si el QR de entrada está validado hoy
  const pedirSOS = async (zone) => {
    if (!isQrValidToday()) {
      const r = await Swal.fire({
        icon: "info",
        title: "Necesitas validar el QR de entrada",
        html: `
          <p style="margin:0 0 6px">
            Para evitar avisos falsos, valida tu QR al entrar al parque.
          </p>
          <small style="color:#6b7280">
            La validación solo es válida <b>hoy</b> y se borra por la noche.
          </small>
        `,
        showCancelButton: true,
        confirmButtonText: "Validar ahora",
        cancelButtonText: "Cancelar",
        background: "#fff",
      });
      if (r.isConfirmed) navigate("/qr");
      return;
    }

    // Registrar parte SOS (mock)
    const parte = {
      id: `sos:${zone}:${Date.now()}:${genId()}`,
      zone,
      ts: Date.now(),
      qr: qrInfo
        ? { date: qrInfo.date, persons: qrInfo.persons, token: qrInfo.token }
        : null,
    };
    try {
      localStorage.setItem("pm:sos:last", JSON.stringify(parte));
    } catch {}

    await Swal.fire({
      icon: "warning",
      title: "Ayuda en camino",
      text: "Mantén la calma y espera en tu posición",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#d33",
      background: "#fff5f5",
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nuestras Instalaciones</h1>

      {/* Aviso estado QR (opción B: no redirige, solo informa y da acceso) */}
      {!qrOk ? (
        <div
          role="alert"
          style={{
            margin: "8px 0 12px",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #fef3c7",
            background: "#fffbeb",
            color: "#92400e",
          }}
        >
          Antes de usar SOS debes
          <button
            onClick={() => navigate("/qr")}
            style={{
              marginLeft: 6,
              textDecoration: "underline",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#92400e",
            }}
          >
            validar tu QR de entrada
          </button>
          . La validación solo vale para un dia, se elimina a las 21h.
        </div>
      ) : (
        <div
          aria-live="polite"
          style={{
            margin: "8px 0 12px",
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #dcfce7",
            background: "#f0fdf4",
            color: "#166534",
            fontSize: 14,
          }}
        >
          ✅ QR validado para hoy
          {qrInfo?.persons ? ` • ${qrInfo.persons} persona(s)` : ""}. Puedes
          solicitar ayuda (SOS) si lo necesitas.
        </div>
      )}

      <p className={styles.description}>
        Disfruta de nuestras áreas de picnic, actividades al aire libre y zonas
        seguras para la entrega por dron. Haz clic en los puntos marcados para
        solicitar ayuda o pedir comida.
      </p>

      <div className={styles.mapWrapper}>
        <img src={mapaImg} alt="Mapa del parque" className={styles.map} />

        {/* SOS (4 zonas A–D) */}
        <button
          className={`${styles.marker} ${styles.ayuda} ${styles.ayuda1}`}
          onClick={() => pedirSOS("A")}
          title={qrOk ? "SOS (Zona A)" : "Valida tu QR para usar SOS"}
          aria-disabled={!qrOk}
        >
          SOS
        </button>
        <button
          className={`${styles.marker} ${styles.ayuda} ${styles.ayuda2}`}
          onClick={() => pedirSOS("B")}
          title={qrOk ? "SOS (Zona B)" : "Valida tu QR para usar SOS"}
          aria-disabled={!qrOk}
        >
          SOS
        </button>
        <button
          className={`${styles.marker} ${styles.ayuda} ${styles.ayuda3}`}
          onClick={() => pedirSOS("C")}
          title={qrOk ? "SOS (Zona C)" : "Valida tu QR para usar SOS"}
          aria-disabled={!qrOk}
        >
          SOS
        </button>
        <button
          className={`${styles.marker} ${styles.ayuda} ${styles.ayuda4}`}
          onClick={() => pedirSOS("D")}
          title={qrOk ? "SOS (Zona D)" : "Valida tu QR para usar SOS"}
          aria-disabled={!qrOk}
        >
          SOS
        </button>

        {/* Comida (2 merenderos que ya dibujaste) */}
        <button
          className={`${styles.marker} ${styles.comida} ${styles.comida1}`}
          onClick={() => selectZone("A")}
          aria-label="Pedir comida en zona A"
          title="Zona A"
        >
          🍔
        </button>
        <button
          className={`${styles.marker} ${styles.comida} ${styles.comida2}`}
          onClick={() => selectZone("B")}
          aria-label="Pedir comida en zona B"
          title="Zona B"
        >
          🍔
        </button>
      </div>
    </div>
  );
}
