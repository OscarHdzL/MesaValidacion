export class AreaModel{
  id: number;
  descripcion: string;
  activo: boolean;
  inclusion: Date;
  tblProcesos: any[];
}


export class AreaFormModel {
  id: number;
  descripcion: string;
  activo: boolean;
  constructor(){
    this.id = 0;
    this.descripcion = null;
    this.activo = true;
  }
}
