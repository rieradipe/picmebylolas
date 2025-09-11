import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Hamburger.module.css";

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const doLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const closeAnd = (fn) => () => {
    setOpen(false);
    fn?.();
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.burger}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="pm-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}

      <nav
        id="pm-menu"
        className={`${styles.panel} ${open ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <header className={styles.header}>
          <span className={styles.title}>Menú</span>
          <button
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <ul className={styles.list} onClick={() => setOpen(false)}>
          <li>
            <Link to="/map">Mapa</Link>
          </li>
          <li>
            <Link to="/policy">Políticas de Uso</Link>
          </li>
          <li>
            <Link to="/qr">Validar QR</Link>
          </li>

          {/* Acceso (solo cuando NO hay sesión) */}
          {!user && (
            <li>
              <Link to="/login">Acceso staff</Link>
            </li>
          )}

          {/* Opciones de staff/admin */}
          {(user?.role === "WAITER" || user?.role === "ADMIN") && (
            <>
              <li className={styles.sectionLabel}>Admin</li>
              <li>
                <Link to="/staff/orders">Pedidos (Staff)</Link>
              </li>
              <li>
                <Link to="/staff/inventory">Inventario</Link>
              </li>
            </>
          )}

          {/* Solo para ADMIN */}
          {user?.role === "ADMIN" && (
            <li>
              <Link to="/admin/users">Usuarios</Link>
            </li>
          )}
        </ul>

        {user && (
          <div className={styles.footer}>
            <div className={styles.userBadge}>
              <span className={styles.dot} />
              Sesión: <b>{user.role}</b>
            </div>
            <button className={styles.logout} onClick={closeAnd(doLogout)}>
              Salir
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
