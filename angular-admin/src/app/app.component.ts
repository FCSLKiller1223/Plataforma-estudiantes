import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  template: `
    <div class="app-shell">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" *ngIf="auth.estaAutenticado">
        <div class="container-fluid px-4">

          <a class="navbar-brand" routerLink="/">
             BiblioUTP
            <span class="fw-normal opacity-75">/ Admin</span>
          </a>

          <div class="d-flex align-items-center gap-3">
            <a class="text-white text-decoration-none" routerLink="/libros">
              Catálogo
            </a>

            <a class="text-white text-decoration-none" routerLink="/prestamos">
              Préstamos
            </a>

            <span class="text-white-50 small d-none d-md-inline">
              {{ auth.usuario?.nombre }}
            </span>

            <button class="btn btn-outline-light btn-sm" (click)="salir()">
              Cerrar sesión
            </button>
          </div>

        </div>
      </nav>

      <router-outlet />
    </div>
  `
})
export class AppComponent {

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  salir() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}