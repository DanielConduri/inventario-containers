import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrestamosRoutingModule } from './prestamos-routing.module';
import { PrestamosComponent } from './prestamos.component';
import { PrestamoModule } from 'src/app/components/prestamo/prestamo.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'prestamo',
        loadChildren:() =>
        import ('./prestamos-routing.module').then(
          (m) => m.PrestamosRoutingModule
        )
      },
      {
        path: 'gestion',
        loadChildren:() =>
        import ('./prestamos-routing.module').then(
          (m) => m.PrestamosRoutingModule
        )
      }
    ]
  }
]

@NgModule({
  declarations: [PrestamosComponent],
  imports: [
    CommonModule,
    PrestamosRoutingModule,
    PrestamoModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    PrestamosComponent
  ]
})
export class PrestamosModule { }
