export interface RespuestaModel {
  estado:boolean;
  EXITO: boolean;
  Object:any;
  MENSAJE: string;
  RESPUESTA: any;
  respuesta:any;
  exito: boolean;
}

/* 
export interface RespuestaModel {
  EXITO: boolean;
  estado:boolean;
  respuesta:any;
  Object:any;
  mensaje:string;
  MENSAJE: string;
  RESPUESTA: any;
  exito: boolean;
  objeto:any;
}
*/
export interface IRespuestaConsulta {
  response: Array<any>;
  success: boolean;
  status: number;
  currentException: any;
}
