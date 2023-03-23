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
import {  FuncionUsuarioFormModel, UsuarioFormModel } from '../modelos/usuario.model';
import { ProcesoUsuarioFormModel } from '../modelos/proceso-usuario.model';
import { DocumentosProyectoFormModel } from '../modelos/DocumentosProyecto.model';
import { ComentarioDocumentoProyectoFormModel } from '../modelos/ComentarioDocumentoProyecto.model';
import { LoginModel } from '../modelos/login.model';



@Injectable({
  providedIn: 'root'
})
export class MesaValidacionService extends ConfiguracionEndpointsService {


  constructor(public http: HttpClient) {
    super(http);
  }


  public async Login(loginModel: LoginModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Sesion/Login', loginModel);
  }

  public async ResetPassword(loginModel: LoginModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Sesion/ResetPass', loginModel);
  }



  /* CLIENTES */

  public async obtenerCatalogoClientes() : Promise <any> {
    return await this.getAsync(this.url_api + 'Clientes');
  }

  public async obtenerCatalogoClientesByResponsablePartida(idResponsablePartida) : Promise <any> {
    return await this.getAsync(this.url_api + 'Clientes/ByResponsablePartida?idResponsablePartida=' + idResponsablePartida);
  }

  public async obtenerCatalogoClientesByUsuarioSesion(idUsuarioSesion) : Promise <any> {
    return await this.getAsync(this.url_api + 'Clientes/MesaValidacion?idUsuarioSesion=' + idUsuarioSesion);
  }

  public async insertarCliente(cliente: ClienteFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Clientes', cliente);
  }

  public async actualizarCliente(cliente: ClienteFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Clientes', cliente);
  }

  public async deshabilitarCliente(cliente: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Clientes/Disable/'+ cliente, {});
  }


   /* PARTIDAS */

   public async obtenerCatalogoPartidas(partida: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Partida?idCliente=' + partida);
  }

  public async insertarPartida(partida: PartidaFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Partida', partida);
  }

  public async actualizarPartida(partida: PartidaFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Partida', partida);
  }

  public async deshabilitarPartida(partida: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Partida/Disable/'+ partida, {});
  }


  /* PROCESO */
  public async obtenerCatalogoProcesos(partida: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Proceso?idPartida=' + partida);
  }

  public async insertarProceso(proceso: ProcesoFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Proceso', proceso);
  }

  public async actualizarProceso(proceso: ProcesoFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Proceso', proceso);
  }

  public async deshabilitarProceso(proceso: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Proceso/Disable/'+ proceso, {});
  }


  /* AREAS */



  /* PERIODOS */
  public async obtenerCatalogoPeriodos(proceso: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Periodo?idProceso=' + proceso);
  }

  public async obtenerCatalogoPeriodosByPartida(idPartida: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Periodo/ByPartida?idPartida=' + idPartida);
  }

  public async insertarPeriodo(periodo: PeriodoFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Periodo', periodo);
  }

  public async actualizarPeriodo(periodo: PeriodoFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Periodo', periodo);
  }

  public async deshabilitarPeriodo(periodo: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Periodo/Disable/'+periodo, {});
  }

  /* DOCUMENTOS */
  public async obtenerCatalogoDocumentos(doc: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Documentacion?idPeriodo=' + doc);
  }

  public async insertarDocumento(doc: DocumentoFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Documentacion', doc);
  }

  public async actualizarDocumento(doc: DocumentoFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Documentacion', doc);
  }

  public async deshabilitarDocumento(doc: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Documentacion/Disable/'+ doc, {});
  }

  /* PROYECTOS */
  public async obtenerCatalogoProyectos(proyecto: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Proyecto?idPeriodo=' + proyecto);
  }

  public async insertarProyecto(proyecto: ProyectoFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Proyecto', proyecto);
  }

  public async actualizarProyecto(proyecto: ProyectoFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Proyecto', proyecto);
  }

  public async deshabilitarProyecto(proyecto: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Proyecto/Disable/'+ proyecto,{});
  }


   /* AREAS */
   public async obtenerCatalogoAreas() : Promise <any> {
    return await this.getAsync(this.url_api + 'Areas');
  }

  public async insertarArea(area: AreaFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Areas', area);
  }

  public async actualizarArea(area: AreaFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Areas', area);
  }

  public async deshabilitarArea(area: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Areas/Disable/'+ area, {});
  }


  /* ROLES */
  public async obtenerCatalogoRols() : Promise <any> {
    return await this.getAsync(this.url_api + 'Roles');
  }

  public async insertarRol(rol: RolFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Roles', rol);
  }

  public async actualizarRol(rol: RolFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Roles', rol);
  }

  public async deshabilitarRol(rol: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Roles/Disable/' + rol, {});
  }

    /* USUARIOS */
    public async obtenerCatalogoUsuarios() : Promise <any> {
      return await this.getAsync(this.url_api + 'Usuarios');
    }

    public async obtenerFuncionesUsuario(idUsuario: number) : Promise <any> {
      return await this.getAsync(this.url_api + 'Usuarios/Funciones?idUsuario=' + idUsuario);
    }

    public async insertarUsuario(usuario: UsuarioFormModel) : Promise <any> {
      return await this.postAsync(this.url_api + 'Usuarios', usuario);
    }

    public async actualizarUsuario(usuario: UsuarioFormModel) : Promise <any> {
      return await this.putAsync(this.url_api + 'Usuarios', usuario);
    }

    public async actualizarFuncionUsuario(funcion: FuncionUsuarioFormModel) : Promise <any> {
      return await this.putAsync(this.url_api + 'Usuarios/Funciones', funcion);
    }

    public async deshabilitarUsuario(usuario: number) : Promise <any> {
      return await this.putAsync(this.url_api + 'Usuarios/Disable/'+usuario, {});
    }



    /* PROCESO USUARIOS */
    public async obtenerCatalogoProcesoUsuarios(procesoUsuario) : Promise <any> {
      return await this.getAsync(this.url_api + 'ProcesoUsuario?idProceso=' + procesoUsuario);
    }

    public async insertarProcesoUsuario(procesoUsuario: ProcesoUsuarioFormModel) : Promise <any> {
      return await this.postAsync(this.url_api + 'ProcesoUsuario', procesoUsuario);
    }

    public async actualizarProcesoUsuario(procesoUsuario: ProcesoUsuarioFormModel) : Promise <any> {
      return await this.putAsync(this.url_api + 'ProcesoUsuario', procesoUsuario);
    }

    public async deshabilitarProcesoUsuario(procesoUsuario: number) : Promise <any> {
      return await this.putAsync(this.url_api + 'ProcesoUsuario/Disable/'+procesoUsuario, {});
    }


     /* DOCUMENTOS POR PROYECTO */
  public async obtenerCatalogoDocumentosProyecto(doc: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Documento/Catalogo?idProyecto=' + doc);
  }

     /* VERSIONES DE DOCUMENTO POR PROYECTO */
  public async obtenerDocumentosProyecto(doc: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Documento?idRelProyectoDocumento=' + doc);
  }


  /* DOCUMENTOS POR PROYECTO */

  public async insertarVersionDocumentosProyecto(doc: DocumentosProyectoFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Documento', doc);
  }

  public async actualizarVersionDocumentosProyecto(doc: DocumentosProyectoFormModel) : Promise <any> {
    return await this.putAsync(this.url_api + 'Documento', doc);
  }

  public async deshabilitarVersionDocumentosProyecto(doc: number) : Promise <any> {
    return await this.putAsync(this.url_api + 'Documento/Disable/'+ doc, {});
  }


  /* COMENTARIOS DOCUMENTOS POR PROYECTO */
  public async obtenerComentariosDocumentoProyecto(doc: number) : Promise <any> {
    return await this.getAsync(this.url_api + 'Comentario?idDocumento=' + doc);
  }

  public async insertarComentariosDocumentoProyecto(doc: ComentarioDocumentoProyectoFormModel) : Promise <any> {
    return await this.postAsync(this.url_api + 'Comentario', doc);
  }

 /* MOVIMIENTOS PROYECTO DOCUMENTO */
 public async obtenerMovimientosDocumentoProyecto(doc: number) : Promise <any> {
  return await this.getAsync(this.url_api + 'MovimientoProyectoDocumento?idRelProyectoDocumento=' + doc);
}

}
