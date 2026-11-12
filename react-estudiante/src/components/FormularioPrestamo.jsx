import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { crearSolicitud, guardarPrestamos } from "../services/prestamos.js";

export default function FormularioPrestamo({ libros, prestamos, usuario, onGuardar }) {
  const [searchParams] = useSearchParams();
  const [libroId, setLibroId] = useState(searchParams.get("libro") || "");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const primerCampo = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    primerCampo.current?.focus();
  }, []);

  const disponibles = libros.filter((libro) => libro.estado === "activo" && libro.disponibles > 0);

  const enviar = (event) => {
    event.preventDefault();
    setMensaje("");
    const resultado = crearSolicitud({ libros, prestamos, usuario, libroId });
    if (resultado.errores) {
      setErrores(resultado.errores);
      return;
    }
    const actualizados = [...prestamos, resultado.prestamo];
    guardarPrestamos(actualizados);
    onGuardar(actualizados);
    setErrores({});
    setLibroId("");
    setMensaje(`Solicitud ${resultado.prestamo.codigo} registrada correctamente.`);
    primerCampo.current?.focus();
  };

  return (
    <form className="card form-card" onSubmit={enviar} noValidate>
      <div className="card-body p-4">
        <label className="form-label fw-semibold" htmlFor="libro">Libro que deseas solicitar</label>
        <select
          ref={primerCampo}
          id="libro"
          className={`form-select ${errores.libro ? "is-invalid" : ""}`}
          value={libroId}
          onChange={(event) => { setLibroId(event.target.value); setErrores({}); }}
          aria-describedby={errores.libro ? "libro-error" : undefined}
        >
          <option value="">Selecciona un libro disponible</option>
          {disponibles.map((libro) => (
            <option key={libro.id} value={libro.id}>{libro.titulo} — {libro.disponibles} disponible(s)</option>
          ))}
        </select>
        {errores.libro && <div className="invalid-feedback" id="libro-error">{errores.libro}</div>}
        {errores.cuenta && <div className="alert alert-danger mt-3 mb-0" role="alert">{errores.cuenta}</div>}
        {mensaje && <div className="alert alert-success mt-3 mb-0" role="status">{mensaje}</div>}
        <p className="form-text mt-3">Las solicitudes quedan pendientes de revisión por la biblioteca. Puedes tener hasta tres préstamos activos o pendientes.</p>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <button className="btn btn-success" type="submit">Enviar solicitud</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/catalogo")}>Volver al catálogo</button>
        </div>
      </div>
    </form>
  );
}
