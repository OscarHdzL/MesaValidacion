import { IVersion } from "./IVersion.model";

export interface IArchivo {
    id: number,
    titulo: string,
    fecha: Date,
    subtitulo: string,
    descripcion: string,
    versiones?: IVersion[]
}