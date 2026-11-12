import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
import { BibliotecaService } from '../services/biblioteca.service';
import { Libro, Prestamo } from '../models';
import { EstadoPrestamoPipe } from '../pipes/estado-prestamo.pipe';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, EstadoPrestamoPipe],
  template: `
    <main class="page-wrap">

      <div class="mb-4">
        <h1 class="h2 fw-bold mb-1">Gestión de préstamos</h1>
        <p class="muted mb-0">
          Revisa solicitudes y administra aprobaciones y devoluciones.
        </p>
      </div>

      <div class="alert alert-info">
        El administrador no solicita préstamos: únicamente procesa las solicitudes de los estudiantes.
      </div>

      <div class="panel overflow-hidden">
        <div class="table-responsive">
          <table class="table align-middle mb-0">

            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Estudiante</th>
                <th>Libro</th>
                <th>Solicitud</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let p of prestamos">

                <td class="fw-semibold">{{ p.codigo }}</td>
                <td>#{{ p.estudianteId }}</td>
                <td>{{ nombreLibro(p.libroId) }}</td>
                <td>{{ p.fechaSolicitud }}</td>

                <td>
                  <span
                    class="badge"
                    [class.text-bg-warning]="p.estado === 'pendiente'"
                    [class.text-bg-success]="p.estado === 'aprobado'"
                    [class.text-bg-danger]="p.estado === 'rechazado'"
                    [class.text-bg-secondary]="p.estado === 'devuelto'"
                  >
                    {{ p.estado | estadoPrestamo }}
                  </span>
                </td>

                <td class="text-end text-nowrap">

                  <button
                    *ngIf="p.estado === 'pendiente'"
                    class="btn btn-sm btn-success me-1"
                    (click)="aprobar(p)"
                  >
                    Aprobar
                  </button>

                  <button
                    *ngIf="p.estado === 'pendiente'"
                    class="btn btn-sm btn-outline-danger"
                    (click)="rechazar(p)"
                  >
                    Rechazar
                  </button>

                  <button
                    *ngIf="p.estado === 'aprobado'"
                    class="btn btn-sm btn-primary"
                    (click)="devolver(p)"
                  >
                    Registrar devolución
                  </button>

                  <span
                    *ngIf="p.estado === 'rechazado' || p.estado === 'devuelto'"
                    class="small muted"
                  >
                    Sin acciones
                  </span>

                </td>
              </tr>

              <tr *ngIf="!prestamos.length">
                <td colspan="6" class="text-center muted py-4">
                  No hay préstamos registrados.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div class="alert alert-danger mt-3" *ngIf="error">
        {{ error }}
      </div>

      <div class="alert alert-success mt-3" *ngIf="mensaje">
        {{ mensaje }}
      </div>

    </main>
  `
})
export class PrestamosComponent implements OnInit {

  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  error = '';
  mensaje = '';

  constructor(private api: BibliotecaService) { }

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    forkJoin({
      p: this.api.listarPrestamos(),
      l: this.api.listarLibros()
    }).subscribe({
      next: r => {
        this.prestamos = r.p;
        this.libros = r.l;
      },
      error: () => this.error = 'No se pudieron cargar los préstamos.'
    });
  }

  nombreLibro(id: number) {
    return this.libros.find(l => l.id === id)?.titulo ?? `Libro #${id}`;
  }

  aprobar(p: Prestamo) {
    this.error = '';
    this.mensaje = '';

    const l = this.libros.find(x => x.id === p.libroId);

    if (!l || l.disponibles < 1) {
      this.error = 'No se puede aprobar: el libro no tiene ejemplares disponibles.';
      return;
    }

    const total = this.prestamos.filter(
      x =>
        x.estudianteId === p.estudianteId &&
        ['aprobado', 'pendiente'].includes(x.estado)
    ).length;

    if (total > 3) {
      this.error = 'El estudiante supera el límite de 3 préstamos activos/pendientes.';
      return;
    }

    this.api.actualizarDisponibilidad(l.id!, l.disponibles - 1).subscribe({
      next: () => this.api.cambiarEstadoPrestamo(p.id, {
        estado: 'aprobado',
        fechaPrestamo: this.obtenerFechaLocal()
      }).subscribe({
        next: () => {
          this.mensaje = `Solicitud ${p.codigo} aprobada.`;
          this.cargar();
        },
        error: () => this.error = 'No se pudo actualizar el préstamo.'
      }),
      error: () => this.error = 'No se pudo actualizar la disponibilidad.'
    });
  }

  rechazar(p: Prestamo) {
    if (!confirm(`¿Rechazar la solicitud ${p.codigo}?`)) return;

    this.api.cambiarEstadoPrestamo(p.id, {
      estado: 'rechazado'
    }).subscribe({
      next: () => {
        this.mensaje = `Solicitud ${p.codigo} rechazada.`;
        this.cargar();
      },
      error: () => this.error = 'No se pudo rechazar la solicitud.'
    });
  }

  devolver(p: Prestamo) {
    const l = this.libros.find(x => x.id === p.libroId);

    if (!l) {
      this.error = 'No se encontró el libro asociado.';
      return;
    }

    this.api.actualizarDisponibilidad(
      l.id!,
      Math.min(l.ejemplares, l.disponibles + 1)
    ).subscribe({
      next: () => this.api.cambiarEstadoPrestamo(p.id, {
        estado: 'devuelto',
        fechaDevolucion: this.obtenerFechaLocal()
      }).subscribe({
        next: () => {
          this.mensaje = `Devolución de ${p.codigo} registrada.`;
          this.cargar();
        },
        error: () => this.error = 'No se pudo actualizar el préstamo.'
      }),
      error: () => this.error = 'No se pudo actualizar el inventario.'
    });
  }

  obtenerFechaLocal(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}