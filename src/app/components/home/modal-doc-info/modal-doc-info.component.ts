import { DocViewerComponent } from './../../doc-viewer/doc-viewer.component';
import { RolEnum } from './../../../enum/rolEnum.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentosProyectoFormModel, DocumentosProyectoModel, DocumentosVersionProyectoModel } from 'src/app/modelos/DocumentosProyecto.model';
import { ArchivosService } from 'src/app/servicios/archivos.service';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { FileManagerService } from 'src/app/servicios/filemanager.service';
import { ModalForoComponent } from '../modal-foro/modal-foro.component';
import { Proceso, SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';

@Component({
  selector: 'vex-modal-doc-info',
  templateUrl: './modal-doc-info.component.html',
  styleUrls: ['./modal-doc-info.component.scss']
})
export class ModalDocInfoComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  procesoRolActual: Proceso;
  indexTab:number;
  panelOpenState = false
  formVersionDocumento: FormGroup
  formVersionDocumentoEdicion: FormGroup
  titulo = "Nueva versión";

  archivoEditableNombre = null;
  archivoEditableToken = null;
  archivoEditableExtension = null;
  archivoFirmadoNombre = null;
  archivoFirmadoToken = null;
  archivoFirmadoExtension = null;

  archivoEditableNombreEdicion = null;
  archivoEditableTokenEdicion = null;
  archivoEditableExtensionEdicion = null;

  archivoFirmadoNombreEdicion = null;
  archivoFirmadoTokenEdicion = null;
  archivoFirmadoExtensionEdicion = null;


  permiso_MostrarNuevaVersion = true;
  permiso_MostrarUltimaVersion = true;
  permiso_MostrarHistorico = true;
  permiso_ValidarVersion = true;

  formatosVisualizacion = ['docx','doc','ppt','pptx','pdf','jpg', 'jpeg','xlsx','xls','DOCX','DOC','PPT','PPTX','PDF','JPG', 'JPEG','XLSX','XLS'];

  @ViewChild(MatSort) sort: MatSort;
  listaVersionesDocumento: DocumentosVersionProyectoModel[] = [];
  ultimaVersionModel: DocumentosVersionProyectoModel;

  dataSource: any
  pageSize = 3;
  pageSizeOptions: number[] = [this.pageSize, 5, 10, 20];
  pageEvent: PageEvent;

  versionDocumentoModel: DocumentosProyectoFormModel  = new DocumentosProyectoFormModel();


  data = {
    descripcionCorta: '',
    descripcionLarga: '',
    tokenFile: ''
  }
  isDragover = false;
  //file: File | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public documento: DocumentosProyectoModel,
    public archivoServicio: ArchivosService,
    public matPaginatorIntl: MatPaginatorIntl,
    private mesaValidacionService: MesaValidacionService,
    private formBuilder: FormBuilder,
    private swalService: SwalServices,
    private filemanagerService: FileManagerService,
    private dialog: MatDialog,
  ) {
    let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

    if(this.sesionUsuarioActual.administrador){
      this.permiso_MostrarNuevaVersion = true;
      this.permiso_MostrarUltimaVersion = true;
      this.permiso_MostrarHistorico = true;
      this.permiso_ValidarVersion = true;
    } else {
      let proceso = localStorage.getItem(KeysStorageEnum.PROCESO);
      this.procesoRolActual = JSON.parse(proceso);
      switch(this.procesoRolActual.idRol){
        case RolEnum.OPERADOR:
          this.permiso_MostrarNuevaVersion = true;
          this.permiso_MostrarUltimaVersion = true;
          this.permiso_MostrarHistorico = true;
          this.permiso_ValidarVersion = false;
          break;
        case RolEnum.VALIDADOR:
          this.permiso_MostrarNuevaVersion = false;
          this.permiso_MostrarUltimaVersion = false;
          this.permiso_MostrarHistorico = true;
          this.permiso_ValidarVersion = true;
          break;
      }
    }


    this.iniciarForm();
   }



  async ngOnInit() {

    this.listaVersionesDocumento = await this.obtenerVersionesDocumentoProyecto(this.documento.relProyectoDocumentacionId);
    this.listaVersionesDocumento.forEach((x)=>{
      x.id == this.documento.idUltimaVersion ? x.ultimaVersion = true : x.ultimaVersion = false
      //PARA MOSTRAR VISUALIZACION O DESCARGA
      this.formatosVisualizacion.includes(x.editableExtension) ? x.mostrarVisualizacionEditable = true : x.mostrarVisualizacionEditable = false;
      this.formatosVisualizacion.includes(x.firmadoExtension) ? x.mostrarVisualizacionFirmado = true : x.mostrarVisualizacionFirmado = false;
    });

    this.dataSource = new MatTableDataSource<any>(this.listaVersionesDocumento);
    this.matPaginatorIntl.itemsPerPageLabel = "Actividades por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

    await this.llenarFormulario();

    setTimeout(() => {
      this.indexTab = 0;
    }, 100);

  }




  get descripcion() { return this.formVersionDocumento.get('descripcion') }
  get detalle() { return this.formVersionDocumento.get('detalle') }


  get descripcionEdicion() { return this.formVersionDocumentoEdicion.get('descripcion') }
  get detalleEdicion() { return this.formVersionDocumentoEdicion.get('detalle') }

  //get archivoEditable() { return this.formVersionDocumento.get('archivoEditable') }
  //get archivoFirmado() { return this.formVersionDocumento.get('archivoFirmado') }

  public iniciarForm(){
    this.formVersionDocumento = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      detalle: ['', [Validators.required]],
      //archivoEditable: ['', [Validators.required]],
      //archivoFirmado: [''],
    });


    this.formVersionDocumentoEdicion = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      detalle: ['', [Validators.required]],
      //archivoEditable: ['', [Validators.required]],
      //archivoFirmado: [''],
    });
  }

  public llenarFormulario(){

    if(this.documento.idUltimaVersion){

      this.ultimaVersionModel = this.listaVersionesDocumento.find((x)=> x.id == this.documento.idUltimaVersion);

      this.descripcionEdicion.setValue(this.ultimaVersionModel.descripcion);
      this.detalleEdicion.setValue(this.ultimaVersionModel.detalle);

      this.archivoEditableNombreEdicion = this.ultimaVersionModel.editableNombre;
      this.archivoEditableTokenEdicion = this.ultimaVersionModel.editable;
      this.archivoEditableExtensionEdicion = this.ultimaVersionModel.editableExtension;
      this.archivoFirmadoNombreEdicion = this.ultimaVersionModel.firmadoNombre;
      this.archivoFirmadoTokenEdicion = this.ultimaVersionModel.firmado;
      this.archivoFirmadoExtensionEdicion = this.ultimaVersionModel.firmadoExtension;
    }

  }


  public async obtenerVersionesDocumentoProyecto(idRelProyectoDocumento: number){
    const respuesta = await this.mesaValidacionService.obtenerDocumentosProyecto(idRelProyectoDocumento);
    return respuesta.exito ? respuesta.respuesta : [];
  }


  async guardarVersionDocumento(){
    this.versionDocumentoModel.id = 0;
    this.versionDocumentoModel.relProyectoDocumentacionId = this.documento.relProyectoDocumentacionId;
    this.versionDocumentoModel.version = this.documento.numeroVersiones + 1;
    this.versionDocumentoModel.descripcion = this.descripcion.value;
    this.versionDocumentoModel.detalle = this.detalle.value;
    this.versionDocumentoModel.editable = this.archivoEditableToken;
    this.versionDocumentoModel.firmado = this.archivoFirmadoToken;
    this.versionDocumentoModel.validado = false;
    this.versionDocumentoModel.catUsuarioId = this.sesionUsuarioActual.id;
    this.versionDocumentoModel.editableNombre = this.archivoEditableNombre;
    this.versionDocumentoModel.editableExtension = this.archivoEditableExtension;
    this.versionDocumentoModel.firmadoNombre = this.archivoFirmadoNombre;
    this.versionDocumentoModel.firmadoExtension = this.archivoFirmadoExtension;

    const respuesta =  this.versionDocumentoModel.id > 0 ? await this.mesaValidacionService.actualizarVersionDocumentosProyecto(this.versionDocumentoModel) : await this.mesaValidacionService.insertarVersionDocumentosProyecto(this.versionDocumentoModel);

    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.documento.idUltimaVersion = respuesta.respuesta;
      this.limpiarFormulario();
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }

  async editarVersionDocumento(){

    this.versionDocumentoModel.id = this.ultimaVersionModel.id;
    this.versionDocumentoModel.relProyectoDocumentacionId = this.ultimaVersionModel.relProyectoDocumentacionId;
    this.versionDocumentoModel.version = this.ultimaVersionModel.version;
    this.versionDocumentoModel.descripcion = this.descripcionEdicion.value;
    this.versionDocumentoModel.detalle = this.detalleEdicion.value;
    this.versionDocumentoModel.editable = this.archivoEditableTokenEdicion;
    this.versionDocumentoModel.firmado = this.archivoFirmadoTokenEdicion;
    this.versionDocumentoModel.validado = this.ultimaVersionModel.validado;
    this.versionDocumentoModel.catUsuarioId = this.sesionUsuarioActual.id;
    this.versionDocumentoModel.editableNombre = this.archivoEditableNombreEdicion;
    this.versionDocumentoModel.editableExtension = this.archivoEditableExtensionEdicion;
    this.versionDocumentoModel.firmadoNombre = this.archivoFirmadoNombreEdicion;
    this.versionDocumentoModel.firmadoExtension = this.archivoFirmadoExtensionEdicion;


    const respuesta =  this.versionDocumentoModel.id > 0 ? await this.mesaValidacionService.actualizarVersionDocumentosProyecto(this.versionDocumentoModel) : await this.mesaValidacionService.insertarVersionDocumentosProyecto(this.versionDocumentoModel);

    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.limpiarFormulario();
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }

  public limpiarFormulario(){
    this.formVersionDocumento.reset();

    this.archivoEditableNombre = null;
    this.archivoEditableToken = null;
    this.archivoEditableExtension = null;
    this.archivoFirmadoNombre = null;
    this.archivoFirmadoToken = null;
    this.archivoFirmadoExtension = null;
  }


  async editableSeleccionado(event) {
    if(event.target.files.length > 0)
     {


       const formData: any = new FormData();
      formData.append('file', event.target.files[0]);

      const respuesta = await this.filemanagerService.cargarArchivo(formData);

      if(respuesta.exito){

        this.archivoEditableNombre = event.target.files[0].name;
        this.archivoEditableToken = respuesta.anotacion;
        //this.archivoEditableToken = respuesta.respuesta;
        this.archivoEditableExtension = this.archivoEditableNombre.split('.')[1];
      } else {
        this.swalService.alertaPersonalizada(false, 'No se pudo cargar el archivo');
      }
     }
   }

   async firmadoSeleccionado(event) {
    if(event.target.files.length > 0)
     {

      const formData: any = new FormData();
     formData.append('file', event.target.files[0]);
     const respuesta = await this.filemanagerService.cargarArchivo(formData);
     if(respuesta.exito){
       this.archivoFirmadoNombre = event.target.files[0].name;
       this.archivoFirmadoToken = respuesta.anotacion;
       //this.archivoFirmadoToken = respuesta.respuesta;
       this.archivoFirmadoExtension = this.archivoFirmadoNombre.split('.')[1];
     } else {
       this.swalService.alertaPersonalizada(false, 'No se pudo cargar el archivo');
     }
     }
   }



  async editableSeleccionadoEdicion(event) {
    if(event.target.files.length > 0)
     {


       const formData: any = new FormData();
      formData.append('file', event.target.files[0]);

      const respuesta = await this.filemanagerService.cargarArchivo(formData);

      if(respuesta.exito){

        this.archivoEditableNombreEdicion = event.target.files[0].name;
        this.archivoEditableTokenEdicion = respuesta.anotacion;
        //this.archivoEditableTokenEdicion = respuesta.respuesta;
        this.archivoEditableExtensionEdicion = this.archivoEditableNombreEdicion.split('.')[1];

      } else {
        this.swalService.alertaPersonalizada(false, 'No se pudo cargar el archivo');
      }
     }
   }

   async firmadoSeleccionadoEdicion(event) {
    if(event.target.files.length > 0)
     {

      const formData: any = new FormData();
     formData.append('file', event.target.files[0]);
     const respuesta = await this.filemanagerService.cargarArchivo(formData);
     if(respuesta.exito){

       this.archivoFirmadoNombreEdicion = event.target.files[0].name;
       this.archivoFirmadoTokenEdicion = respuesta.anotacion;
       //this.archivoFirmadoTokenEdicion = respuesta.respuesta;

       this.archivoFirmadoExtensionEdicion = this.archivoFirmadoNombreEdicion.split('.')[1];
     } else {
       this.swalService.alertaPersonalizada(false, 'No se pudo cargar el archivo');
     }
     }
   }

   async abrirDocumento(token: string){
    let url = await this.filemanagerService.obtenerRutaArchivo(token);
    window.open(url,'_blank');
   }

   comentariosAgregar() {
    this.documento.modoVisualizacion = false;
    this.dialog.open(ModalForoComponent, {

      width: '80%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: this.documento,
      disableClose: true
    }).afterClosed().subscribe(result => {

      this.ngOnInit()
    });
  }


  comentarios(documento: DocumentosVersionProyectoModel) {

    //SE GENERA UN OBJETO DocumentosProyectoModel PARA QUE SE RECIBA TAL CUAL EN EL FORO
    let doc = new DocumentosProyectoModel();
    if(documento.id == this.documento.idUltimaVersion){
      doc.idUltimaVersion = this.documento.idUltimaVersion
      doc.modoVisualizacion = false;
    } else {
      doc.idUltimaVersion = documento.id;
      doc.modoVisualizacion = true;
    }

    this.documento.modoVisualizacion = false;
    this.dialog.open(ModalForoComponent, {

      width: '80%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: doc,
      disableClose: true
    }).afterClosed().subscribe(result => {

      this.ngOnInit()
    });



  }





  async ValidarVersion(version: DocumentosVersionProyectoModel){

    let versionValidar = new DocumentosProyectoFormModel();

    versionValidar.id = version.id;
    versionValidar.relProyectoDocumentacionId = version.relProyectoDocumentacionId;
    versionValidar.version = version.version;
    versionValidar.descripcion = version.descripcion;
    versionValidar.detalle = version.detalle;
    versionValidar.editable = version.editable;
    versionValidar.editableNombre = version.editableNombre;
    versionValidar.editableExtension = version.editableExtension;
    versionValidar.firmado = version.firmado;
    versionValidar.firmadoNombre = version.firmadoNombre;
    versionValidar.firmadoExtension = version.firmadoExtension;
    versionValidar.validado = true;
    versionValidar.catUsuarioId = this.sesionUsuarioActual.id;


    const respuesta =  await this.mesaValidacionService.actualizarVersionDocumentosProyecto(versionValidar);

    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.limpiarFormulario();
      this.ngOnInit();
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }
  }




  async verDocumento(token: string) {

    let url = await this.filemanagerService.obtenerRutaArchivo(token);
    //window.open(url,'_blank');

    this.dialog.open(DocViewerComponent, {
      height: '80%',
      width: '100%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: url,
      disableClose: true
    }).afterClosed().subscribe(result => {

      this.ngOnInit()
    });
  }
}
