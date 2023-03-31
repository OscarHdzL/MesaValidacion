import { PartidaFormModel } from './../modelos/partidas.model';
import { ConfiguracionEndpointsService } from './configuracion-endpoints.service';
import { NavigationService } from '../../@vex/services/navigation.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteFormModel } from '../modelos/cliente.model';
import { ProcesoFormModel } from '../modelos/procesos.model';
import { PeriodoFormModel } from '../modelos/periodos.model';
import { DocumentoFormModel } from '../modelos/documentos.model';
import { ProyectoFormModel } from '../modelos/proyectos.model';
import { AreaFormModel } from '../modelos/area.model';
import { RolFormModel } from '../modelos/rol.model';
import { UsuarioFormModel } from '../modelos/usuario.model';
import { ProcesoUsuarioFormModel } from '../modelos/proceso-usuario.model';
import { DocumentosProyectoFormModel } from '../modelos/DocumentosProyecto.model';



@Injectable({
  providedIn: 'root'
})
export class FileManagerService extends ConfiguracionEndpointsService {


  constructor(public http: HttpClient) {
    super(http);
  }


  /* FILEMANAGER */

  public async obtenerArchivo(token: string) : Promise <any> {
    return await this.getAsync(this.url_filemanager + 'api/Archivos/DescargarArchivo/D2185557-67E6-40F0-9450-5B0B3AFFF7F0/' + token);
  }

  public async cargarArchivo(archivo: any) : Promise <any> {
    return await this.postAsync(this.url_filemanager + 'api/Archivos/CargarArchivos/D2185557-67E6-40F0-9450-5B0B3AFFF7F0', archivo);
  }

/*
  public async obtenerArchivo(token: string) : Promise <any> {
    return await this.getAsync(this.url_filemanager + 'AdminArchivos/AdminArchivos/Visualizar/31B215CC-90A7-4E7B-A4B2-7001B177DB43/' + token);
  }

  public async cargarArchivo(archivo: any) : Promise <any> {
    return await this.postAsync(this.url_filemanager + 'AdminArchivos/AdminArchivos/Insertar/31B215CC-90A7-4E7B-A4B2-7001B177DB43', archivo);
  } */

  public async eliminarArchivo(token: string) : Promise <any> {
    return await this.postAsync(this.url_filemanager + 'api/Archivos/EliminarArchivo/D2185557-67E6-40F0-9450-5B0B3AFFF7F0/' + token, {});
  }

  public async obtenerRutaArchivo(token: string): Promise <string>{
    return this.url_filemanager + 'api/Archivos/DescargarArchivo/D2185557-67E6-40F0-9450-5B0B3AFFF7F0/' + token;
  }

/*   public async obtenerRutaArchivo(token: string): Promise <string>{
    return this.url_filemanager + 'AdminArchivos/AdminArchivos/Visualizar/31B215CC-90A7-4E7B-A4B2-7001B177DB43/' + token;
  } */




}
