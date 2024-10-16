import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailedComponent } from './failed.component';

const routes: Routes = [
  { path: '', component: FailedComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FailedRoutingModule { }
