import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: string = 'usuarios' ): any {

    let url = `${URL_SERVICIOS}/imagen`;

    if ( !img ) { return `${url}/not-found/xxx`; }

    if ( img.indexOf('https') >= 0 ) { return img; }

    switch ( tipo ) {
      case 'usuarios':
        url += `/usuarios/${img}`;
        break;
      case 'medicos':
        url += `/medicos/${img}`;
        break;
      case 'hospitales':
        url += `/hospitales/${img}`;
        break;
      default:
        url += '/not-found/xxx';
        break;
    }

    return url;
  }

}
