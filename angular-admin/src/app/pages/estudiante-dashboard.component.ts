
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EstudianteAuthService } from '../services/estudiante-auth.service';

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  disponibles: number;
  estado: string;
}

interface Prestamo {
  id: number;
  codigo: string;
  libroId: number;
  estudianteId: number;
  fechaSolicitud: string;
  estado: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="navbar navbar-dark bg-success px-4">
      <span class="navbar-brand fw-bold">BiblioUTP - Estudiante</span>

      <div class="text-white">
        {{ auth.estudiante?.nombre }}

        <button
          class="btn btn-outline-light btn-sm ms-3"
          (click)="salir()"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>

    <main class="page-wrap">

      <section class="panel p-4 mb-4">
        <h2>Bienvenido, {{ auth.estudiante?.nombre }}</h2>
        <p class="muted mb-0">
          Desde aquí puedes consultar libros y administrar tus solicitudes.
        </p>
      </section>

      <div class="alert alert-info" *ngIf="mensaje">
        {{ mensaje }}
      </div>

      <section class="panel p-4 mb-4">
        <div class="d-flex justify-content-between flex-wrap gap-3">
          <h3 class="h5">Catálogo de libros</h3>

          <input
            class="form-control"
            style="max-width:350px"
            placeholder="Buscar libro..."
            [(ngModel)]="busqueda"
          >
        </div>

        <div class="row g-3 mt-2">

          <div
            class="col-md-6 col-lg-4"
            *ngFor="let libro of librosFiltrados"
          >
            <article class="border rounded-3 p-3 h-100">

              <div class="fs-2"></div>

              <h4 class="h6 fw-bold">{{ libro.titulo }}</h4>

              <p class="small text-muted mb-1">
                Autor: {{ libro.autor }}
              </p>

              <p class="small text-muted">
                Categoría: {{ libro.categoria }}
              </p>

              <p class="small text-success">
                Disponibles: {{ libro.disponibles }}
              </p>

              <button
                class="btn btn-success btn-sm w-100"
                [disabled]="libro.disponibles <= 0"
                (click)="solicitar(libro)"
              >
                Solicitar préstamo
              </button>

            </article>
          </div>

        </div>

        <p *ngIf="librosFiltrados.length === 0" class="text-muted mt-3">
          No se encontraron libros.
        </p>
      </section>

      <section class="panel p-4">
        <h3 class="h5">Mis préstamos y solicitudes</h3>

        <p class="small text-muted">
          Aquí solamente aparecen tus propios registros.
        </p>

        <div class="table-responsive">
          <table class="table table-hover align-middle">

            <thead>
              <tr>
                <th>Código</th>
                <th>Libro</th>
                <th>Fecha de solicitud</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let prestamo of misPrestamos">
                <td>{{ prestamo.codigo }}</td>

                <td>
                  {{ nombreLibro(prestamo.libroId) }}
                </td>

                <td>{{ prestamo.fechaSolicitud }}</td>

                <td>
                  <span class="badge bg-secondary">
                    {{ prestamo.estado }}
                  </span>
                </td>
              </tr>

              <tr *ngIf="misPrestamos.length === 0">
                <td colspan="4" class="text-center text-muted">
                  Todavía no tienes solicitudes.
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </section>

    </main>
  `
})
export class EstudianteDashboardComponent implements OnInit {

  private api = 'http://localhost:3000';

  libros: Libro[] = [];
  misPrestamos: Prestamo[] = [];

  busqueda = '';
  mensaje = '';

  constructor(
    public auth: EstudianteAuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  async ngOnInit() {
    if (!this.auth.estaAutenticado) {
      this.router.navigate(['/estudiante/login']);
      return;
    }

    await this.cargarDatos();
  }

  get librosFiltrados(): Libro[] {
    const texto = this.busqueda.toLowerCase();

    return this.libros.filter(libro =>
      libro.estado === 'activo' &&
      (
        libro.titulo.toLowerCase().includes(texto) ||
        libro.autor.toLowerCase().includes(texto) ||
        libro.categoria.toLowerCase().includes(texto)
      )
    );
  }

  async cargarDatos() {
    const estudianteId = this.auth.estudiante!.id;

    const [libros, prestamos] = await Promise.all([
      firstValueFrom(
        this.http.get<Libro[]>(`${this.api}/libros`)
      ),
      firstValueFrom(
        this.http.get<Prestamo[]>(
          `${this.api}/prestamos`,
          { params: { estudianteId: String(estudianteId) } }
        )
      )
    ]);

    this.libros = libros;
    this.misPrestamos = prestamos;
  }

  nombreLibro(id: number): string {
    return this.libros.find(l => l.id === id)?.titulo
      || 'Libro no encontrado';
  }

  async solicitar(libro: Libro) {
    const estudiante = this.auth.estudiante!;

    const activos = this.misPrestamos.filter(p =>
      p.estado === 'pendiente' || p.estado === 'aprobado'
    );

    if (activos.length >= 3) {
      this.mensaje = 'Ya tienes el máximo de 3 solicitudes o préstamos activos.';
      return;
    }

    if (activos.some(p => p.libroId === libro.id)) {
      this.mensaje = 'Ya tienes una solicitud o préstamo activo de este libro.';
      return;
    }

    if (libro.disponibles <= 0) {
      this.mensaje = 'No hay ejemplares disponibles.';
      return;
    }

    const nuevoPrestamo = {
      codigo: `SOL-${Date.now()}`,
      libroId: libro.id,
      estudianteId: estudiante.id,
      fechaSolicitud: this.obtenerFechaLocal(),
      fechaPrestamo: null,
      fechaDevolucion: null,
      estado: 'pendiente'
    };

    try {
      await firstValueFrom(
        this.http.post(`${this.api}/prestamos`, nuevoPrestamo)
      );

      this.mensaje = 'Solicitud enviada. Espera la aprobación del administrador.';
      await this.cargarDatos();

    } catch {
      this.mensaje = 'No se pudo registrar la solicitud.';
    }
  }

  salir() {
    this.auth.logout();
    this.router.navigate(['/estudiante/login']);
  }

  obtenerFechaLocal(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
