export class ProcesoModel{
  id: number;
  tblPartidasId: number;
  catAreaId: number;
  nombre: string;
  activo: boolean;
  inclusion: Date;
  catArea?: any;
  tblPartidas?: any;
  tblPeriodos: any[];
  tblProcesoUsuarios: any[];
}


export class ProcesoFormModel {
  id: number;
  tblPartidasId: number;
  catAreaId: number;
  nombre: string;
  constructor(){
    this.id = 0;
    this.tblPartidasId = 0;
    this.nombre = null;
  }
}
