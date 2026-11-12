import { useMemo, useState } from "react";
import ListaLibros from "../components/ListaLibros.jsx";

export default function Catalogo({ libros }) {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("");
  const categorias = [...new Set(libros.map((libro) => libro.categoria))].sort();
  const filtrados = useMemo(() => {
    const consulta = texto.trim().toLowerCase();
    return libros.filter((libro) => {
      const coincideTexto = [libro.titulo, libro.autor, libro.categoria]
        .some((valor) => valor.toLowerCase().includes(consulta));
      return coincideTexto && (!categoria || libro.categoria === categoria);
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
      <p className="small text-muted">{filtrados.length} libro(s) encontrados</p>
      <ListaLibros libros={filtrados} />
    </main>
  );
}
