import { PermisosClientePartidaProcesoUsuario } from './../../../enum/PermisosPantallas.enum';

import { ProcesoModel } from 'src/app/modelos/procesos.model';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';


import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { ProcesoUsuarioModel } from 'src/app/modelos/proceso-usuario.model';
import { ModalProcesoUsuarioComponent } from './modal-proceso-usuario/modal-proceso-usuario.component';
import { Funcion, SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';


@Component({
  selector: 'vex-proceso-procesoUsuarios',
  templateUrl: './proceso-usuarios.component.html',
  styleUrls: ['./proceso-usuarios.component.scss']
})
export class ProcesoUsuariosComponent implements OnInit {
  sesionUsuarioActual: SesionModel;

  permiso_Listar_procesoUsuario = false;
  permiso_Agregar_procesoUsuario = false;
  permiso_Actualizar_procesoUsuario = false;
  permiso_Eliminar_procesoUsuario = false;
  permiso_Listar_proyecto_procesoUsuario = false;
  esAdministrador: boolean = false;

  //PERMISOS_USUARIO_PANTALLA: PerfilProcesoUsuarioModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  ProcesoUsuarios: ProcesoUsuarioModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns: TableColumn<any>[] = [
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Correo', property: 'correo', type: 'text', visible: true, cssClasses: ['font-medium'] },

    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  constructor(
              @Inject(MAT_DIALOG_DATA) public procesoModel: ProcesoModel,
              public matPaginatorIntl: MatPaginatorIntl,
              private swalService: SwalServices,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private mesaValidacionService: MesaValidacionService
              ) {
                let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
                  //


                /* let permisosSesion: PerfilProcesoUsuarioModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoProcesoUsuario.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProcesoUsuario.Listar_procesoUsuario);
                  this.permiso_Agregar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProcesoUsuario.Agregar_procesoUsuario);
                  this.permiso_Actualizar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProcesoUsuario.Actualizar_procesoUsuario);
                  this.permiso_Eliminar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProcesoUsuario.Eliminar_procesoUsuario);
                  this.permiso_Listar_proyecto_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProcesoUsuario.Listar_proyecto_procesoUsuario);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {
    this.sesionUsuarioActual.funciones = await this.obtenerFunciones();
    //SE SOBREESCRIBE EL VALOR POR SI HUBO CAMBIOS EN LAS FUNCIONES
    localStorage.setItem(KeysStorageEnum.USER,JSON.stringify(this.sesionUsuarioActual));
    this.definirPermisos();
    this.ProcesoUsuarios = await this.obtenerProcesoUsuarios();

    this.dataSource = new MatTableDataSource<ProcesoUsuarioModel>(this.ProcesoUsuarios);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "ProcesoUsuarios por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

  }


  public async obtenerFunciones(){
    const respuesta = await this.mesaValidacionService.obtenerFuncionesUsuario(this.sesionUsuarioActual.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async definirPermisos(){

    this.esAdministrador = this.sesionUsuarioActual.administrador ? this.sesionUsuarioActual.administrador: false;
    if(this.esAdministrador){
      this.permiso_Listar_procesoUsuario = true;
      this.permiso_Agregar_procesoUsuario = true;
      this.permiso_Actualizar_procesoUsuario = true;
      this.permiso_Eliminar_procesoUsuario = true;
      this.permiso_Listar_proyecto_procesoUsuario = true;
  }
  else {
    let permisosSesion: Funcion[] = this.sesionUsuarioActual.funciones;

    if(permisosSesion.length > 0){
      this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>(permiso.modulo == PermisosClientePartidaProcesoUsuario.MODULO) && permiso.activo == true).map((Y)=>Y.funcion);
      this.permiso_Listar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoUsuario.LISTAR);
      this.permiso_Agregar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoUsuario.AGREGAR);
      this.permiso_Actualizar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoUsuario.EDITAR);
      this.permiso_Eliminar_procesoUsuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoUsuario.ELIMINAR);

    } else {
      this.PERMISOS_USUARIO_PANTALLA = [];
    }
}
  }

  public async obtenerProcesoUsuarios(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoProcesoUsuarios(this.procesoModel.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  openModalProcesoUsuario(procesoUsuario: ProcesoUsuarioModel){

    if(procesoUsuario == null){
      procesoUsuario = new ProcesoUsuarioModel();
      procesoUsuario.tblProcesoId = this.procesoModel.id;
    }

      this.dialog.open(ModalProcesoUsuarioComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: procesoUsuario,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {

        this.ngOnInit();
      });
  }

public async eliminarProcesoUsuario(procesoUsuario: ProcesoUsuarioModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    procesoUsuario.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarProcesoUsuario(procesoUsuario.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}


}
