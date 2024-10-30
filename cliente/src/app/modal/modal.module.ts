import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { AgregarUsuarioComponent } from '../pages/configuracion/ajustes/modals/agregar-usuario/agregar-usuario.component';
import { AjustesModule } from '../pages/configuracion/ajustes/ajustes.module';
import { ComponentsModule } from '../components/components.module';
import { CentrosModule1 } from '../components/centros/centros.module';
import { SharedModule } from '../shared/shared.module';
import { ConfiguracionModule } from '../pages/configuracion/configuracion.module';
import { AdminModule } from '../pages/admin/admin.module';
import { DesplegableComponent } from '../components/desplegable/desplegable.component';
import { BienesModule } from '../pages/admin/bienes/bienes.module';
import { AjustesBienesModule } from '../components/ajustes-bienes/ajustes-bienes.module';
import { ReportesModule1 } from '../components/reportes/reportes.module';
import { MantenimientoModule1 } from '../components/mantenimiento/mantenimiento.module';
import { HorariosModule } from '../components/horarios/horarios.module';
import { PrestamoModule } from '../components/prestamo/prestamo.module';


@NgModule({
    declarations: [
      ModalComponent
    ],
    exports: [
      ModalComponent,
    ],
    imports: [
        CommonModule,
        AjustesModule,
        CentrosModule1,
        SharedModule,
        ComponentsModule,
        BienesModule,
        AjustesBienesModule,
        ReportesModule1,
        MantenimientoModule1,
        HorariosModule,
        PrestamoModule
        // ConfiguracionModule,
        // AdminModule,
    ]
})
export class ModalModule { }
