
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EstudianteAuthService } from '../services/estudiante-auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="login-bg">
      <section class="panel login-card">

        <div class="text-center mb-4">
          <div class="display-5"></div>
          <h1 class="h3 fw-bold mt-2">BiblioUTP</h1>
          <p class="muted">Portal del estudiante</p>
        </div>

        <form (ngSubmit)="ingresar()">

          <div class="mb-3">
            <label class="form-label">Correo institucional</label>
            <input
              class="form-control"
              type="email"
              name="correo"
              [(ngModel)]="correo"
              required
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input
              class="form-control"
              type="password"
              name="password"
              [(ngModel)]="password"
              required
            >
          </div>

          <div class="alert alert-danger" *ngIf="error">
            {{ error }}
          </div>

          <button
            class="btn btn-success w-100"
            type="submit"
            [disabled]="cargando"
          >
            {{ cargando ? 'Verificando...' : 'Ingresar como estudiante' }}
          </button>

        </form>

        <a routerLink="/login" class="d-block text-center mt-3">
          Acceso para administrador
        </a>

      </section>
    </main>
  `
})
export class EstudianteLoginComponent {

  correo = 'u20231234@utp.edu.pe';
  password = 'Est123*';
  error = '';
  cargando = false;

  constructor(
    private auth: EstudianteAuthService,
    private router: Router
  ) {
    if (this.auth.estaAutenticado) {
      this.router.navigate(['/estudiante']);
    }
  }

  async ingresar() {
    this.error = '';
    this.cargando = true;

    const resultado = await this.auth.login(
      this.correo,
      this.password
    );

    this.cargando = false;

    if (resultado) {
      this.error = resultado;
    } else {
      this.router.navigate(['/estudiante']);
    }
  }
}

