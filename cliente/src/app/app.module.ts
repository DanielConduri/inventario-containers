import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './pages/home/home.module';
import { DeniedComponent } from './pages/denied/denied.component';
import { FailedModule } from './pages/failed/failed.module';
import { CasClient } from './core/security/CasClient/CasClient';
import { HttpService } from './core/security/CasClient/http.service';
import { AuthInterceptor } from './core/security/other/auth.interceptor';
// import { ModalComponent } from './modal/modal.component';
import { ModalService } from './core/services/modal.service';
import { ModalModule } from './modal/modal.module';
import { CentrosComponent } from './pages/admin/centros/centros.component';
import { ButtonComponent } from './components/button/button.component';
import { ComponentsModule } from './components/components.module';
import { CentrosService } from './core/services/centros.service';
import { PersonasService } from './core/services/personas.service';
import { AjustesService } from './core/services/ajustes.service';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminModule } from './pages/admin/admin.module';
import { ConfiguracionModule } from './pages/configuracion/configuracion.module';
import { DeniedModule } from './pages/denied/denied.module';
import { LogoutModule } from './pages/logout/logout.module';
import { CasErrModule } from './pages/cas-err/cas-err.module';
// import { ReportesModule } from './components/reportes/reportes.module';
import { SidebarService } from './core/services/sidebar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { TipoInformeComponent } from './reportes/tipo-informe/tipo-informe.component';


@NgModule({
    declarations: [
        AppComponent,
        // TipoInformeComponent,
        // ConfiguracionesComponent,
       // ConfiguracionModule
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      LayoutModule,
      HomeModule,
      FailedModule,
      HttpClientModule,
      ModalModule,
      FormsModule,
      ReactiveFormsModule,
      AdminModule,
      ConfiguracionModule,
      DeniedModule,
      LogoutModule,
      CasErrModule,
      BrowserAnimationsModule,
      MatSlideToggleModule,
  ],
  exports:[
  ],
  providers: [
    ModalService,
    CentrosService,
    ModalService,
    PersonasService,
    SidebarService,
    AjustesService,
    CasClient,
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
