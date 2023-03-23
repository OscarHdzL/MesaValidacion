import { PermisosClientePartidaProceso } from './../../../enum/PermisosPantallas.enum';
import { ModalResponsablePartidaComponent } from './modal-responsable-partida/modal-responsable-partida.component';
import { ClienteModel } from './../../../modelos/cliente.model';
import { ProcesosComponent } from './../procesos/procesos.component';
import { PartidaFormModel, PartidaModel } from './../../../modelos/partidas.model';
import { ModalPartidaComponent } from './modal-partida/modal-partida.component';
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
import { PermisosClientePartida } from 'src/app/enum/PermisosPantallas.enum';
import { debug } from 'console';

@Component({
  selector: 'vex-partidas',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.scss']
})
export class PartidasComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_partida = false;
  permiso_Agregar_partida = false;
  permiso_Actualizar_partida = false;
  permiso_Eliminar_partida = false;
  permiso_Listar_proceso_partida = false;
  permiso_Agregar_responsable_partida= false;
  esAdministrador: boolean = false;

  PartidaModel: PartidaFormModel = new PartidaFormModel();
  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Partidas: PartidaModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  columns: TableColumn<any>[] = [

    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];


  constructor(
            @Inject(MAT_DIALOG_DATA) public clienteModel: ClienteModel,
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
    this.Partidas = await this.obtenerPartidas();

    //USUARIO RESPONSABLE
    if(!this.esAdministrador){
      this.Partidas = this.Partidas.filter((x)=> x.usuarioResponsableId == this.sesionUsuarioActual.id);
    }

    this.dataSource = new MatTableDataSource<PartidaModel>(this.Partidas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Partidas por página";
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
                  this.permiso_Listar_proceso_partida = false;
                  this.permiso_Listar_partida = true;
                  this.permiso_Agregar_partida = true;
                  this.permiso_Actualizar_partida = true;
                  this.permiso_Eliminar_partida = true;
                  this.permiso_Agregar_responsable_partida = true;
                } else {
                  let permisosSesion: Funcion[] = this.sesionUsuarioActual.funciones;

                  if(permisosSesion.length > 0){
                    this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>(permiso.modulo == PermisosClientePartida.MODULO || PermisosClientePartida.MODULO) && permiso.activo == true ).map((Y)=>Y.funcion);
                    this.permiso_Listar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartida.LISTAR);
                    this.permiso_Agregar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartida.AGREGAR);
                    this.permiso_Actualizar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartida.EDITAR);
                    this.permiso_Eliminar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartida.ELIMINAR);
                    this.permiso_Listar_proceso_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProceso.LISTAR);
                    this.permiso_Agregar_responsable_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartida.ASIGNAR);

                  } else {
                    this.PERMISOS_USUARIO_PANTALLA = [];
                  }
                }
  }

  public async obtenerPartidas(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoPartidas(this.clienteModel.id);
    return respuesta.exito? respuesta.respuesta: [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalPartida(partida: PartidaModel){
    if(partida == null){
      partida = new PartidaModel();
      partida.catClienteId = this.clienteModel.id;
    }

    this.dialog.open(ModalPartidaComponent,{
      height: '45%',
      width: '100%',
      autoFocus: true,
      data: partida,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      //maxWidth: '90%'
    }).afterClosed().subscribe(result => {

      this.ngOnInit();
    });
  }



  openModalResponsablePartida(partida: PartidaModel){

    this.dialog.open(ModalResponsablePartidaComponent,{
      height: '30%',
      width: '90%',
      autoFocus: true,
      data: partida,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      //maxWidth: '90%'
    }).afterClosed().subscribe(result => {

      this.ngOnInit();
    });
  }

  openModalProcesos(partida: PartidaModel){

    this.dialog.open(ProcesosComponent,{
      height: '50%',
      width: '100%',
      autoFocus: true,
      data: partida,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
    }).afterClosed().subscribe(result => {

      this.ngOnInit();
    });
}

public async eliminarPartida(partida: PartidaModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    partida.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarPartida(partida.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}
}
