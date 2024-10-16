import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'src/app/modal/modal.module';
import { BienesModule } from './bienes/bienes.module';
import { ReportesComponent } from './reportes/reportes.component';
import { PermissionsGuard } from 'src/app/core/guards/permissions.guard';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'welcome',
        // canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./welcome/welcome.module').then((m) => m.WelcomeModule),
      },
      {
        path: 'centros',
        canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./centros/centros.module').then((m) => m.CentrosModule),
      },
      {
        path: 'bienes',
        canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./bienes/bienes.module').then((m) => m.BienesModule),
      },
      {
        path: 'reportes',
        canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./reportes/reportes.module').then((m) => m.ReportesModule),
      },
      {
        path: 'mantenimiento',
        canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./mantenimiento/mantenimiento.module').then(
            (m) => m.MantenimientoModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminModule {}
