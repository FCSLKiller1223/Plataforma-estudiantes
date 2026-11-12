import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark site-navbar">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">BiblioUTP</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Abrir navegación">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/catalogo">Catálogo</NavLink>
            {user && <NavLink className="nav-link" to="/mis-prestamos">Mis préstamos</NavLink>}
            {user && <NavLink className="nav-link" to="/nuevo-prestamo">Solicitar préstamo</NavLink>}
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-outline-light" onClick={toggleTheme} type="button">
              {theme === "light" ? "Modo oscuro" : "Modo claro"}
            </button>
            {user ? (
              <>
                <span className="navbar-text d-none d-lg-inline">{user.nombre}</span>
                <button className="btn btn-sm btn-light" onClick={handleLogout} type="button">Salir</button>
              </>
            ) : <NavLink className="btn btn-sm btn-light" to="/login">Ingresar</NavLink>}
          </div>
        </div>
      </div>
    </nav>
  );
}
