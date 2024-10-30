import { NgModule } from "@angular/core";
import { AddHorarioComponent } from "./add-horario/add-horario.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    AddHorarioComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AddHorarioComponent
  ]
})
export class HorariosModule { }
