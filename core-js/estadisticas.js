export const contarPrestamosPorEstado = (prestamos) =>
  prestamos.reduce(
    (acumulado, prestamo) => {
      acumulado[prestamo.estado] = (acumulado[prestamo.estado] ?? 0) + 1;
      return acumulado;
    },
    { pendiente: 0, aprobado: 0, rechazado: 0, devuelto: 0 }
  );

export const contarLibrosPorCategoria = (libros) =>
  libros.reduce((acumulado, libro) => {
    acumulado[libro.categoria] = (acumulado[libro.categoria] ?? 0) + 1;
    return acumulado;
  }, {});

export const categoriasUnicas = (libros) =>
  [...new Set(libros.map((libro) => libro.categoria))];

export const rankingLibrosMasSolicitados = (libros, prestamos) => {
  const conteo = new Map();

  prestamos.forEach((prestamo) => {
    const cantidad = conteo.get(prestamo.libroId) ?? 0;
    conteo.set(prestamo.libroId, cantidad + 1);
  });

  return [...libros]
    .map((libro) => ({
      ...libro,
      solicitudes: conteo.get(libro.id) ?? 0
    }))
    .sort((a, b) => b.solicitudes - a.solicitudes);
};

export const crearGeneradorCodigoPrestamo = (prefijo = "PRE") => {
  let contador = 1;

  return () => `${prefijo}-${String(contador++).padStart(4, "0")}`;
};
