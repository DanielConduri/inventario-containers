import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustodioService } from 'src/app/core/services/Bienes-Services/custodio-service/custodio.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  providers: [DatePipe],
  selector: 'app-mostrar-custodios',
  templateUrl: './mostrar-custodios.component.html',
  styleUrls: ['./mostrar-custodios.component.css']
})
export class MostrarCustodiosComponent implements OnInit {

  elementForm:{
    form: string,
    title: string,
    special: boolean
  } = {
    form: '',
    title: '',
    special: true
  }



  private destroy$ = new Subject<any>();

  isData: boolean = false;
  isLoading: boolean = true;


  //variables para el filtro
  data: string = '';
  parameter: string = '';
  options: string[] = ['cedula', 'estado', 'nombre','activo'];
  searchResult: any = null;

  //variables para paginación
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

  constructor(
    public srvCustodios: CustodioService,
    public srvPaginacion: PaginacionService,
    public srvMenu: MenuService,
    public srvModal: ModalService,
  ) { }


  ngOnInit(): void {
    // setTimeout(() => {
    //   this.isLoading = false;
    //   Swal.close();
    // }, 2000);
    this.pasarPagina(1);
  }

  getCustodios(){
    Swal.fire({
      title: 'Cargando Custodios',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true;
        this.isData = true;
      }
    });

    this.srvCustodios.getCustodios(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        if(data.body){
          this.isData = true;
          // console.log("Obteniendo Custodios de la base de Datos", data.body);
          this.srvCustodios.datosCustodios = data.body;
          this.metadata = data.total;
        } else{
          this.isLoading = false;
        this.isData = false;
        }
        Swal.close();
        this.dataPagina();
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los Custodios',
          text: 'No se pudo obtener los Custodios'
        });
      },
      complete: () => {
        // console.log("Custodios completados");
        Swal.close();
      }
    });
  }

  dataPagina(){
    this.elementPagina.dataLength = this.srvCustodios.datosCustodios ? this.srvCustodios.datosCustodios.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page:page, parameter: this.parameter, data: this.data };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.getCustodios();
  }

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      this.parameter = 'str_custodio_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.getCustodios();
    }
  }

    //funcion para permisos de editar
    permisoEditar(path: string){
      return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_editar ?? false;
    }
  
    //funcion para permisos de eliminar
    permisoEliminar(path: string){
      return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_eliminar ?? false;
    }

    mostrarInfoById(strCedula: string, _tittle:string, _form:string){
      // console.log("Cedula del custodio a consultar", strCedula)
      this.elementForm.form = _form;
      this.elementForm.title = _tittle;
      this.srvModal.setForm(this.elementForm);
      this.srvModal.setSelectCedula_Custodio(strCedula);
      //this.srvModal.setSelectID_Bien(5);
      this.srvModal.openModal();
    }
  

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
