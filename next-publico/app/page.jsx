import Link from "next/link";
import { obtenerLibros } from "../lib/api.js";

export const dynamic = "force-dynamic";

export default async function InicioPublico() {
  let cantidad = 0;

  try {
    cantidad = (await obtenerLibros()).length;
  } catch {
    // La página principal conserva su contenido si la API no responde.
  }

  return (
    <main className="hero">
      <span className="eyebrow">BIBLIOTECA UNIVERSITARIA</span>
      <h1>Conocimiento al alcance de todos.</h1>
      <p>
        Explora el catálogo de BiblioUTP y consulta la disponibilidad de
        nuestros libros.
      </p>
      <p className="book-count">{cantidad} títulos registrados en el catálogo</p>
      <Link className="primary-link" href="/libros">
        Explorar catálogo
      </Link>
    </main>
  );
}
