import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function DetalleLibro({ libros }) {
  const { id } = useParams();
  const { user } = useAuth();
  const libro = libros.find((item) => String(item.id) === id);
  if (!libro) {
    return <main className="container page-section"><div className="alert alert-warning">No encontramos ese libro.</div><Link to="/catalogo">Volver al catálogo</Link></main>;
  }
  const disponible = libro.estado === "activo" && libro.disponibles > 0;
  return (
    <main className="container page-section">
      <Link to="/catalogo" className="back-link">← Volver al catálogo</Link>
      <div className="row g-5 mt-2">
        <div className="col-md-4"><div className="detail-cover" aria-hidden="true">📚</div></div>
        <div className="col-md-8">
          <span className="eyebrow">{libro.categoria}</span>
          <h1 className="display-6 fw-bold mt-2">{libro.titulo}</h1>
          <p className="lead text-muted">{libro.autor}</p>
          <p>{libro.descripcion || "Descripción no disponible."}</p>
          <dl className="row book-facts">
            <dt className="col-sm-4">Editorial</dt><dd className="col-sm-8">{libro.editorial || "No especificada"}</dd>
            <dt className="col-sm-4">Año</dt><dd className="col-sm-8">{libro.anio || "No especificado"}</dd>
            <dt className="col-sm-4">ISBN</dt><dd className="col-sm-8">{libro.isbn || "No especificado"}</dd>
            <dt className="col-sm-4">Disponibilidad</dt><dd className="col-sm-8">{disponible ? `${libro.disponibles} de ${libro.ejemplares} ejemplares` : "No disponible"}</dd>
          </dl>
          {disponible && <Link className="btn btn-success btn-lg mt-2" to={user ? `/nuevo-prestamo?libro=${libro.id}` : "/login"}>Solicitar préstamo</Link>}
        </div>
      </div>
    </main>
  );
}
