import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'src/app/modal/modal.module';
import { BienesModule } from './bienes/bienes.module';
import { ReportesComponent } from './reportes/reportes.component';
import { PermissionsGuard } from 'src/app/core/guards/permissions.guard';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';

import { BienCustodioModule } from './bien-custodio/bien-custodio.module';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { FirmaElectronicaComponent } from './firma-electronica/firma-electronica.component';

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
      {
        path: 'bienes-custodio',
        canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./bien-custodio/bien-custodio.module').then(
          (m) => m.BienCustodioModule
        ),
      },
      {
        path: 'prestamos',
        canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./prestamos/prestamos.module').then(
          (m) => m.PrestamosModule
        ),
      },
      {
        path: 'firma-electronica',
        //canActivate: [PermissionsGuard],
        loadChildren: () =>
          import('./firma-electronica/firma-electronica.module').then(
          (m) => m.FirmaElectronicaModule
        ),
      }
    ],
  },
];

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminModule { }
