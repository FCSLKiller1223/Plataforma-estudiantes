# BiblioUTP — Avance 1

Sistema de gestión de biblioteca universitaria desarrollado para el Avance 1 del proyecto integral de JavaScript Avanzado.

## Alcance de este ZIP

- `core-js/`: validadores, clases de dominio, estadísticas y pruebas con `node:test`.
- `api-mock/`: API REST simulada con JSON Server 0.17.4 y datos de prueba.
- `angular-admin/`: panel Angular standalone para el administrador: login simulado, catálogo CRUD, detalle de libro y gestión de solicitudes/préstamos.
- El portal completo del estudiante en React corresponde al Avance 2 del documento del curso. En este Avance 1 se incluye su cuenta en la API y se bloquea su acceso al panel administrativo.

## Roles y permisos

| Función | Estudiante | Administrador |
|---|---:|---:|
| Consultar catálogo | Sí (portal estudiante, siguiente avance) | Sí |
| Buscar/ver detalle de libros | Sí | Sí |
| Crear libros | No | Sí |
| Editar/eliminar libros | No | Sí |
| Solicitar préstamos | Sí (portal estudiante, siguiente avance) | No |
| Ver sus propios préstamos | Sí (portal estudiante, siguiente avance) | No aplica |
| Ver todas las solicitudes | No | Sí |
| Aprobar/rechazar solicitudes | No | Sí |
| Registrar devoluciones | No | Sí |
| Ver estadísticas administrativas | No | Sí |

**Separación de responsabilidades:** el administrador administra el catálogo y procesa solicitudes; no solicita préstamos como estudiante. El estudiante consulta libros y gestiona únicamente sus propias solicitudes desde su portal. En el Avance 1 el panel Angular es exclusivamente administrativo.

## Cuentas de prueba

Contraseñas de demostración (texto plano, solo para el login simulado del Avance 1):

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@biblioutp.edu.pe | Admin123* |
| Administrador | biblioteca@biblioutp.edu.pe | Biblio2026* |
| Estudiante | u20231234@utp.edu.pe | Est123* |
| Estudiante | u20235678@utp.edu.pe | Est456* |

El panel Angular acepta únicamente cuentas con rol `admin`. Si se intenta ingresar con una cuenta `estudiante`, se rechaza el acceso y se muestra un mensaje.

## Requisitos

- Node.js LTS (recomendado Node 20 o 22)
- npm
- Visual Studio Code

## 1. Ejecutar las pruebas de core-js

Abre una terminal en la carpeta `core-js`:

```bash
npm install
npm test
```

## 2. Levantar la API simulada

Abre otra terminal en `api-mock`:

```bash
npm install
npm run api
```

API: `http://localhost:3000`

Rutas principales:
- `GET /libros`
- `GET /libros/:id`
- `POST /libros`
- `PUT /libros/:id`
- `DELETE /libros/:id`
- `GET /prestamos`
- `GET /prestamos?estudianteId=3`
- `GET /usuarios?correo=admin@biblioutp.edu.pe`

JSON Server permite filtrar por query string. Para probarlo, abre `http://localhost:3000/libros`.

## 3. Ejecutar Angular

Con la API funcionando, abre una tercera terminal en `angular-admin`:

```bash
npm install
npm start
```

Abre `http://localhost:4200`.

Inicia sesión con:
- Correo: `admin@biblioutp.edu.pe`
- Contraseña: `Admin123*`

## Funcionalidades Angular incluidas

- Login simulado y validación de rol administrador.
- Guard de rutas: sin sesión no se accede al panel.
- Menú administrativo.
- Listado de libros con búsqueda y filtro por categoría.
- Crear, editar y eliminar libros (CRUD conectado a JSON Server).
- Vista de detalle.
- Lista de préstamos/solicitudes para gestión administrativa.
- Aprobar, rechazar y registrar devolución (actualiza estado mediante `PATCH`).
- Formularios reactivos con validaciones.
- Directiva personalizada para resaltar libros con pocas unidades.
- Pipe personalizado para mostrar el estado del préstamo.
- Bootstrap mediante CDN.

## Modelo de datos

### Usuario
`id, nombre, correo, codigo, rol, password`

### Libro
`id, titulo, autor, categoria, editorial, anio, isbn, descripcion, ejemplares, disponibles, estado`

### Préstamo
`id, codigo, libroId, estudianteId, fechaSolicitud, fechaPrestamo, fechaDevolucion, estado`

Estados de préstamo: `pendiente`, `aprobado`, `rechazado`, `devuelto`.

## Reglas de negocio definidas

1. Máximo 3 préstamos activos por estudiante.
2. No se aprueba un préstamo si no hay ejemplares disponibles.
3. Solo el administrador gestiona el catálogo.
4. Solo el administrador aprueba/rechaza solicitudes y registra devoluciones.
5. El estudiante solo consulta y gestiona sus propios préstamos.
6. Al aprobar se descuenta una unidad disponible.
7. Al devolver se incrementa una unidad disponible.
8. Un libro no se elimina si tiene préstamos pendientes o aprobados.

Las reglas que requieren autorización y consistencia transaccional deben reforzarse en el backend real del Avance 5. En el mock de este avance, la interfaz administrativa valida las operaciones de gestión.

## Estructura

```text
BiblioUTP/
├── core-js/
├── api-mock/
└── angular-admin/
```
