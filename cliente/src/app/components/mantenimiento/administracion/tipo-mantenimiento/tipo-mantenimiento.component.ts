import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { dataMantenimiento, pagTipoMantenimiento } from 'src/app/core/models/mantenimiento/tipoMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-mantenimiento',
  templateUrl: './tipo-mantenimiento.component.html',
  styleUrls: ['./tipo-mantenimiento.component.css']
})
export class TipoMantenimientoComponent implements OnInit {

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
    // public srvMantenimiento: TipoMantenimientoService,
    public srvMenu: MenuService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvMantenimiento: CaracteristicasMantenimientoService
    ) { }

  ngOnInit(): void {
    this.pasarPagina(1)
    // console.log('entrando a tipo')
    // this.obtenerTipoMantenimiento()
  }

  obtenerTipoMantenimiento() {
    Swal.fire({
      title: 'Cargando Tipos de Mantenimiento...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvMantenimiento.getTipoMantenimiento(this.mapFiltersToRequest).
    pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagTipoMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvMantenimiento.datosTipoMantenimiento = data.body
          this.metadata = data.total
          // console.log('la metadata ->>>>>', this.metadata)

        }
        
        // console.log('lo que llega', data)
        Swal.close();

        this.dataPagina()
      },
      error: (error) => {console.log(error)}
    },
    )
  }

  modifyTipo(id: number, _title: string, _form: string){
    this.srvMantenimiento.idTipoMModify = id
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    // this.elementForm.special = false;
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()
  }

  deleteTipo(id: number){
    Swal.fire({
      title: '¿Está seguro que desea modificar este Tipo de Mantenimiento?',
      showDenyButton: true,
      text: 'Al deshabilitar un Tipo de Mantenimiento, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Tipo de Mantenimiento...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvMantenimiento
          .deleteTipoMantenimiento(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res:any) => {
              if (res.status) {
                Swal.fire({
                  title: 'Tipo de Mantenimiento modificado corectamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  title: 'No se modifico el Tipo de Mantenimiento',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              this.obtenerTipoMantenimiento();
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
    this.elementPagina.dataLength = this.srvMantenimiento.datosTipoMantenimiento ? this.srvMantenimiento.datosTipoMantenimiento.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerTipoMantenimiento();
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
