import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validarSolicitudPrestamo } from "../../../core-js/modelos.js";
import { esCodigoAlumno, esCorreoInstitucional } from "../../../core-js/validadores.js";

function fechaLocal() {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

export default function FormularioPrestamo({ libros, prestamos, usuario, onCrear }) {
  const [searchParams] = useSearchParams();
  const [libroId, setLibroId] = useState(searchParams.get("libro") || "");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const primerCampo = useRef(null);
  const navigate = useNavigate();

  useEffect(() => primerCampo.current?.focus(), []);

  const disponibles = libros.filter((libro) => libro.estado === "activo" && libro.disponibles > 0);

  const enviar = async (event) => {
    event.preventDefault();
    setMensaje("");
    const nuevosErrores = {};
    if (!esCorreoInstitucional(usuario.correo)) nuevosErrores.cuenta = "Usa tu correo institucional UTP.";
    if (!esCodigoAlumno(usuario.codigo)) nuevosErrores.cuenta = "El código del estudiante no tiene el formato esperado.";
    const libro = libros.find((item) => String(item.id) === String(libroId));
    const reglas = validarSolicitudPrestamo({ usuario, prestamos, libro });
    if (reglas.length) nuevosErrores.libro = reglas.join(" ");
    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      return;
    }

    const solicitud = {
      codigo: `PRE-${Date.now()}`,
      libroId: Number(libroId),
      estudianteId: usuario.id,
      fechaSolicitud: fechaLocal(),
      fechaPrestamo: null,
      fechaDevolucion: null,
      estado: "pendiente"
    };

    setCargando(true);
    try {
      const creada = await onCrear(solicitud);
      setErrores({});
      setLibroId("");
      setMensaje(`Solicitud ${creada.codigo} registrada correctamente.`);
      primerCampo.current?.focus();
    } catch (error) {
      setErrores({ general: error.userMessage || error.message || "No se pudo registrar la solicitud." });
    } finally {
      setCargando(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={enviar} noValidate>
      <div className="card-body p-4">
        <label className="form-label fw-semibold" htmlFor="libro">Libro que deseas solicitar</label>
        <select ref={primerCampo} id="libro" className={`form-select ${errores.libro ? "is-invalid" : ""}`} value={libroId} onChange={(event) => { setLibroId(event.target.value); setErrores({}); }}>
          <option value="">Selecciona un libro disponible</option>
          {disponibles.map((libro) => <option key={libro.id} value={libro.id}>{libro.titulo} — {libro.disponibles} disponible(s)</option>)}
        </select>
        {errores.libro && <div className="invalid-feedback">{errores.libro}</div>}
        {errores.cuenta && <div className="alert alert-danger mt-3 mb-0">{errores.cuenta}</div>}
        {errores.general && <div className="alert alert-danger mt-3 mb-0">{errores.general}</div>}
        {mensaje && <div className="alert alert-success mt-3 mb-0" role="status">{mensaje}</div>}
        <p className="form-text mt-3">Las solicitudes quedan pendientes de revisión por la biblioteca. Puedes tener hasta tres préstamos activos o pendientes.</p>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <button className="btn btn-success" type="submit" disabled={cargando}>{cargando ? "Enviando..." : "Enviar solicitud"}</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/catalogo")}>Volver al catálogo</button>
        </div>
      </div>
    </form>
  );
}
