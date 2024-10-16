import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside/aside.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { BodyComponent } from './body/body.component';
import { AjustesModule } from '../pages/configuracion/ajustes/ajustes.module';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        AsideComponent,
        FooterComponent,
        HeaderComponent,
        MainComponent,
        BodyComponent,

    ],
    exports: [
        AsideComponent,
        FooterComponent,
        HeaderComponent,
        MainComponent,
        BodyComponent
    ],
    imports: [
        CommonModule,
        AjustesModule,
        ComponentsModule,
        // CentrosModule,
        // WelcomeModule,
        RouterModule.forChild([])
    ]
})
export class SharedModule { }
