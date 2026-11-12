export type Rol = 'admin' | 'estudiante';

export type EstadoLibro = 'activo' | 'inactivo';

export type EstadoPrestamo =
  | 'pendiente'
  | 'aprobado'
  | 'rechazado'
  | 'devuelto';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  codigo: string;
  rol: Rol;
  password: string;
}

export interface Libro {
  id?: number;
  titulo: string;
  autor: string;
  categoria: string;
  editorial: string;
  anio: number | null;
  isbn: string;
  descripcion: string;
  ejemplares: number;
  disponibles: number;
  estado: EstadoLibro;
}

export interface Prestamo {
  id: number;
  codigo: string;
  libroId: number;
  estudianteId: number;
  fechaSolicitud: string;
  fechaPrestamo: string | null;
  fechaDevolucion: string | null;
  estado: EstadoPrestamo;
}