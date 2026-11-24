import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

export function useReservas(usuarioId) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(Boolean(usuarioId));
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    if (!usuarioId) {
      setDatos([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    setError("");
    try {
      const respuesta = await api.get("/prestamos", {
        params: { estudianteId: usuarioId }
      });
      setDatos(respuesta.data);
    } catch (err) {
      setError(err.userMessage || "No se pudieron cargar tus préstamos.");
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const crear = useCallback(async (prestamo) => {
    const respuesta = await api.post("/prestamos", prestamo);
    await recargar();
    return respuesta.data;
  }, [recargar]);

  const cancelar = useCallback(async (id) => {
    const existente = datos.find((item) => String(item.id) === String(id));
    if (!existente || existente.estado !== "pendiente") {
      throw new Error("Solo puedes cancelar solicitudes pendientes.");
    }
    await api.delete(`/prestamos/${id}`);
    await recargar();
  }, [datos, recargar]);

  return { datos, cargando, error, crear, cancelar, recargar };
}
