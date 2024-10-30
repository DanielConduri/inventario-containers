import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pagRegistroMantenimiento } from 'src/app/core/models/mantenimiento/registro';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-mantenimiento',
  templateUrl: './registro-mantenimiento.component.html',
  styleUrls: ['./registro-mantenimiento.component.css']
})
export class RegistroMantenimientoComponent implements OnInit {

//   private destroy$ = new Subject<any>()

//   isLoading: boolean = false
//   isData: boolean = false;


//   elementForm: {
//     //Establecemos los elementos "formulario" y "title" a los que les
//     //designaremos sus respectivos tipos
//     form: string;
//     title: string;
//     special: boolean;
//   } = {
//     //inicializamos los elementos en vacio
//     form: '',
//     title: '',
//     special: true,
//   };

// //elementos de paginacion

//   elementPagina: {
//     dataLength: number,
//     metaData: number,
//     currentPage: number
//   } = {
//       dataLength: 0,
//       metaData: 0,
//       currentPage: 0
//     }

//   currentPage = 1;
//   metadata: any;
//   mapFiltersToRequest: any = {};

//   constructor(
//     public srvMenu: MenuService,
//     public srvModal: ModalService,
//     public srvPaginacion: PaginacionService,
//     public srvRegistro: CaracteristicasMantenimientoService
//   ) { }

//   ngOnInit(): void {
//     this.pasarPagina(1)
//   }

//   obtenerRegistro(){
//     Swal.fire({
//       title: 'Cargando Registros...',
//       didOpen: () => {
//         Swal.showLoading();
//         this.isLoading = true;
//         this.isData = true;
//       },
//     });
//     this.srvRegistro.getRegistro(this.mapFiltersToRequest)
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: (data: pagRegistroMantenimiento) => {
//         if(data.body.length > 0){
//           this.isData = true;
//           this.isLoading = true;
//           this.srvRegistro.datosRegistro = data.body
//           this.metadata = data.total
//         }
//         console.log('lo que llega', data)
//         Swal.close();
//         this.dataPagina()
//       },
//       error: (error) => {
//         console.log('Error', error)
//       }
//     })
//   }

//   modifyRegistro(id: number, _title: string, _form: string){}

//   deleteRegistro(id: number){}

//   dataPagina() {
//     this.elementPagina.dataLength = this.srvRegistro.datosRegistro ? this.srvRegistro.datosRegistro.length : 0;
//     this.elementPagina.metaData = this.metadata;
//     this.elementPagina.currentPage = this.mapFiltersToRequest.page
//     this.srvPaginacion.setPagination(this.elementPagina)
//   }

//   pasarPagina(page: number) {
//     this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
//     console.log('mapFiltersToRequest', this.mapFiltersToRequest);
//     this.obtenerRegistro();
//   }

//   permisoEditar(path: string){
//     return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_editar ?? false;
//   }

//   //funcion para permisos de eliminar
//   permisoEliminar(path: string){
//     return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_eliminar ?? false;
//   }

menuTabSelected: number = 0;
  typeView: boolean = false;
  isValue: number = 3;
  condiciones: number = 0;

  listaViews: any = {
    CORRECTIVO: 0,
    PREVENTIVO: 1,
    // NIVEL: 2,
    // ESTADO: 3,
    // REGISTRO: 4,
    // PLANIFICACION: 5
    // MARCAS: 2
  }

  menuTabSelect:{
    id: number,
    status: boolean,
  } = {
    id: 0,
    status: false
  }

  buttonName!: number;
  private destroy$ = new Subject<any>();

  constructor( public srvMantenimiento: MantenimientoService) { }

  ngOnInit(): void {
    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabSelect.id = this.listaViews[path.toUpperCase()] || 0;
    this.isValue = 5;

    // Llamado al behaviorSubject
    this.srvMantenimiento.SelectButtonName$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.buttonName = data.id;
          // console.log('lo mque llega ->>>>', this.buttonName)
        }
      });
  }

  mostrarSoporte() {
    this.menuTabSelect.id= 6
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 9
  }

  mostrarTipo() { 
    this.menuTabSelect.id = 7
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 10;
  }

  mostrarNivel() {
    this.menuTabSelect.id = 8
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 11;
  }

  mostrarEstado() {
    this.menuTabSelect.id = 9
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 12;
  }

  mostrarRegistro() {
    this.menuTabSelect.id = 10
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 13;
  }

  mostrarPlanificacion() {
    this.menuTabSelect.id = 11
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 14;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
