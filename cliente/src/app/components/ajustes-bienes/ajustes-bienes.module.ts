import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostrarCustodiosComponent } from './mostrar-custodios/mostrar-custodios.component';
import { MostrarInventarioComponent } from './mostrar-inventario/mostrar-inventario.component';
import { MostrarCaracteristicasComponent } from './mostrar-caracteristicas/mostrar-caracteristicas.component';
import { AgregarBienComponent} from './bienes-modals/agregar-bien/agregar-bien.component';
import { ModificarBienComponent } from './bienes-modals/modificar-bien/modificar-bien.component';
import { MostrarEstadosComponent } from './bienes-modals/mostrar-estados/mostrar-estados.component';
import { AgregarEstadosComponent } from './bienes-modals/agregar-estados/agregar-estados.component';
import { ModificarEstadosComponent } from './bienes-modals/modificar-estados/modificar-estados.component';
import { AgregarProveedorComponent } from './bienes-modals/agregar-proveedor/agregar-proveedor.component';
import { MostrarProveedorComponent } from './bienes-modals/mostrar-proveedor/mostrar-proveedor.component';
import { ModificarProveedorComponent } from './bienes-modals/modificar-proveedor/modificar-proveedor.component';
import { MostrarMarcaComponent } from './bienes-modals/mostrar-marca/mostrar-marca.component';
import { AgregarMarcaComponent } from './bienes-modals/agregar-marca/agregar-marca.component';
import { ModificarMarcaComponent } from './bienes-modals/modificar-marca/modificar-marca.component';
import { ImportarBienComponent } from './bienes-modals/importar-bien/importar-bien.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MostrarBienComponent } from './bienes-modals/mostrar-bien/mostrar-bien.component';
import { MostrarProcesoComponent } from './bienes-modals/mostrar-proceso/mostrar-proceso.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { MostrarCatalogoComponent } from './bienes-modals/mostrar-catalogo/mostrar-catalogo.component';
import { AgregarCatalogoComponent } from './bienes-modals/agregar-catalogo/agregar-catalogo.component';
import { ImportarCatalogoComponent } from './bienes-modals/importar-catalogo/importar-catalogo.component';
import { ModificarCatalogoComponent } from './bienes-modals/modificar-catalogo/modificar-catalogo.component';
import { MostrarInfoBienComponent } from './bienes-modals/mostrar-info-bien/mostrar-info-bien.component';
import { CustodioBienInfoComponent } from './bienes-modals/custodio-bien-info/custodio-bien-info.component';
import { ModificarBienInternoComponent } from './bienes-modals/modificar-bien-interno/modificar-bien-interno.component';
import { HistorialBienComponent } from './bienes-modals/historial-bien/historial-bien.component';
import { HistorialArchivosComponent } from './bienes-modals/historial-archivos/historial-archivos.component';

import {MatExpansionModule} from '@angular/material/expansion';
import { ComponentsModule } from '../components.module';
import { MostrarBienesCustodioComponent } from './bienes-modals/mostrar-bienes-custodio/mostrar-bienes-custodio.component';
import { DetalleCargaComponent } from './bienes-modals/detalle-carga/detalle-carga.component';


@NgModule({
  declarations: [
    MostrarCustodiosComponent,
    MostrarInventarioComponent,
    MostrarCaracteristicasComponent,


    MostrarBienComponent,
    ModificarBienComponent,
    AgregarBienComponent,
    ModificarEstadosComponent,
    MostrarEstadosComponent,
    AgregarEstadosComponent,
    ModificarEstadosComponent,
    MostrarProveedorComponent,
    AgregarProveedorComponent,
    ModificarProveedorComponent,
    MostrarMarcaComponent,
    AgregarMarcaComponent,
    ModificarMarcaComponent,
    ImportarBienComponent,
    MostrarProcesoComponent,
    MostrarCatalogoComponent,
    AgregarCatalogoComponent,
    ImportarCatalogoComponent,
    ModificarCatalogoComponent,
    MostrarInfoBienComponent,
    CustodioBienInfoComponent,
    ModificarBienInternoComponent,
    HistorialBienComponent,
    HistorialArchivosComponent,
    MostrarBienesCustodioComponent,
    DetalleCargaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    PaginationModule,
    ComponentsModule,

    MatSlideToggleModule,
    MatExpansionModule


  ],
  exports:[
    MostrarCustodiosComponent,
    MostrarInventarioComponent,
    MostrarCaracteristicasComponent,



    MostrarBienComponent,
    MostrarBienesCustodioComponent,
    ModificarBienComponent,
    AgregarBienComponent,
    ModificarEstadosComponent,
    MostrarEstadosComponent,
    AgregarEstadosComponent,
    ModificarEstadosComponent,
    MostrarProveedorComponent,
    AgregarProveedorComponent,
    ModificarProveedorComponent,
    MostrarMarcaComponent,
    AgregarMarcaComponent,
    ModificarMarcaComponent,
    ImportarBienComponent,
    MostrarProcesoComponent,
    AgregarCatalogoComponent,
    ImportarCatalogoComponent,
    ModificarCatalogoComponent,
    MostrarInfoBienComponent,
    CustodioBienInfoComponent,
    ModificarBienInternoComponent,
    HistorialBienComponent,
    HistorialArchivosComponent,
    DetalleCargaComponent,
  ]
})
export class AjustesBienesModule { }
