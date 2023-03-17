import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { PartidaFormModel, PartidaModel } from 'src/app/modelos/partidas.model';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-partida',
  templateUrl: './modal-partida.component.html',
  styleUrls: ['./modal-partida.component.scss']
})
export class ModalPartidaComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  formPartida: FormGroup;
  partidaModel: PartidaFormModel = new PartidaFormModel();
  listaSectores: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public partida: PartidaModel,
              private dialogRef: MatDialogRef<ModalPartidaComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {

                let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

                /* if(partida != null){
                  this.partidaModel.id = this.partida.id;
                  this.partidaModel.descripcion = this.partida.descripcion;
                  this.partidaModel.nombre = this.partida.nombre;

                } else {
                  this.partidaModel = new PartidaFormModel();
                } */

                  this.partidaModel.id = this.partida.id;
                  this.partidaModel.descripcion = this.partida.descripcion;
                  this.partidaModel.nombre = this.partida.nombre;
                  this.partidaModel.catClienteId = this.partida.catClienteId;


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


  get descripcion() { return this.formPartida.get('descripcion') }
  get nombre() { return this.formPartida.get('nombre') }





  public iniciarForm(){
    this.formPartida = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
    });
  }


  public inicializarForm() {
    this.descripcion.setValue(this.partidaModel.descripcion);
    this.nombre.setValue(this.partidaModel.nombre);
  }

  public async guardarPartida(){
    //this.partidaModel.id = 0;
    this.partidaModel.descripcion = this.descripcion.value;
    this.partidaModel.nombre = this.nombre.value;
    this.partidaModel.catClienteId = this.partida.catClienteId;


    const respuesta =  this.partidaModel.id > 0 ? await this.mesaValidacionService.actualizarPartida(this.partidaModel) : await this.mesaValidacionService.insertarPartida(this.partidaModel);

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
