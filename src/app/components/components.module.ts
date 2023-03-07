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
@NgModule({
  declarations: [
    HomeComponent,
    ModalDocInfoComponent,
    TabHistoricoComponent,
    TabNuevaVersionComponent,
    ModalForoComponent,
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
    MatPaginatorModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
  ]
})
export class ComponentsModule { }
