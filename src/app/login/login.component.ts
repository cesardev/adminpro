import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
// Librería de google
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor(
    public router: Router,
    public usuarioService: UsuarioService
  ) { }

  ngOnInit() {

    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) { this.recuerdame = true; }
  }

  googleInit() {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '1037971167380-vaf8lldgjvauqncv0jb7fg5dvcnc37ru.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle') ); 

    });

  }

  attachSignin( element: any ) {

    this.auth2.attachClickHandler( element, {}, (googleUser: any) => {
      // const profile = googleUser.getBasicProfile();

      const token = googleUser.getAuthResponse().id_token;

      this.usuarioService.loginGoogle( token ).subscribe( () => window.location.href = '#/dashboard' );

    });

  }

  ingresar( forma: NgForm ): void {

    if ( forma.invalid ) { return; }

    const usuario = new Usuario(
      null,
      forma.value.email,
      forma.value.password
    );

    this.usuarioService.login( usuario, forma.value.recuerdame )
      .subscribe( () => this.router.navigate([ '/dashboard' ]) );

  }

}
