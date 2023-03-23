
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { DocumentosProyectoModel, DocumentosVersionProyectoModel } from 'src/app/modelos/DocumentosProyecto.model';
import { ArchivosService } from 'src/app/servicios/archivos.service';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';
import { FileManagerService } from 'src/app/servicios/filemanager.service';
import { Proceso, SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { MovimientoDocumentosProyectoModel } from 'src/app/modelos/MovimientoDocumentosProyecto.model';


@Component({
  selector: 'vex-modal-movimimientos-proyecto',
  templateUrl: './modal-movimimientos-proyecto.component.html',
  styleUrls: ['./modal-movimimientos-proyecto.component.scss']
})
export class ModalMovimimientosProyectoComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  procesoRolActual: Proceso;



  @ViewChild(MatSort) sort: MatSort;
  listaMovimientos: MovimientoDocumentosProyectoModel[] = [];
  ultimaVersionModel: DocumentosVersionProyectoModel;

  dataSource: any
  pageSize = 3;
  pageSizeOptions: number[] = [this.pageSize, 5, 10, 20];
  pageEvent: PageEvent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public documento: DocumentosProyectoModel,
    public archivoServicio: ArchivosService,
    public matPaginatorIntl: MatPaginatorIntl,
    private mesaValidacionService: MesaValidacionService,
    private swalService: SwalServices,
    private filemanagerService: FileManagerService,
    private dialog: MatDialog,
  ) {
    let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;



   }



  async ngOnInit() {

    this.listaMovimientos = await this.obtenerMovimientosProyecto(this.documento.relProyectoDocumentacionId);

  }

  public async obtenerMovimientosProyecto(idRelProyectoDocumento: number){
    const respuesta = await this.mesaValidacionService.obtenerMovimientosDocumentoProyecto(idRelProyectoDocumento);
    return respuesta.exito ? respuesta.respuesta : [];
  }



}
