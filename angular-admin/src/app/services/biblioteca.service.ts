import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro, Prestamo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaService {

  private readonly api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  listarLibros() {
    return this.http.get<Libro[]>(`${this.api}/libros`);
  }

  obtenerLibro(id: number) {
    return this.http.get<Libro>(`${this.api}/libros/${id}`);
  }

  crearLibro(l: Libro) {
    return this.http.post<Libro>(`${this.api}/libros`, l);
  }

  actualizarLibro(id: number, l: Libro) {
    return this.http.put<Libro>(`${this.api}/libros/${id}`, l);
  }

  eliminarLibro(id: number) {
    return this.http.delete<void>(`${this.api}/libros/${id}`);
  }

  listarPrestamos() {
    return this.http.get<Prestamo[]>(`${this.api}/prestamos`);
  }

  cambiarEstadoPrestamo(id: number, c: Partial<Prestamo>) {
    return this.http.patch<Prestamo>(`${this.api}/prestamos/${id}`, c);
  }

  actualizarDisponibilidad(id: number, d: number) {
    return this.http.patch<Libro>(`${this.api}/libros/${id}`, {
      disponibles: d
    });
  }
}