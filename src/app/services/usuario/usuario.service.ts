import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map } from 'rxjs/operators';
import swal from 'SweetAlert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {

  private URL: string = URL_SERVICIOS;
  public usuario: Usuario;
  public token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService
  ) { this.cargarStorage(); }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  estaLogueado() { return ( this.token.length > 5 ) ? true : false; }

  guardarStorage( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;

  }

  logout() {

    this.token = '';
    this.usuario = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  loginGoogle( token: string ) {

    return this.http.post( `${this.URL}/login/google`, { token } )
      .pipe( map( (resp: any) => {

        this.guardarStorage( resp.id, resp.token, resp.usuario );

        return true;
      }));

  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) { localStorage.setItem('email', usuario.email); }
    else { localStorage.removeItem('email'); }

    return this.http.post( `${this.URL}/login`, usuario )
      .pipe( map( (resp: any) => {

        this.guardarStorage( resp.id, resp.token, resp.usuario );

        return true;
      }));

  }

  crearUsuario( usuario: Usuario ) {

    return this.http.post( `${this.URL}/usuario`, usuario )
      .pipe( map( (resp: any) => {

        swal('Usuario creado', usuario.email, 'success');

        return  resp.usuario;

      }));

  }

  actualizarUsuario( usuario: Usuario ) {

    const url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;

    return this.http.put( url, usuario )
    .pipe( map(( resp: any ) => {

      const user: Usuario = resp.usuario;

      this.guardarStorage( user._id, this.token, user );

      swal('Usuario actualizado', usuario.nombre, 'success');

      return true;
    }));

  }

  cambiarImagen( archivo: File, id: string ) {

    this.subirArchivoService.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) => {

        this.usuario.img = resp.usuario.img;
        this.guardarStorage( id, this.token, this.usuario );

        swal('Imagen actualizada', this.usuario.nombre, 'success');

      }).catch( resp => {
        console.log(resp);
      });

  }
}
