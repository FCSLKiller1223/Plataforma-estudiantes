import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BibliotecaService } from '../services/biblioteca.service';
import { Libro } from '../models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  template: `
    <main class="page-wrap">

      <a routerLink="/libros" class="small">← Volver al catálogo</a>

      <h1 class="h2 fw-bold mt-2">
        {{ editando ? 'Editar libro' : 'Registrar libro' }}
      </h1>

      <p class="muted">
        Completa los datos bibliográficos y el inventario.
      </p>

      <form class="panel p-4" [formGroup]="form" (ngSubmit)="guardar()">

        <div class="row g-3">

          <div class="col-md-6">
            <label class="form-label">Título *</label>
            <input class="form-control" formControlName="titulo">
            <small class="text-danger" *ngIf="invalido('titulo')">
              El título es obligatorio.
            </small>
          </div>

          <div class="col-md-6">
            <label class="form-label">Autor *</label>
            <input class="form-control" formControlName="autor">
          </div>

          <div class="col-md-4">
            <label class="form-label">Categoría *</label>
            <select class="form-select" formControlName="categoria">
              <option value="">Selecciona</option>
              <option>Programación</option>
              <option>Ingeniería de software</option>
              <option>Bases de datos</option>
              <option>Redes</option>
              <option>Algoritmos</option>
              <option>Matemática</option>
              <option>Otros</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Editorial</label>
            <input class="form-control" formControlName="editorial">
          </div>

          <div class="col-md-4">
            <label class="form-label">Año</label>
            <input class="form-control" type="number" formControlName="anio">
          </div>

          <div class="col-md-6">
            <label class="form-label">ISBN</label>
            <input class="form-control" formControlName="isbn">
          </div>

          <div class="col-md-6">
            <label class="form-label">Estado</label>
            <select class="form-select" formControlName="estado">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Ejemplares totales *</label>
            <input
              class="form-control"
              type="number"
              min="1"
              formControlName="ejemplares"
            >
          </div>

          <div class="col-md-6">
            <label class="form-label">Disponibles *</label>
            <input
              class="form-control"
              type="number"
              min="0"
              formControlName="disponibles"
            >
          </div>

          <div class="col-12">
            <label class="form-label">Descripción</label>
            <textarea
              class="form-control"
              rows="3"
              formControlName="descripcion"
            ></textarea>
          </div>

        </div>

        <div class="alert alert-danger mt-3" *ngIf="error">
          {{ error }}
        </div>

        <div class="d-flex gap-2 justify-content-end mt-4">

          <button
            type="button"
            class="btn btn-light"
            (click)="volver()"
          >
            Cancelar
          </button>

          <button
            class="btn btn-primary"
            [disabled]="form.invalid || guardando"
          >
            {{ guardando ? 'Guardando...' : 'Guardar libro' }}
          </button>

        </div>

      </form>
    </main>
  `
})
export class LibroFormComponent implements OnInit {

  editando = false;
  id = 0;
  error = '';
  guardando = false;

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    autor: ['', Validators.required],
    categoria: ['', Validators.required],
    editorial: [''],
    anio: [null as number | null, [Validators.min(1000), Validators.max(2100)]],
    isbn: [''],
    estado: ['activo' as 'activo' | 'inactivo'],
    ejemplares: [1, [Validators.required, Validators.min(1)]],
    disponibles: [1, [Validators.required, Validators.min(0)]],
    descripcion: ['']
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: BibliotecaService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.editando = true;
      this.id = id;

      this.api.obtenerLibro(id).subscribe({
        next: l => this.form.patchValue(l),
        error: () => this.error = 'No se encontró el libro.'
      });
    }
  }

  invalido(c: string) {
    const x = this.form.get(c);
    return !!x && x.touched && x.invalid;
  }

  volver() {
    this.router.navigate(['/libros']);
  }

  guardar() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    if (Number(v.disponibles) > Number(v.ejemplares)) {
      this.error = 'Los disponibles no pueden superar los ejemplares totales.';
      return;
    }

    this.guardando = true;

    const libro = {
      ...v,
      anio: v.anio ? Number(v.anio) : null,
      ejemplares: Number(v.ejemplares),
      disponibles: Number(v.disponibles)
    } as Libro;

    const req = this.editando
      ? this.api.actualizarLibro(this.id, libro)
      : this.api.crearLibro(libro);

    req.subscribe({
      next: () => this.router.navigate(['/libros']),
      error: () => {
        this.error = 'No se pudo guardar. Verifica que la API esté activa.';
        this.guardando = false;
      }
    });
  }
}