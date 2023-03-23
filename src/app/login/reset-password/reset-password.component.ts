import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { LoginModel } from 'src/app/modelos/login.model';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';

@Component({
  selector: 'vex-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: UntypedFormGroup;
  inputType = 'password';
  visible = false;


  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: MesaValidacionService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      user: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  async login() {



    try {
      let res = await this.authService.ResetPassword(this.form.value as LoginModel)

      if(res.exito == true) {

        this.router.navigate(['/login']);
        this.snackbar.open(res.mensaje, null, {
          duration: 3000
        });
      } else {

        this.snackbar.open(res.mensaje, null, {
          duration: 3000
        });
        return
      }
    } catch (error) {

      this.snackbar.open(error.error, null, {
        duration: 3000
      });
      return
    }


  }

}
