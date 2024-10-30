import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienCustodioComponent } from './bien-custodio.component';


const routes: Routes = [
  {path: '', component: BienCustodioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BienCustodioRoutingModule { }
