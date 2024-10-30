import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { perRolesModel } from 'src/app/core/models/personas';
import { MenuService } from 'src/app/core/services/menu.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { PaginacionService } from 'src/app/core/services/paginacion.service';

@Component({
  selector: 'app-mostrar-usuarios',
  templateUrl: './mostrar-usuarios.component.html',
  styleUrls: ['./mostrar-usuarios.component.css']
})
export class MostrarUsuariosComponent /*implements OnInit */ {

  options: string[] = ['cedula', 'estado', 'nombres', 'apellidos'];
  searchResult: any = null;

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      this.parameter = 'str_per_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.getPersonas();
    }
  }

  data: string = '';
  parameter: string = '';
  dataForm: perRolesModel = {
    status: true,
    id: 0,
  };

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


  private destroy$ = new Subject<any>();
  status!: boolean;
  isData: boolean = false;
  isLoading: boolean = true

  permiso: {
    bln_editar: boolean,
    bln_eliminar: boolean
  } = {
      bln_editar: false,
      bln_eliminar: false
    }

  constructor(public srvPersonas: PersonasService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvMenu: MenuService,
  ) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false
      Swal.close();
    }, 1500);
    this.pasarPagina(1);
    this.permisos();
  }


  getPersonas() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvPersonas.getPersonasP(this.mapFiltersToRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data.body) {
            this.isData = true;
            this.srvPersonas.datosPersonas = data.body;
            this.metadata = data.total
            Swal.close();
          }
          this.dataPagina()
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
        }
      });
  }

  editarUsuario(_id: number, _title: string, _form: string) {
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.setIdUser(_id);
    this.srvModal.openModal();
  }

  cambiarEstado(_id: number) {
    // console.log('cambiarEstado');
    Swal.fire({
      title: "¿Está seguro que desea desactivar este Usuario?",
      text: 'Al deshabilitar un Usuario, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      showDenyButton: true,
      confirmButtonText: `Si, cambiar`,
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvPersonas
          .deleteUsuarios(_id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              // console.log("res dentro del next CAMBIAR ESTADO: ", res);
              if (res.status) {
                Swal.fire({
                  title: res.message,
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2500,
                });
                //obtener usuario la actualización a la tabla
              } else {
                Swal.fire({
                  title: res.message,
                  icon: 'warning',
                  showDenyButton: false,
                  confirmButtonText: `Aceptar`,
                });
              }
              setTimeout(() => {
                this.getPersonas();
              }, 3000);
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
            }
          });
      }

    });
  }

  // Para cambiar la vista al body e ir a la vista de peronas rol
  selectView(viewType: boolean, _id: number) {
    this.dataForm.status = viewType;
    this.dataForm.id = _id;
    this.srvPersonas.setData_rol(this.dataForm);
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvPersonas.datosPersonas ? this.srvPersonas.datosPersonas.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page:page , parameter: this.parameter, data: this.data };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.getPersonas();
  }

  permisos() {
    this.permiso = {
      bln_editar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/usuarios')?.bln_editar ?? false,
      bln_eliminar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/usuarios')?.bln_eliminar ?? false,
    };
  }

  //   buscarUsuario(){
  //  //   if(this.buscar.length > 2){
  //     this.mapFiltersToRequest = { size: 10, page: 1, parameter:'str_per_estado', data: this.data};
  //     this.getPersonas();
  //    // }
  //   }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

