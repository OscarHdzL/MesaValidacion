
export class Proyecto {
  id: number;
  nombre: string;
}

export class Periodo {
  id: number;
  nombre: string;
  proyectos: Proyecto[];
}

export class Proceso {
  id: number;
  nombre: string;
  area: string;
  idRol: number;
  rol: string;
  periodos: Periodo[];
}

export class Partida {
  id: number;
  nombre: string;
  procesos: Proceso[];
}

export class Cliente {
  id: number;
  nombre: string;
  identificador: string;
  partidas: Partida[];
}

export class SesionModel {
  id: number;
  nombre: string;
  correo: string;
  clientes: Cliente[];
  administrador: boolean;
}
