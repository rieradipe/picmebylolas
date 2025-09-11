import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Login.module.css";

const ROLES = [
  { value: "USER", label: "Usuario" },
  { value: "WAITER", label: "Camarero" },
  { value: "ADMIN", label: "Administrador" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  const submit = (e) => {
    e.preventDefault();
    login({ name, email, role });

    if (role === "WAITER") navigate("/staff/orders");
    else if (role === "ADMIN") navigate("/admin/users");
    else navigate("/map");
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Acceso</h1>
      <form onSubmit={submit} className={styles.form}>
        <label>
          Nombre
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Rol
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.btn}>
          Entrar
        </button>
      </form>
    </main>
  );
}
