


export class DocumentosProyectoModel{

  relProyectoDocumentacionId: number;
  tblDocumentacionId: number;
  documento: string;
  tblProyectoId: number;
  proyecto: string;
  numeroVersiones: number;
  idUltimaVersion: number;

  modoVisualizacion: Boolean = false;
}




export class DocumentosVersionProyectoModel{
/*     id?: any;
    version?: any;
    descripcion?: any;
    detalle?: any;
    archivo?: any;
    editable?: any;
    firmado?: any;
    validado?: any;
    activo?: any;
    inclusion?: any;
    relProyectoDocumentacionId: number;
    tblDocumentacionId: number;
    documento: string;
    tblProyectoId: number;
    proyecto: string; */

    id: number;
    relProyectoDocumentacionId: number;
    version: number;
    descripcion: string;
    detalle: string;
    editable?: string;
    firmado?: any;
    editableNombre?: string;
    editableExtension?: string;
    firmadoNombre?: string;
    firmadoExtension?: string;
    validado: boolean;
    activo: boolean;
    inclusion: Date;
    relProyectoDocumentacion?: any;
    tblDocumentoComentarios: any[];

    contadorVersiones: number;
    ultimaVersion: boolean = false;

    mostrarVisualizacionEditable: boolean = false;
    mostrarVisualizacionFirmado: boolean = false;
  }


export class DocumentosProyectoFormModel {
  id: number;
  relProyectoDocumentacionId: number;
  version: number;
  descripcion: string;
  detalle: string;
  //archivo: string;
  editable: string;
  firmado: string;
  validado: boolean;
  catUsuarioId: number;
  editableNombre?: string;
  editableExtension?: string;
  firmadoNombre?: string;
  firmadoExtension?: string;

  constructor(){
    this.id = 0;
    this.relProyectoDocumentacionId = 0;
    this.catUsuarioId = 0;
    this.version = 0;
    this.descripcion = null;
    this.detalle = null;
    //this.archivo = null;
    this.editable = null;
    this.firmado = null;
    this.editableNombre = null;
    this.editableExtension = null;
    this.firmadoNombre = null;
    this.firmadoExtension = null;
    this.validado = false;
  }
}
