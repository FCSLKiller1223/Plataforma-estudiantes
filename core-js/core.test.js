import { test } from "node:test";
import assert from "node:assert/strict";
import { esCorreoInstitucional, esCodigoAlumno, esHora, esFecha, validarLibro } from "./validadores.js";
import { Usuario, Libro, Prestamo, validarSolicitudPrestamo } from "./modelos.js";
import { contarPrestamosPorEstado, categoriasUnicas, crearGeneradorCodigoPrestamo } from "./estadisticas.js";

test("acepta correo institucional UTP", () => assert.equal(esCorreoInstitucional("alumno@utp.edu.pe"), true));
test("rechaza correo externo", () => assert.equal(esCorreoInstitucional("alumno@gmail.com"), false));
test("valida código de alumno", () => assert.equal(esCodigoAlumno("U20231234"), true));
test("rechaza código mal formado", () => assert.equal(esCodigoAlumno("A20231234"), false));
test("valida hora HH:mm", () => assert.equal(esHora("23:59"), true));
test("rechaza hora inválida", () => assert.equal(esHora("25:10"), false));
test("valida formato de fecha", () => assert.equal(esFecha("2026-11-20"), true));
test("valida datos básicos de libro", () => assert.deepEqual(validarLibro({ titulo: "JS", autor: "Ana", categoria: "Programación", ejemplares: 2, disponibles: 2 }), []));
test("no permite disponibles mayores que ejemplares", () => assert.ok(validarLibro({ titulo: "JS", autor: "Ana", categoria: "Programación", ejemplares: 1, disponibles: 2 }).length));
test("libro descuenta y devuelve ejemplar", () => {
  const l = new Libro({ id: 1, titulo: "JS", autor: "A", categoria: "Prog", ejemplares: 2, disponibles: 2 });
  l.prestar(); assert.equal(l.disponibles, 1); l.devolver(); assert.equal(l.disponibles, 2);
});
test("solo un estudiante puede solicitar préstamo", () => {
  const usuario = new Usuario({ id: 1, nombre: "E", correo: "e@utp.edu.pe", codigo: "U12345678", rol: "estudiante" });
  const libro = new Libro({ id: 1, titulo: "JS", autor: "A", categoria: "Prog", ejemplares: 2, disponibles: 2 });
  assert.deepEqual(validarSolicitudPrestamo({ usuario, prestamos: [], libro }), []);
});
test("el administrador no puede solicitar préstamo", () => {
  const usuario = new Usuario({ id: 2, nombre: "Admin", correo: "a@utp.edu.pe", codigo: "A12345678", rol: "admin" });
  const libro = new Libro({ id: 1, titulo: "JS", autor: "A", categoria: "Prog", ejemplares: 2, disponibles: 2 });
  assert.ok(validarSolicitudPrestamo({ usuario, prestamos: [], libro }).length);
});
test("estadísticas cuentan estados", () => {
  assert.deepEqual(contarPrestamosPorEstado([{ estado: "pendiente" }, { estado: "aprobado" }, { estado: "aprobado" }]), { pendiente: 1, aprobado: 2, rechazado: 0, devuelto: 0 });
});
test("categorías únicas no se repiten", () => assert.deepEqual(categoriasUnicas([{ categoria: "JS" }, { categoria: "JS" }, { categoria: "BD" }]), ["JS", "BD"]));
test("generador produce códigos correlativos", () => {
  const generar = crearGeneradorCodigoPrestamo();
  assert.equal(generar(), "PRE-0001"); assert.equal(generar(), "PRE-0002");
});
