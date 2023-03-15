import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ComponentsRoutingModule } from './components-routing.module';
import { HomeComponent } from './home/home.component';
import { MatIconModule } from '@angular/material/icon';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { TabHistoricoComponent } from './home/tab-historico/tab-historico.component';
import { TabNuevaVersionComponent } from './home/tab-nueva-version/tab-nueva-version.component';
import { ModalDocInfoComponent } from './home/modal-doc-info/modal-doc-info.component';
import { ModalForoComponent } from './home/modal-foro/modal-foro.component';
import {MatListModule} from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientesComponent } from './clientes/clientes.component';
import { ModalClienteComponent } from './clientes/modal-cliente/modal-cliente.component';
import { PartidasComponent } from './clientes/partidas/partidas.component';
import { ModalPartidaComponent } from './clientes/partidas/modal-partida/modal-partida.component';
import { ProcesosComponent } from './clientes/procesos/procesos.component';
import { ModalProcesoComponent } from './clientes/procesos/modal-proceso/modal-proceso.component';
import { PeriodosComponent } from './clientes/periodos/periodos.component';
import { ModalPeriodoComponent } from './clientes/periodos/modal-periodo/modal-periodo.component';
import { DocumentosComponent } from './clientes/documentos/documentos.component';
import { ModalDocumentoComponent } from './clientes/documentos/modal-documento/modal-documento.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ProyectosComponent } from './clientes/proyectos/proyectos.component';
import { ModalProyectoComponent } from './clientes/proyectos/modal-proyecto/modal-proyecto.component';
import { AreasComponent } from './areas/areas.component';
import { ModalAreaComponent } from './areas/modal-area/modal-area.component';
import { RolesComponent } from './roles/roles.component';
import { ModalRolComponent } from './roles/modal-rol/modal-rol.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ModalUsuarioComponent } from './usuarios/modal-usuario/modal-usuario.component';
import { ProcesoUsuariosComponent } from './clientes/proceso-usuarios/proceso-usuarios.component';
import { ModalProcesoUsuarioComponent } from './clientes/proceso-usuarios/modal-proceso-usuario/modal-proceso-usuario.component';
@NgModule({
  declarations: [
    HomeComponent,
    ModalDocInfoComponent,
    TabHistoricoComponent,
    TabNuevaVersionComponent,
    ModalForoComponent,
    ClientesComponent,
    ModalClienteComponent,
    PartidasComponent,
    ModalPartidaComponent,
    ProcesosComponent,
    ModalProcesoComponent,
    PeriodosComponent,
    ModalPeriodoComponent,
    DocumentosComponent,
    ModalDocumentoComponent,
    ProyectosComponent,
    ModalProyectoComponent,
    AreasComponent,
    ModalAreaComponent,
    RolesComponent,
    ModalRolComponent,
    UsuariosComponent,
    ModalUsuarioComponent,
    ProcesoUsuariosComponent,
    ModalProcesoUsuarioComponent,
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    PageLayoutModule,
    BreadcrumbsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
  ]
})
export class ComponentsModule { }
