const CLASES = {
  pendiente: "text-bg-warning",
  aprobado: "text-bg-success",
  rechazado: "text-bg-danger",
  devuelto: "text-bg-secondary"
};

const ETIQUETAS = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  devuelto: "Devuelto"
};

export default function BadgeEstado({ estado }) {
  return (
    <span className={`badge rounded-pill ${CLASES[estado] || "text-bg-secondary"}`}>
      {ETIQUETAS[estado] || estado}
    </span>
  );
}
