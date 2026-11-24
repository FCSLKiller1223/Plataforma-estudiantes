import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="detail-card">
        <h1>Registro no encontrado</h1>
        <p>No existe un libro o préstamo con los datos indicados.</p>
        <Link href="/libros">Volver al catálogo</Link>
      </section>
    </main>
  );
}
