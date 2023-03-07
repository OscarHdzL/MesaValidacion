import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { IArchivo } from 'src/app/modelos/IArchivo.model';
import { IVersion } from 'src/app/modelos/IVersion.model';
import { ArchivosService } from 'src/app/servicios/archivos.service';

@Component({
  selector: 'vex-tab-historico',
  templateUrl: './tab-historico.component.html',
  styleUrls: ['./tab-historico.component.scss']
})
export class TabHistoricoComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dummyData: IArchivo
  dummyData2: IVersion[]
  panelOpenState = false
  dataSource: any
  pageSize = 3;
  pageSizeOptions: number[] = [this.pageSize, 5, 10, 20];
  pageEvent: PageEvent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public objeto: any, 
    public archivoServicio: ArchivosService,
    public matPaginatorIntl: MatPaginatorIntl
  ) 
  {
    this.dummyData = archivoServicio.getArchivosById(this.objeto.id)
    this.dummyData2 = this.dummyData.versiones
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.dummyData2);
    this.matPaginatorIntl.itemsPerPageLabel = "Actividades por página";
    this.matPaginatorIntl.previousPageLabel  = 'Anterior página';
    this.matPaginatorIntl.nextPageLabel = 'Siguiente página';
  }

  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.dummyData2 = this.dummyData2.slice(firstCut, secondCut);
  }
}
