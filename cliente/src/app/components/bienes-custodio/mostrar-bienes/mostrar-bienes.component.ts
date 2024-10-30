import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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
  selector: 'app-mostrar-bienes',
  templateUrl: './mostrar-bienes.component.html',
  styleUrls: ['./mostrar-bienes.component.css']
})
export class MostrarBienesComponent implements OnInit {

  @ViewChild('miElemento') miElementoRef!: ElementRef;

  elementForm:{
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
  cedulaLogin: any = {};

  //Variables para el filtro
  options: string[] = ['nombre', 'modelo', 'serie', 'estado_logico','codigo_bien','bien_garantia'/*, 'ubicacion','bodega','condicion_bien','marca'*/];
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
    // const token = localStorage.getItem('token');
    // console.log('token logeado',token);
    setTimeout(() => {
      this.isLoading = false;
      Swal.close();
    }, 2500);
    this.pasarPagina(1)
  }


 
  getBienesOtros(){
    this.cedulaLogin = sessionStorage.getItem('UserCedula');
    // console.log('cedulaToken', this.cedulaLogin);

    Swal.fire({
      title: 'Cargando Bienes...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    //console.log('mapFiltersToRequest mostrar bien ->', this.mapFiltersToRequest)
    this.srvInventario.getBienesPorCustodio(this.mapFiltersToRequest, this.cedulaLogin)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataOtros: OtrosShowModelPag) => {
        // console.log("Obteniendo Bienes Otros de la base de Datos", dataOtros);
        this.isData = false;
        if(dataOtros.body.length > 0){

          this.isData = true;
          //console.log("Obteniendo Bienes Otros de la base de Datos", dataOtros);
          this.srvInventario.datosOtros = dataOtros.body;
          this.metadata = dataOtros.total;
          // console.log('metadatos ->', this.metadata);
          Swal.close();
        }

      },
      error: (err) => {
        console.log("Error al obtener los Bienes Otros", err);
      },
      complete: () => {

        this.dataPagina()
      }
    })
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvInventario.datosOtros ? this.srvInventario.datosOtros.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  returnView(){
    this.srvInventario.setData_Bool$(true);
  }

  mostrarInfoById(idBien: number, _tittle:string, _form:string){
    // console.log("ID del Bien a mostrar", idBien)
    this.elementForm.form = _form;
    this.elementForm.title = _tittle;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Bien(idBien);
    this.srvModal.openModal();
  }


  ModifyBienById(idBien: number, _tittle:string, _form:string){
    // console.log("Funcion para editar el bien por ID")
    this.elementForm.form = _form;
    this.elementForm.title = _tittle;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Bien(idBien);
    this.srvModal.openModal();
  };

  HistoryBien(idBien:number, _tittle:string, _form:string){
    // console.log("Metodo para mostrar el Historial del bien");
    this.elementForm.form = _form;
    this.elementForm.title = _tittle;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Bien(idBien);
    this.srvModal.openModal();
  }



  deleteBienById(){

  };


  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      // console.log('handleSearch else -> como lega el parametro', this.searchResult.parameter);
      //'nombre', 'modelo', 'marca', 'serie', 'estado'
      if(this.searchResult.parameter === 'estado_logico' || this.searchResult.parameter === 'nombre' || this.searchResult.parameter === 'modelo' || this.searchResult.parameter === 'serie' ){
      this.parameter = 'str_bien_' + this.searchResult.parameter;
      }
      //'ubicacion','bodega','condicion_bien','marca'
      else if ( this.searchResult.parameter === 'ubicacion' || this.searchResult.parameter === 'bodega' || this.searchResult.parameter === 'condicion_bien' || this.searchResult.parameter === 'marca' ){
        this.parameter = 'int_' + this.searchResult.parameter + '_id';
        this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: parseInt(this.searchResult.data) };

      }else{
        this.parameter = 'str_' + this.searchResult.parameter;
      }
      // console.log('handleSearch else -> como queda el parametro ->', this.parameter);
      this.data = this.searchResult.data;
     this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
     this.getBienesOtros();
    }
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page: page, parameter: this.parameter, data: this.data };
    this.getBienesOtros();
  }


  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


}
