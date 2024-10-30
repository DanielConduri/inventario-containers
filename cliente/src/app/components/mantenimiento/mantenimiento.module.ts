import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
// import { MostrarAntenimientoComponent } from './mostrar-antenimiento/mostrar-antenimiento.component';
// import { MostrarMantenimientoComponent } from './mostrar-mantenimiento/mostrar-mantenimiento.component';
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
// import { PlanificacionMantenimientoComponent } from './caracteries/planificacion-mantenimiento/planificacion-mantenimiento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarNivelComponent } from './administracion/agregar-nivel/agregar-nivel.component';
import { AgregarEstadoMComponent } from './administracion/agregar-estado-m/agregar-estado-m.component';
import { AgregarRegistroComponent } from './caracteries/registro/agregar-registro/agregar-registro.component';
import { MostrarAdministracionComponent } from './mostrar-administracion/mostrar-administracion.component';
import { MostrarRegistroPComponent } from './caracteries/registro/mostrar-registro-p/mostrar-registro-p.component';
import { MostrarRegistroCComponent } from './caracteries/registro/mostrar-registro-c/mostrar-registro-c.component';
import { AgregarPlanificacionComponent } from './caracteries/registro/agregar-planificacion/agregar-planificacion.component';
import { EditarTipoComponent } from './administracion/editar-tipo/editar-tipo.component';
import { EditarSoporteComponent } from './administracion/editar-soporte/editar-soporte.component';
import { EditarNivelComponent } from './administracion/editar-nivel/editar-nivel.component';
import { EditarEstadoMComponent } from './administracion/editar-estado-m/editar-estado-m.component';
import { EditarPlanificacionComponent } from './caracteries/registro/editar-planificacion/editar-planificacion.component';
import { EditarCorrectivoComponent } from './caracteries/registro/editar-correctivo/editar-correctivo.component';
import { TraspasoTecnicoComponent } from './caracteries/registro/traspaso-tecnico/traspaso-tecnico.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { EditarMantenimientoPreventivoComponent } from './caracteries/registro/editar-mantenimiento-preventivo/editar-mantenimiento-preventivo.component';
import { DetallesPlanificacionComponent } from './caracteries/registro/detalles-planificacion/detalles-planificacion.component';


@NgModule({
  declarations: [
    // MostrarMantenimientoComponent,
    AgregarMantenimientoComponent,
    TipoMantenimientoComponent,
    TipoSoporteComponent,
    AgregarSoporteComponent,
    MostrarCaracteresComponent,
    AgregarTipoComponent,
    NivelMantenimientoComponent,
    EstadoMantenimientoComponent,
    RegistroMantenimientoComponent,
    // PlanificacionMantenimientoComponent,
    AgregarNivelComponent,
    AgregarEstadoMComponent,
    AgregarRegistroComponent,
    MostrarAdministracionComponent,
    MostrarRegistroPComponent,
    MostrarRegistroCComponent,
    AgregarPlanificacionComponent,
    EditarTipoComponent,
    EditarSoporteComponent,
    EditarNivelComponent,
    EditarEstadoMComponent,
    EditarPlanificacionComponent,
    EditarCorrectivoComponent,
    TraspasoTecnicoComponent,
    EditarMantenimientoPreventivoComponent,
    DetallesPlanificacionComponent
  ],
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  exports:[
    // MostrarMantenimientoComponent,
    AgregarMantenimientoComponent,
    TipoMantenimientoComponent,
    TipoSoporteComponent,
    AgregarSoporteComponent,
    MostrarCaracteresComponent,
    AgregarTipoComponent,
    NivelMantenimientoComponent,
    EstadoMantenimientoComponent,
    RegistroMantenimientoComponent,
    // PlanificacionMantenimientoComponent,
    AgregarNivelComponent,
    AgregarEstadoMComponent,
    AgregarRegistroComponent,
    MostrarAdministracionComponent,
    MostrarRegistroPComponent,
    AgregarPlanificacionComponent,
    EditarTipoComponent,
    EditarSoporteComponent,
    EditarNivelComponent,
    EditarEstadoMComponent,
    EditarPlanificacionComponent,
    EditarCorrectivoComponent,
    TraspasoTecnicoComponent,
    EditarMantenimientoPreventivoComponent,
    DetallesPlanificacionComponent
  ]
})
export class MantenimientoModule1 { }
