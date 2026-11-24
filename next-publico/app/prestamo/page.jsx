export const metadata = {
  title: "Consulta de préstamo",
  description: "Consulta el estado de una solicitud mediante su código público."
};

export default function ConsultaPrestamo() {
  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">SEGUIMIENTO</span>
        <h1>Consulta tu préstamo</h1>
        <p>Ingresa tu código de solicitud para consultar su estado.</p>
      </div>

      <form action="/prestamo/resultado" method="GET" className="lookup-form">
        <label htmlFor="codigo">Código de préstamo</label>
        <input id="codigo" name="codigo" placeholder="PRE-0001" required />
        <button type="submit">Consultar</button>
      </form>
    </main>
  );
}
