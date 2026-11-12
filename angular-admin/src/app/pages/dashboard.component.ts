import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BibliotecaService } from '../services/biblioteca.service';
import { Libro, Prestamo } from '../models';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <main class="page-wrap">

      <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <p class="text-primary fw-semibold mb-1">PANEL ADMINISTRATIVO</p>
          <h1 class="h2 fw-bold mb-1">Resumen de biblioteca</h1>
          <p class="muted mb-0">
            Gestiona el catálogo y atiende solicitudes de préstamo.
          </p>
        </div>

        <a routerLink="/libros/nuevo" class="btn btn-primary">
          + Registrar libro
        </a>
      </div>

      <div class="row g-3 mb-4">

        <div class="col-md-3">
          <div class="panel stat-card">
            <div class="muted small">Títulos registrados</div>
            <div class="stat-value">{{ libros.length }}</div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="panel stat-card">
            <div class="muted small">Ejemplares disponibles</div>
            <div class="stat-value">{{ disponibles }}</div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="panel stat-card">
            <div class="muted small">Solicitudes pendientes</div>
            <div class="stat-value">{{ pendientes }}</div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="panel stat-card">
            <div class="muted small">Préstamos aprobados</div>
            <div class="stat-value">{{ aprobados }}</div>
          </div>
        </div>

      </div>

      <div class="row g-3">

        <div class="col-lg-7">
          <section class="panel p-4 h-100">

            <div class="d-flex justify-content-between mb-3">
              <h2 class="h5 fw-bold">Libros con poco stock</h2>
              <a routerLink="/libros" class="small">Ver catálogo</a>
            </div>

            <div *ngIf="!bajoStock.length" class="muted">
              No hay libros con stock crítico.
            </div>

            <div
              *ngFor="let l of bajoStock"
              class="d-flex justify-content-between border-bottom py-2"
            >
              <span class="book-title">{{ l.titulo }}</span>
              <span class="badge text-bg-warning">
                {{ l.disponibles }} disponibles
              </span>
            </div>

          </section>
        </div>

        <div class="col-lg-5">
          <section class="panel p-4 h-100">

            <div class="d-flex justify-content-between mb-3">
              <h2 class="h5 fw-bold">Atención pendiente</h2>
              <a routerLink="/prestamos" class="small">Gestionar</a>
            </div>

            <div *ngIf="!solicitudes.length" class="muted">
              No hay solicitudes pendientes.
            </div>

            <div
              *ngFor="let p of solicitudes"
              class="border-bottom py-2"
            >
              <div class="fw-semibold">{{ p.codigo }}</div>
              <div class="small muted">
                Estudiante #{{ p.estudianteId }} · Libro #{{ p.libroId }}
              </div>
            </div>

          </section>
        </div>

      </div>

    </main>
  `
})
export class DashboardComponent implements OnInit {

  libros: Libro[] = [];
  prestamos: Prestamo[] = [];

  constructor(private api: BibliotecaService) {}

  ngOnInit() {
    forkJoin({
      libros: this.api.listarLibros(),
      prestamos: this.api.listarPrestamos()
    }).subscribe({
      next: r => {
        this.libros = r.libros;
        this.prestamos = r.prestamos;
      }
    });
  }

  get disponibles() {
    return this.libros.reduce((s, l) => s + l.disponibles, 0);
  }

  get pendientes() {
    return this.prestamos.filter(p => p.estado === 'pendiente').length;
  }

  get aprobados() {
    return this.prestamos.filter(p => p.estado === 'aprobado').length;
  }

  get bajoStock() {
    return this.libros.filter(l => l.disponibles <= 1);
  }

  get solicitudes() {
    return this.prestamos
      .filter(p => p.estado === 'pendiente')
      .slice(0, 5);
  }
}