import { SesionModel } from './modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public user  = null

  constructor(private router: Router,private snackbar: MatSnackBar,) {
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
        let obj = JSON.parse(this.user) as SesionModel
        if(!obj.vigenciaSesion||obj.vigenciaSesion < new Date().getTime())
        {
          console.log(obj.vigenciaSesion + " se superó la vigencia de la sesión: " + new Date().getTime() )
          localStorage.removeItem(KeysStorageEnum.USER);
          this.snackbar.open('Se superó la vigencia de la sesión. Inicie sesión nuevamente.', null, {
            duration: 4000,
            panelClass: 'center'
          });

        return this.router.navigate(['/login']).then(() => false);
        }
      }
    return true;
  }

}
