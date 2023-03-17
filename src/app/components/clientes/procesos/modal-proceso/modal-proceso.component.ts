import { AreaModel } from 'src/app/modelos/area.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartidaFormModel, PartidaModel } from 'src/app/modelos/partidas.model';
import { ProcesoFormModel, ProcesoModel } from 'src/app/modelos/procesos.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

@Component({
  selector: 'vex-modal-proceso',
  templateUrl: './modal-proceso.component.html',
  styleUrls: ['./modal-proceso.component.scss']
})
export class ModalProcesoComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  listaAreas: AreaModel[] = [];
  formProceso: FormGroup;
  procesoModel: ProcesoFormModel = new ProcesoFormModel();


  constructor(@Inject(MAT_DIALOG_DATA) public proceso: ProcesoModel,
              private dialogRef: MatDialogRef<ModalProcesoComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {
                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
               /*  if(proceso != null){
                  this.procesoModel.id = this.proceso.id;
                  this.procesoModel.nombre = this.proceso.nombre;
                  this.procesoModel.idArea = this.proceso.idArea;

                } else {
                  this.procesoModel = new ProcesoFormModel();
                } */

                this.procesoModel = this.proceso;


                this.iniciarForm();
               }

  async ngOnInit() {
    this.listaAreas = await this.obtenerAreas();

    this.inicializarForm();
  }


  public async obtenerAreas(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoAreas();
    return respuesta.exito ? respuesta.respuesta : [];
  }


  get nombre() { return this.formProceso.get('nombre') }
  get area() { return this.formProceso.get('area') }


  public iniciarForm(){
    this.formProceso = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      area: ['', [Validators.required]],
    });
  }


  public inicializarForm() {
    this.nombre.setValue(this.procesoModel.nombre);
    this.area.setValue(this.procesoModel.catAreaId);
  }

  public async guardarProceso(){
    //this.procesoModel.id = 0;
    this.procesoModel.nombre = this.nombre.value;
    this.procesoModel.catAreaId = this.area.value;


    const respuesta =  this.procesoModel.id > 0 ? await this.mesaValidacionService.actualizarProceso(this.procesoModel) : await this.mesaValidacionService.insertarProceso(this.procesoModel);

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
