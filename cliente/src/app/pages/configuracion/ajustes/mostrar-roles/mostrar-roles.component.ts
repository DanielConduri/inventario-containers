import { Component, OnInit, OnDestroy } from '@angular/core';
import { AjustesService } from '../../../../core/services/ajustes.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-mostrar-roles',
  templateUrl: './mostrar-roles.component.html',
  styleUrls: ['./mostrar-roles.component.css']
})
export class MostrarRolesComponent implements OnInit, OnDestroy {

  //creamos la propiedad "elementForm"
  elementForm: {
    //Establecemos los elementos "formulario" y "title" a los que les
    //designaremos sus respectivos tipos
    form: string,
    title: string,
    special: boolean
  } = {
      //inicializamos los elementos en vacio
      form: '',
      title: '',
      special: true
    }
  isData: boolean = false;
  isLoading: boolean = true

  elementPagina: {
    dataLength: number,
    metaData: number,
    currentPage: number
  } = {
      dataLength: 0,
      metaData: 0,
      currentPage: 0
    }

  permiso: {
    bln_crear: boolean,
    bln_editar: boolean,
    bln_eliminar: boolean,
    bln_ver: boolean,
  } = {
      bln_crear: false,
      bln_editar: false,
      bln_eliminar: false,
      bln_ver: false,
    }

  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};
  edit: boolean = false;
  private destroy$ = new Subject<any>() //Se crea para que no exista desbordamiento de datos

  //Variables para el filtro
  options: string[] = ['nombre', 'estado'];
  searchResult: any = null;
  data: string = '';
  parameter: string = '';

  constructor(
    public srvAjustes: AjustesService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvMenu: MenuService,

  ) { } //se inyecta el servicio que se creo

  ngOnInit(): void {
    this.permisos();

    setTimeout(() => {
      this.isLoading = false
      Swal.close();
    }, 1500);
    this.pasarPagina(1);
    this.getRoles();
    this.srvAjustes.funcion(this.getRoles())
  }

  getRoles() {
    Swal.fire({
      title: 'Cargando Roles...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvAjustes.getRolesP(this.mapFiltersToRequest) //se llama a la funcion que se solicita en ajustes.service.ts
      .pipe(takeUntil(this.destroy$)) //
      .subscribe({
        next: (roles) => {
          if (roles.status) {
            this.metadata = roles.total
            // console.log('roles anates del if leanght', roles)
            if (roles.total === 0) {
              this.isData = false;
              // console.log('no hay datos')

            } else {
              this.isLoading = true;
              this.isData = true;
              this.srvAjustes.datosRoles = roles.body
              // console.log('roles', roles.body)
            }
          } else {
            this.isLoading = false;
          }
          Swal.close();
          this.dataPagina()

        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          // console.log('CARGA, DATOS', this.isLoading, this.isData)
        }
      })
  }
  //dentro de nuestra funcion establecemos los parametros a recibir
  modifyRol(id: number, _title: string, _form: string) {
    //Asignamos los valores a nuestros elementos en base a sus respectivos parametros

    this.elementForm.form = _form;
    this.elementForm.title = _title;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setIdRol(id);
    this.srvModal.openModal();

  }

  //funcion para eliminar roles 
  deleteRol(id: number) {

    Swal.fire({
      title: '¿Está seguro que desea modificar este rol?',
      showDenyButton: true,
      text: 'Al deshabilitar un Rol, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Rol...',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        this.srvAjustes.deleteRol(id,)
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
              this.getRoles();
              setTimeout(() => {
                Swal.close();
              }, 3000);
            },
            error: (error) => {
              console.log('err', error);
            },
            complete: () => {
            }
          })
      }
    });
  }

  //funciones de informacion para la paginacion en roles 
  dataPagina() {
    this.elementPagina.dataLength = this.srvAjustes.datosRoles ? this.srvAjustes.datosRoles.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page:page, parameter: this.parameter, data: this.data };
    // console.log('mapFiltersToRequest en pasasr pag en roles', this.mapFiltersToRequest);
    this.getRoles();
  }

  permisos() {
    this.permiso = {
      bln_crear: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/roles')?.bln_crear ?? false,
      bln_editar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/roles')?.bln_editar ?? false,
      bln_eliminar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/roles')?.bln_eliminar ?? false,
      bln_ver: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/roles')?.bln_ver ?? false,
    };
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
      this.getRoles();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
