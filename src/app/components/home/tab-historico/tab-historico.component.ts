import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { IArchivo } from 'src/app/modelos/IArchivo.model';
import { IVersion } from 'src/app/modelos/IVersion.model';
import { ArchivosService } from 'src/app/servicios/archivos.service';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { DocumentosProyectoModel, DocumentosVersionProyectoModel } from 'src/app/modelos/DocumentosProyecto.model';

@Component({
  selector: 'vex-tab-historico',
  templateUrl: './tab-historico.component.html',
  styleUrls: ['./tab-historico.component.scss']
})
export class TabHistoricoComponent implements OnInit {
  @Input() documento: DocumentosProyectoModel


  @ViewChild(MatSort) sort: MatSort;
  dummyData: IArchivo
  listaVersionesDocumento: DocumentosVersionProyectoModel[]
  panelOpenState = false
  dataSource: any
  pageSize = 3;
  pageSizeOptions: number[] = [this.pageSize, 5, 10, 20];
  pageEvent: PageEvent;

  constructor(
   // @Inject(MAT_DIALOG_DATA) public doc: DocumentosProyectoModel,
    public archivoServicio: ArchivosService,
    public matPaginatorIntl: MatPaginatorIntl,
    private mesaValidacionService: MesaValidacionService,
  )
  {




/*     this.dummyData = archivoServicio.getArchivosById(this.objeto.id)
    this.listaVersionesDocumento = this.dummyData.versiones */
  }

  async ngOnInit(){


    this.listaVersionesDocumento = await this.obtenerVersionesDocumentoProyecto(this.documento.relProyectoDocumentacionId);

    this.dataSource = new MatTableDataSource<any>(this.listaVersionesDocumento);
    this.matPaginatorIntl.itemsPerPageLabel = "Actividades por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';
  }

  public async obtenerVersionesDocumentoProyecto(idRelProyectoDocumento: number){
    const respuesta = await this.mesaValidacionService.obtenerDocumentosProyecto(idRelProyectoDocumento);
    return respuesta.exito ? respuesta.respuesta : [];
  }


  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.listaVersionesDocumento = this.listaVersionesDocumento.slice(firstCut, secondCut);
  }
}
