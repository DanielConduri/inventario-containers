import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { Routes, RouterModule } from '@angular/router';
import { BienCustodioRoutingModule } from './bien-custodio-routing.module';
import { BienCustodioComponent } from './bien-custodio.component';
import { AjustesBienesModule } from 'src/app/components/ajustes-bienes/ajustes-bienes.module';
import { BienesCustodioModule } from 'src/app/components/bienes-custodio/bienes-custodio.module';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'bien-custodio',
        loadChildren: () =>
          import('./bien-custodio-routing.module').then(
            (m) => m.BienCustodioRoutingModule
            ),
      }
    ]

  }, 
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  declarations: [
    BienCustodioComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    BienCustodioRoutingModule,
    RouterModule.forChild(routes),
        AjustesBienesModule,
        BienesCustodioModule

  ],

  exports: [
    RouterModule
    
     
  ]
})
export class BienCustodioModule { }

