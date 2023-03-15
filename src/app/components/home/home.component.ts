import { ProyectoModel } from './../../modelos/proyectos.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
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

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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

  constructor(
    private dialog: MatDialog,
    public archivoServicio: ArchivosService,
    private mesaValidacionService: MesaValidacionService,
    private formBuilder: FormBuilder
  )
  {
    this.dummyData = archivoServicio.getAllArchivos()
    this.iniciarForm();
  }

  async ngOnInit() {

    this.listaClientes = await this.obtenerClientes();
    //this.changeProyecto(1);

    if(window.innerWidth <= 500) {
      this.getScreenWidth = '100%'
    } else {
      this.getScreenWidth = '80%'
    }
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

  public async obtenerClientes(){
    const respuesta = await this.mesaValidacionService.obtenerCatalogoClientes();
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
    this.listaPartidas = await this.obtenerPartidas(idCliente);
    this.listaProcesos;
    this.listaPeriodos;
    this.listaProyectos;
    this.listaDocumentosProyecto;
  }

  public async changePartida(idPartida){
    this.listaProcesos = await this.obtenerProcesos(idPartida);
    this.listaPeriodos;
    this.listaProyectos;
    this.listaDocumentosProyecto;
  }

  public async changeProceso(idProceso){
    this.listaPeriodos = await this.obtenerPeriodos(idProceso);
    this.listaProyectos;
    this.listaDocumentosProyecto;
  }

  public async changePeriodo(idPeriodo: number){
    this.listaProyectos = await this.obtenerProyectos(idPeriodo);
    this.listaDocumentosProyecto;
  }

  public async changeProyecto(idProyecto: number){

    this.listaDocumentosProyecto = await this.obtenerDocumentosProyecto(idProyecto);
  }



  detalles(doc: DocumentosProyectoModel) {
    this.dialog.open(ModalDocInfoComponent , {
      height: '80%',
      width: '100%',
      maxWidth: this.getScreenWidth,
      autoFocus: true,
      data: doc,
      disableClose: true
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit()
    });
  }

  comentarios(doc: DocumentosProyectoModel) {

    doc.modoVisualizacion = true;

    this.dialog.open(ModalForoComponent, {
      height: '80%',
      width: '100%',
      maxWidth: this.getScreenWidth,
      autoFocus: true,
      data: doc,
      disableClose: true
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit()
    });
  }
}
