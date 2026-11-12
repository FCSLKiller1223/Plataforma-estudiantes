import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { esCorreoInstitucional, mensajeError } from "../../../core-js/validadores.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const { user, login } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const destino = location.state?.from?.pathname || "/mis-prestamos";
  if (user) return <Navigate to={destino} replace />;

  const enviar = (event) => {
    event.preventDefault();
    const nuevosErrores = {};
    if (!esCorreoInstitucional(correo)) nuevosErrores.correo = mensajeError("correo", "ingresa tu correo institucional @utp.edu.pe.");
    if (!password.trim()) nuevosErrores.password = mensajeError("contraseña", "este campo es obligatorio.");
    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      return;
    }
    if (!login(correo, password)) {
      setErrores({ general: "No pudimos iniciar sesión. Verifica tus datos de estudiante." });
      return;
    }
    navigate(destino, { replace: true });
  };

  return (
    <main className="container login-section">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card form-card">
            <div className="card-body p-4 p-md-5">
              <span className="eyebrow">PORTAL DEL ESTUDIANTE</span>
              <h1 className="h2 fw-bold mt-2">Inicia sesión</h1>
              <p className="text-muted">Usa tu cuenta de estudiante BiblioUTP.</p>
              <form onSubmit={enviar} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="correo">Correo institucional</label>
                  <input id="correo" type="email" autoComplete="username" className={`form-control ${errores.correo ? "is-invalid" : ""}`} value={correo} onChange={(event) => setCorreo(event.target.value)} />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Contraseña</label>
                  <input id="password" type="password" autoComplete="current-password" className={`form-control ${errores.password ? "is-invalid" : ""}`} value={password} onChange={(event) => setPassword(event.target.value)} />
                  {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                </div>
                {errores.general && <div className="alert alert-danger" role="alert">{errores.general}</div>}
                <button className="btn btn-success w-100" type="submit">Ingresar</button>
              </form>
              <p className="small text-muted mt-4 mb-0">Cuenta de prueba: u20231234@utp.edu.pe · Est123*</p>
              <Link className="small d-inline-block mt-2" to="/catalogo">Continuar como visitante</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
