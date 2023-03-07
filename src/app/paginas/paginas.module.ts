import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { PaginasRoutingModule } from './paginas-routing.module';



@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    PaginasRoutingModule
  ]
})
export class PaginasModule { }
