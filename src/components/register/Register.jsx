import styles from "./Register.module.css";

export default function Register({ open, onClose, onSubmit }) {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      nombre: f.get("nombre")?.trim(),
      apellidos: f.get("apellidos")?.trim(),
      telefono: f.get("telefono")?.trim(),
      email: f.get("email")?.trim(),
      iban: f.get("iban")?.trim(),
      password: f.get("password")?.trim(),
    };
    if (!data.email || !data.password) return;
    onSubmit(data); // se lo mandas al padre (CatalogPage u otra vista)
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className={styles.modal} onClick={stop}>
        <h2 className={styles.title}>Crea tu cuenta</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label className={styles.label}>
              Nombre
              <input name="nombre" required />
            </label>
            <label className={styles.label}>
              Apellidos
              <input name="apellidos" required />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Teléfono
              <input name="telefono" type="tel" required />
            </label>
            <label className={styles.label}>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              IBAN
              <input
                name="iban"
                pattern="^[A-Z]{2}\\d{22}$"
                placeholder="ES12 3456 7890 1234 5678 9012"
                required
              />
            </label>
            <label className={styles.label}>
              Contraseña
              <input
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  );
}
