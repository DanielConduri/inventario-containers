import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostrarBienesComponent } from './mostrar-bienes/mostrar-bienes.component';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';


@NgModule({
  declarations: [MostrarBienesComponent],
  imports: [
    CommonModule,
    PaginationModule
  ],
  exports: [
    MostrarBienesComponent
  
  ]
})
export class BienesCustodioModule { }
