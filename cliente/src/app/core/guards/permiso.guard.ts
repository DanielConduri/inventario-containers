import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CasClient } from '../security/CasClient/CasClient';

@Injectable({
  providedIn: 'root',
})
export class PermisoGuard implements CanActivate {
  constructor(private casclient: CasClient) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.hasUser()) {
      return true;
    }
    window.location.href = '/denegado';
    return false;
  }

  hasUser(): boolean {
    return this.casclient.isAuthenticated() && !!this.casclient.getLogin();
  }
}
