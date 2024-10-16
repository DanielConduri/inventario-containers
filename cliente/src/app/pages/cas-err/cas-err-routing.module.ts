import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasErrComponent } from './cas-err.component';

const routes: Routes = [
  {path: '', component: CasErrComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasErrRoutingModule { }
