import { ProyectosComponent } from './../proyectos/proyectos.component';
import { ProcesoModel } from './../../../modelos/procesos.model';
import { DocumentosComponent } from './../documentos/documentos.component';
import { ModalPeriodoComponent } from './modal-periodo/modal-periodo.component';


import { PeriodoFormModel, PeriodoModel } from './../../../modelos/periodos.model';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';

import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

@Component({
  selector: 'vex-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss']
})
export class PeriodosComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_periodo = false;
  permiso_Agregar_periodo = false;
  permiso_Actualizar_periodo = false;
  permiso_Eliminar_periodo = false;
  permiso_Listar_periodo_periodo = false;

  PeriodoModel: PeriodoFormModel = new PeriodoFormModel();
  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Periodos: PeriodoModel[] = []; //[{id: 1,nombre: 'da', activo: true, inicio: '', fin: ''}];
  dataSource:any;
  TIPOMATERIA: String;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns: TableColumn<any>[] = [

    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Inicio', property: 'inicio', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Fin', property: 'fin', type: 'text', visible: true, cssClasses: ['font-medium'] },
    /* { label: 'Descripción', property: 'descripcion', type: 'text', visible: true, cssClasses: ['font-medium'] }, */
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
                  this.permiso_Listar_periodo = true;
                  this.permiso_Agregar_periodo = true;
                  this.permiso_Actualizar_periodo = true;
                  this.permiso_Eliminar_periodo = true;
                  this.permiso_Listar_periodo_periodo = true;
                /* let permisosSesion: PerfilRolModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoPeriodo.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_periodo = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPeriodo.Listar_periodo);
                  this.permiso_Agregar_periodo = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPeriodo.Agregar_periodo);
                  this.permiso_Actualizar_periodo = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPeriodo.Actualizar_periodo);
                  this.permiso_Eliminar_periodo = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPeriodo.Eliminar_periodo);
                  this.permiso_Listar_periodo_periodo = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPeriodo.Listar_periodo_periodo);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {

    this.Periodos = await this.obtenerPeriodos();

    this.dataSource = new MatTableDataSource<PeriodoModel>(this.Periodos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Periodos por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

  }

  public async obtenerPeriodos(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoPeriodos(this.procesoModel.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalPeriodo(periodo: PeriodoModel){

    if(periodo==null){
      periodo = new PeriodoModel();
      periodo.tblProcesoId = this.procesoModel.id;
    }

    periodo.tblProceso = this.procesoModel;

      this.dialog.open(ModalPeriodoComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: periodo,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {
        console.log(result);
        this.ngOnInit();
      });
  }

  openModalDocumentos(periodo: PeriodoModel){

    this.dialog.open(DocumentosComponent,{
      height: '50%',
      width: '100%',
      autoFocus: true,
      data: periodo,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit();
    });
}


openModalProyectos(periodo: PeriodoModel){

  this.dialog.open(ProyectosComponent,{
    height: '50%',
    width: '100%',
    autoFocus: true,
    data: periodo,
    disableClose: true,
    maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
  }).afterClosed().subscribe(result => {
    console.log(result);
    this.ngOnInit();
  });
}

public async eliminarPeriodo(periodo: PeriodoModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    periodo.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarPeriodo(periodo.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}
}
