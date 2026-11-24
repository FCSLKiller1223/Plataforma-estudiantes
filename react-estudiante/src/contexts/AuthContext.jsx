import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "biblioutp-estudiante";

function getSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const user = saved ? JSON.parse(saved) : null;
    return user?.rol === "estudiante" ? user : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = async (correo, password) => {
    const response = await api.get("/usuarios", { params: { correo } });
    const account = response.data.find((candidate) =>
      candidate.correo.toLowerCase() === correo.trim().toLowerCase()
      && candidate.password === password
      && candidate.rol === "estudiante"
    );
    if (!account) return false;

    const student = {
      id: account.id,
      nombre: account.nombre,
      correo: account.correo,
      codigo: account.codigo,
      rol: account.rol
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    setUser(student);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}
