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
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

@Component({
  selector: 'vex-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_proceso = false;
  permiso_Agregar_proceso = false;
  permiso_Actualizar_proceso = false;
  permiso_Eliminar_proceso = false;
  permiso_Listar_proceso_proceso = false;

  ProcesoModel: ProcesoFormModel = new ProcesoFormModel();
  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Procesos: ProcesoModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
                  //
                  this.permiso_Listar_proceso = true;
                  this.permiso_Agregar_proceso = true;
                  this.permiso_Actualizar_proceso = true;
                  this.permiso_Eliminar_proceso = true;
                  this.permiso_Listar_proceso_proceso = true;
                /* let permisosSesion: PerfilRolModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoProceso.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProceso.Listar_proceso);
                  this.permiso_Agregar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProceso.Agregar_proceso);
                  this.permiso_Actualizar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProceso.Actualizar_proceso);
                  this.permiso_Eliminar_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProceso.Eliminar_proceso);
                  this.permiso_Listar_proceso_proceso = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProceso.Listar_proceso_proceso);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {

    this.Procesos = await this.obtenerProcesos();

    this.dataSource = new MatTableDataSource<ProcesoModel>(this.Procesos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Procesos por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

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
        console.log(result);
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
      console.log(result);
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
    console.log(result);
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
