import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeniedRoutingModule } from './denied-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DeniedComponent } from './denied.component';


@NgModule({
  declarations: [
    DeniedComponent
  ],
  exports: [
    DeniedComponent
  ],
  imports: [
    CommonModule,
    DeniedRoutingModule,
    SharedModule,
  ]
})
export class DeniedModule { }
