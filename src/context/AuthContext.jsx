// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const LS_KEY = "pm:auth";
const AuthContext = createContext(null);

// Función para normalizar los roles a valores canónicos
const normalizeRole = (raw) => {
  const r = (raw || "USER").toString().trim().toUpperCase();
  if (r === "WAITER" || r === "CAMARERA") return "CAMARERO";
  if (r === "ADMIN") return "ADMIN";
  return "USER"; // fallback
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage al arrancar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setUser({ ...saved, role: normalizeRole(saved.role) });
      }
    } catch {}
  }, []);

  // Login: guardar usuario en estado + localStorage
  const login = ({ name, email, role }) => {
    const u = {
      id: crypto.randomUUID(),
      name: name?.trim() || "Invitado",
      email: email?.trim() || "",
      role: normalizeRole(role),
    };
    setUser(u);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(u));
    } catch {}
  };

  // Logout: limpiar estado + localStorage
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  };

  // Comprobar permisos
  const isAllowed = (allow = []) => {
    if (!user) return false;
    if (!allow?.length) return true;
    return allow.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAllowed }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
