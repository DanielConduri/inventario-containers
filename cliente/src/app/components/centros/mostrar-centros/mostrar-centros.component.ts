import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { cargaLoading, pagCenter } from 'src/app/core/models/centros';
import { CentrosService } from 'src/app/core/services/centros.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-centros',
  templateUrl: './mostrar-centros.component.html',
  styleUrls: ['./mostrar-centros.component.css'],
})
export class MostrarCentrosComponent implements OnInit, OnDestroy {
  isLoading: boolean = false
  isData: boolean = false;

  elementForm: {
    //Establecemos los elementos "formulario" y "title" a los que les
    //designaremos sus respectivos tipos
    form: string;
    title: string;
    special: boolean;
  } = {
    //inicializamos los elementos en vacio
    form: '',
    title: '',
    special: true,
  };

//elementos de paginacion

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
  private destroy$ = new Subject<any>() //Se crea para que no exista desbordamiento de datos


  //Variables para el filtro
  options: string[] = ['tipo_nombre','nombre_sede','estado'];
  searchResult: any = null;
  data: string = '';
  parameter: string = '';

  // constructor(public srvCentros: CentrosService,
  //   public srvModal: ModalService,
  //   public srvPaginacion: PaginacionService) { }

  constructor(
    public srvCentros: CentrosService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvMenu: MenuService,
  ) {}

  ngOnInit(): void {
    this.pasarPagina(1)
    // this.getCentros()
  }

  //funcion para obtener los centros 

  getCentros() {
    Swal.fire({
      title: 'Cargando Centros...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvCentros.getCenter(this.mapFiltersToRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (center: pagCenter) => {
          if (center.body.length > 0) {
            this.isData = true;
            this.isLoading = true;
            this.srvCentros.datosCentros = center.body
            //guardamos los datos que nos envian para poder manejar la paginacion 
            this.metadata = center.total;
          } else {
            this.srvCentros.SelectIsCarga$
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (load: cargaLoading) => {
                  this.isLoading = load.isLoading;
                  this.isData = load.isData;
                  // this.isLoading = false
                }
              })
          }
          Swal.close();
          this.dataPagina()

        }
        , error: (err) => {
          console.log('error ->', err);
        },
        complete: () => {
        }
      })
  }

//llenamos los demas valores que necesitamos para la paginacion 

  dataPagina() {
    this.elementPagina.dataLength = this.srvCentros.datosCentros ? this.srvCentros.datosCentros.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    // this.srvPaginacion.setPagination(this.elementPagina)
  }

  //funcion para eliminar los centrros 

  deleteCenter(id: number) {
    Swal.fire({
      title: '¿Está seguro que desea modificar este Centro?',
      showDenyButton: true,
      text: 'Al deshabilitar un Centro, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Centro...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvCentros
          .deleteCenter(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              if (res.status) {
                Swal.fire({
                  title: 'Estado modificado corectamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  title: 'No se modifico el estado',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              this.getCentros();
              setTimeout(() => {
                Swal.close();
              }, 3000);
            },
            error: (error) => {
              console.log('err', error);
            },
            complete: () => {},
          });
      }
    });
  }

  //funcion parael pasar pagina 

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.getCentros();
  }


  

  //funcion para abrir el modal que da los detalles

  modifyCenter(id: number, _title: string, _form: string) {
    // this.getDetalles(id)
    this.srvCentros.idModify = id
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.openModal();
  }


  //funcion para llamar a los detalles y abrir el modal  los detalles del centro

  detalles(id: number) {
    Swal.fire({
      title: 'Cargando Centros...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.getDetalles(id)
    this.srvModal.openModal()
  }

  //funcion para mostrar los detalles de los centros 

  getDetalles(id: number){
    this.srvCentros.getDetalles(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.srvCentros.datosDetalles = data.body
        },
        error: (err) => {
          console.log('error ->', err);
        },
        complete: () => {
          Swal.close()
          console.log('se completa');
          this.elementForm.form = 'detallesCentro'
          this.elementForm.title = 'detalles'
          this.srvModal.setForm(this.elementForm);
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
      this.parameter = 'str_centro_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.getCentros();
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


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  
}
