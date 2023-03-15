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


@Component({
  selector: 'vex-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  permiso_Listar_proyecto = false;
  permiso_Agregar_proyecto = false;
  permiso_Actualizar_proyecto = false;
  permiso_Eliminar_proyecto = false;
  permiso_Listar_proyecto_proyecto = false;

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

                  //
                  this.permiso_Listar_proyecto = true;
                  this.permiso_Agregar_proyecto = true;
                  this.permiso_Actualizar_proyecto = true;
                  this.permiso_Eliminar_proyecto = true;
                  this.permiso_Listar_proyecto_proyecto = true;
                /* let permisosSesion: PerfilRolModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoProyecto.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProyecto.Listar_proyecto);
                  this.permiso_Agregar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProyecto.Agregar_proyecto);
                  this.permiso_Actualizar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProyecto.Actualizar_proyecto);
                  this.permiso_Eliminar_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProyecto.Eliminar_proyecto);
                  this.permiso_Listar_proyecto_proyecto = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoProyecto.Listar_proyecto_proyecto);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {

    this.Proyectos = await this.obtenerProyectos();

    this.dataSource = new MatTableDataSource<ProyectoModel>(this.Proyectos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Proyectos por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

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
        console.log(result);
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
    console.log(result);
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
