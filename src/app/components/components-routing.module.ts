import { UsuariosComponent } from './usuarios/usuarios.component';
import { AreasComponent } from './areas/areas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RolesComponent } from './roles/roles.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  },
  {
    path: 'areas',
    component: AreasComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
