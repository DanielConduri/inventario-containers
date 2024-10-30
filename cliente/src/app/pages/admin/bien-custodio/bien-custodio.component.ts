import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
//import { BienesService } from 'src/app/core/services/Bienes-Services/bienes.service';
import { OtrosShowModelPag } from 'src/app/core/models/Bienes/Inventario/otros';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';


import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Component({
  providers: [DatePipe],
  selector: 'app-bien-custodio',
  templateUrl: './bien-custodio.component.html',
  styleUrls: ['./bien-custodio.component.css']
})
export class BienCustodioComponent implements OnInit {
  @ViewChild('miElemento') miElementoRef!: ElementRef;
  
  elementForm: {
    form: string,
    title: string,
    special: boolean
  } = {
      form: '',
      title: '',
      special: true
    }

  isData: boolean = false;
  isLoading: boolean = true;

  elementPagina: {
    dataLength: number,
    metaData: number,
    currentPage: number
  } = {
      dataLength: 0,
      metaData: 0,
      currentPage: 0
    }

  //Variables para Paginacion
  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};

  //Variables para el filtro
  options: string[] = ['nombre', 'modelo', 'serie', 'estado_logico', 'codigo_bien', 'bien_garantia'/*, 'ubicacion','bodega','condicion_bien','marca'*/];
  searchResult: any = null;
  data: string = '';
  datan = 0;
  parameter: string = '';

  private destroy$ = new Subject<any>();


  constructor(
    public fb_Otros: FormBuilder,
    public srvCentros: CentrosService,
    public srvCaracteristicas: CaracteristcasService,
    public srvModal: ModalService,
    public srvInventario: InventarioService,
    public srvPaginacion: PaginacionService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      Swal.close();
    }, 2500);
    //this.pasarPagina(1)
  }




}
