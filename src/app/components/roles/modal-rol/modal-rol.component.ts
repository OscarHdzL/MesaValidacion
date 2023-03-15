import { MesaValidacionService } from './../../../servicios/mesa-validacion.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolFormModel, RolModel } from 'src/app/modelos/rol.model';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-rol',
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.scss']
})
export class ModalRolComponent implements OnInit {

  formRol: FormGroup;
  rolModel: RolFormModel = new RolFormModel();
  listaSectores: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public rol: RolModel,
              private dialogRef: MatDialogRef<ModalRolComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {

                if(rol != null){
                  this.rolModel.id = this.rol.id;
                  this.rolModel.descripcion = this.rol.descripcion;
                } else {
                  this.rolModel = new RolFormModel();
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

  get descripcion() { return this.formRol.get('descripcion') }

  public iniciarForm(){
    this.formRol = this.formBuilder.group({
      descripcion: ['', [Validators.required]]
    });
  }

  public inicializarForm() {
    this.descripcion.setValue(this.rolModel.descripcion);
  }

  public async guardarRol(){
    //this.rolModel.id = 0;
    this.rolModel.descripcion = this.descripcion.value;
    this.rolModel.activo = true;

    const respuesta =  this.rolModel.id > 0 ? await this.mesaValidacionService.actualizarRol(this.rolModel) : await this.mesaValidacionService.insertarRol(this.rolModel);

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
