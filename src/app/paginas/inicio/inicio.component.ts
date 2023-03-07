import { Component, OnInit } from '@angular/core';
import { EjemploService } from 'src/app/servicios/ejemplo.service';

@Component({
  selector: 'vex-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(
    private servicioRenapo: EjemploService
  ) { }

  ngOnInit(): void {
    this.obtenerCURP();
  }

  public async obtenerCURP(){
    debugger
    const respuesta = await this.servicioRenapo.ObtieneDatosCurp('COCM990909HQRLNR00');
    console.log(respuesta);
  }
}
