import { FuncionModel, FuncionUsuarioFormModel, UsuarioModel } from './../../../modelos/usuario.model';
import { PermisosClientePartidaProcesoPeriodoDocumento } from './../../../enum/PermisosPantallas.enum';
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
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'vex-modal-funcion-usuario',
  templateUrl: './modal-funcion-usuario.component.html',
  styleUrls: ['./modal-funcion-usuario.component.scss']
})
export class ModalFuncionUsuarioComponent implements OnInit {
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  sesionUsuarioActual: SesionModel;
  permiso_Listar_documento = false;
  permiso_Agregar_documento = false;
  permiso_Actualizar_documento = false;
  permiso_Eliminar_documento = false;
  permiso_Listar_proyecto_documento = false;
  esAdministrador: boolean = false;

  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Funciones: DocumentoModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  columns: TableColumn<any>[] = [
    //{ label: 'Descripcion', property: 'descripcion', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Módulo', property: 'modulo', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Función', property: 'funcion', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public usuarioModel: UsuarioModel,
              public matPaginatorIntl: MatPaginatorIntl,
              private swalService: SwalServices,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private mesaValidacionService: MesaValidacionService
              ) {

                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
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
                    this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso) => permiso.modulo == PermisosClientePartidaProcesoPeriodoDocumento.MODULO).map((Y)=>Y.funcion);
                    this.permiso_Listar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.LISTAR);
                    this.permiso_Agregar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.AGREGAR);
                    this.permiso_Actualizar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.EDITAR);
                    this.permiso_Eliminar_documento = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosClientePartidaProcesoPeriodoDocumento.ELIMINAR);

                  } else {
                    this.PERMISOS_USUARIO_PANTALLA = [];
                  }
                }


               }

  async ngOnInit() {

    this.Funciones = await this.obtenerFunciones();

    this.dataSource = new MatTableDataSource<DocumentoModel>(this.Funciones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Funciones por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

  }

  public async obtenerFunciones(){
    const respuesta = await this.mesaValidacionService.obtenerFuncionesUsuario(this.usuarioModel.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

public async actualizarFuncion(funcion: FuncionModel, evento: any ){

  const fun: FuncionUsuarioFormModel = {
    id: funcion.id,
    catUsuarioId:   funcion.idUsuario,
    catFuncionesId: funcion.idFuncion,
    inclusion:      funcion.inclusion,
    activo:        !funcion.activo
  }

  const respuesta =  await this.mesaValidacionService.actualizarFuncionUsuario(fun);

    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
}

/* public async eliminarDocumento(documento: DocumentoModel){

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
} */
}
