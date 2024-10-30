import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pagEstadoMantenimiento } from 'src/app/core/models/mantenimiento/estadoMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estado-mantenimiento',
  templateUrl: './estado-mantenimiento.component.html',
  styleUrls: ['./estado-mantenimiento.component.css']
})
export class EstadoMantenimientoComponent implements OnInit {

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
    public srvEstadoM: CaracteristicasMantenimientoService
  ) { }

  ngOnInit(): void {
    this.pasarPagina(1)
  }

  obtenerEstadoMantenimiento(){
    Swal.fire({
      title: 'Cargando Estados...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvEstadoM.getEstadoMantenimiento(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagEstadoMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvEstadoM.datosEstadoMantenimiento = data.body
          this.metadata = data.total
        }
        // console.log('lo que llega', data)
        Swal.close();
        this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  modifyEstado(id: number, _title: string, _form: string){
    this.srvEstadoM.idEstadoMModify = id
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    // this.elementForm.special = true;
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal();
  }

  deleteEstado(id: number){
    // console.log('el id es ->', id)
    Swal.fire({
      title: '¿Está seguro que desea modificar este Estado de Mantenimiento?',
      showDenyButton: true,
      text: 'Al deshabilitar un Estado de Mantenimiento, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Estado de Mantenimiento...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvEstadoM.deleteEstadoMantenimiento(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res:any) => {
              if (res.status) {
                Swal.fire({
                  title: 'Estado de Mantenimiento modificado corectamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  title: 'No se modifico el Estado de Mantenimiento',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              this.obtenerEstadoMantenimiento();
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
    this.elementPagina.dataLength = this.srvEstadoM.datosEstadoMantenimiento ? this.srvEstadoM.datosEstadoMantenimiento.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerEstadoMantenimiento();
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
