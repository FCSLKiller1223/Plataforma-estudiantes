export const contarPrestamosPorEstado = (prestamos) =>
  prestamos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] ?? 0) + 1;
    return acc;
  }, { pendiente: 0, aprobado: 0, rechazado: 0, devuelto: 0 });

export const contarLibrosPorCategoria = (libros) =>
  libros.reduce((acc, libro) => {
    acc[libro.categoria] = (acc[libro.categoria] ?? 0) + 1;
    return acc;
  }, {});

export const categoriasUnicas = (libros) =>
  [...new Set(libros.map(l => l.categoria))];

export const rankingLibrosMasSolicitados = (libros, prestamos) => {
  const conteo = new Map();
  prestamos.forEach(p => conteo.set(p.libroId, (conteo.get(p.libroId) ?? 0) + 1));
  return [...libros]
    .map(libro => ({ ...libro, solicitudes: conteo.get(libro.id) ?? 0 }))
    .sort((a, b) => b.solicitudes - a.solicitudes);
};

export const crearGeneradorCodigoPrestamo = (prefijo = "PRE") => {
  let contador = 1;
  return () => `${prefijo}-${String(contador++).padStart(4, "0")}`;
};
