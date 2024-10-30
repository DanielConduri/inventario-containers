import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { DatePipe } from '@angular/common';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';

@Component({

  providers: [DatePipe],
  selector: 'app-mostrar-proveedor',
  templateUrl: './mostrar-proveedor.component.html',
  styleUrls: ['./mostrar-proveedor.component.css']
})
export class MostrarProveedorComponent implements OnInit {

  elementForm:{
    form: string,
    title: string,
    special: boolean
  } ={
    form: '',
    title: '',
    special: true
  }

isData: boolean = false;
isLoading: boolean = true;

//Variables para paginacion
  currentPage = 1;
  metadata: any;
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

//Variables para el filtro
options: string[] = ['nombre', 'estado','ruc'];
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
    //this.getProveedor();
    this.pasarPagina(1);
  }

  // Funcion para obtener los proveedores
  getProveedor(){
    Swal.fire({
      title: 'Cargando Proveedores...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.srvCaracteristicas.getProveedorP(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        if(data.body){
          this.metadata = data.total
          this.isData = true;
          // console.log("Obteniendo Respuesta del Servidor =>", data)
          // console.log("Obteniendo Proveedores de la base de Datos", data.body);
          this.srvCaracteristicas.datosProveedor = data.body;
        }else{
          // console.log("No se obtuvo respuesta del servidor =>", data)
        }
        this.dataPagina();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        Swal.close();
      }
    });
  }

  //Funcion para modificar un pproveedor
  ModifyProveedorById(idProveedor: number, _tittle: string, _form: string){
    this.elementForm.title = _tittle;
    this.elementForm.form = _form;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Proveedor(idProveedor);
    this.srvModal.openModal();
  }

  // Funcion para eliminar un proveedor
  deleteProveedorById(idProveedor: number){
    Swal.fire({
      title: '¿Estas seguro de cambiar el estado este proveedor?',
      text: "Al deshabilitar un Proveedor, este no podra ser seleccionada a la hora de agregar un Bien. Este cambio puede ser revertido en cualquier momento",
      showDenyButton: true,
      confirmButtonText: `Modificar`,
      denyButtonText: `Cancelar`,
    }).then((result)=>{
      if(result.isConfirmed){
        this.srvCaracteristicas.deleteProveedorById(idProveedor)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            // console.log("Estado Eliminado => ", data);
            if(data.status){
              Swal.fire({
                title: data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
            }else{
              Swal.fire({
                title: data.message,
                icon: 'warning',
                showConfirmButton: false,
                confirmButtonText: 'Aceptar',
              });
            }
            setTimeout(() => {
              this.getProveedor();
            }, 1500);
          },
          error: (err) => {
            console.log("Error al eliminar el Proveedor =>",err);
          },
          complete: () => {
            // console.log("Proceso de eliminacion de Proveedor completado");
          }
        });
      }
    });
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvCaracteristicas.datosProveedor ? this.srvCaracteristicas.datosProveedor.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page:page, parameter: this.parameter, data: this.data };
    // console.log('mapFiltersToRequest en pasasr pag en roles', this.mapFiltersToRequest);
    this.getProveedor();
  }


  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      // console.log('handleSearch else');
      this.parameter = 'str_rol_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.getProveedor();
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
