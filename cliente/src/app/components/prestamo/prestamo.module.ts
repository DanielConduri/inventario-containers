import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostrarPrestamoComponent } from './mostrar-prestamo/mostrar-prestamo.component';
import { AgregarPrestamoComponent } from './agregar-prestamo/agregar-prestamo.component';
import { MostrarEstadosComponent } from './gestion/mostrar-estados/mostrar-estados.component';
import { AgregarEstadosComponent } from './gestion/agregar-estados/agregar-estados.component';
import { ModificarEstadosComponent } from './gestion/modificar-estados/modificar-estados.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { InteraccionCustodioComponent } from './interaccion-custodio/interaccion-custodio.component';
import { PintarSolicitudComponent } from './pintar-solicitud/pintar-solicitud.component';
import { AgregarFirmaSolComponent } from './agregar-firma-sol/agregar-firma-sol.component';



@NgModule({
  declarations: [
    MostrarPrestamoComponent,
    AgregarPrestamoComponent,
    MostrarEstadosComponent,
    AgregarEstadosComponent,
    ModificarEstadosComponent,
    InteraccionCustodioComponent,
    PintarSolicitudComponent,
    AgregarFirmaSolComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    
  ], 
  exports: [
    MostrarPrestamoComponent,
    AgregarPrestamoComponent,
    MostrarEstadosComponent,
    AgregarEstadosComponent,
    ModificarEstadosComponent,
    InteraccionCustodioComponent,
    PintarSolicitudComponent,
    AgregarFirmaSolComponent
  ]
})
export class PrestamoModule { }
