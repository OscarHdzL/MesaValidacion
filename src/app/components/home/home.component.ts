import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArchivosService } from 'src/app/servicios/archivos.service';
import { ModalDocInfoComponent } from './modal-doc-info/modal-doc-info.component'; 
import { ModalForoComponent } from './modal-foro/modal-foro.component';

@Component({
  selector: 'vex-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dummyData: any[] 
  getScreenWidth: any

  constructor(
    private dialog: MatDialog, 
    public archivoServicio: ArchivosService
  ) 
  {
    this.dummyData = archivoServicio.getAllArchivos()
  }

  ngOnInit(): void {
    if(window.innerWidth <= 500) {
      this.getScreenWidth = '100%'
    } else {
      this.getScreenWidth = '80%'
    }
  }

  detalles(id: any) {
    this.dialog.open(ModalDocInfoComponent , {
      height: '80%',
      width: '100%',
      maxWidth: this.getScreenWidth,
      autoFocus: true,
      data: {id},
      disableClose: true
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit()
    });
  } 

  comentarios(id: any) {
    this.dialog.open(ModalForoComponent, {
      height: '80%',
      width: '100%',
      maxWidth: this.getScreenWidth,
      autoFocus: true,
      data: {id},
      disableClose: true
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit()
    });
  } 
}
