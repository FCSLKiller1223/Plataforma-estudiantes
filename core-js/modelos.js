const aMinutos = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
};

export class Usuario {
  constructor({ id, nombre, correo, codigo, rol }) {
    Object.assign(this, { id, nombre, correo, codigo, rol });
  }
  get esAdministrador() { return this.rol === "admin"; }
  get esEstudiante() { return this.rol === "estudiante"; }
}

export class Libro {
  constructor({ id, titulo, autor, categoria, editorial = "", anio = null,
    isbn = "", descripcion = "", ejemplares = 1, disponibles = 1, estado = "activo" }) {
    Object.assign(this, {
      id, titulo, autor, categoria, editorial, anio, isbn,
      descripcion, ejemplares: Number(ejemplares), disponibles: Number(disponibles), estado
    });
  }
  get tieneDisponibilidad() { return this.estado === "activo" && this.disponibles > 0; }
  prestar() {
    if (!this.tieneDisponibilidad) throw new Error("El libro no tiene ejemplares disponibles.");
    this.disponibles -= 1;
  }
  devolver() {
    if (this.disponibles >= this.ejemplares) throw new Error("No hay préstamos pendientes de devolución.");
    this.disponibles += 1;
  }
}

export class Prestamo {
  constructor({ id, codigo, libroId, estudianteId, fechaSolicitud, fechaPrestamo = null,
    fechaDevolucion = null, estado = "pendiente" }) {
    Object.assign(this, {
      id, codigo, libroId, estudianteId, fechaSolicitud,
      fechaPrestamo, fechaDevolucion, estado
    });
  }
  esActivo() { return this.estado === "aprobado"; }
  aprobar() {
    if (this.estado !== "pendiente") throw new Error("Solo se aprueban solicitudes pendientes.");
    this.estado = "aprobado";
  }
  rechazar() {
    if (this.estado !== "pendiente") throw new Error("Solo se rechazan solicitudes pendientes.");
    this.estado = "rechazado";
  }
  devolver(fecha = new Date().toISOString().slice(0, 10)) {
    if (this.estado !== "aprobado") throw new Error("Solo se registran devoluciones de préstamos aprobados.");
    this.estado = "devuelto";
    this.fechaDevolucion = fecha;
  }
  duracionDiasHasta(fechaFin) {
    if (!this.fechaPrestamo) return 0;
    return Math.ceil((new Date(fechaFin) - new Date(this.fechaPrestamo)) / 86400000);
  }
}

export const puedeGestionarCatalogo = (usuario) => usuario?.rol === "admin";
export const puedeSolicitarPrestamo = (usuario) => usuario?.rol === "estudiante";
export const puedeGestionarPrestamos = (usuario) => usuario?.rol === "admin";

export const maximoPrestamosActivos = 3;

export const validarSolicitudPrestamo = ({ usuario, prestamos, libro }) => {
  const errores = [];
  if (usuario?.rol !== "estudiante") errores.push("Solo un estudiante puede solicitar préstamos.");
  const activos = prestamos.filter(p => p.estudianteId === usuario?.id && p.estado === "aprobado").length;
  const pendientes = prestamos.filter(p => p.estudianteId === usuario?.id && p.estado === "pendiente").length;
  if (activos + pendientes >= maximoPrestamosActivos) errores.push("El estudiante ya alcanzó el límite de 3 préstamos activos o pendientes.");
  if (!libro || libro.estado !== "activo" || libro.disponibles < 1) errores.push("El libro no está disponible.");
  return errores;
};

export const aMinutosReserva = aMinutos;
