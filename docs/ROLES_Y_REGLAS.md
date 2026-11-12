# Roles, permisos y reglas de negocio — BiblioUTP

## Estudiante
- Consulta el catálogo y el detalle de libros.
- Busca por título, autor y categoría.
- Solicita préstamos de ejemplares disponibles.
- Consulta únicamente sus propios préstamos.
- Cancela solicitudes propias mientras estén pendientes.
- No registra, edita ni elimina libros.
- No ve solicitudes de otros estudiantes.
- No aprueba/rechaza préstamos ni registra devoluciones.

## Administrador
- Administra el catálogo: crear, consultar, editar y eliminar.
- Revisa todas las solicitudes.
- Aprueba o rechaza solicitudes.
- Registra devoluciones y consulta indicadores administrativos.
- No crea solicitudes de préstamo para sí mismo.
- No necesita el módulo “mis préstamos” del estudiante.

## Reglas
1. Máximo 3 préstamos activos por estudiante.
2. No aprobar si no hay ejemplares disponibles.
3. La disponibilidad baja al aprobar y sube al devolver.
4. No eliminar libros con solicitudes pendientes o préstamos aprobados.
5. Un estudiante solo consulta sus propios préstamos.

## Alcance por avance
- Avance 1: core-js, API simulada y panel Angular de administración.
- Avance 2: portal React del estudiante.
- Avance 3: integración de ambos portales con el API.
- Avance 5: autorización real en Express mediante JWT y middleware por rol.

## Límite técnico
JSON Server no implementa autorización por roles en el servidor. El login del Avance 1 es simulado en Angular, como indica la guía. El guard protege las rutas Angular, pero no convierte JSON Server en una API segura. No usar este mock en producción.
