import { RolModel } from './../../../../modelos/rol.model';
import { UsuarioModel } from './../../../../modelos/usuario.model';
import { AreaModel } from 'src/app/modelos/area.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartidaFormModel, PartidaModel } from 'src/app/modelos/partidas.model';

import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { ProcesoUsuarioFormModel, ProcesoUsuarioModel } from 'src/app/modelos/proceso-usuario.model';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

@Component({
  selector: 'vex-modal-proceso-usuario',
  templateUrl: './modal-proceso-usuario.component.html',
  styleUrls: ['./modal-proceso-usuario.component.scss']
})
export class ModalProcesoUsuarioComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  listaUsuarios: UsuarioModel[] = [];
  listaRoles: RolModel[] = [];
  formProcesoUsuario: FormGroup;
  procesoUsuarioModel: ProcesoUsuarioFormModel = new ProcesoUsuarioFormModel();


  constructor(@Inject(MAT_DIALOG_DATA) public procesoUsuario: ProcesoUsuarioModel,
              private dialogRef: MatDialogRef<ModalProcesoUsuarioComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {
                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
               /*  if(procesoUsuario != null){
                  this.procesoUsuarioModel.id = this.procesoUsuario.id;
                  this.procesoUsuarioModel.nombre = this.procesoUsuario.nombre;
                  this.procesoUsuarioModel.idArea = this.procesoUsuario.idArea;

                } else {
                  this.procesoUsuarioModel = new ProcesoUsuarioFormModel();
                } */

                this.procesoUsuarioModel.id = this.procesoUsuario.id;
                this.procesoUsuarioModel.tblProcesoId = this.procesoUsuario.tblProcesoId;
                this.procesoUsuarioModel.catUsuarioId = this.procesoUsuario.catUsuarioId;
                this.procesoUsuarioModel.catRolId = this.procesoUsuario.catRolId;
                this.procesoUsuarioModel.catUsuario = this.procesoUsuario.catUsuario;
                this.procesoUsuarioModel.catRol = this.procesoUsuario.catRol;


                this.iniciarForm();
               }

  async ngOnInit() {
    this.listaUsuarios = await this.obtenerUsuarios();
    this.listaUsuarios = this.listaUsuarios.filter((x)=> x.administrador != true);
    this.listaRoles = await this.obtenerRoles();
    this.inicializarForm();
  }


  public async obtenerUsuarios(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoUsuarios();
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerRoles(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoRols();
    return respuesta.exito ? respuesta.respuesta : [];
  }


  get usuario() { return this.formProcesoUsuario.get('usuario') }
  get rol() { return this.formProcesoUsuario.get('rol') }


  public iniciarForm(){
    this.formProcesoUsuario = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      rol: ['', [Validators.required]],
    });
  }


  public inicializarForm() {
    this.usuario.setValue(this.procesoUsuarioModel.catUsuarioId);
    this.rol.setValue(this.procesoUsuarioModel.catRolId);
  }

  public async guardarProcesoUsuario(){
    //this.procesoUsuarioModel.id = 0;
    this.procesoUsuarioModel.catRolId = this.rol.value;
    this.procesoUsuarioModel.catUsuarioId = this.usuario.value;


    const respuesta =  this.procesoUsuarioModel.id > 0 ? await this.mesaValidacionService.actualizarProcesoUsuario(this.procesoUsuarioModel) : await this.mesaValidacionService.insertarProcesoUsuario(this.procesoUsuarioModel);

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
