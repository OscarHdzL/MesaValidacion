import { MesaValidacionService } from './../../../servicios/mesa-validacion.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { AreaFormModel, AreaModel } from 'src/app/modelos/area.model';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-area',
  templateUrl: './modal-area.component.html',
  styleUrls: ['./modal-area.component.scss']
})
export class ModalAreaComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  formArea: FormGroup;
  areaModel: AreaFormModel = new AreaFormModel();
  listaSectores: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public area: AreaModel,
              private dialogRef: MatDialogRef<ModalAreaComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {

                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

                if(area != null){
                  this.areaModel.id = this.area.id;
                  this.areaModel.descripcion = this.area.descripcion;
                } else {
                  this.areaModel = new AreaFormModel();
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


  get descripcion() { return this.formArea.get('descripcion') }

  public iniciarForm(){
    this.formArea = this.formBuilder.group({
      descripcion: ['', [Validators.required]]
    });
  }


  public inicializarForm() {
    this.descripcion.setValue(this.areaModel.descripcion);
  }

  public async guardarArea(){
    //this.areaModel.id = 0;
    this.areaModel.descripcion = this.descripcion.value;
    this.areaModel.activo = true;

    const respuesta =  this.areaModel.id > 0 ? await this.mesaValidacionService.actualizarArea(this.areaModel) : await this.mesaValidacionService.insertarArea(this.areaModel);

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
