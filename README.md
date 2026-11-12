# BiblioUTP — Avances 1 y 2

Sistema de gestión de biblioteca universitaria desarrollado para el proyecto integral de JavaScript Avanzado. Este repositorio contiene el Avance 1 y el portal React del estudiante correspondiente al Avance 2.

## Alcance de este ZIP

- `core-js/`: validadores, clases de dominio, estadísticas y pruebas con `node:test`.
- `api-mock/`: API REST simulada con JSON Server 0.17.4 y datos de prueba.
- `angular-admin/`: panel Angular standalone para el administrador: login simulado, catálogo CRUD, detalle de libro y gestión de solicitudes/préstamos.
- `react-estudiante/`: portal React del estudiante para el Avance 2, con catálogo local, inicio de sesión simulado y solicitudes de préstamo. No se conecta a la API; esa integración corresponde al Avance 3.

## Alcance del Avance 2: portal React del estudiante

El Avance 2 implementa una SPA React para que el estudiante consulte el catálogo de libros e inicie solicitudes de préstamo. La aplicación usa una copia local de `api-mock/db.json`; la integración con la API se realizará en el Avance 3. Este portal es distinto del panel administrativo Angular.

### Requisitos adaptados a BiblioUTP

1. **Proyecto:** `react-estudiante/` está creado con Vite, JSX y Bootstrap.
2. **Componentes:** incluye `Navbar`, `TarjetaLibro`, `ListaLibros`, `FormularioPrestamo` y `BadgeEstado`, con props. Las listas usan `key` y los componentes se mantienen por debajo de 120 líneas.
3. **Navegación:** `react-router-dom` configura `/`, `/catalogo`, `/catalogo/:id` (leído con `useParams`), `/mis-prestamos`, `/nuevo-prestamo`, `/login` y una página 404. Las rutas de préstamos requieren sesión.
4. **Hooks:** la aplicación usa:
   - `useState` para los filtros de catálogo (categoría y texto) y la lista de préstamos.
   - `useEffect` para actualizar el título de la pestaña y mostrar una cuenta regresiva o aviso relacionado con la próxima devolución; limpiar el intervalo al desmontar el componente.
   - `useContext` con `AuthContext` para el usuario en sesión y `ThemeContext` para el tema claro/oscuro.
   - `useRef` para enfocar el primer campo del formulario y devolverle el foco después de guardar.
5. **Solicitud de préstamo:** un formulario controlado muestra errores junto al campo y reutiliza las reglas de `core-js/modelos.js`. Acepta solo estudiantes, libros disponibles y hasta tres préstamos activos o pendientes por estudiante.

**Datos y alcance:** el portal está en `react-estudiante/` e importa la copia `src/data/db.json`. El inicio de sesión y las solicitudes son simulados en el navegador; la sesión y las solicitudes nuevas se guardan en `localStorage`. Reutiliza `validarSolicitudPrestamo` y la clase `Prestamo` de `core-js/modelos.js`, junto con validadores de correo y código de estudiante de `core-js/validadores.js`. La aplicación filtra los préstamos para que cada estudiante vea solo los suyos. La sesión del navegador y estas reglas del cliente son únicamente para la demostración, no sustituyen autorización del servidor.

## Roles y permisos

| Función | Estudiante | Administrador |
|---|---:|---:|
| Consultar catálogo | Sí (portal React) | Sí |
| Buscar/ver detalle de libros | Sí | Sí |
| Crear libros | No | Sí |
| Editar/eliminar libros | No | Sí |
| Solicitar préstamos | Sí (portal React) | No |
| Ver sus propios préstamos | Sí (portal React) | No aplica |
| Ver todas las solicitudes | No | Sí |
| Aprobar/rechazar solicitudes | No | Sí |
| Registrar devoluciones | No | Sí |
| Ver estadísticas administrativas | No | Sí |

**Separación de responsabilidades:** el administrador administra el catálogo y procesa solicitudes; no solicita préstamos como estudiante. El portal React permite al estudiante consultar libros y ver únicamente sus propias solicitudes. El panel Angular es exclusivamente administrativo.

## Cuentas de prueba

Contraseñas de demostración en texto plano para los inicios de sesión simulados:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@biblioutp.edu.pe | Admin123* |
| Administrador | biblioteca@biblioutp.edu.pe | Biblio2026* |
| Estudiante | u20231234@utp.edu.pe | Est123* |
| Estudiante | u20235678@utp.edu.pe | Est456* |

El panel Angular acepta únicamente cuentas con rol `admin`. Si se intenta ingresar con una cuenta `estudiante`, se rechaza el acceso y se muestra un mensaje. El portal React acepta únicamente cuentas con rol `estudiante`.

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

## 4. Ejecutar el portal React del estudiante

Abre otra terminal en `react-estudiante`:

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`). Para iniciar sesión, usa una cuenta estudiante:

- Correo: `u20231234@utp.edu.pe`
- Contraseña: `Est123*`

También puedes usar `u20235678@utp.edu.pe` con `Est456*`. El acceso es simulado: los datos se validan contra la copia local de `src/data/db.json`. Las nuevas solicitudes y la sesión se guardan en el almacenamiento local del navegador. Restablecer los datos de demostración: borra `biblioutp-estudiante` y `biblioutp-prestamos` del `localStorage` del sitio.

El portal incluye catálogo con búsqueda y filtro por categoría, detalle del libro, login de estudiante, rutas protegidas de préstamos, creación de solicitudes, estado de préstamos, tema claro/oscuro y aviso de próxima devolución. La API JSON Server no necesita estar levantada para ejecutar React.

Para comprobar la compilación de producción:

```bash
npm test
npm run build
```

## Modelo de datos

### Usuario
`id, nombre, correo, codigo, rol, password`

### Libro
`id, titulo, autor, categoria, editorial, anio, isbn, descripcion, ejemplares, disponibles, estado`

### Préstamo
`id, codigo, libroId, estudianteId, fechaSolicitud, fechaPrestamo, fechaDevolucion, estado`

Estados de préstamo: `pendiente`, `aprobado`, `rechazado`, `devuelto`.

## Reglas de negocio definidas

1. Máximo 3 préstamos activos o pendientes por estudiante.
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
├── angular-admin/
└── react-estudiante/
```
