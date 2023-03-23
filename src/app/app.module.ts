import { LoaderComponent } from './loader/loader.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { EventBlockerDirectiveDirective } from './directives/event-blocker-directive.directive';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoaderInterceptor } from './loader.interceptor';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [AppComponent,  LoaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Vex
    VexModule,
    CustomLayoutModule,
    NgxLoadingModule.forRoot({}),
    MatSnackBarModule
  ],
  providers: [{provide:LocationStrategy, useClass:HashLocationStrategy},
    {
    provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
