import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostrarCentrosComponent } from './mostrar-centros/mostrar-centros.component';
import { ComponentsModule } from '../components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { AgregarCentrosComponent } from './agregar-centros/agregar-centros.component';
import { EditarCentrosComponent } from './editar-centros/editar-centros.component';
import { DetallesCentrosComponent } from './detalles-centros/detalles-centros.component';



@NgModule({
  declarations: [
    MostrarCentrosComponent,
    AgregarCentrosComponent,
    EditarCentrosComponent,
    DetallesCentrosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // ComponentsModule,
    PaginationModule

  ],
  exports:[
    MostrarCentrosComponent,
    AgregarCentrosComponent,
    EditarCentrosComponent,
    DetallesCentrosComponent
  ]
})
export class CentrosModule1 { }
