import { Component, OnInit } from '@angular/core';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { SesionModel } from 'src/app/modelos/sesion.model';

@Component({
  selector: 'vex-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  constructor() {

    let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
   }

  ngOnInit(): void {
  }

}
