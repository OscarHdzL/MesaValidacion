import { ModalMovimimientosProyectoComponent } from './modal-movimimientos-proyecto/modal-movimimientos-proyecto.component';
import { Partida, Periodo, Proceso, SesionModel, Proyecto } from './../../modelos/sesion.model';
import { ProyectoModel } from './../../modelos/proyectos.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArchivosService } from 'src/app/servicios/archivos.service';
import { ModalDocInfoComponent } from './modal-doc-info/modal-doc-info.component';
import { ModalForoComponent } from './modal-foro/modal-foro.component';
import { ClienteModel } from 'src/app/modelos/cliente.model';
import { PartidaModel } from 'src/app/modelos/partidas.model';
import { ProcesoModel } from 'src/app/modelos/procesos.model';
import { PeriodoModel } from 'src/app/modelos/periodos.model';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { DocumentosProyectoModel } from 'src/app/modelos/DocumentosProyecto.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { ModalProyectoComponent } from '../clientes/proyectos/modal-proyecto/modal-proyecto.component';
import { Router } from '@angular/router';
import { Modulos } from 'src/app/enum/PermisosPantallas.enum';

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  procesoRolActual: Proceso;
  esAdministrador: boolean = false;
  formBusqueda: FormGroup;
  dummyData: any[]
  getScreenWidth: any
  mostrarArchivos: boolean = false;
  listaClientes: ClienteModel[] = [];
  listaPartidas: PartidaModel[] = [];
  listaProcesos: ProcesoModel[] = [];
  listaPeriodos: PeriodoModel[] = [];
  listaProyectos: ProyectoModel[] = [];
  listaDocumentosProyecto: DocumentosProyectoModel[] = [];
  getIdPeriodo: number
  PERMISOS_SIDEBAR: string[] = [];

  constructor(
    private dialog: MatDialog,
    public archivoServicio: ArchivosService,
    private mesaValidacionService: MesaValidacionService,
    private formBuilder: FormBuilder,
    private router: Router,
  )
  {
    let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
    this.esAdministrador = this.sesionUsuarioActual.administrador ? this.sesionUsuarioActual.administrador: false;
    this.dummyData = archivoServicio.getAllArchivos()
    this.iniciarForm();
  }

  async ngOnInit() {

    //SE SOBREESCRIBE EL VALOR POR SI HUBO CAMBIOS EN LAS FUNCIONES
    this.sesionUsuarioActual.funciones = await this.obtenerFunciones();

    this.PERMISOS_SIDEBAR = this.sesionUsuarioActual.funciones.filter((x)=> x.modulo == 'Sidebar' && x.activo == true).map((Y)=>Y.funcion);

    //SE SOBREESCRIBE EL VALOR POR SI HUBO CAMBIOS EN LOS CLIENTES
    this.sesionUsuarioActual.clientes = await this.obtenerClientesUsuarioSesion();
    localStorage.setItem(KeysStorageEnum.USER,JSON.stringify(this.sesionUsuarioActual));

    if(!this.PERMISOS_SIDEBAR.includes(Modulos.MESA_VALIDACION)){
      console.log('NO TIENE ACCESO A LA PANTALLA MESA VALIDACION');
      this.router.navigate(['/components/inicio']);
      return;
    }


    this.listaClientes = await this.obtenerClientes();
    this.changeProyecto(1);

    if(window.innerWidth <= 500) {
      this.getScreenWidth = '100%'
    } else {
      this.getScreenWidth = '80%'
    }
  }

  // Modal para agregar proyecto:
  openModalProyectos(){
    let data: ProyectoModel = {
      id: 0,
      tblPeriodoId: this.getIdPeriodo,
      nombre: '',
      activo: true
    }

    this.dialog.open(ModalProyectoComponent,{
      height: '50%',
      width: '100%',
      autoFocus: true,
      data,
      disableClose: true,
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
    }).afterClosed().subscribe(result => {

      this.ngOnInit();
    });
  }


  public iniciarForm(){
    this.formBusqueda = this.formBuilder.group({
      cliente: ['', [Validators.required]],
      partida: ['', [Validators.required]],
      proceso: ['', [Validators.required]],
      periodo: ['', [Validators.required]],
      proyecto: ['', [Validators.required]],
    });
  }

  get cliente ()  {return this.formBusqueda.get('cliente');}
  get partida ()  {return this.formBusqueda.get('partida');}
  get proceso ()  {return this.formBusqueda.get('proceso');}
  get periodo ()  {return this.formBusqueda.get('periodo');}
  get proyecto()  {return this.formBusqueda.get('proyecto');}

  public async obtenerFunciones(){
    const respuesta = await this.mesaValidacionService.obtenerFuncionesUsuario(this.sesionUsuarioActual.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerClientesUsuarioSesion(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoClientesByUsuarioSesion(this.sesionUsuarioActual.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerClientes(){
    const respuesta = this.esAdministrador ? await this.mesaValidacionService.obtenerCatalogoClientes() : {'exito': true, 'respuesta': this.sesionUsuarioActual.clientes};
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerPartidas(idCliente: number){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoPartidas(idCliente);
    return respuesta.exito? respuesta.respuesta: [];
  }

  public async obtenerProcesos(idPartida: number){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoProcesos(idPartida);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerPeriodos(idProceso: number){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoPeriodos(idProceso);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerProyectos(idPeriodo: number){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoProyectos(idPeriodo);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async obtenerDocumentosProyecto(idProyecto: number){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoDocumentosProyecto(idProyecto);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async changeCliente(idCliente){


    let partidasUsuario = [];

    if(!this.esAdministrador){
      partidasUsuario = this.sesionUsuarioActual.clientes.find(x=>x.id == idCliente).partidas as Partida[];
    }

    this.listaPartidas = this.esAdministrador ? await this.obtenerPartidas(idCliente) : partidasUsuario;
    this.partida.setValue('');
    this.listaProcesos = [];
    this.proceso.setValue('');
    this.listaPeriodos = [];
    this.periodo.setValue('');
    this.listaProyectos = [];
    this.proyecto.setValue('');
    this.listaDocumentosProyecto = [];
  }

  public async changePartida(idPartida){

    let procesosUsuario = []

    if(!this.esAdministrador){
      procesosUsuario = this.sesionUsuarioActual.clientes.find(x=>x.id == this.cliente.value).partidas.find(y=>y.id == idPartida).procesos as Proceso[];
    }

    this.listaProcesos =  this.esAdministrador ? await this.obtenerProcesos(idPartida): procesosUsuario;
    this.proceso.setValue('');
    this.listaPeriodos = [];
    this.periodo.setValue('');
    this.listaProyectos = [];
    this.proyecto.setValue('');
    this.listaDocumentosProyecto = [];
  }

  public async changeProceso(idProceso){

    let periodosUsuario = [];
    if(!this.esAdministrador){
      periodosUsuario = this.sesionUsuarioActual.clientes.find(x=>x.id == this.cliente.value).partidas.find(y=>y.id == this.partida.value).procesos.find(z=>z.id == idProceso).periodos as Periodo[];
      this.procesoRolActual = this.sesionUsuarioActual.clientes.find(x=>x.id == this.cliente.value).partidas.find(y=>y.id == this.partida.value).procesos.find(z=>z.id == idProceso);
      localStorage.removeItem('ProcesoSeleccionado');
      //Se guarda el proceso actual para utilizar el rol en los madales;
      localStorage.setItem('ProcesoSeleccionado',JSON.stringify(this.procesoRolActual));
    }

    this.listaPeriodos = this.esAdministrador ? await this.obtenerPeriodos(idProceso): periodosUsuario;
    this.periodo.setValue('');
    this.listaProyectos = [];
    this.proyecto.setValue('');
    this.listaDocumentosProyecto = [];
  }

  public async changePeriodo(idPeriodo: number){
    this.getIdPeriodo = idPeriodo

    let proyectosUsuario = [];

    if(!this.esAdministrador){
      proyectosUsuario = this.sesionUsuarioActual.clientes.find(x=>x.id == this.cliente.value).partidas.find(y=>y.id == this.partida.value).procesos.find(z=>z.id == this.proceso.value).periodos.find(p=>p.id == idPeriodo).proyectos as Proyecto[];
    }

    this.listaProyectos = this.esAdministrador ? await this.obtenerProyectos(idPeriodo): proyectosUsuario;
    this.proyecto.setValue('');
    this.listaDocumentosProyecto = [];
  }

  public async changeProyecto(idProyecto: number){
    this.listaDocumentosProyecto = await this.obtenerDocumentosProyecto(idProyecto);
  }



  detalles(doc: DocumentosProyectoModel) {
    this.dialog.open(ModalDocInfoComponent , {
      height: '80%',
      width: '100%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: doc,
      disableClose: true
    }).afterClosed().subscribe(async result => {

      //await this.ngOnInit();
      //Se recarga el listado de documento del proyecto
      await this.changeProyecto(this.proyecto.value);
    });
  }

  comentarios(doc: DocumentosProyectoModel) {

    doc.modoVisualizacion = true;

    this.dialog.open(ModalForoComponent, {
      //height: '80%',
      width: '80%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: doc,
      disableClose: true
    }).afterClosed().subscribe(async result => {


      //this.ngOnInit()
      //Se recarga el listado de documento del proyecto
      await this.changeProyecto(this.proyecto.value);
    });
  }


  movimientos(doc: DocumentosProyectoModel) {
    this.dialog.open(ModalMovimimientosProyectoComponent , {
      height: '80%',
      width: '100%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: doc,
      disableClose: true
    }).afterClosed().subscribe(async result => {

      //this.ngOnInit()
      //Se recarga el listado de documento del proyecto
      await this.changeProyecto(this.proyecto.value);
    });
  }
}
