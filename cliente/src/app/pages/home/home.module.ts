import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CasService } from 'src/app/core/services/cas.service';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent,
    // CasService
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
    // CasService

  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
