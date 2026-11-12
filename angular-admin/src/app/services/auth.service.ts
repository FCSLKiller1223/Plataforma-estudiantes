import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly api = 'http://localhost:3000';
  private readonly key = 'biblioutp_admin_session';

  constructor(private http: HttpClient) {}

  get usuario(): Usuario | null {
    const raw = sessionStorage.getItem(this.key);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  get estaAutenticado() {
    return this.usuario?.rol === 'admin';
  }

  async login(correo: string, password: string): Promise<{ ok: boolean; mensaje: string }> {
    try {
      const usuarios = await firstValueFrom(
        this.http.get<Usuario[]>(`${this.api}/usuarios`, {
          params: { correo }
        })
      );

      const usuario = usuarios.find(
        u =>
          u.correo.toLowerCase() === correo.toLowerCase() &&
          u.password === password
      );

      if (!usuario) {
        return {
          ok: false,
          mensaje: 'Correo o contraseña incorrectos.'
        };
      }

      if (usuario.rol !== 'admin') {
        return {
          ok: false,
          mensaje: 'Acceso denegado: esta cuenta es de estudiante. El panel es exclusivo del administrador.'
        };
      }

      const { password: _password, ...seguro } = usuario;

      sessionStorage.setItem(this.key, JSON.stringify(seguro));

      return {
        ok: true,
        mensaje: 'Bienvenido al panel administrativo.'
      };

    } catch {
      return {
        ok: false,
        mensaje: 'No se pudo conectar con la API. Verifica JSON Server en el puerto 3000.'
      };
    }
  }

  logout() {
    sessionStorage.removeItem(this.key);
  }
}