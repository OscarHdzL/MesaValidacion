import { PermisosClientePartidaProcesoPeriodoDocumento } from './../../../enum/PermisosPantallas.enum';
import { PeriodoModel } from './../../../modelos/periodos.model';
import { ModalDocumentoComponent } from './modal-documento/modal-documento.component';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { DocumentoModel } from 'src/app/modelos/documentos.model';
import { Funcion, SesionModel } from 'src/app/modelos/sesion.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';


@Component({
  selector: 'vex-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_documento = false;
  permiso_Agregar_documento = false;
  permiso_Actualizar_documento = false;
  permiso_Eliminar_documento = false;
  permiso_Listar_proyecto_documento = false;
  esAdministrador: boolean = false;


  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Documentos: DocumentoModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  columns: TableColumn<any>[] = [
    //{ label: 'Descripcion', property: 'descripcion', type: 'text', visible: true, cssClasses: ['font-medium'] },
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
    this.Documentos = await this.obtenerDocumentos();

    this.dataSource = new MatTableDataSource<DocumentoModel>(this.Documentos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Documentos por página";
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
      this.permiso_Listar_documento = true;
      this.permiso_Agregar_documento = true;
      this.permiso_Actualizar_documento = true;
      this.permiso_Eliminar_documento = true;
      this.permiso_Listar_proyecto_documento = true;
    }else{

      let permisosSesion: Funcion[] = this.sesionUsuarioActual.funciones;

      if(permisosSesion.length > 0){
        this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso) => (permiso.modulo == PermisosClientePartidaProcesoPeriodoDocumento.MODULO) && permiso.activo == true).map((Y)=>Y.funcion);
        this.permiso_Listar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.LISTAR);
        this.permiso_Agregar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.AGREGAR);
        this.permiso_Actualizar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.EDITAR);
        this.permiso_Eliminar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.ELIMINAR);

      } else {
        this.PERMISOS_USUARIO_PANTALLA = [];
      }
    }

  }

  public async obtenerDocumentos(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoDocumentos(this.periodoModel.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalDocumento(documento: DocumentoModel){


    if(documento == null){
      documento = new DocumentoModel();
      documento.tblPeriodoId = this.periodoModel.id;
    }

      this.dialog.open(ModalDocumentoComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: documento,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {

        this.ngOnInit();
      });
  }

/*   openModalPartidasDocumento(documento: DocumentoModel){

    this.dialog.open(PartidasComponent,{
      height: '50%',
      width: '100%',
      autoFocus: true,
      data: documento,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit();
    });
} */

public async eliminarDocumento(documento: DocumentoModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    documento.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarDocumento(documento.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}

}
