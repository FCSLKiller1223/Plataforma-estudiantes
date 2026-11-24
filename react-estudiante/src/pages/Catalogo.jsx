import { useEffect, useMemo, useState } from "react";
import ListaLibros from "../components/ListaLibros.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function cargarLibros() {
      try {
        const response = await fetch(`${API_URL}/libros`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        setLibros(await response.json());
      } catch (err) {
        if (err.name !== "AbortError") setError("No se pudo cargar el catálogo. Comprueba que la API esté activa.");
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }
    cargarLibros();
    return () => controller.abort();
  }, []);

  const categorias = [...new Set(libros.map((libro) => libro.categoria))].sort();
  const filtrados = useMemo(() => {
    const consulta = texto.trim().toLowerCase();
    return libros.filter((libro) => {
      const coincide = [libro.titulo, libro.autor, libro.categoria]
        .some((valor) => String(valor).toLowerCase().includes(consulta));
      return coincide && (!categoria || libro.categoria === categoria);
    });
  }, [libros, texto, categoria]);

  return (
    <main className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">DESCUBRE TU PRÓXIMA LECTURA</span>
        <h1 className="display-6 fw-bold mt-2">Catálogo de libros</h1>
        <p className="text-muted">Filtra por título, autor o categoría y revisa la disponibilidad.</p>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <label className="visually-hidden" htmlFor="buscar">Buscar libros</label>
          <input id="buscar" className="form-control form-control-lg" value={texto} onChange={(event) => setTexto(event.target.value)} placeholder="Buscar por título, autor o categoría" />
        </div>
        <div className="col-md-4">
          <label className="visually-hidden" htmlFor="categoria">Filtrar por categoría</label>
          <select id="categoria" className="form-select form-select-lg" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
          </select>
        </div>
      </div>
      {cargando && <p className="text-muted">Cargando catálogo...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!cargando && !error && <><p className="small text-muted">{filtrados.length} libro(s) encontrados</p><ListaLibros libros={filtrados} /></>}
      {!cargando && !error && libros.length === 0 && <div className="alert alert-light border">No hay libros registrados.</div>}
    </main>
  );
}
