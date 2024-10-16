import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pagRegistroCorrectivo, pagRegistroMantenimiento } from 'src/app/core/models/mantenimiento/registro';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-registro-c',
  templateUrl: './mostrar-registro-c.component.html',
  styleUrls: ['./mostrar-registro-c.component.css']
})
export class MostrarRegistroCComponent implements OnInit {

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
    // public srvRegistro: CaracteristicasMantenimientoService,
    public srvRegistroC: RegistroMantenimientoService
  ) { }

  ngOnInit(): void {
    this.pasarPagina(1)
    // this.srvRegistroC.obtenetRegitroCorrectivo({})
  }

  obtenerRegistro(){
    Swal.fire({
      title: 'Cargando Registros...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvRegistroC.getRegistroCorrectivo(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagRegistroCorrectivo) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvRegistroC.datosRegistroCorrectivo = data.body
          this.metadata = data.total
        }
        console.log('lo que llega', data)
        Swal.close();
        this.dataPagina()
      },
      error: (error) => {
        console.log('Error', error)
      }
    })
  }

  modifyRegistro(id: number, _title: string, _form: string){}

  deleteRegistro(id: number){}

  dataPagina() {
    this.elementPagina.dataLength = this.srvRegistroC.datosRegistroCorrectivo ? this.srvRegistroC.datosRegistroCorrectivo.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerRegistro();
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
