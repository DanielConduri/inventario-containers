import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CatalogoShowModel1 } from 'src/app/core/models/Bienes/Caracteristicas/catalogo';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  providers: [DatePipe],
  selector: 'app-mostrar-catalogo',
  templateUrl: './mostrar-catalogo.component.html',
  styleUrls: ['./mostrar-catalogo.component.css']
})
export class MostrarCatalogoComponent implements OnInit {

  //opciones para el filtro
  options: string[] = ['id_bien', 'estado', 'descripcion'];

  // Declaramos el elemtForm para el modal
  elementForm:{
    form: string,
    title: string,
    special: boolean
  } = {
    form: '',
    title: '',
    special: true
  }

  // Declaramos las variables para mostrar pantalla de no contenido cargado
  isData: boolean = false;
  isLoading: boolean = true;

  //Variables para Paginacion
  elementPagina: {
    dataLength: number,
    metaData: number,
    currentPage: number
  } = {
      dataLength: 0,
      metaData: 0,
      currentPage: 0
    }

  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};
  searchResult: any = null;
  data: string = '';
  parameter: string = '';

  idReporte: any = []

  // delcaramos el destroy para desuscribirnos de los observables
  private destroy$ = new Subject<any>();


  constructor(
    // llamamos a los servicios correspondientes
    public srvCaracteristicas: CaracteristcasService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvMenu: MenuService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      Swal.close();
    }, 1500);
    // llamamos a la funcion para obtener los datos del catalogo
    this.pasarPagina(1)
    this.getCatalogo();
  }

  // Funcion para obtener los datos del catalogo
  getCatalogo(){
    Swal.fire({
      title: 'Cargando Catalogo...',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    // llamamos al servicio para obtener los datos del catalogo
    this.srvCaracteristicas.getCatalogo(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: CatalogoShowModel1) => {
        if(data.body){
          this.isData = true;
          // console.log("Obteniendo Catalogo de la base de Datos", data.body);
          this.srvCaracteristicas.datosCatalogo = data.body;
          this.metadata = data.total;
          if(this.srvModal.report){
            // console.log('los id ->', this.srvCaracteristicas.datosCatalogo)
            for(let i = 0; i< this.srvCaracteristicas.datosCatalogo.length ; i++){
              this.idReporte.push(this.srvCaracteristicas.datosCatalogo[i].int_catalogo_bien_id)
            }
          }
          // console.log('los id ->', this.idReporte)
        }else{
          this.isData = false;
          // console.log("No se pudo obtener el Catalogo de la base de Datos");
        }
      },
      error: (err: any) => {
        console.log("Error al obtener el Catalogo de la base de Datos", err);
      },
      complete: () => {
        // console.log("Peticion completa")
        Swal.close();
        this.dataPagina()
      }
    });
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvCaracteristicas.datosCatalogo ? this.srvCaracteristicas.datosCatalogo.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: this.parameter, data: this.data };
    this.getCatalogo();
  }

  //Funcion para obtener el ID de un catalogo
  ModifyCatalogoId(idCatalogo: number, _tittle: string, _form: string){
    this.elementForm.title = _tittle;
    this.elementForm.form = _form;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Catalogo(idCatalogo);
    this.srvModal.openModal();
  }

  // Funcion para eliminar un elemento del catalogo
  deleteCatalogo(idCatalogo: number){
    Swal.fire({
      title: '¿Estas seguro de cambiar el estado este Catalogo?',
      text: "Al deshabilitar un Catalogo, este no podra ser seleccionada a la hora de agregar un Bien. Este cambio puede ser revertido en cualquier momento",
      showDenyButton: true,
      confirmButtonText: `Desactivar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if(result.isConfirmed){
        this.srvCaracteristicas.deleteCatalogo(idCatalogo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            // console.log("Catalogo deshabilitado", data);
            if(data.status){
              Swal.fire({
                title: 'Catalogo Deshabilitado',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
            }else{
              Swal.fire({
                title: 'Catalogo No Deshabilitado',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
              });
            }
            setTimeout(() => {
              this.getCatalogo();
            }, 1500);
          },
          error: (err: any) => {
            console.log("Error al deshabilitar el Catalogo", err);
          },
          complete: () => {
            // console.log("Peticion completa");
          }
        });
      }
    });
  }

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.srvModal.report = false
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      this.srvModal.report = true
      this.parameter = 'str_catalogo_bien_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      // console.log('lo que llega del filtro ->', this.searchResult.data)
      this.getCatalogo();
    }
  }

    //funcion para permisos de ver
    permisoEditar(path: string){
      return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_editar ?? false;
    }
  
    //funcion para permisos de crear
    permisoEliminar(path: string){
      return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_eliminar ?? false;
    }

  //Funcion ngDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
