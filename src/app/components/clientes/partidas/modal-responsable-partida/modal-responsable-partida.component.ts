import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { PartidaFormModel, PartidaModel } from 'src/app/modelos/partidas.model';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { UsuarioModel } from 'src/app/modelos/usuario.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-responsable-partida',
  templateUrl: './modal-responsable-partida.component.html',
  styleUrls: ['./modal-responsable-partida.component.scss']
})
export class ModalResponsablePartidaComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  formResponsablePartida: FormGroup;
  responsablePartidaModel: PartidaFormModel = new PartidaFormModel();

  listaUsuarios: UsuarioModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public partida: PartidaModel,
              private dialogRef: MatDialogRef<ModalResponsablePartidaComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {

                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

                /* if(partida != null){
                  this.responsablePartidaModel.id = this.partida.id;
                  this.responsablePartidaModel.descripcion = this.partida.descripcion;
                  this.responsablePartidaModel.nombre = this.partida.nombre;

                } else {
                  this.responsablePartidaModel = new PartidaFormModel();
                } */

                  this.responsablePartidaModel.id = this.partida.id;
                  this.responsablePartidaModel.descripcion = this.partida.descripcion;
                  this.responsablePartidaModel.nombre = this.partida.nombre;
                  this.responsablePartidaModel.catClienteId = this.partida.catClienteId;


                this.iniciarForm();
               }

  async ngOnInit() {
    //this.listaSectores = await this.obtenerSectores();
    this.listaUsuarios = await this.obtenerUsuarios();
    this.listaUsuarios = this.listaUsuarios.filter((x)=> x.administrador != true);

    this.inicializarForm();
  }


  public async obtenerUsuarios(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoUsuarios();
    return respuesta.exito ? respuesta.respuesta : [];
  }



  get responsable() { return this.formResponsablePartida.get('responsable') }

  public iniciarForm(){
    this.formResponsablePartida = this.formBuilder.group({
      responsable: ['', [Validators.required]],
    });
  }


  public inicializarForm() {
    this.responsable.setValue(this.partida.usuarioResponsableId);
  }

  public async guardarResponsable(){

    this.responsablePartidaModel.id = this.partida.id;
    this.responsablePartidaModel.usuarioResponsableId = this.responsable.value;
    this.responsablePartidaModel.catClienteId = this.partida.catClienteId;
    this.responsablePartidaModel.nombre = this.partida.nombre;
    this.responsablePartidaModel.descripcion = this.partida.descripcion;

    const respuesta =  await this.mesaValidacionService.actualizarPartida(this.responsablePartidaModel);

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
