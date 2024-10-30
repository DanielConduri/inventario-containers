import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';


@Component({
  providers: [DatePipe],
  selector: 'app-historial-archivos',
  templateUrl: './historial-archivos.component.html',
  styleUrls: ['./historial-archivos.component.css']
})
export class HistorialArchivosComponent implements OnInit {
  elementForm:{
    form: string,
    title: string,
    special: boolean
  } = {
    form: '',
    title: '',
    special: true
  }
  
  isLoading: boolean = false
  isData: boolean = false;

   //Variables para Paginacion
   currentPage = 1;
   metadata: number = 0;
   mapFiltersToRequest: any = {};

   elementPagina: {
    dataLength: number,
    metaData: number,
    currentPage: number
  } = {
      dataLength: 0,
      metaData: 0,
      currentPage: 0
    }

   //Variables para el filtro
   searchResult: any = null;
   options: string[] = ['nombre', 'resolucion', 'estado_carga'];
   data: string = '';
   parameter: string = '';



  private destroy$ = new Subject<any>();

  constructor(
    public srvInventario: InventarioService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    ) { }

  ngOnInit(): void {
    //this.getArchivos()
    setTimeout(() => {
      this.isLoading = false;
      Swal.close();
    }, 2500);
    this.pasarPagina(1)
  }

  getArchivos(){
    Swal.fire({
      title: 'Cargando Historial...',
      didOpen: () => {
        Swal.showLoading()
       
      },
    });
    this.srvInventario.getArchivos(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.isData = true
        //console.log('lo que llega', data)
        if(data.body){
          this.srvInventario.archivos = data.body;
          this.isLoading = true
          this.isData = true
          this.metadata = data.total;
          Swal.close();
        } else {
          this.isLoading = false
          this.isData = false
        }
        //console.log('Archivos ->', this.srvInventario.archivos)
        this.dataPagina();
      },
      error: (error) => {
        console.log('Error ->', error)
      },
      complete: () => {
        Swal.close();
      }
    })
  }
  

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      this.parameter = 'str_registro_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      //console.log('la data a enviar es', this.data)
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.getArchivos();
    }
  }
  dataPagina(){
    this.elementPagina.dataLength = this.srvInventario.archivos ? this.srvInventario.archivos.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page: page, parameter: this.parameter, data: this.data };
    this.getArchivos();
  }


  mostrarInfoById(idArchivo: number, _tittle:string, _form:string){
    //console.log("ID del Archivo a mostrar", idArchivo)
    this.elementForm.form = _form;
    this.elementForm.title = _tittle;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Archivo(idArchivo);

    this.srvModal.openModal();
  }


  calcularTiempo(time1: string, time2: string): string {
    // console.log(time1)
    // console.log(time2)
    const hora1 = time1.substring(11,13)
    const hora2 = time2.substring(11,13)

    const minutos1 = time1.substring(14,16)
    const minutos2 = time2.substring(14,16)

    // console.log('hora1', hora1)
    // console.log('hora2', hora2)

    // console.log('minutos1', minutos1)
    // console.log('minutos2', minutos2)

    const resultadoHoras = parseInt(hora1) - parseInt(hora2)
    const resultadoMinutos =  parseInt(minutos1) - parseInt(minutos2)

    // console.log(resultadoHoras)
    // console.log(resultadoMinutos)

    // if(resultadoHoras === 0)
    //   return `${resultadoMinutos} minutos`;
    // else
    // return `${resultadoHoras} h ${resultadoMinutos} minutos`;
    return '0';
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
