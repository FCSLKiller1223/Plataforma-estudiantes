
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink  } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    template: `
<main class="login-bg">
    <section class="panel login-card">

        <div class="text-center mb-4">
            <div class="display-5"></div>
            <h1 class="h3 fw-bold mt-2">BiblioUTP</h1>
            <p class="muted mb-0">Acceso al panel administrativo</p>
        </div>

        <div class="alert alert-info small">
            Este acceso es exclusivo para personal administrador de la biblioteca.
        </div>

        <form [formGroup]="form" (ngSubmit)="ingresar()">

            <div class="mb-3">
                <label class="form-label">Correo institucional</label>
                <input class="form-control" type="email" formControlName="correo">

                <div class="text-danger small mt-1"
                    *ngIf="form.controls.correo.touched && form.controls.correo.invalid">
                    Ingresa un correo válido.
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input class="form-control" type="password" formControlName="password">
            </div>

            <div class="alert alert-danger py-2" *ngIf="error">
                {{ error }}
            </div>

            <button class="btn btn-primary w-100 py-2"
                [disabled]="form.invalid || cargando">
                {{ cargando ? 'Verificando...' : 'Ingresar como administrador' }}
            </button>

        </form>

        <div class="text-center mt-3">
            <p class="small text-muted mb-2">
                ¿Eres estudiante?
            </p>

            <a routerLink="/estudiante/login" class="btn btn-outline-success w-100">
                Ingresar al portal del estudiante
            </a>
        </div>

    </section>
</main>
`
})

export class LoginComponent {

    error = '';
    cargando = false;

    form = this.fb.nonNullable.group({
        correo: [
            'admin@biblioutp.edu.pe',
            [Validators.required, Validators.email]
        ],
        password: ['Admin123*', Validators.required]
    });

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) {
        if (auth.estaAutenticado) {
            this.router.navigate(['/']);
        }
    }

    async ingresar() {
        if (this.form.invalid) return;

        this.cargando = true;
        this.error = '';

        const r = await this.auth.login(
            this.form.getRawValue().correo,
            this.form.getRawValue().password
        );

        this.cargando = false;

        if (r.ok) {
            this.router.navigate(['/']);
        } else {
            this.error = r.mensaje;
        }
    }
}
