import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { RolModel } from 'src/app/modelos/rol.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { ModalRolComponent } from './modal-rol/modal-rol.component';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { Modulos } from 'src/app/enum/PermisosPantallas.enum';

@Component({
  selector: 'vex-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_rol = false;
  permiso_Agregar_rol = false;
  permiso_Actualizar_rol = false;
  permiso_Eliminar_rol = false;
  permiso_Listar_proyecto_rol = false;


  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];
  PERMISOS_SIDEBAR: string[] = [];

  Rols: RolModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns: TableColumn<any>[] = [
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  constructor(

              public matPaginatorIntl: MatPaginatorIntl,
              private swalService: SwalServices,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private mesaValidacionService: MesaValidacionService,
              private router: Router,
              ) {

                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
                  //
                  this.permiso_Listar_rol = true;
                  this.permiso_Agregar_rol = true;
                  this.permiso_Actualizar_rol = true;
                  this.permiso_Eliminar_rol = true;
                  this.permiso_Listar_proyecto_rol = true;

                /* let permisosSesion: PerfilRolModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoRol.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_rol = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoRol.Listar_rol);
                  this.permiso_Agregar_rol = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoRol.Agregar_rol);
                  this.permiso_Actualizar_rol = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoRol.Actualizar_rol);
                  this.permiso_Eliminar_rol = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoRol.Eliminar_rol);
                  this.permiso_Listar_proyecto_rol = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoRol.Listar_proyecto_rol);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {
    this.sesionUsuarioActual.funciones = await this.obtenerFunciones();
    this.PERMISOS_SIDEBAR = this.sesionUsuarioActual.funciones.filter((x)=> x.modulo == 'Sidebar' && x.activo == true).map((Y)=>Y.funcion);
    localStorage.setItem(KeysStorageEnum.USER,JSON.stringify(this.sesionUsuarioActual));


    if(!this.PERMISOS_SIDEBAR.includes(Modulos.ROLES)){
      console.log('NO TIENE ACCESO A LA PANTALLA ROLES');
      this.router.navigate(['/components/inicio']);
      return;
    }


    this.Rols = await this.obtenerRols();

    this.dataSource = new MatTableDataSource<RolModel>(this.Rols);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Rols por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

  }


  public async obtenerFunciones(){
    const respuesta = await this.mesaValidacionService.obtenerFuncionesUsuario(this.sesionUsuarioActual.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerRols(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoRols();
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalRol(rol: RolModel){

      this.dialog.open(ModalRolComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: rol,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {

        this.ngOnInit();
      });
  }

public async eliminarRol(rol: RolModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    rol.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarRol(rol.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}


}
