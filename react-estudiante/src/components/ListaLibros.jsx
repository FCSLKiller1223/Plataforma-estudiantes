import TarjetaLibro from "./TarjetaLibro.jsx";

export default function ListaLibros({ libros }) {
  if (libros.length === 0) {
    return <div className="alert alert-light border">No se encontraron libros con esos filtros.</div>;
  }
  return (
    <div className="row g-4">
      {libros.map((libro) => (
        <div className="col-sm-6 col-lg-4" key={libro.id}>
          <TarjetaLibro libro={libro} />
        </div>
      ))}
    </div>
  );
}
