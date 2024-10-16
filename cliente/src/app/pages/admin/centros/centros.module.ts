import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentrosRoutingModule } from './centros-routing.module';
import { CentrosModule1 } from 'src/app/components/centros/centros.module';
import { CentrosComponent } from './centros.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    CentrosComponent,
  ],
  imports: [
    CommonModule,
    CentrosRoutingModule,
    CentrosModule1,
    ComponentsModule,
  ],
  exports:[
    CentrosComponent
  ]
})
export class CentrosModule { }
