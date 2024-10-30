import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { AjustesModule } from '../pages/configuracion/ajustes/ajustes.module';
import { ButtonComponent } from './button/button.component';
import { MostrarCentrosComponent } from './centros/mostrar-centros/mostrar-centros.component';
import { CentrosModule } from '../pages/admin/centros/centros.module';
import { FormsModule } from '@angular/forms';
import { DesplegableComponent } from './desplegable/desplegable.component';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { AjustesBienesModule } from './ajustes-bienes/ajustes-bienes.module';
import { MostrarBienesComponent } from './bienes-custodio/mostrar-bienes/mostrar-bienes.component';







@NgModule({
    declarations: [
        ButtonComponent,
        DesplegableComponent,
    ],
    exports: [
        ButtonComponent,
        DesplegableComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
    ]
})
export class ComponentsModule { }
