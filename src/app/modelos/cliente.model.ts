export class ClienteModel{
  id: number;
  nombre: string;
  identificador: string;
  razonSocial: string;
  rfc: string;
  correo: string;
  telefono: string;
  activo: boolean;
  inclusion: Date;
  tblPartida: any[];
  usuarioResponsableId: number;
}


export class ClienteFormModel {
  id: number;
  usuarioResponsableId: number;
  identificador: string;
  nombre: string;
  razonSocial: string;
  rfc: string;
  telefono: string;
  //contacto: string;
  correo: string;
  activo: boolean;

  constructor(){
    this.id = 0;
    this.usuarioResponsableId = 0;
    this.identificador = null;
    this.nombre = null;
    this.razonSocial = null;
    this.rfc = null;
    //this.contacto = null;
    this.telefono = null;
    this.correo = null;
    this.activo = true;
  }
}
