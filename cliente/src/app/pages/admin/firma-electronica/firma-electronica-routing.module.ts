import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirmaElectronicaComponent } from './firma-electronica.component';

const routes: Routes = [{
  path: '', component: FirmaElectronicaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirmaElectronicaRoutingModule { }
