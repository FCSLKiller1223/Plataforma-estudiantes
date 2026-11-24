import { notFound } from "next/navigation";
import { obtenerPrestamos } from "../../../lib/api.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resultado de consulta" };

export default async function ResultadoPrestamo({ searchParams }) {
  const codigo = String(searchParams.codigo || "").trim().toUpperCase();
  if (!codigo) notFound();

  let prestamos = [];
  try {
    prestamos = await obtenerPrestamos();
  } catch {
    return (
      <main className="page">
        <p className="alert">No se pudo consultar el servicio en este momento.</p>
      </main>
    );
  }

  const prestamo = prestamos.find(
    (item) => item.codigo.toUpperCase() === codigo
  );
  if (!prestamo) notFound();

  const estados = {
    pendiente: "Pendiente de revisión",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    devuelto: "Devuelto"
  };

  return (
    <main className="page">
      <section className="detail-card">
        <span className="eyebrow">RESULTADO DE CONSULTA</span>
        <h1>{prestamo.codigo}</h1>
        <p>
          Estado: <strong>{estados[prestamo.estado] || prestamo.estado}</strong>
        </p>
        <p>Fecha de solicitud: {prestamo.fechaSolicitud}</p>
        <p>Fecha de préstamo: {prestamo.fechaPrestamo || "Aún no registrado"}</p>
        <p>
          Fecha de devolución: {prestamo.fechaDevolucion || "Aún no registrado"}
        </p>
        <a className="back" href="/prestamo">
          Consultar otro código
        </a>
      </section>
    </main>
  );
}
