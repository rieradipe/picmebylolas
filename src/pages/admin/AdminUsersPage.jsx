// src/pages/admin/AdminUserPage.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "./AdminUserPage.module.css";

const USERS_KEY = "pm:users";

// ROLES canónicos para la app
const ROLES = ["USER", "WAITER", "ADMIN"];

// Etiquetas para UI
const ROLE_LABEL = {
  USER: "Usuario",
  WAITER: "Camarero",
  ADMIN: "Admin",
};

// Normaliza cualquier variante vieja al canónico
const toCanonicalRole = (raw) => {
  const r = (raw || "USER").toString().trim().toUpperCase();
  if (r === "CAMARERO" || r === "CAMARERA") return "WAITER";
  return ROLES.includes(r) ? r : "USER";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      // migración a roles canónicos
      const migrated = arr.map((u) => ({
        ...u,
        role: toCanonicalRole(u.role),
      }));
      setUsers(migrated);
      localStorage.setItem(USERS_KEY, JSON.stringify(migrated));
    } catch {
      setUsers([]);
    }
  }, []);

  const save = (next) => {
    setUsers(next);
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
    } catch {}
  };

  const changeRole = (id, role) => {
    const canon = toCanonicalRole(role);
    const next = users.map((u) => (u.id === id ? { ...u, role: canon } : u));
    save(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        ROLE_LABEL[toCanonicalRole(u.role)].toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Usuarios · Admin</h1>
        <div className={styles.tools}>
          <input
            className={styles.search}
            placeholder="Buscar por nombre, email o rol…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {!filtered.length ? (
        <p className={styles.empty}>No hay usuarios que coincidan.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th className={styles.colRole}>Rol</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.avatar} aria-hidden>
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className={styles.name}>{u.name || "—"}</div>
                        <div className={styles.idMuted}>id: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.email}>{u.email || "—"}</td>
                  <td>
                    <select
                      className={styles.roleSelect}
                      value={toCanonicalRole(u.role)}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
