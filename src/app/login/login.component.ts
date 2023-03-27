import { SesionModel } from './../modelos/sesion.model';
import { LoginModel } from './../modelos/login.model';
import { MesaValidacionService } from './../servicios/mesa-validacion.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '../../@vex/animations/fade-in-up.animation';

import { ILoginRespuesta } from '../modelos/ILogin.model';
import { KeysStorageEnum } from '../enum/keysStorage.enum';



@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  inputType = 'password';
  visible = false;
  errorMessage = false

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: MesaValidacionService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login() {
    this.errorMessage = false

    try {
      let res = await this.authService.Login(this.form.value as LoginModel)

      if(res.exito == true) {

        let sesion = res.respuesta as SesionModel
        let fActual = new Date();
        let minutos = 30;
        sesion.vigenciaSesion = new Date().setTime(fActual.getTime() + (minutos * 60 * 1000) )
        console.log(sesion.vigenciaSesion + " se establecio la vigencia" )
        localStorage.setItem(KeysStorageEnum.USER, JSON.stringify(sesion));
        this.router.navigate(['/components/inicio']);
        this.snackbar.open('Acceso correcto', null, {
          duration: 3000,
          panelClass: 'center'
        });
      } else {
        this.errorMessage = true
        this.snackbar.open(res.mensaje, null, {
          duration: 3000
        });
        return
      }
    } catch (error) {
      this.errorMessage = true;
      this.snackbar.open(error.error, null, {
        duration: 3000
      });
      return
    }


  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
