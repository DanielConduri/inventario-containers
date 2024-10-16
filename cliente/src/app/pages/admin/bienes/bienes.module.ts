import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienesComponent } from './bienes.component';
import { ComponentsModule } from '../../../components/components.module';
import { BienesRoutingModule } from './bienes-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { AjustesBienesModule } from "../../../components/ajustes-bienes/ajustes-bienes.module";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inventario',
        loadChildren: () =>
          import('./bienes-routing.module').then(
            (m) => m.BienesRoutingModule
            ),
      },
      {
        path: 'custodios',
        loadChildren: () =>
          import('./bienes-routing.module').then(
            (m) => m.BienesRoutingModule
            ),
      },
      {
        path: 'caracteristicas',
        loadChildren: () =>
        import('./bienes-routing.module').then(
          (m) => m.BienesRoutingModule
        )
      }
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
    declarations: [
        BienesComponent,
    ],
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        BienesRoutingModule,
        RouterModule.forChild(routes),
        AjustesBienesModule
    ]
})
export class BienesModule { }
