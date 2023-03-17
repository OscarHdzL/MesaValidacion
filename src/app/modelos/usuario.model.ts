export class UsuarioModel{
  id: number;
  nombre: string;
  correo: string;
  password?: any;
  activo: boolean;
  administrador: boolean;
  inclusion: Date;
  tblDocumentoComentarios: any[];
  tblProcesoUsuarios: any[];
}


export class UsuarioFormModel {
  id: number;
  nombre: string;
  correo: string;

  constructor(){
    this.id = 0;
    this.nombre = null;
    this.correo = null;
  }

}
