import { SesionModel } from './modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public user  = null

  constructor(private router: Router) {
    this.user = localStorage.getItem(KeysStorageEnum.USER);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.user = localStorage.getItem(KeysStorageEnum.USER);
      console.log("this.user :" + this.user ? 'lleno' : 'vacio');
      if (!this.user) {
        localStorage.removeItem(KeysStorageEnum.USER);
        return this.router.navigate(['/login']).then(() => false);
      } else {

      }
    return true;
  }

}
