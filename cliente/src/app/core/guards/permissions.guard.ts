import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(public srvMenu: MenuService,
    ) {}

  canActivate(
    route: any, // Modificar el tipo del parámetro route a any
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  let path: string = state.url;
  //eliminar el primer caracter del path
   path = path.substring(1);
  //  console.log('guardsss', this.srvMenu.permisos)
  
    if (this.permisoVer(path)) {
      return true;
    }

    window.location.href = '/denegado';
    return false;
  }

  permisoVer(path: string) {
    if(this.srvMenu.permisos ){
      //console.log('entra aqui?')
      return this.srvMenu.permisos?.find(p => p.str_menu_path === path)?.bln_ver 
    } else{
    window.location.href = '/welcome';

      return true
    }
  }
}
