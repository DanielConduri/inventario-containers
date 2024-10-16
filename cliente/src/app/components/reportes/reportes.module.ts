import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import { ResporteComponent } from './resporte/resporte.component';
import { MostrarReporteComponent } from './mostrar-reporte/mostrar-reporte.component';
import { ReporteIndividualComponent } from './reporte-individual/reporte-individual.component';
import { MostrarInformeComponent } from './mostrar-informe/mostrar-informe.component';
import { AgregarReporteComponent } from './agregar-reporte/agregar-reporte.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarInformeComponent } from './agregar-informe/agregar-informe.component';
import { ComponentsModule } from '../components.module';
import { TipoInformeComponent } from './tipo-informe/tipo-informe.component';
import { AgregarTipoComponent } from './agregar-tipo/agregar-tipo.component';
import { PintarPDFComponent } from './pintar-pdf/pintar-pdf.component';
import { ModificarInformeComponent } from './modificar-informe/modificar-informe.component';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { ModificarTipoComponent } from './modificar-tipo/modificar-tipo.component';




@NgModule({
  declarations: [
    MostrarReporteComponent,
    ReporteIndividualComponent,
    MostrarInformeComponent,
    AgregarReporteComponent,
    AgregarInformeComponent,
    TipoInformeComponent,
    AgregarTipoComponent,
    PintarPDFComponent,
    ModificarInformeComponent,
    ModificarTipoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule
    // ComponentsModule
  ],
  exports: [
    MostrarReporteComponent,
    ReporteIndividualComponent,
    MostrarInformeComponent,
    AgregarReporteComponent,
    AgregarInformeComponent,
    TipoInformeComponent,
    AgregarTipoComponent,
    PintarPDFComponent,
    ModificarInformeComponent,
    ModificarTipoComponent


  ], providers: [
    DatePipe
  ]
})
export class ReportesModule1 { }
