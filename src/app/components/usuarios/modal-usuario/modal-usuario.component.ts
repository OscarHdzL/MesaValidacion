import { MesaValidacionService } from './../../../servicios/mesa-validacion.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioFormModel, UsuarioModel } from 'src/app/modelos/usuario.model';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {

  formUsuario: FormGroup;
  usuarioModel: UsuarioFormModel = new UsuarioFormModel();
  listaSectores: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public usuario: UsuarioModel,
              private dialogRef: MatDialogRef<ModalUsuarioComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {

                if(usuario != null){
                  this.usuarioModel.id = this.usuario.id;
                  this.usuarioModel.nombre = this.usuario.nombre;
                  this.usuarioModel.correo = this.usuario.correo;
                } else {
                  this.usuarioModel = new UsuarioFormModel();
                }


                this.iniciarForm();
               }

  async ngOnInit() {
    //this.listaSectores = await this.obtenerSectores();

    this.inicializarForm();
  }


  public async obtenerSectores(){
/*     const respuesta = await this.mesaValidacionService.obtenerCatalogoSectores();
    return respuesta; */
  }

  get nombre() { return this.formUsuario.get('nombre') }
  get correo() { return this.formUsuario.get('correo') }

  public iniciarForm(){
    this.formUsuario = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  public inicializarForm() {
    this.nombre.setValue(this.usuarioModel.nombre);
    this.correo.setValue(this.usuarioModel.correo);
  }

  public async guardarUsuario(){
    //this.usuarioModel.id = 0;
    this.usuarioModel.nombre = this.nombre.value;
    this.usuarioModel.correo = this.correo.value;

    const respuesta =  this.usuarioModel.id > 0 ? await this.mesaValidacionService.actualizarUsuario(this.usuarioModel) : await this.mesaValidacionService.insertarUsuario(this.usuarioModel);

    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.close(true);
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }

  }

  close(result: boolean) {
    this.dialogRef.close(result);
  }

}
