import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailedComponent } from './failed.component';
import { FailedRoutingModule } from './failed-routing.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [FailedComponent],
  imports: [
    CommonModule,
    FailedRoutingModule,
    SharedModule
  ],
  exports:[
    FailedComponent
  ]
})
export class FailedModule { }
