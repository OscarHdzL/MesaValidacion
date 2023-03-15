import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { UsuarioModel } from 'src/app/modelos/usuario.model';

import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';


@Component({
  selector: 'vex-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {


  permiso_Listar_usuario = false;
  permiso_Agregar_usuario = false;
  permiso_Actualizar_usuario = false;
  permiso_Eliminar_usuario = false;
  permiso_Listar_proyecto_usuario = false;


  //PERMISOS_USUARIO_PANTALLA: PerfilUsuarioModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Usuarios: UsuarioModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns: TableColumn<any>[] = [
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Correo', property: 'correo', type: 'text', visible: true, cssClasses: ['font-medium'] },

    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  constructor(

              public matPaginatorIntl: MatPaginatorIntl,
              private swalService: SwalServices,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private mesaValidacionService: MesaValidacionService
              ) {
                  //
                  this.permiso_Listar_usuario = true;
                  this.permiso_Agregar_usuario = true;
                  this.permiso_Actualizar_usuario = true;
                  this.permiso_Eliminar_usuario = true;
                  this.permiso_Listar_proyecto_usuario = true;

                /* let permisosSesion: PerfilUsuarioModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoUsuario.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_usuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoUsuario.Listar_usuario);
                  this.permiso_Agregar_usuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoUsuario.Agregar_usuario);
                  this.permiso_Actualizar_usuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoUsuario.Actualizar_usuario);
                  this.permiso_Eliminar_usuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoUsuario.Eliminar_usuario);
                  this.permiso_Listar_proyecto_usuario = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoUsuario.Listar_proyecto_usuario);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {
    this.Usuarios = await this.obtenerUsuarios();

    this.dataSource = new MatTableDataSource<UsuarioModel>(this.Usuarios);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Usuarios por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

  }

  public async obtenerUsuarios(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoUsuarios();
    return respuesta.exito ? respuesta.respuesta : [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalUsuario(usuario: UsuarioModel){

      this.dialog.open(ModalUsuarioComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: usuario,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {
        console.log(result);
        this.ngOnInit();
      });
  }

public async eliminarUsuario(usuario: UsuarioModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    usuario.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarUsuario(usuario.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}


}
