import { useRequest } from "alova";
import { alova } from "../services/alova.js";

export default function ResumenEstados({ usuarioId }) {
  const { loading, data, error, send } = useRequest(
    () => alova.Get(`/prestamos?estudianteId=${usuarioId}`),
    { immediate: true, initialData: [] }
  );

  const resumen = (data || []).reduce((acumulado, prestamo) => {
    acumulado[prestamo.estado] = (acumulado[prestamo.estado] || 0) + 1;
    return acumulado;
  }, { pendiente: 0, aprobado: 0, rechazado: 0, devuelto: 0 });

  return (
    <section className="row g-3 mb-4" aria-label="Resumen de préstamos">
      {loading && <p className="text-muted">Actualizando resumen...</p>}
      {error && <div className="alert alert-warning">No se pudo actualizar el resumen.</div>}
      {Object.entries(resumen).map(([estado, cantidad]) => (
        <div className="col-6 col-lg-3" key={estado}>
          <div className="card h-100"><div className="card-body">
            <div className="small text-muted text-capitalize">{estado}</div>
            <div className="h3 fw-bold mb-0">{cantidad}</div>
          </div></div>
        </div>
      ))}
      <div className="col-12"><button className="btn btn-sm btn-outline-secondary" onClick={() => send()}>Actualizar resumen</button></div>
    </section>
  );
}
