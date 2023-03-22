import { ProcesoModel } from './procesos.model';
export class PeriodoModel{
  id: number;
  tblProcesoId: number;
  nombre: string;
  inicio: string;
  fin: string;
  activo: boolean;
  inclusion: Date;
  tblDocumentacions: any[];
  tblProceso?: ProcesoModel;
  tblProyectos: any[];
}


export class PeriodoFormModel {
  id: number;
  tblProcesoId: number;
  nombre: string;
  inicio: string;
  fin: string;
  constructor(){
    this.id = 0;
    this.tblProcesoId = 0;
    this.inicio= null;
    this.fin= null;
    this.nombre = null;
  }
}
