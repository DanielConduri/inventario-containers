import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import { ResporteComponent } from './resporte/resporte.component';
import { MostrarReporteComponent } from './mostrar-reporte/mostrar-reporte.component';
// import { ReporteIndividualComponent } from './reporte-individual/reporte-individual.component';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReporteComponent } from './reporte/reporte.component';
import { MostrarReporteMantenimientoComponent } from './mostrar-reporte-mantenimiento/mostrar-reporte-mantenimiento.component';




@NgModule({
  declarations: [
    MostrarReporteComponent,
    // ReporteIndividualComponent,
    MostrarInformeComponent,
    AgregarReporteComponent,
    AgregarInformeComponent,
    TipoInformeComponent,
    AgregarTipoComponent,
    PintarPDFComponent,
    ModificarInformeComponent,
    ModificarTipoComponent,
    ReporteComponent,
    MostrarReporteMantenimientoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatExpansionModule
    // ComponentsModule
  ],
  exports: [
    MostrarReporteComponent,
    // ReporteIndividualComponent,
    MostrarInformeComponent,
    AgregarReporteComponent,
    AgregarInformeComponent,
    TipoInformeComponent,
    AgregarTipoComponent,
    PintarPDFComponent,
    ModificarInformeComponent,
    ModificarTipoComponent,
    ReporteComponent,
    MostrarReporteMantenimientoComponent

  ], providers: [
    DatePipe
  ]
})
export class ReportesModule1 { }
