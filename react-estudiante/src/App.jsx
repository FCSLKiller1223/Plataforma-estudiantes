import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import { useReservas } from "./hooks/useReservas.js";
import Catalogo from "./pages/Catalogo.jsx";
import DetalleLibro from "./pages/DetalleLibro.jsx";
import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import MisPrestamos from "./pages/MisPrestamos.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";
import FormularioPrestamo from "./components/FormularioPrestamo.jsx";
import { api } from "./services/api.js";

const titulos = {
  "/": "Inicio",
  "/catalogo": "Catálogo",
  "/mis-prestamos": "Mis préstamos",
  "/nuevo-prestamo": "Solicitar préstamo",
  "/login": "Iniciar sesión"
};

function TituloPagina() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${titulos[pathname] || (pathname.startsWith("/catalogo/") ? "Detalle del libro" : "Página no encontrada")} | BiblioUTP`;
  }, [pathname]);
  return null;
}

function SolicitudPrestamo() {
  const { user } = useAuth();
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const reservas = useReservas(user?.id);

  useEffect(() => {
    api.get("/libros")
      .then((response) => setLibros(response.data))
      .catch((err) => setError(err.userMessage || "No se pudo cargar el catálogo."))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <main className="container page-section">Cargando libros...</main>;
  if (error) return <main className="container page-section"><div className="alert alert-danger">{error}</div></main>;

  return (
    <main className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">BIBLIOUTP</span>
        <h1 className="display-6 fw-bold mt-2">Solicitar un préstamo</h1>
        <p className="text-muted">Elige un libro disponible para enviar tu solicitud.</p>
      </div>
      <FormularioPrestamo libros={libros} prestamos={reservas.datos} usuario={user} onCrear={reservas.crear} />
      {reservas.error && <div className="alert alert-danger mt-3">{reservas.error}</div>}
    </main>
  );
}

function PaginaMisPrestamos() {
  const { user } = useAuth();
  const reservas = useReservas(user?.id);
  const [libros, setLibros] = useState([]);
  useEffect(() => {
    api.get("/libros").then((response) => setLibros(response.data)).catch(() => setLibros([]));
  }, []);
  return <MisPrestamos libros={libros} prestamos={reservas.datos} usuario={user} cargando={reservas.cargando} error={reservas.error} onCancelar={reservas.cancelar} onRecargar={reservas.recargar} />;
}

export default function App() {
  return (
    <>
      <TituloPagina />
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalogo/:id" element={<DetalleLibro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mis-prestamos" element={<RutaProtegida><PaginaMisPrestamos /></RutaProtegida>} />
        <Route path="/nuevo-prestamo" element={<RutaProtegida><SolicitudPrestamo /></RutaProtegida>} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
      <footer className="site-footer"><div className="container d-flex flex-wrap justify-content-between gap-2"><span>BiblioUTP · Portal del estudiante</span><span>API REST · JSON Server</span></div></footer>
    </>
  );
}
