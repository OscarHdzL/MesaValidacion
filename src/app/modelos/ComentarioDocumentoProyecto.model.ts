import { UsuarioFormModel } from './usuario.model';


export class ComentarioDocumentoProyecto {
  id: number;
  tblProyectoDocumentoId: number;
  catUsuarioId: number;
  comentario: string;
  activo: boolean;
  inclusion: Date;
  catUsuario: UsuarioFormModel;
  tblProyectoDocumento?: any;
}


export class ComentarioDocumentoProyectoFormModel {
  id: number;
  tblProyectoDocumentoId: number;
  catUsuarioId: number;
  comentario: string;
  constructor(){
    this.id = 0;
    this.tblProyectoDocumentoId = 0;
    this.catUsuarioId = 0;
    this.comentario = null;
  }
}
