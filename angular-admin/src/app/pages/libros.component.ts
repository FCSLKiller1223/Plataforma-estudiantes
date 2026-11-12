import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BibliotecaService } from '../services/biblioteca.service';
import { Libro } from '../models';
import { StockBajoDirective } from '../directives/stock-bajo.directive';

@Component({
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink, StockBajoDirective],
  template: `
    <main class="page-wrap">

      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 class="h2 fw-bold mb-1">Catálogo de libros</h1>
          <p class="muted mb-0">
            El administrador mantiene actualizado el inventario.
          </p>
        </div>

        <a routerLink="/libros/nuevo" class="btn btn-primary">
          + Nuevo libro
        </a>
      </div>

      <section class="panel p-3 mb-3">
        <div class="row g-2">

          <div class="col-md-8">
            <input
              class="form-control"
              [(ngModel)]="busqueda"
              placeholder="Buscar por título, autor o ISBN..."
            >
          </div>

          <div class="col-md-4">
            <select class="form-select" [(ngModel)]="categoria">
              <option value="">Todas las categorías</option>
              <option *ngFor="let c of categorias" [value]="c">
                {{ c }}
              </option>
            </select>
          </div>

        </div>
      </section>

      <div class="panel overflow-hidden">
        <div class="table-responsive">
          <table class="table align-middle mb-0">

            <thead class="table-light">
              <tr>
                <th>Libro</th>
                <th>Categoría</th>
                <th>Ejemplares</th>
                <th>Disponibles</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr
                *ngFor="let l of filtrados"
                [appStockBajo]="l.disponibles"
              >

                <td>
                  <div class="book-title">{{ l.titulo }}</div>
                  <div class="small muted">
                    {{ l.autor }} · {{ l.isbn }}
                  </div>
                </td>

                <td>{{ l.categoria }}</td>
                <td>{{ l.ejemplares }}</td>

                <td>
                  <span
                    class="badge"
                    [class.text-bg-warning]="l.disponibles <= 1"
                    [class.text-bg-success]="l.disponibles > 1"
                  >
                    {{ l.disponibles }}
                  </span>
                </td>

                <td>
                  <span class="badge text-bg-success" *ngIf="l.estado === 'activo'">
                    Activo
                  </span>

                  <span class="badge text-bg-secondary" *ngIf="l.estado !== 'activo'">
                    Inactivo
                  </span>
                </td>

                <td class="text-end text-nowrap">

                  <a
                    class="btn btn-sm btn-outline-secondary me-1"
                    [routerLink]="['/libros', l.id]"
                  >
                    Ver
                  </a>

                  <a
                    class="btn btn-sm btn-outline-primary me-1"
                    [routerLink]="['/libros', l.id, 'editar']"
                  >
                    Editar
                  </a>

                  <button
                    class="btn btn-sm btn-outline-danger"
                    (click)="eliminar(l)"
                  >
                    Eliminar
                  </button>

                </td>
              </tr>

              <tr *ngIf="!filtrados.length">
                <td colspan="6" class="text-center muted py-4">
                  No se encontraron libros.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div class="small muted mt-2">
        * Filas resaltadas: disponibilidad crítica (1 ejemplar o menos).
      </div>

      <div class="alert alert-danger mt-3" *ngIf="error">
        {{ error }}
      </div>

    </main>
  `
})
export class LibrosComponent implements OnInit {

  libros: Libro[] = [];
  busqueda = '';
  categoria = '';
  error = '';

  constructor(private api: BibliotecaService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api.listarLibros().subscribe({
      next: x => this.libros = x,
      error: () => this.error = 'No se pudo cargar el catálogo.'
    });
  }

  get categorias() {
    return [...new Set(this.libros.map(l => l.categoria))];
  }

  get filtrados() {
    const q = this.busqueda.toLowerCase();

    return this.libros.filter(
      l =>
        (!this.categoria || l.categoria === this.categoria) &&
        [l.titulo, l.autor, l.isbn].some(v => v.toLowerCase().includes(q))
    );
  }

  eliminar(l: Libro) {
    if (!confirm(`¿Eliminar "${l.titulo}"?`)) return;

    this.api.listarPrestamos().subscribe(ps => {

      if (
        ps.some(
          p =>
            p.libroId === l.id &&
            ['pendiente', 'aprobado'].includes(p.estado)
        )
      ) {
        this.error = 'No se puede eliminar: tiene solicitudes pendientes o préstamos aprobados.';
        return;
      }

      this.api.eliminarLibro(l.id!).subscribe({
        next: () => this.cargar(),
        error: () => this.error = 'No se pudo eliminar el libro.'
      });

    });
  }
}