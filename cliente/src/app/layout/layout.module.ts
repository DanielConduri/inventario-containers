import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { SimpleLayoutComponent } from './simple-layout/simple-layout.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FullLayoutComponent,
    SimpleLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([])  
  ],
  exports:[FullLayoutComponent,
  SimpleLayoutComponent]
})
export class LayoutModule { }
