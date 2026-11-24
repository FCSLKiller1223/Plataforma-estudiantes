# BiblioUTP — Proyecto integral de JavaScript Avanzado

Sistema universitario de biblioteca. Este repositorio conserva los módulos de los avances anteriores y organiza las nuevas entregas siguiendo la estructura de referencia del curso, adaptada al dominio de BiblioUTP.

## Datos del proyecto

- **Dominio:** gestión de una biblioteca universitaria.
- **Proyecto:** BiblioUTP.
- **Integrantes:** completa aquí los nombres y apellidos de los integrantes del grupo.

## Estructura del proyecto

```text
BiblioUTP/
├── README.md
├── docs/
│   └── ROLES_Y_REGLAS.md
├── core-js/                 # Núcleo JavaScript reutilizable
│   ├── validadores.js
│   ├── modelos.js            # Usuario, Libro y Prestamo
│   ├── estadisticas.js       # map, filter, reduce, Map y Set
│   └── core.test.js          # node:test
├── api-mock/                # JSON Server, API REST de demostración
│   └── db.json
├── angular-admin/           # Panel de administración
├── react-estudiante/        # Portal del estudiante
├── vue-kiosko/              # Kiosko de disponibilidad
└── next-publico/            # Catálogo y consulta pública SSR
```

`api-express/` no se incluye todavía: corresponde al Avance 5 (backend real con autenticación JWT) y no forma parte de esta entrega.

## Funcionalidades por módulo

### `core-js/`
- Validaciones de correo institucional y código de estudiante.
- Clases `Usuario`, `Libro` y `Prestamo`.
- Reglas de negocio y estadísticas de libros y préstamos.
- Pruebas automatizadas con `node:test`.

### `api-mock/`
- API REST con JSON Server en `http://localhost:3000`.
- Recursos `/usuarios`, `/libros` y `/prestamos`.
- Soporta GET, POST, PUT, PATCH y DELETE.

### `angular-admin/` — administrador
- Login exclusivo para rol `admin`.
- Gestión CRUD de libros.
- Aprobación, rechazo y devolución de préstamos mediante `PATCH`.
- Control de disponibilidad y validación de reglas de negocio.
- Actualización automática de la lista de préstamos cada 15 segundos.

### `react-estudiante/` — Avances 2 y 3 / Semana 15
- Portal del estudiante con catálogo, detalle y solicitudes.
- Fetch API con `async/await` y comprobación de `response.ok` para catálogo y detalle.
- Instancia Axios con `baseURL` e interceptor de errores HTTP.
- Inicio de sesión consultando `GET /usuarios?correo=...`; la sesión se conserva en `localStorage`.
- Hook `useReservas(usuarioId)` centraliza consulta, creación y cancelación de solicitudes; los componentes no realizan directamente esas llamadas.
- Creación por `POST /prestamos` y cancelación por `DELETE /prestamos/:id` (solo solicitudes pendientes).
- Resumen de estados con Alova y botón para refrescar los datos.
- Estados de carga, error y lista vacía.
- Botón de actualización para reflejar aprobaciones o rechazos hechos desde Angular.

### `vue-kiosko/` — Avance 4 / Semana 16
- Kiosko público de disponibilidad de libros.
- Componentes `GrillaDisponibilidad` y `CeldaDisponibilidad` con props y eventos.
- Filtro por categoría con `v-model`.
- Estados visuales: disponible, último ejemplar y agotado.
- Carga inicial y actualización automática cada 30 segundos; el intervalo se limpia al desmontar el componente.

### `next-publico/` — Avance 4 / Semana 16
- Catálogo público renderizado en servidor en `/libros`.
- Detalle SSR en `/libros/[id]`, con préstamos aprobados del libro durante la semana actual.
- Consulta pública del estado por código en `/reserva/[codigo]` (por ejemplo, `/reserva/PRE-0001`); formulario de búsqueda en `/prestamo`.
- Metadata por página y pantalla 404 para libros o códigos inexistentes.
- Las páginas consultan la API mock desde el servidor y usan `cache: no-store` para mostrar datos recientes.

## Roles y cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@biblioutp.edu.pe` | `Admin123*` |
| Administrador | `biblioteca@biblioutp.edu.pe` | `Biblio2026*` |
| Estudiante | `u20231234@utp.edu.pe` | `Est123*` |
| Estudiante | `u20235678@utp.edu.pe` | `Est456*` |

El administrador administra el catálogo y procesa las solicitudes; no solicita préstamos. El estudiante consulta el catálogo, solicita préstamos y solo ve/cancela sus propias solicitudes pendientes. Las credenciales en texto plano son exclusivamente para la simulación académica; no deben utilizarse en producción.

## Requisitos

- Node.js 20 o 22 LTS.
- npm.
- Visual Studio Code.

## Instalación y ejecución

Abre cada módulo en una terminal distinta. Ejecuta `npm install` una vez dentro de cada carpeta.

### 1. Pruebas del núcleo

```bash
cd core-js
npm install
npm test
```

### 2. API simulada

```bash
cd api-mock
npm install
npm run api
```

API: `http://localhost:3000`

### 3. Panel Angular

```bash
cd angular-admin
npm install
npm start
```

Abre `http://localhost:4200` e inicia sesión con la cuenta administradora.

### 4. Portal React

```bash
cd react-estudiante
npm install
npm run dev
```

Abre `http://localhost:5173` e inicia sesión con una cuenta estudiante.

### 5. Kiosko Vue

```bash
cd vue-kiosko
npm install
npm run dev
```

Abre `http://localhost:5174`.

### 6. Portal público Next.js

```bash
cd next-publico
npm install
npm run dev
```

Abre `http://localhost:3001`.

## Verificación de renderizado SSR

En Next.js abre `/libros` o `/libros/1` y utiliza **Ver código fuente de la página** (Ctrl+U en el navegador). El contenido principal debe aparecer en el HTML recibido del servidor.

## Orden recomendado para probar la integración

1. Inicia `api-mock` y mantenlo abierto.
2. Inicia Angular, React, Vue y Next en terminales separadas.
3. En React, inicia sesión como estudiante y crea una solicitud.
4. En Angular, inicia sesión como administrador y aprueba o rechaza la solicitud.
5. En React, entra a **Mis préstamos** y pulsa **Actualizar desde API** para ver el nuevo estado.
6. En Vue, verifica la disponibilidad; el kiosko se actualiza automáticamente cada 30 segundos.
7. En Next, abre el catálogo y consulta el detalle o el estado público con el código del préstamo.

## Variables opcionales

React y Vue aceptan `VITE_API_URL` (por defecto `http://localhost:3000`). Next acepta `BIBLIO_API_URL` o `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:3000`).

## Pruebas y compilación

Ejecuta en cada módulo:

```bash
npm run build
```

En `core-js` y `react-estudiante` también puedes ejecutar `npm test`. No se incluyen carpetas `node_modules`; cada módulo instala sus dependencias de forma independiente.

## Comparación de tecnologías

| Tecnología | Uso en BiblioUTP | Ventaja principal |
|---|---|---|
| Fetch API | Catálogo y detalle React | API nativa del navegador, sin dependencia adicional |
| Axios | Login y operaciones de préstamos React | Instancia centralizada e interceptor de errores |
| Alova | Resumen de préstamos React | Gestión declarativa de solicitudes y estados |
| Angular | Administración | Formularios, rutas protegidas y gestión de catálogo/préstamos |
| Vue 3 | Kiosko de disponibilidad | Componentes reactivos y actualización periódica |
| Next.js | Portal público | Renderizado del lado del servidor y metadata por ruta |

## Alcance y seguridad

`api-mock` y las credenciales de demostración son recursos académicos. JSON Server no aplica autorización real ni transacciones seguras. Las validaciones del frontend no sustituyen controles del backend. El backend Express con JWT, autorización por rol y persistencia segura se desarrollará en el Avance 5.
