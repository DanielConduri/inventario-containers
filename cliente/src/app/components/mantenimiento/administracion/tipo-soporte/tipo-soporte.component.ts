import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pagSoporte } from 'src/app/core/models/mantenimiento/soporte';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-soporte',
  templateUrl: './tipo-soporte.component.html',
  styleUrls: ['./tipo-soporte.component.css']
})
export class TipoSoporteComponent implements OnInit {

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
    // public srvSoporte: SoporteService,
    public srvMenu: MenuService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvSoporte: CaracteristicasMantenimientoService
  ) { }

  ngOnInit(): void {
    this.pasarPagina(1)
  }

  obtenerSoporte(){
    Swal.fire({
      title: 'Cargando Soportes...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvSoporte.getSoporte(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagSoporte) => {
        console.log('lo que llega ->', data)
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvSoporte.datosSoporte = data.body
          this.metadata = data.total
          // console.log('la metadata ->>>>>', this.metadata)
        }
        // console.log('lo que llega', data)
        Swal.close();
        this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  modifySoporte(id: number, _title: string, _form: string){
    this.srvSoporte.idTipoSModify = id
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    // this.elementForm.special = true;
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal();
    // this.srvSoporte.idSoporte = id;
  
  }

  deleteSoporte(id: number){
    Swal.fire({
      title: '¿Está seguro que desea modificar este Soporte?',
      showDenyButton: true,
      text: 'Al deshabilitar un Soporte, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando soporte...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvSoporte
          .deleteSoporte(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res:any) => {
              if (res.status) {
                Swal.fire({
                  title: 'Soporte modificado corectamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  title: 'No se modifico el soporte',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              this.obtenerSoporte();
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
    this.elementPagina.dataLength = this.srvSoporte.datosSoporte ? this.srvSoporte.datosSoporte.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerSoporte();
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
