export class ProyectoModel{
  id: number;
  tblPeriodoId: number;
  nombre: string;
  activo: boolean;
  inclusion?: Date;
  relProyectoDocumentacions?: any[];
  tblPeriodo?: any;
}


export class ProyectoFormModel {
  id: number;
  tblPeriodoId: number;
  nombre: string;
  constructor(){
    this.id = 0;
    this.tblPeriodoId = 0;
    this.nombre = null;
  }
}
