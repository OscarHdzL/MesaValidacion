import { PermisosClientePartidaProceso, PermisosClientePartidaProcesoUsuario, PermisosClientePartidaProcesoPeriodo } from './../../../enum/PermisosPantallas.enum';
import { ProcesoUsuariosComponent } from './../proceso-usuarios/proceso-usuarios.component';
import { PartidaModel } from './../../../modelos/partidas.model';
import { PeriodosComponent } from './../periodos/periodos.component';
import { ModalProcesoComponent } from './modal-proceso/modal-proceso.component';

import { ProcesoFormModel, ProcesoModel } from './../../../modelos/procesos.model';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';

import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { Funcion, SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

@Component({
  selector: 'vex-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  sesionUsuarioActual: SesionModel;

  permiso_Listar_periodos = false;
  permiso_Listar_usuarios = false;

  permiso_Listar_proceso = false;
  permiso_Agregar_proceso = false;
  permiso_Actualizar_proceso = false;
  permiso_Eliminar_proceso = false;
  permiso_Listar_proceso_periodo = false;
  permiso_Listar_proceso_usuario = false;



  ProcesoModel: ProcesoFormModel = new ProcesoFormModel();
  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Procesos: ProcesoModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  esAdministrador: boolean = false;

  columns: TableColumn<any>[] = [

    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    //{ label: 'Descripción', property: 'descripcion', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];


  constructor(
            @Inject(MAT_DIALOG_DATA) public partidaModel: PartidaModel,
              public matPaginatorIntl: MatPaginatorIntl,
              private swalService: SwalServices,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private mesaValidacionService: MesaValidacionService
              ) {

                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;


               }

  async ngOnInit() {
    this.sesionUsuarioActual.funciones = await this.obtenerFunciones();
    //SE SOBREESCRIBE EL VALOR POR SI HUBO CAMBIOS EN LAS FUNCIONES
    localStorage.setItem(KeysStorageEnum.USER,JSON.stringify(this.sesionUsuarioActual));
    this.definirPermisos();
    this.Procesos = await this.obtenerProcesos();

    this.dataSource = new MatTableDataSource<ProcesoModel>(this.Procesos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Procesos por página";
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
    this.permiso_Listar_proceso = true;
    this.permiso_Agregar_proceso = true;
    this.permiso_Actualizar_proceso = true;
    this.permiso_Eliminar_proceso = true;
    this.permiso_Listar_proceso_periodo = true;
    this.permiso_Listar_usuarios = true;
  }
  else {
    let permisosSesion: Funcion[] = this.sesionUsuarioActual.funciones;

    if(permisosSesion.length > 0){
      this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>(permiso.modulo == PermisosClientePartidaProceso.MODULO || PermisosClientePartidaProcesoUsuario.MODULO) && permiso.activo == true).map((Y)=>Y.funcion);
      this.permiso_Listar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProceso.LISTAR);
      this.permiso_Agregar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProceso.AGREGAR);
      this.permiso_Actualizar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProceso.EDITAR);
      this.permiso_Eliminar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProceso.ELIMINAR);
      this.permiso_Listar_proceso_periodo = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodo.LISTAR);
      this.permiso_Listar_usuarios = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoUsuario.LISTAR);
    } else {
      this.PERMISOS_USUARIO_PANTALLA = [];
    }
}
  }


  public async obtenerProcesos(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoProcesos(this.partidaModel.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalProceso(proceso: ProcesoModel){


    if(proceso == null){
      proceso = new ProcesoModel();
      proceso.tblPartidasId = this.partidaModel.id;
    }

      this.dialog.open(ModalProcesoComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: proceso,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {

        this.ngOnInit();
      });
  }

  openModalPeriodos(proceso: ProcesoModel){

    this.dialog.open(PeriodosComponent,{
      height: '50%',
      width: '100%',
      autoFocus: true,
      data: proceso,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
    }).afterClosed().subscribe(result => {

      this.ngOnInit();
    });
}

openModalProcesoUsuarios(proceso: ProcesoModel){

  this.dialog.open(ProcesoUsuariosComponent,{
    height: '50%',
    width: '100%',
    autoFocus: true,
    data: proceso,
    disableClose: true,
    maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
  }).afterClosed().subscribe(result => {

    this.ngOnInit();
  });
}

public async eliminarProceso(proceso: ProcesoModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    proceso.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarProceso(proceso.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}
}
