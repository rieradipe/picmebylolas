import Login from "../../components/login/Login.jsx";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  // Al entrar en /login, cerramos sesión previa para evitar confusiones
  const { logout } = useAuth();
  useEffect(() => {
    logout?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Login />;
}
