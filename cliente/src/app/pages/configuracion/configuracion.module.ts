import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AjustesModule } from './ajustes/ajustes.module';
import { ConfiguracionComponent } from './configuracion.component';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


const routes: Routes = [
  {
    path:'',
    children:[
      {
        path: 'cuenta',
        loadChildren:() =>
          import ('./configuracion-routing.module').then(
            (m) => m.ConfiguracionRoutingModule
          )
      },
      {
        path: 'menus',
        loadChildren:() =>
          import ('./configuracion-routing.module').then(
            (m) => m.ConfiguracionRoutingModule
          )
      }
      // { path: 'cuenta', component: MostrarCuentaComponent}
      ,{
        path: 'usuarios',
        loadChildren:() =>
        import ('./configuracion-routing.module').then(
          (m) => m.ConfiguracionRoutingModule
        )
      }
      ,{
        path: 'roles',
        loadChildren:() =>
        import ('./configuracion-routing.module').then(
          (m) => m.ConfiguracionRoutingModule
        )
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]


@NgModule({
  declarations: [ConfiguracionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ConfiguracionRoutingModule,
    ComponentsModule,
    AjustesModule,
  ],
  exports: [
    RouterModule
  ]
})
export class ConfiguracionModule { }
