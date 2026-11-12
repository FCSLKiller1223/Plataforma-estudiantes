import { test } from "node:test";
import assert from "node:assert/strict";
import { Prestamo } from "../../../core-js/modelos.js";
import { crearSolicitud } from "./prestamos.js";

const usuario = {
  id: 3,
  nombre: "Luis Quispe",
  correo: "u20231234@utp.edu.pe",
  codigo: "U20231234",
  rol: "estudiante"
};
const libros = [{ id: 1, titulo: "JavaScript", estado: "activo", disponibles: 1 }];
const solicitud = (prestamos = [], estudiante = usuario, catalogo = libros) =>
  crearSolicitud({ libros: catalogo, prestamos, usuario: estudiante, libroId: 1 });

test("crea una solicitud pendiente reutilizando la clase Prestamo", () => {
  const resultado = solicitud();
  assert.ok(resultado.prestamo instanceof Prestamo);
  assert.equal(resultado.prestamo.estado, "pendiente");
  assert.equal(resultado.prestamo.codigo, "PRE-0001");
  assert.equal(resultado.prestamo.estudianteId, usuario.id);
});

test("impide superar el límite de préstamos activos y pendientes", () => {
  const existentes = [
    { estudianteId: usuario.id, estado: "aprobado" },
    { estudianteId: usuario.id, estado: "pendiente" },
    { estudianteId: usuario.id, estado: "pendiente" }
  ];
  assert.match(solicitud(existentes).errores.libro, /límite de 3/);
});

test("no permite solicitar un libro agotado", () => {
  const agotados = [{ ...libros[0], disponibles: 0 }];
  assert.match(solicitud([], usuario, agotados).errores.libro, /no está disponible/);
});

test("no permite que una cuenta administradora solicite préstamos", () => {
  const admin = { ...usuario, rol: "admin" };
  assert.match(solicitud([], admin).errores.libro, /Solo un estudiante/);
});

test("valida el correo y el código institucional antes de registrar", () => {
  const cuentaInvalida = { ...usuario, correo: "externo@example.com", codigo: "A123" };
  assert.ok(solicitud([], cuentaInvalida).errores.cuenta);
});
