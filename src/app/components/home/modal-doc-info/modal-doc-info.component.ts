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

@Component({
  selector: 'vex-modal-doc-info',
  templateUrl: './modal-doc-info.component.html',
  styleUrls: ['./modal-doc-info.component.scss']
})
export class ModalDocInfoComponent implements OnInit {
  indexTab:number = 0;
  panelOpenState = false
  formVersionDocumento: FormGroup
  formVersionDocumentoEdicion: FormGroup
  titulo = "Nueva versión";
  archivoEditableNombre = null;
  archivoEditableToken = null;
  archivoFirmadoNombre = null;
  archivoFirmadoToken = null;

  archivoEditableNombreEdicion = null;
  archivoEditableTokenEdicion = null;
  archivoFirmadoNombreEdicion = null;
  archivoFirmadoTokenEdicion = null;

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

    console.log(this.documento)
    this.iniciarForm();
   }



  async ngOnInit() {
    this.indexTab = 0;

    this.listaVersionesDocumento = await this.obtenerVersionesDocumentoProyecto(this.documento.relProyectoDocumentacionId);

    this.dataSource = new MatTableDataSource<any>(this.listaVersionesDocumento);
    this.matPaginatorIntl.itemsPerPageLabel = "Actividades por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';

    await this.llenarFormulario();
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
debugger
    if(this.documento.idUltimaVersion){

      this.ultimaVersionModel = this.listaVersionesDocumento.find((x)=> x.id == this.documento.idUltimaVersion);

      this.descripcionEdicion.setValue(this.ultimaVersionModel.descripcion);
      this.detalleEdicion.setValue(this.ultimaVersionModel.detalle);

      this.archivoEditableNombreEdicion = this.ultimaVersionModel.editable;
      this.archivoEditableTokenEdicion = this.ultimaVersionModel.editable;

      this.archivoFirmadoNombreEdicion = this.ultimaVersionModel.firmado;
      this.archivoFirmadoTokenEdicion = this.ultimaVersionModel.firmado;
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
    this.versionDocumentoModel.validado = false;

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
  }


  async editableSeleccionado(event) {
    if(event.target.files.length > 0)
     {
       console.log(event.target.files[0].name);

       const formData: any = new FormData();
      formData.append('file', event.target.files[0]);

      const respuesta = await this.filemanagerService.cargarArchivo(formData);

      if(respuesta.exito){
        this.archivoEditableNombre = event.target.files[0].name;
        this.archivoEditableToken = respuesta.anotacion;
      } else {
        this.swalService.alertaPersonalizada(false, 'No se pudo cargar el archivo');
      }
     }
   }

   async firmadoSeleccionado(event) {
    if(event.target.files.length > 0)
     {
      console.log(event.target.files[0].name);
      const formData: any = new FormData();
     formData.append('file', event.target.files[0]);
     const respuesta = await this.filemanagerService.cargarArchivo(formData);
     if(respuesta.exito){
       this.archivoFirmadoNombre = event.target.files[0].name;
       this.archivoFirmadoToken = respuesta.anotacion;
     } else {
       this.swalService.alertaPersonalizada(false, 'No se pudo cargar el archivo');
     }
     }
   }



  async editableSeleccionadoEdicion(event) {
    if(event.target.files.length > 0)
     {
       console.log(event.target.files[0].name);

       const formData: any = new FormData();
      formData.append('file', event.target.files[0]);

      const respuesta = await this.filemanagerService.cargarArchivo(formData);

      if(respuesta.exito){
        this.archivoEditableNombreEdicion = event.target.files[0].name;
        this.archivoEditableTokenEdicion = respuesta.anotacion;
      } else {
        this.swalService.alertaPersonalizada(false, 'No se pudo cargar el archivo');
      }
     }
   }

   async firmadoSeleccionadoEdicion(event) {
    if(event.target.files.length > 0)
     {
      console.log(event.target.files[0].name);
      const formData: any = new FormData();
     formData.append('file', event.target.files[0]);
     const respuesta = await this.filemanagerService.cargarArchivo(formData);
     if(respuesta.exito){
       this.archivoFirmadoNombreEdicion = event.target.files[0].name;
       this.archivoFirmadoTokenEdicion = respuesta.anotacion;
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
      height: '80%',
      width: '100%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: this.documento,
      disableClose: true
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit()
    });
  }


  comentarios(documento: DocumentosVersionProyectoModel) {
    debugger
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
      height: '80%',
      width: '100%',
      maxWidth: (window.innerWidth >= 1280) ? '80vw': '100vw',
      autoFocus: true,
      data: doc,
      disableClose: true
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit()
    });
  }
}
