export class RolModel{
  id: number;
  descripcion: string;
  activo: boolean;
}


export class RolFormModel {
  id: number;
  descripcion: string;
  activo: boolean;
  constructor(){
    this.id = 0;
    this.descripcion = null;
    this.activo = true;
  }
}
