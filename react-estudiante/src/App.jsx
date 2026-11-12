import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import db from "./data/db.json";
import Navbar from "./components/Navbar.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import DetalleLibro from "./pages/DetalleLibro.jsx";
import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import MisPrestamos from "./pages/MisPrestamos.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";
import FormularioPrestamo from "./components/FormularioPrestamo.jsx";
import { cargarPrestamos } from "./services/prestamos.js";

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

export default function App() {
  const { user } = useAuth();
  const [prestamos, setPrestamos] = useState(() => cargarPrestamos(db.prestamos));
  const libros = db.libros;

  return (
    <>
      <TituloPagina />
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo libros={libros} />} />
        <Route path="/catalogo/:id" element={<DetalleLibro libros={libros} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mis-prestamos" element={<RutaProtegida><MisPrestamos libros={libros} prestamos={prestamos} usuario={user} /></RutaProtegida>} />
        <Route path="/nuevo-prestamo" element={<RutaProtegida><main className="container page-section"><div className="page-heading"><span className="eyebrow">BIBLIOUTP</span><h1 className="display-6 fw-bold mt-2">Solicitar un préstamo</h1><p className="text-muted">Elige un libro disponible para enviar tu solicitud.</p></div><FormularioPrestamo libros={libros} prestamos={prestamos} usuario={user} onGuardar={setPrestamos} /></main></RutaProtegida>} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
      <footer className="site-footer"><div className="container d-flex flex-wrap justify-content-between gap-2"><span>BiblioUTP · Portal del estudiante</span><span>Datos de demostración locales</span></div></footer>
    </>
  );
}
