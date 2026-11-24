import { notFound } from "next/navigation";
import { obtenerLibro, obtenerPrestamos } from "../../../lib/api.js";

export const dynamic = "force-dynamic";

function obtenerInicioSemana(fecha = new Date()) {
  const inicio = new Date(fecha);
  inicio.setHours(0, 0, 0, 0);
  const diasDesdeLunes = (inicio.getDay() + 6) % 7;
  inicio.setDate(inicio.getDate() - diasDesdeLunes);
  return inicio;
}

export async function generateMetadata({ params }) {
  const libro = await obtenerLibro(params.id).catch(() => null);

  return {
    title: libro ? libro.titulo : "Libro no encontrado",
    description: libro
      ? `Detalle y disponibilidad de ${libro.titulo}.`
      : "El libro solicitado no existe en el catálogo."
  };
}

export default async function DetallePublico({ params }) {
  const libro = await obtenerLibro(params.id).catch(() => null);
  if (!libro) notFound();

  let prestamosSemana = [];
  try {
    const prestamos = await obtenerPrestamos();
    const inicio = obtenerInicioSemana();
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 7);

    prestamosSemana = prestamos.filter((prestamo) => {
      if (
        prestamo.libroId !== libro.id ||
        prestamo.estado !== "aprobado" ||
        !prestamo.fechaPrestamo
      ) {
        return false;
      }

      const fecha = new Date(`${prestamo.fechaPrestamo}T00:00:00`);
      return fecha >= inicio && fecha < fin;
    });
  } catch {
    // El detalle permanece disponible aunque falle la consulta complementaria.
  }

  return (
    <main className="page">
      <a href="/libros" className="back">
        ← Volver al catálogo
      </a>

      <article className="detail-card">
        <span className="category">{libro.categoria}</span>
        <h1>{libro.titulo}</h1>
        <p className="lead">{libro.autor}</p>
        <p>{libro.descripcion}</p>
        <dl>
          <dt>Editorial</dt>
          <dd>{libro.editorial || "No especificada"}</dd>
          <dt>Año</dt>
          <dd>{libro.anio || "No especificado"}</dd>
          <dt>ISBN</dt>
          <dd>{libro.isbn || "No especificado"}</dd>
          <dt>Ejemplares disponibles</dt>
          <dd>
            {libro.disponibles} de {libro.ejemplares}
          </dd>
        </dl>
      </article>

      <section className="detail-card">
        <h2>Préstamos aprobados esta semana</h2>
        <p>
          {prestamosSemana.length} préstamo(s) aprobados para este título durante
          la semana actual.
        </p>
        {prestamosSemana.length > 0 && (
          <ul>
            {prestamosSemana.map((prestamo) => (
              <li key={prestamo.id}>
                {prestamo.codigo} · Fecha: {prestamo.fechaPrestamo}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
