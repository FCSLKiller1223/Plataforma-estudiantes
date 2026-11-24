import Link from "next/link";
import { obtenerLibros } from "../../lib/api.js";

export const metadata = {
  title: "Catálogo de libros",
  description: "Catálogo público de libros disponibles en BiblioUTP."
};
export const dynamic = "force-dynamic";

export default async function CatalogoPublico() {
  let libros = [];
  let error = "";

  try {
    libros = await obtenerLibros();
  } catch {
    error = "No se pudo conectar con la API. Intenta nuevamente más tarde.";
  }

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">BIBLIOUTP</span>
        <h1>Catálogo de libros</h1>
        <p>Consulta títulos, autores y ejemplares disponibles.</p>
      </div>

      {error && <p className="alert">{error}</p>}
      {!error && libros.length === 0 && (
        <p className="empty">No hay libros registrados.</p>
      )}

      <div className="book-list">
        {libros.map((libro) => (
          <article className="book-card" key={libro.id}>
            <div className="book-icon">📖</div>
            <div>
              <span className="category">{libro.categoria}</span>
              <h2>{libro.titulo}</h2>
              <p>{libro.autor}</p>
              <span
                className={
                  libro.disponibles > 0 && libro.estado === "activo"
                    ? "available"
                    : "unavailable"
                }
              >
                {libro.disponibles > 0 && libro.estado === "activo"
                  ? `${libro.disponibles} disponible(s)`
                  : "No disponible"}
              </span>
            </div>
            <Link href={`/libros/${libro.id}`}>Ver detalle →</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
