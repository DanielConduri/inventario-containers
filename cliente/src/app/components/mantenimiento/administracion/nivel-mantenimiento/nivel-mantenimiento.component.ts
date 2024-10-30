import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nivel-mantenimiento',
  templateUrl: './nivel-mantenimiento.component.html',
  styleUrls: ['./nivel-mantenimiento.component.css']
})
export class NivelMantenimientoComponent implements OnInit {

  private destroy$ = new Subject<any>()

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

  constructor(
    public srvMenu: MenuService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvNivelM: CaracteristicasMantenimientoService
  ) { }

  ngOnInit(): void {
    this.pasarPagina(1)
  }

  obtenerNivelMantenimiento() {
    Swal.fire({
      title: 'Cargando Niveles...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvNivelM.getNivelMantenimiento(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagNivelMantenimiento) => {
        // console.log('lo que llega ->', data)
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvNivelM.datosNivelMantenimiento = data.body
          this.metadata = data.total
        }
        // console.log('lo que llega en el nivel ->', data)
        Swal.close();
        this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  modifyNivel(id: number, _title: string, _form: string){
    this.srvNivelM.idNivelMModify = id
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    // this.elementForm.special = true;
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal();
  }

  deleteNivel(id: number){
    Swal.fire({
      title: '¿Está seguro que desea modificar este Nivel?',
      showDenyButton: true,
      text: 'Al deshabilitar un Nivel, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Nivel...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvNivelM.deleteNivelMantenimiento(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res:any) => {
              if (res.status) {
                Swal.fire({
                  title: 'Nivel modificado corectamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  title: 'No se modifico el Nivel',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              this.obtenerNivelMantenimiento();
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

  dataPagina() {
    this.elementPagina.dataLength = this.srvNivelM.datosNivelMantenimiento ? this.srvNivelM.datosNivelMantenimiento.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerNivelMantenimiento();
  }

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
