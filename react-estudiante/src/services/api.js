import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const mensajes = {
      400: "La solicitud contiene datos incorrectos.",
      401: "Tu sesión no está autorizada para realizar esta acción.",
      403: "No tienes permisos para realizar esta acción.",
      404: "No se encontró el recurso solicitado.",
      409: "La operación genera un conflicto con los datos actuales.",
      500: "El servidor encontró un problema. Inténtalo más tarde."
    };
    error.userMessage = mensajes[status] || (
      error.code === "ECONNABORTED" || !error.response
        ? "No se pudo conectar con la API. Verifica que JSON Server esté activo."
        : "Ocurrió un error al procesar la solicitud."
    );
    return Promise.reject(error);
  }
);
