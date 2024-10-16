import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
// import { MostrarAntenimientoComponent } from './mostrar-antenimiento/mostrar-antenimiento.component';
import { MostrarMantenimientoComponent } from './mostrar-mantenimiento/mostrar-mantenimiento.component';
import { AgregarMantenimientoComponent } from './agregar-mantenimiento/agregar-mantenimiento.component';
import { TipoMantenimientoComponent } from './administracion/tipo-mantenimiento/tipo-mantenimiento.component';
import { TipoSoporteComponent } from './administracion/tipo-soporte/tipo-soporte.component';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { AgregarSoporteComponent } from './administracion/agregar-soporte/agregar-soporte.component';
import { MostrarCaracteresComponent } from './mostrar-caracteres/mostrar-caracteres.component';
import { AgregarTipoComponent } from './administracion/agregar-tipo/agregar-tipo.component';
import { NivelMantenimientoComponent } from './administracion/nivel-mantenimiento/nivel-mantenimiento.component';
import { EstadoMantenimientoComponent } from './administracion/estado-mantenimiento/estado-mantenimiento.component';
import { RegistroMantenimientoComponent } from './caracteries/registro-mantenimiento/registro-mantenimiento.component';
import { PlanificacionMantenimientoComponent } from './caracteries/planificacion-mantenimiento/planificacion-mantenimiento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarNivelComponent } from './administracion/agregar-nivel/agregar-nivel.component';
import { AgregarEstadoMComponent } from './administracion/agregar-estado-m/agregar-estado-m.component';
import { AgregarRegistroComponent } from './caracteries/registro/agregar-registro/agregar-registro.component';
import { MostrarAdministracionComponent } from './mostrar-administracion/mostrar-administracion.component';
import { MostrarRegistroPComponent } from './caracteries/registro/mostrar-registro-p/mostrar-registro-p.component';
import { MostrarRegistroCComponent } from './caracteries/registro/mostrar-registro-c/mostrar-registro-c.component';


@NgModule({
  declarations: [
    MostrarMantenimientoComponent,
    AgregarMantenimientoComponent,
    TipoMantenimientoComponent,
    TipoSoporteComponent,
    AgregarSoporteComponent,
    MostrarCaracteresComponent,
    AgregarTipoComponent,
    NivelMantenimientoComponent,
    EstadoMantenimientoComponent,
    RegistroMantenimientoComponent,
    PlanificacionMantenimientoComponent,
    AgregarNivelComponent,
    AgregarEstadoMComponent,
    AgregarRegistroComponent,
    MostrarAdministracionComponent,
    MostrarRegistroPComponent,
    MostrarRegistroCComponent
  ],
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    MostrarMantenimientoComponent,
    AgregarMantenimientoComponent,
    TipoMantenimientoComponent,
    TipoSoporteComponent,
    AgregarSoporteComponent,
    MostrarCaracteresComponent,
    AgregarTipoComponent,
    NivelMantenimientoComponent,
    EstadoMantenimientoComponent,
    RegistroMantenimientoComponent,
    PlanificacionMantenimientoComponent,
    AgregarNivelComponent,
    AgregarEstadoMComponent,
    AgregarRegistroComponent,
    MostrarAdministracionComponent,
    MostrarRegistroPComponent
  ]
})
export class MantenimientoModule1 { }
