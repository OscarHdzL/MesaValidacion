import { SesionModel } from './../modelos/sesion.model';
import { LoginModel } from './../modelos/login.model';
import { MesaValidacionService } from './../servicios/mesa-validacion.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
      let res: ILoginRespuesta = await this.authService.Login(this.form.value as LoginModel)

      if(res.exito == true) {

        let sesion = res.respuesta as SesionModel
        localStorage.setItem(KeysStorageEnum.USER, JSON.stringify(sesion));
        this.router.navigate(['components/home']);
      } else {
        this.errorMessage = true
        return
      }
    } catch (error) {
      this.errorMessage = true
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
