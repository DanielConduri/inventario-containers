import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { FilterComponent } from './filter/filter.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PaginationComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    PaginationComponent,
    FilterComponent
  ]
})
export class PaginationModule { }
