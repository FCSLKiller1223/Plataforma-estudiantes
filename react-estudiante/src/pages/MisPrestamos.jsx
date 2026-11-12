import BadgeEstado from "../components/BadgeEstado.jsx";
import ContadorDevolucion from "../components/ContadorDevolucion.jsx";

export default function MisPrestamos({ libros, prestamos, usuario }) {
  const propios = prestamos
    .filter((prestamo) => prestamo.estudianteId === usuario.id)
    .sort((a, b) => String(b.fechaSolicitud).localeCompare(String(a.fechaSolicitud)));

  return (
    <main className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">TU ACTIVIDAD</span>
        <h1 className="display-6 fw-bold mt-2">Mis préstamos</h1>
        <p className="text-muted">Consulta el estado de tus solicitudes y préstamos.</p>
      </div>
      <section className="card reminder-card mb-4">
        <div className="card-body"><h2 className="h6">Próxima devolución</h2><ContadorDevolucion prestamos={propios} libros={libros} /></div>
      </section>
      {propios.length === 0 ? <div className="alert alert-light border">Aún no tienes solicitudes. Explora el catálogo para encontrar un libro.</div> : (
        <div className="table-responsive card">
          <table className="table align-middle mb-0">
            <thead><tr><th>Código</th><th>Libro</th><th>Solicitud</th><th>Devolución</th><th>Estado</th></tr></thead>
            <tbody>{propios.map((prestamo) => {
              const libro = libros.find((item) => item.id === prestamo.libroId);
              return (
                <tr key={prestamo.id}>
                  <td className="fw-semibold">{prestamo.codigo}</td>
                  <td>{libro?.titulo || "Libro no disponible"}</td>
                  <td>{prestamo.fechaSolicitud || "—"}</td>
                  <td>{prestamo.fechaDevolucion || "Pendiente de aprobación"}</td>
                  <td><BadgeEstado estado={prestamo.estado} /></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </main>
  );
}
