import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { pagMarcas } from 'src/app/core/models/Bienes/Caracteristicas/marcas';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  providers: [DatePipe],
  selector: 'app-mostrar-marca',
  templateUrl: './mostrar-marca.component.html',
  styleUrls: ['./mostrar-marca.component.css']
})
export class MostrarMarcaComponent implements OnInit {

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

  //variables para paginacion
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

  //Variables para el filtro
  options: string[] = ['nombre', 'estado'];
  searchResult: any = null;
  data: string = '';
  parameter: string = '';


  private destroy$ = new Subject<any>();

  constructor(
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
    // this.getMarcas();
    this.pasarPagina(1);
  }

  // Funcion para obtener las marcas
  getMarcas() {
    Swal.fire({
      title: 'Cargando Marcas...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.srvCaracteristicas.getMarcasP(this.mapFiltersToRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: pagMarcas) => {
          if (data.status) {
            this.metadata = data.total;
            if(data.total == 0){
            this.isData = false;
            }else{
            this.isLoading = true
            this.isData = true;
            // console.log("Obteniendo Marcas de la base de Datos", data.body);
            this.srvCaracteristicas.datosMarcas = data.body;
            }
          }else{
            this.isData = false;
          }
          this.dataPagina();
        },
        error: (err) => {
          console.log("Error al obtener las marcas", err);
        },
        complete: () => {
          Swal.close();
        }
      });
  }



  // Funcion para obtener el ID de una marca
  ModifyMarcaById(idMarca: number, _title: string, _form: string) {
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Marca(idMarca);
    this.srvModal.openModal();
  }

  // Funcion para eliminar Logicamente una marca
  deleteMarcaById(idMarca: number) {
    Swal.fire({
      title: '¿Estas seguro de desactivar esta marca?',
      text: 'Al deshabilitar una Marca, este no podra ser seleccionada a la hora de agregar un Bien. Este cambio puede ser revertido en cualquier momento',
      showDenyButton: true,
      confirmButtonText: `Si, cambiar estado`,
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCaracteristicas.deleteMarcaById(idMarca)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              // console.log("Marca desactivada", data);
              if (data.status) {
                Swal.fire({
                  title: data.message,
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500,
                });
              } else {
                Swal.fire({
                  title: 'Error al desactivar la marca',
                  icon: 'warning',
                  showDenyButton: false,
                  confirmButtonText: `Aceptar`,
                });
              }
              setTimeout(() => {
                this.getMarcas();
              }, 2000);
            },
            error: (err) => {
              console.log("Error al desactivar la marca", err);
            },
            complete: () => {
              // console.log("Marca desactivada");
            }
          })
      }
    })
  }


  //funciones de informacion para la paginacion
  dataPagina() {
    this.elementPagina.dataLength = this.srvCaracteristicas.datosMarcas ? this.srvCaracteristicas.datosMarcas.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page:page, parameter: this.parameter, data: this.data };
    // console.log('mapFiltersToRequest en pasasr pag en roles', this.mapFiltersToRequest);
    this.getMarcas();
  }

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      // console.log('handleSearch else');
      this.parameter = 'str_marca_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.getMarcas();
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


  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}



