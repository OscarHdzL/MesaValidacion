import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartidaFormModel, PartidaModel } from 'src/app/modelos/partidas.model';
import { PeriodoFormModel, PeriodoModel } from 'src/app/modelos/periodos.model';

import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';


@Component({
  selector: 'vex-modal-periodo',
  templateUrl: './modal-periodo.component.html',
  styleUrls: ['./modal-periodo.component.scss']
})
export class ModalPeriodoComponent implements OnInit {

  formPeriodo: FormGroup;
  periodoModel: PeriodoFormModel = new PeriodoFormModel();
  listaAreas: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public periodo: PeriodoModel,
              private dialogRef: MatDialogRef<ModalPeriodoComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {

                /* if(periodo != null){
                  this.periodoModel.id = this.periodo.id;
                  this.periodoModel.nombre = this.periodo.nombre;
                  this.periodoModel.inicio = this.periodo.inicio;
                  this.periodoModel.fin = this.periodo.fin;

                } else {
                  this.periodoModel = new PeriodoFormModel();
                } */
                this.periodoModel.id = this.periodo.id;
                this.periodoModel.nombre = this.periodo.nombre;
                this.periodoModel.inicio = this.periodo.inicio ? this.periodo.inicio.substring(0,10) : this.periodo.inicio;
                this.periodoModel.fin = this.periodo.fin ? this.periodo.fin.substring(0,10) : this.periodo.fin;
                this.periodoModel.tblProcesoId = this.periodo.tblProcesoId;

                this.iniciarForm();
               }

  async ngOnInit() {
    //this.listaAreas = await this.obtenerAreas();

    this.inicializarForm();
  }




  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "La fecha inicio no puede ser mayor que la fecha fin"
        };
      }
      return {};
    }
}


  get nombre() { return this.formPeriodo.get('nombre') }
  get inicio() { return this.formPeriodo.get('inicio') }
  get fin() { return this.formPeriodo.get('fin') }

  get errorFechas(){ return this.formPeriodo.getError('dates')}


  public iniciarForm(){
    this.formPeriodo = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      inicio: ['', [Validators.required]],
      fin: ['', [Validators.required]]
    }, {validator: this.dateLessThan('inicio','fin')} );
  }




  public inicializarForm() {

    this.nombre.setValue(this.periodoModel.nombre);
    this.inicio.setValue(this.periodoModel.inicio);
    this.fin.setValue(this.periodoModel.fin);

  }

  public async guardarPeriodo(){
    //this.periodoModel.id = 0;
    this.periodoModel.nombre = this.nombre.value;
    this.periodoModel.inicio = this.inicio.value;
    this.periodoModel.fin = this.fin.value;


    const respuesta =  this.periodoModel.id > 0 ? await this.mesaValidacionService.actualizarPeriodo(this.periodoModel) : await this.mesaValidacionService.insertarPeriodo(this.periodoModel);

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
