import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoutRoutingModule } from './logout-routing.module';
import { LogoutComponent } from './logout.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    LogoutRoutingModule,
    SharedModule
  ],
  exports:[
    LogoutComponent
  ]
})
export class LogoutModule { }
