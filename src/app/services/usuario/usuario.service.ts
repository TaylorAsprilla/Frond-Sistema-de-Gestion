import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ListarUsuario } from 'src/app/interfaces/listar-usuario.interface';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { RegisterForm } from 'src/app/interfaces/register-form.interface';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario: UsuarioModel;
  public idUsuario: number;

  constructor(private httpClient: HttpClient, private router: Router) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get usuarioId(): string {
    return this.usuario.id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  validarToken(): Observable<boolean> {
    return this.httpClient
      .get(`${base_url}/login/renew/`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((respuesta: any) => {
          const {
            id,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            numero_documento,
            email,
            celular,
            fecha_nacimiento,
            estado,
            documentoTutor,
            id_congregacion,
            id_tipoDocumento,
            id_genero,
            id_vacuna,
            login,
            password,
            carnet,
            imagen = '',
          } = respuesta.usuario;

          this.usuario = new UsuarioModel(
            id,
            primer_nombre,
            primer_apellido,
            numero_documento,
            fecha_nacimiento,
            id_congregacion,
            id_tipoDocumento,
            id_genero,
            estado,
            documentoTutor,
            id_vacuna,
            login,
            password,
            segundo_nombre,
            segundo_apellido,
            celular,
            email,
            1,
            carnet,
            imagen
          );
          localStorage.setItem('token', respuesta.token);
          return true;
        }),

        catchError((error) => {
          console.log(error);
          return of(false);
        })
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.httpClient.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  login(formData: LoginForm) {
    return this.httpClient.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
        sessionStorage.setItem('idUsuario', resp.usuario.id);
      })
    );
  }

  listarUsuarios(desde: number = 0) {
    return this.httpClient.get<ListarUsuario>(`${base_url}/usuarios?desde=${desde}`, this.headers).pipe(
      map((usuariosRespuesta) => {
        const usuarios = usuariosRespuesta.usuarios.map(
          (usuario) =>
            new UsuarioModel(
              usuario.id,
              usuario.primer_nombre,
              usuario.primer_apellido,
              usuario.numero_documento,
              usuario.fecha_nacimiento,
              usuario.id_congregacion,
              usuario.id_tipoDocumento,
              usuario.id_genero,
              usuario.estado,
              usuario.documentoTutor,
              usuario.id_vacuna,
              usuario.login,
              usuario.password,
              usuario.segundo_nombre,
              usuario.segundo_apellido,
              usuario.celular,
              usuario.email,
              usuario.vacuna,
              usuario.carnet,
              usuario.imagen
            )
        );
        return { totalUsuarios: usuariosRespuesta.totalUsuarios, usuarios };
      })
    );
  }

  listarTodosLosUsuarios() {
    return this.httpClient.get<ListarUsuario>(`${base_url}/usuarios/todos`, this.headers).pipe(
      map((usuariosRespuesta) => {
        const usuarios = usuariosRespuesta.usuarios.map(
          (usuario) =>
            new UsuarioModel(
              usuario.id,
              usuario.primer_nombre,
              usuario.primer_apellido,
              usuario.numero_documento,
              usuario.fecha_nacimiento,
              usuario.id_congregacion,
              usuario.id_tipoDocumento,
              usuario.id_genero,
              usuario.estado,
              usuario.documentoTutor,
              usuario.id_vacuna,
              usuario.login,
              usuario.password,
              usuario.segundo_nombre,
              usuario.segundo_apellido,
              usuario.celular,
              usuario.email,
              usuario.vacuna,
              usuario.carnet,
              usuario.imagen
            )
        );
        return { totalUsuarios: usuariosRespuesta.totalUsuarios, usuarios };
      })
    );
  }

  getUsuario(id: string) {
    return this.httpClient
      .get(`${base_url}/usuarios/${id}`, this.headers)
      .pipe(map((usuario: { ok: boolean; usuario: UsuarioModel }) => usuario.usuario));
  }

  eliminarUsuario(usuario: UsuarioModel) {
    return this.httpClient.delete(`${base_url}/usuarios/${usuario.id}`, this.headers);
  }

  actualizarUsuario(usuario: UsuarioModel, id: string) {
    return this.httpClient.put(`${base_url}/usuarios/${id}`, usuario, this.headers);
  }
}
