import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailedModule } from './pages/failed/failed.module';
import { HomeModule } from './pages/home/home.module';
import { DeniedModule } from './pages/denied/denied.module';
import  config  from 'config/config';
import { Layouts } from './layout/layout';
import { PermisoGuard } from './core/guards/permiso.guard';
import { PermissionsGuard } from './core/guards/permissions.guard';
import { AdminModule } from './pages/admin/admin.module';
import { ConfiguracionModule } from './pages/configuracion/configuracion.module';
import { LogoutModule } from './pages/logout/logout.module';
import { CasErrModule } from './pages/cas-err/cas-err.module';
import { BienesModule } from './pages/admin/bienes/bienes.module';

const routes: Routes = [
  {
    path: config.URL_BASE_PATH,
    data: {layout: Layouts.simple},
    children: [
      {path: '', loadChildren:() => HomeModule},
      {path: '404', loadChildren:() => FailedModule},
      {path: 'denegado', loadChildren:() => DeniedModule},
      {path: 'logout', loadChildren:() => LogoutModule},
      {path: 'casError', loadChildren:() => CasErrModule}
    ],
  },
  {
    path: config.URL_BASE_PATH,
    data: {layout: Layouts.full},
    canActivate: [PermisoGuard, /*PermissionsGuard*/],
    children: [
      {path: '', loadChildren:() => AdminModule},
      {path: 'ajustes', loadChildren:() => ConfiguracionModule},
      {path: 'bienes', loadChildren:() => BienesModule}
    ],
  },

  { path: '**', redirectTo:'/404'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
