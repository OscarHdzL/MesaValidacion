import { filter } from 'rxjs/operators';
import { PartidasComponent } from './partidas/partidas.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ClienteModel } from 'src/app/modelos/cliente.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { ModalClienteComponent } from './modal-cliente/modal-cliente.component';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

@Component({
  selector: 'vex-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  permiso_Listar_cliente = false;
  permiso_Agregar_cliente = false;
  permiso_Actualizar_cliente = false;
  permiso_Eliminar_cliente = false;
  permiso_Listar_proyecto_cliente = false;
  esAdministrador: boolean = false;


  //PERMISOS_USUARIO_PANTALLA: PerfilRolModel[] = [];
  PERMISOS_USUARIO_PANTALLA: string[] = [];

  Clientes: ClienteModel[] = [];
  dataSource:any;
  TIPOMATERIA: String
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns: TableColumn<any>[] = [
    { label: 'Clave', property: 'clave', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'RazonSocial', property: 'razonSocial', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Telefono', property: 'telefono', type: 'text', visible: true, cssClasses: ['font-medium'] },
     /*{ label: 'Contacto', property: 'contacto', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Correo', property: 'correo', type: 'text', visible: true, cssClasses: ['font-medium'] },*/
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];


  constructor(

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
                  this.permiso_Listar_cliente = true;
                  this.permiso_Agregar_cliente = true;
                  this.permiso_Actualizar_cliente = true;
                  this.permiso_Eliminar_cliente = true;
                  this.permiso_Listar_proyecto_cliente = true;
                }else{
                  this.permiso_Listar_cliente = true;
                  this.permiso_Agregar_cliente = false;
                  this.permiso_Actualizar_cliente = false;
                  this.permiso_Eliminar_cliente = false;
                  this.permiso_Listar_proyecto_cliente = true;
                }


                /* let permisosSesion: PerfilRolModel[] = JSON.parse(localStorage.getItem('MENU_USUARIO'));
                if(permisosSesion.length > 0){
                  this.PERMISOS_USUARIO_PANTALLA =  permisosSesion.filter((permiso)=>permiso.alphaModulo == PermisosModuloCatalogoCliente.Alpha_Modulo).map((Y)=>Y.alphaModuloComponente);
                  this.permiso_Listar_cliente = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoCliente.Listar_cliente);
                  this.permiso_Agregar_cliente = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoCliente.Agregar_cliente);
                  this.permiso_Actualizar_cliente = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoCliente.Actualizar_cliente);
                  this.permiso_Eliminar_cliente = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoCliente.Eliminar_cliente);
                  this.permiso_Listar_proyecto_cliente = this.PERMISOS_USUARIO_PANTALLA.includes(PermisosModuloCatalogoCliente.Listar_proyecto_cliente);
                } else {
                  this.PERMISOS_USUARIO_PANTALLA = [];
                } */
               }

  async ngOnInit() {
    this.Clientes = await this.obtenerClientes();



    this.dataSource = new MatTableDataSource<ClienteModel>(this.Clientes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginatorIntl.itemsPerPageLabel = "Clientes por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

  }

  public async obtenerClientes(){
    const respuesta = this.esAdministrador ? await this.mesaValidacionService.obtenerCatalogoClientes() : await this.mesaValidacionService.obtenerCatalogoClientesByResponsablePartida(this.sesionUsuarioActual.id);
    if(respuesta.exito){
      if(this.esAdministrador){
        let lista = respuesta.respuesta as ClienteModel[];
        return lista.filter((x)=>x.usuarioResponsableId == this.sesionUsuarioActual.id);
      }
      return respuesta.respuesta as ClienteModel[];
    }
    return  [];
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }


  openModalCliente(cliente: ClienteModel){

      this.dialog.open(ModalClienteComponent,{
        height: '45%',
        width: '100%',
        autoFocus: true,
        data: cliente,
        disableClose: true,
        maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
        //maxWidth: '90%'
      }).afterClosed().subscribe(result => {
        console.log(result);
        this.ngOnInit();
      });
  }

  openModalPartidasCliente(cliente: ClienteModel){

    this.dialog.open(PartidasComponent,{
      height: '50%',
      width: '100%',
      autoFocus: true,
      data: cliente,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit();
    });
}

public async eliminarCliente(cliente: ClienteModel){

  let confirmacion = await this.swalService.confirmacion("Atención","¿Esta seguro de eliminar el registro?", "Eliminar","");

  if(confirmacion){
    cliente.activo = false;
    const respuesta = await this.mesaValidacionService.deshabilitarCliente(cliente.id);
    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }
}

}
