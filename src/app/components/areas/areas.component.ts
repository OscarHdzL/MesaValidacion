
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { AreaModel } from 'src/app/modelos/area.model';
import { ClienteModel } from 'src/app/modelos/cliente.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { ModalAreaComponent } from './modal-area/modal-area.component';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { Modulos } from 'src/app/enum/PermisosPantallas.enum';

@Component({
  selector: 'vex-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_area = false;
  permiso_Agregar_area = false;
  permiso_Actualizar_area = false;
  permiso_Eliminar_area = false;
  permiso_Listar_proyecto_area = false;


  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];
  PERMISOS_SIDEBAR: string[] = [];

  Areas: AreaModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns: TableColumn<any>[] = [
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
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
                  this.permiso_Listar_area = true;
                  this.permiso_Agregar_area = true;
                  this.permiso_Actualizar_area = true;
                  this.permiso_Eliminar_area = true;
                  this.permiso_Listar_proyecto_area = true;

                /* let permisosSesion: PerfilRolModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoArea.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_area = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoArea.Listar_area);
                  this.permiso_Agregar_area = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoArea.Agregar_area);
                  this.permiso_Actualizar_area = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoArea.Actualizar_area);
                  this.permiso_Eliminar_area = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoArea.Eliminar_area);
                  this.permiso_Listar_proyecto_area = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoArea.Listar_proyecto_area);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {
    this.sesionUsuarioActual.funciones = await this.obtenerFunciones();
    this.PERMISOS_SIDEBAR = this.sesionUsuarioActual.funciones.filter((x)=> x.modulo == 'Sidebar' && x.activo == true).map((Y)=>Y.funcion);
    localStorage.setItem(KeysStorageEnum.USER,JSON.stringify(this.sesionUsuarioActual));

    if(!this.PERMISOS_SIDEBAR.includes(Modulos.AREAS)){
      console.log('NO TIENE ACCESO A LA PANTALLA AREAS');
      this.router.navigate(['/components/inicio']);
      return;
    }

    this.Areas = await this.obtenerAreas();

    this.dataSource = new MatTableDataSource<AreaModel>(this.Areas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Areas por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

  }


  public async obtenerFunciones(){
    const respuesta = await this.mesaValidacionService.obtenerFuncionesUsuario(this.sesionUsuarioActual.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerAreas(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoAreas();
    return respuesta.exito ? respuesta.respuesta: [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalArea(area: AreaModel){

      this.dialog.open(ModalAreaComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: area,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {

        this.ngOnInit();
      });
  }

public async eliminarArea(area: AreaModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    area.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarArea(area.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}


}
