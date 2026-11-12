import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BibliotecaService } from '../services/biblioteca.service';
import { Libro } from '../models';

@Component({
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <main class="page-wrap">

      <a routerLink="/libros" class="small">
        ← Volver al catálogo
      </a>

      <section class="panel p-4 mt-3" *ngIf="libro; else cargando">

        <div class="d-flex justify-content-between flex-wrap gap-3">

          <div>
            <span class="badge text-bg-primary">
              {{ libro.categoria }}
            </span>

            <h1 class="h2 fw-bold mt-3">
              {{ libro.titulo }}
            </h1>

            <p class="lead muted">
              {{ libro.autor }}
            </p>
          </div>

          <a
            class="btn btn-outline-primary align-self-start"
            [routerLink]="['/libros', libro.id, 'editar']"
          >
            Editar libro
          </a>

        </div>

        <hr>

        <div class="row g-3">

          <div class="col-md-6">
            <b>Editorial:</b> {{ libro.editorial || 'No registrada' }}
          </div>

          <div class="col-md-6">
            <b>Año:</b> {{ libro.anio || 'No registrado' }}
          </div>

          <div class="col-md-6">
            <b>ISBN:</b> {{ libro.isbn || 'No registrado' }}
          </div>

          <div class="col-md-6">
            <b>Estado:</b> {{ libro.estado }}
          </div>

          <div class="col-md-6">
            <b>Ejemplares:</b> {{ libro.ejemplares }}
          </div>

          <div class="col-md-6">
            <b>Disponibles:</b> {{ libro.disponibles }}
          </div>

          <div class="col-12">
            <b>Descripción:</b>
            <p class="mt-1">
              {{ libro.descripcion || 'Sin descripción.' }}
            </p>
          </div>

        </div>

      </section>

      <ng-template #cargando>
        <div class="panel p-4">
          Cargando información del libro...
        </div>
      </ng-template>

    </main>
  `
})
export class LibroDetalleComponent implements OnInit {

  libro: Libro | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: BibliotecaService
  ) {}

  ngOnInit() {
    this.api.obtenerLibro(
      Number(this.route.snapshot.paramMap.get('id'))
    ).subscribe({
      next: l => this.libro = l
    });
  }
}