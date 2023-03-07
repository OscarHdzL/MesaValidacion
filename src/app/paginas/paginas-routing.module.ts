import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';


const rutas: Routes = [
  {
    path: 'inicio',
    component: InicioComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(rutas)],
  exports: [RouterModule]
})
export class PaginasRoutingModule { }
