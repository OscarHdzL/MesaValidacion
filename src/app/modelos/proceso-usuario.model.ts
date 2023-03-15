import { UsuarioFormModel } from './usuario.model';
import { RolFormModel } from './rol.model';
export class CatRol {
  id: number;
  descripcion: string;
  activo: boolean;
  inclusion: Date;
  tblProcesoUsuarios: any[];
}

export class CatUsuario {
  id: number;
  nombre: string;
  correo: string;
  password?: any;
  activo: boolean;
  inclusion: Date;
  tblDocumentoComentarios: any[];
  tblProcesoUsuarios: any[];
}

export class ProcesoUsuarioModel {
  id: number;
  tblProcesoId: number;
  catUsuarioId: number;
  catRolId: number;
  activo: boolean;
  inclusion: Date;
  catRol: CatRol;
  catUsuario: CatUsuario;
  tblProceso?: any;
}


export class ProcesoUsuarioFormModel {
        id: number;
        tblProcesoId: number;
        catUsuarioId: number;
        catRolId: number;
        catRol: RolFormModel;
        catUsuario: UsuarioFormModel;

  constructor(){
    this.id = 0;
    this.tblProcesoId = 0;
    this.catUsuarioId = 0;
    this.catRolId = 0;
    this.catRol = new RolFormModel();
    this.catUsuario = new UsuarioFormModel();
  }

}
