export class PartidaModel{
  id: number;
  usuarioResponsableId: number;
  catClienteId: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  inclusion: Date;
  catCliente?: any;
  tblProcesos: any[];
}


export class PartidaFormModel {
  id: number;
  catClienteId: number;
  nombre: string;
  descripcion: string;
  usuarioResponsableId: number;
  constructor(){
    this.id = 0;
    this.catClienteId = 0;
    this.descripcion = null;
    this.nombre = null;
    this.usuarioResponsableId = 0;

  }
}
