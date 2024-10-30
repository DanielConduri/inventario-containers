import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaRoutingModule } from './firma-electronica-routing.module';
import { FirmaElectronicaComponent } from './firma-electronica.component';



@NgModule({
  declarations: [FirmaElectronicaComponent],
  imports: [
    CommonModule,
    FirmaElectronicaRoutingModule
  ], 
  exports: [
    FirmaElectronicaComponent
  ]
})
export class FirmaElectronicaModule { }
