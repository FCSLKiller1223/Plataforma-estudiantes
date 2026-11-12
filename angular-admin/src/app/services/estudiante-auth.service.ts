
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Estudiante {
  id: number;
  nombre: string;
  correo: string;
  codigo: string;
  rol: string;
}

interface UsuarioAPI extends Estudiante {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteAuthService {
  private api = 'http://localhost:3000';
  private key = 'biblioutp_estudiante_session';

  constructor(private http: HttpClient) {}

  get estudiante(): Estudiante | null {
    const datos = sessionStorage.getItem(this.key);

    if (!datos) return null;

    try {
      return JSON.parse(datos);
    } catch {
      return null;
    }
  }

  get estaAutenticado(): boolean {
    return this.estudiante?.rol === 'estudiante';
  }

  async login(correo: string, password: string): Promise<string | null> {
    try {
      const usuarios = await firstValueFrom(
        this.http.get<UsuarioAPI[]>(`${this.api}/usuarios`, {
          params: { correo }
        })
      );

      const usuario = usuarios.find(
        u =>
          u.correo.toLowerCase() === correo.toLowerCase() &&
          u.password === password
      );

      if (!usuario) {
        return 'Correo o contraseña incorrectos.';
      }

      if (usuario.rol !== 'estudiante') {
        return 'Esta cuenta no pertenece a un estudiante.';
      }

      const { password: _, ...datosSeguros } = usuario;

      sessionStorage.setItem(
        this.key,
        JSON.stringify(datosSeguros)
      );

      return null;

    } catch {
      return 'No se pudo conectar con el servidor.';
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.key);
  }
}
