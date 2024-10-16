import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { MantenimientoComponent } from './mantenimiento.component';
import { MantenimientoModule1 } from 'src/app/components/mantenimiento/mantenimiento.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'mantenimientos',
        loadChildren:() =>
        import ('./mantenimiento-routing.module').then(
          (m) => m.MantenimientoRoutingModule
        )
      },
      {
        path: 'caracteres',
        loadChildren:() =>
        import ('./mantenimiento-routing.module').then(
          (m) => m.MantenimientoRoutingModule
        )
      },
      {
        path: 'administracion',
        loadChildren:() =>
        import ('./mantenimiento-routing.module').then(
          (m) => m.MantenimientoRoutingModule
        )
      }
    ]
  }
]

@NgModule({
  declarations: [MantenimientoComponent],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    MantenimientoModule1,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    MantenimientoComponent
  ]
})
export class MantenimientoModule { }
