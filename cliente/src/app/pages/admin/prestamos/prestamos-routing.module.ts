import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrestamosComponent } from './prestamos.component';

const routes: Routes = [{ path:'', component: PrestamosComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestamosRoutingModule { }
