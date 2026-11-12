import { createContext, useContext, useMemo, useState } from "react";
import db from "../data/db.json";

const AuthContext = createContext(null);
const STORAGE_KEY = "biblioutp-estudiante";

const getSavedUser = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  const parsed = JSON.parse(saved);
  return parsed?.rol === "estudiante" ? parsed : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = (correo, password) => {
    const account = db.usuarios.find((candidate) =>
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
};
