import { useEffect, useState } from "react";

const formatoTiempo = (milisegundos) => {
  const total = Math.abs(Math.floor(milisegundos / 1000));
  const dias = Math.floor(total / 86400);
  const horas = Math.floor((total % 86400) / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  return `${dias}d ${horas}h ${minutos}m`;
};

export default function ContadorDevolucion({ prestamos, libros }) {
  const [ahora, setAhora] = useState(Date.now());
  const proximo = prestamos
    .filter((prestamo) => prestamo.estado === "aprobado" && prestamo.fechaDevolucion)
    .map((prestamo) => ({ ...prestamo, vencimiento: new Date(`${prestamo.fechaDevolucion}T23:59:59`) }))
    .sort((a, b) => a.vencimiento - b.vencimiento)[0];

  useEffect(() => {
    const intervalo = window.setInterval(() => setAhora(Date.now()), 60_000);
    return () => window.clearInterval(intervalo);
  }, []);

  if (!proximo) return <p className="text-muted mb-0">No tienes devoluciones próximas registradas.</p>;
  const diferencia = proximo.vencimiento.getTime() - ahora;
  const titulo = libros.find((libro) => libro.id === proximo.libroId)?.titulo || "Libro";
  return (
    <p className="mb-0">
      <strong>{titulo}:</strong>{" "}
      {diferencia >= 0 ? `faltan ${formatoTiempo(diferencia)} para la devolución.` : `vencido hace ${formatoTiempo(diferencia)}.`}
    </p>
  );
}
