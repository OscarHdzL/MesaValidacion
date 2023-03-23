import { PermisosClientePartidaProcesoPeriodoProyecto } from './../../../enum/PermisosPantallas.enum';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { PeriodoModel } from 'src/app/modelos/periodos.model';
import { ProyectoFormModel, ProyectoModel } from 'src/app/modelos/proyectos.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { ModalProyectoComponent } from './modal-proyecto/modal-proyecto.component';
import { Funcion, SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';


@Component({
  selector: 'vex-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_proyecto = false;
  permiso_Agregar_proyecto = false;
  permiso_Actualizar_proyecto = false;
  permiso_Eliminar_proyecto = false;
  permiso_Listar_proyecto_proyecto = false;
  esAdministrador: boolean = false;

  ProyectoModel: ProyectoFormModel = new ProyectoFormModel();
  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Proyectos: ProyectoModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns: TableColumn<any>[] = [

    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  constructor(
              @Inject(MAT_DIALOG_DATA) public periodoModel: PeriodoModel,
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
    this.Proyectos = await this.obtenerProyectos();

    this.dataSource = new MatTableDataSource<ProyectoModel>(this.Proyectos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Proyectos por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';


    this.periodoModel
  }



  public async obtenerFunciones(){
    const respuesta = await this.mesaValidacionService.obtenerFuncionesUsuario(this.sesionUsuarioActual.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async definirPermisos(){

this.esAdministrador = this.sesionUsuarioActual.administrador ? this.sesionUsuarioActual.administrador: false;
if(this.esAdministrador){
  this.permiso_Listar_proyecto = true;
  this.permiso_Agregar_proyecto = true;
  this.permiso_Actualizar_proyecto = true;
  this.permiso_Eliminar_proyecto = true;
  this.permiso_Listar_proyecto_proyecto = true;
} else {
  let permisosSesion: Funcion[] = this.sesionUsuarioActual.funciones;

  if(permisosSesion.length > 0){
    this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso) => (permiso.modulo == PermisosClientePartidaProcesoPeriodoProyecto.MODULO) && permiso.activo == true).map((Y)=>Y.funcion);
    this.permiso_Listar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoProyecto.LISTAR);
    this.permiso_Agregar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoProyecto.AGREGAR);
    this.permiso_Actualizar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoProyecto.EDITAR);
    this.permiso_Eliminar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoProyecto.ELIMINAR);
  } else {
    this.PERMISOS_USUARIO_PANTALLA = [];
  }
}
  }

  public async obtenerProyectos(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoProyectos(this.periodoModel.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalProyecto(proyecto: ProyectoModel){

    if(proyecto == null){
      proyecto = new ProyectoModel();
      proyecto.tblPeriodoId = this.periodoModel.id;
    }

      this.dialog.open(ModalProyectoComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: proyecto,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {

        this.ngOnInit();
      });
  }




openModalProyectos(proyecto: ProyectoModel){

  this.dialog.open(ProyectosComponent,{
    height: '50%',
    width: '100%',
    autoFocus: true,
    data: proyecto,
    disableClose: true,
    maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
  }).afterClosed().subscribe(result => {

    this.ngOnInit();
  });
}

public async eliminarProyecto(proyecto: ProyectoModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    proyecto.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarProyecto(proyecto.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}
}
