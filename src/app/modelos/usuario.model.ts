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



export class FuncionModel {
  id:            number;
  idFuncion:     number;
  modulo:        string;
  funcion:       string;
  idUsuario:     number;
  administrador: boolean;
  correo:        string;
  nombre:        string;
  activo:        boolean;
  inclusion: string
}

export class FuncionUsuarioFormModel {
  id:             number;
  catUsuarioId:   number;
  catFuncionesId: number;
  inclusion:      string;
  activo:         boolean;
}



