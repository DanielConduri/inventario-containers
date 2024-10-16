import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReportesModule1 } from 'src/app/components/reportes/reportes.module'; 
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path: 'reporte',
        loadChildren:() =>
          import ('./reportes-routing.module').then(
            (m) => m.ReportesRoutingModule
          )
      },
      {
        path: 'informe',
        loadChildren:() =>
          import ('./reportes-routing.module').then(
            (m) => m.ReportesRoutingModule
          )
      },
      {
        path:'tipo',
        loadChildren:() =>
          import ('./reportes-routing.module').then(
            (m) => m.ReportesRoutingModule
          )
      }
      // { path: 'cuenta', component: MostrarCuentaComponent}
      
      
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
@NgModule({
  declarations: [
    ReportesComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ComponentsModule,
    ReportesModule1,
    RouterModule.forChild(routes),
  ],
  exports: [
    ReportesComponent
  ]
})
export class ReportesModule { }
