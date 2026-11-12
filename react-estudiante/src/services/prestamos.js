import { Prestamo, validarSolicitudPrestamo } from "../../../core-js/modelos.js";
import { esCodigoAlumno, esCorreoInstitucional } from "../../../core-js/validadores.js";

const STORAGE_KEY = "biblioutp-prestamos";

export const cargarPrestamos = (prestamosIniciales) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : prestamosIniciales;
};

export const guardarPrestamos = (prestamos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prestamos));
};

export const crearSolicitud = ({ libros, prestamos, usuario, libroId }) => {
  const errores = {};
  if (!esCorreoInstitucional(usuario.correo)) {
    errores.cuenta = "La cuenta debe usar el correo institucional UTP.";
  }
  if (!esCodigoAlumno(usuario.codigo)) {
    errores.cuenta = "El código del estudiante no tiene el formato esperado.";
  }

  const libro = libros.find((item) => String(item.id) === String(libroId));
  const reglas = validarSolicitudPrestamo({ usuario, prestamos, libro });
  if (reglas.length) errores.libro = reglas.join(" ");
  if (Object.keys(errores).length) return { errores };

  const id = Math.max(0, ...prestamos.map((item) => Number(item.id) || 0)) + 1;
  const ahora = new Date();
  const fechaLocal = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
  const prestamo = new Prestamo({
    id,
    codigo: `PRE-${String(id).padStart(4, "0")}`,
    libroId: libro.id,
    estudianteId: usuario.id,
    fechaSolicitud: fechaLocal
  });
  return { prestamo };
};
