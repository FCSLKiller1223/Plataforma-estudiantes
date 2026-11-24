import { notFound } from "next/navigation";
import { obtenerPrestamos } from "../../../lib/api.js";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  return {
    title: `Consulta ${params.codigo}`,
    description: "Consulta pública del estado de un préstamo de BiblioUTP."
  };
}

export default async function EstadoPrestamoPublico({ params }) {
  const codigo = decodeURIComponent(params.codigo).trim().toUpperCase();
  let prestamos = [];

  try {
    prestamos = await obtenerPrestamos();
  } catch {
    return (
      <main className="page">
        <p className="alert">No se pudo conectar con el servicio de préstamos.</p>
      </main>
    );
  }

  const prestamo = prestamos.find(
    (item) => String(item.codigo).toUpperCase() === codigo
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
        <span className="eyebrow">CONSULTA PÚBLICA</span>
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
