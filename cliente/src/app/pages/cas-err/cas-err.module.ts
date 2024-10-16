import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasErrRoutingModule } from './cas-err-routing.module';
import { CasErrComponent } from './cas-err.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CasErrComponent
  ],
  imports: [
    CommonModule,
    CasErrRoutingModule,
    SharedModule
  ],
  exports:[
    CasErrComponent
  ]
})
export class CasErrModule { }
