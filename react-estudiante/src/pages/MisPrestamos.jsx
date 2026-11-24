import { useState } from "react";
import BadgeEstado from "../components/BadgeEstado.jsx";
import ContadorDevolucion from "../components/ContadorDevolucion.jsx";
import ResumenEstados from "../components/ResumenEstados.jsx";

export default function MisPrestamos({ libros, prestamos, usuario, cargando, error, onCancelar, onRecargar }) {
  const [accion, setAccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const propios = prestamos
    .filter((prestamo) => prestamo.estudianteId === usuario.id)
    .sort((a, b) => String(b.fechaSolicitud).localeCompare(String(a.fechaSolicitud)));

  const cancelar = async (prestamo) => {
    if (!window.confirm(`¿Cancelar la solicitud ${prestamo.codigo}?`)) return;
    setAccion(String(prestamo.id));
    setMensaje("");
    try {
      await onCancelar(prestamo.id);
      setMensaje(`La solicitud ${prestamo.codigo} fue cancelada.`);
    } catch (err) {
      setMensaje(err.message || "No se pudo cancelar la solicitud.");
    } finally {
      setAccion("");
    }
  };

  return (
    <main className="container page-section">
      <div className="page-heading d-flex flex-wrap justify-content-between align-items-end gap-3">
        <div><span className="eyebrow">TU ACTIVIDAD</span><h1 className="display-6 fw-bold mt-2">Mis préstamos</h1><p className="text-muted">Consulta el estado de tus solicitudes y préstamos.</p></div>
        <button className="btn btn-outline-success" onClick={onRecargar}>Actualizar desde API</button>
      </div>
      <ResumenEstados usuarioId={usuario.id} />
      <section className="card reminder-card mb-4"><div className="card-body"><h2 className="h6">Próxima devolución</h2><ContadorDevolucion prestamos={propios} libros={libros} /></div></section>
      {cargando && <p className="text-muted">Cargando tus préstamos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      {!cargando && propios.length === 0 && <div className="alert alert-light border">Aún no tienes solicitudes. Explora el catálogo para encontrar un libro.</div>}
      {!cargando && propios.length > 0 && (
        <div className="table-responsive card">
          <table className="table align-middle mb-0">
            <thead><tr><th>Código</th><th>Libro</th><th>Solicitud</th><th>Devolución</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>{propios.map((prestamo) => {
              const libro = libros.find((item) => item.id === prestamo.libroId);
              return <tr key={prestamo.id}>
                <td className="fw-semibold">{prestamo.codigo}</td>
                <td>{libro?.titulo || "Libro no disponible"}</td>
                <td>{prestamo.fechaSolicitud || "—"}</td>
                <td>{prestamo.fechaDevolucion || "—"}</td>
                <td><BadgeEstado estado={prestamo.estado} /></td>
                <td>
                  {prestamo.estado === "pendiente" ? (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={accion === String(prestamo.id)}
                      onClick={() => cancelar(prestamo)}
                    >
                      {accion === String(prestamo.id)
                        ? "Cancelando..."
                        : "Cancelar"}
                    </button>
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
                </td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      )}
    </main>
  );
}
