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
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

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
                  //
                  this.permiso_Listar_partida = true;
                  this.permiso_Agregar_partida = true;
                  this.permiso_Actualizar_partida = true;
                  this.permiso_Eliminar_partida = true;
                  this.permiso_Listar_proceso_partida = true;
                /* let permisosSesion: PerfilRolModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoPartida.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPartida.Listar_partida);
                  this.permiso_Agregar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPartida.Agregar_partida);
                  this.permiso_Actualizar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPartida.Actualizar_partida);
                  this.permiso_Eliminar_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPartida.Eliminar_partida);
                  this.permiso_Listar_proceso_partida = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoPartida.Listar_proceso_partida);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {

    this.Partidas = await this.obtenerPartidas();

    this.dataSource = new MatTableDataSource<PartidaModel>(this.Partidas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Partidas por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

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
      console.log(result);
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
      console.log(result);
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
