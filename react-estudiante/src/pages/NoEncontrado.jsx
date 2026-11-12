import { Link } from "react-router-dom";

export default function NoEncontrado() {
  return (
    <main className="container page-section text-center">
      <div className="not-found-code">404</div>
      <h1 className="h2 fw-bold">Esta página no está en el catálogo</h1>
      <p className="text-muted">Puede que el enlace haya cambiado o no exista.</p>
      <Link className="btn btn-success mt-2" to="/">Volver al inicio</Link>
    </main>
  );
}
