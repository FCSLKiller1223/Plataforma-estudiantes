import { Link } from "react-router-dom";

export default function TarjetaLibro({ libro }) {
  const disponible = libro.estado === "activo" && Number(libro.disponibles) > 0;
  return (
    <article className="card h-100 book-card">
      
      <div className="card-body d-flex flex-column">
        <span className="small text-uppercase text-muted mb-2">{libro.categoria}</span>
        <h2 className="h5">{libro.titulo}</h2>
        <p className="text-muted mb-3">{libro.autor}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
          <span className={`small ${disponible ? "text-success" : "text-danger"}`}>
            {disponible ? `${libro.disponibles} disponible(s)` : "No disponible"}
          </span>
          <Link className="btn btn-outline-success btn-sm" to={`/catalogo/${libro.id}`}>Ver detalle</Link>
        </div>
      </div>
    </article>
  );
}
