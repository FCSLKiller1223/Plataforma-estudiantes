export const esCorreoInstitucional = (correo) => 
  /^[a-z0-9._%+-]+@utp\.edu\.pe$/i.test(String(correo ?? "").trim());

export const esCodigoAlumno = (codigo) =>
  /^U\d{8}$/.test(String(codigo ?? "").trim());

export const esHora = (hora) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(String(hora ?? "").trim());

export const esFecha = (fecha) =>
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(String(fecha ?? "").trim());

export const esISBN = (isbn) =>
  /^(?:\d{9}[\dX]|\d{13})$/.test(String(isbn ?? "").replaceAll("-", "").trim());

export const validarLibro = (libro) => {
  const errores = [];
  if (!String(libro.titulo ?? "").trim()) errores.push("El título es obligatorio.");
  if (!String(libro.autor ?? "").trim()) errores.push("El autor es obligatorio.");
  if (!String(libro.categoria ?? "").trim()) errores.push("La categoría es obligatoria.");
  if (!Number.isInteger(Number(libro.ejemplares)) || Number(libro.ejemplares) < 1)
    errores.push("Los ejemplares deben ser un entero mayor o igual a 1.");
  if (!Number.isInteger(Number(libro.disponibles)) || Number(libro.disponibles) < 0)
    errores.push("Los disponibles deben ser un entero no negativo.");
  if (Number(libro.disponibles) > Number(libro.ejemplares))
    errores.push("Los disponibles no pueden superar los ejemplares.");
  return errores;
};

export const mensajeError = (campo, detalle) => `Error en ${campo}: ${detalle}`;
