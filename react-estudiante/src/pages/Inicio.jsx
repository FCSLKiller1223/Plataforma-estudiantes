import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Inicio() {
  const { user } = useAuth();
  return (
    <main>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-4 py-lg-4">
            <div className="col-lg-7">
              <span className="eyebrow">BIBLIOTECA UNIVERSITARIA</span>
              <h1 className="display-4 fw-bold mt-3">Ideas que abren caminos.</h1>
              <p className="lead mt-3">Explora el catálogo de BiblioUTP y solicita tus libros desde tu portal de estudiante.</p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link className="btn btn-success btn-lg" to="/catalogo">Explorar catálogo</Link>
                <Link className="btn btn-outline-success btn-lg" to={user ? "/nuevo-prestamo" : "/login"}>Solicitar un libro</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-note">
                <span className="display-3" aria-hidden="true">📖</span>
                <h2 className="h4 mt-3">Tu próxima lectura te espera</h2>
                <p className="mb-0">Busca por título, autor o categoría y consulta la disponibilidad antes de solicitar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-4"><div className="feature-tile"><strong>01</strong><h2 className="h5 mt-3">Descubre</h2><p className="mb-0">Consulta libros y encuentra materiales para tus cursos.</p></div></div>
          <div className="col-md-4"><div className="feature-tile"><strong>02</strong><h2 className="h5 mt-3">Solicita</h2><p className="mb-0">Envía tu solicitud con tu cuenta de estudiantil.</p></div></div>
          <div className="col-md-4"><div className="feature-tile"><strong>03</strong><h2 className="h5 mt-3">Haz seguimiento</h2><p className="mb-0">Revisa el estado de tus solicitudes en un solo lugar.</p></div></div>
        </div>
      </section>
    </main>
  );
}
