import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { ProyectoFormModel, ProyectoModel } from 'src/app/modelos/proyectos.model';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-proyecto',
  templateUrl: './modal-proyecto.component.html',
  styleUrls: ['./modal-proyecto.component.scss']
})
export class ModalProyectoComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  formProyecto: FormGroup;
  proyectoModel: ProyectoFormModel = new ProyectoFormModel();
  listaSectores: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public proyecto: ProyectoModel,
    private dialogRef: MatDialogRef<ModalProyectoComponent>,
    private formBuilder: FormBuilder,
    private swalService: SwalServices,
    private mesaValidacionService: MesaValidacionService
  ) {
    let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

    this.proyectoModel.id = this.proyecto.id;
    this.proyectoModel.nombre = this.proyecto.nombre;
    this.proyectoModel.tblPeriodoId = this.proyecto.tblPeriodoId;

    this.iniciarForm();
  }

  async ngOnInit() {
    //this.listaSectores = await this.obtenerSectores();
    if(this.proyecto.tblPeriodoId !== 0) {
      this.proyectoModel.tblPeriodoId = this.proyecto.tblPeriodoId
    }
    
    this.inicializarForm();
  }


  public async obtenerSectores(){
/*     const respuesta = await this.mesaValidacionService.obtenerCatalogoSectores();
    return respuesta; */
  }


  get descripcion() { return this.formProyecto.get('descripcion') }
  get nombre() { return this.formProyecto.get('nombre') }





  public iniciarForm(){
    this.formProyecto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
    });
  }


  public inicializarForm() {
    this.nombre.setValue(this.proyectoModel.nombre);
  }

  public async guardarProyecto() {
    this.proyectoModel.nombre = this.nombre.value;

    const respuesta =  this.proyectoModel.id > 0 ? await this.mesaValidacionService.actualizarProyecto(this.proyectoModel) : 
      await this.mesaValidacionService.insertarProyecto(this.proyectoModel);

    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.close(true);
    } else {
      if(!this.proyectoModel.tblPeriodoId) {
        this.swalService.alertaPersonalizada(false, 'Para agregar un proyecto primero debes seleccionar los campos anteriores.')
        return
      }

      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }

  close(result: boolean) {
    this.dialogRef.close(result);
  }

}
