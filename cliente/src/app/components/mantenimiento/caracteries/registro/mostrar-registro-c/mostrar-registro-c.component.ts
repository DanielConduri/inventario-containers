import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pagRegistroCorrectivo, pagRegistroMantenimiento } from 'src/app/core/models/mantenimiento/registro';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { PersonasService } from 'src/app/core/services/personas.service';
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

  tecnico!: string

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

     //Variables para el filtro
     options: string[] = ['custodio', 'tecnico', 'codigo bien'];
     searchResult: any = null;
     data: string = '';
     parameter: string = '';

  constructor(
    public srvMenu: MenuService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    public srvPersona: PersonasService,
    public srvRegistroC: RegistroMantenimientoService,
    public srvMantenimiento: MantenimientoService
  ) { }

  ngOnInit(): void {
    console.log(this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos)
    this.tecnico = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos
    this.pasarPagina(1)
    // this.srvRegistroC.obtenetRegitroCorrectivo({})
  }

  obtenerRegistro(){
    Swal.fire({
      title: 'Cargando Registros...',
      didOpen: () => {
        Swal.showLoading();
        // this.isData = true;
      },
    });
    this.srvRegistroC.getRegistroCorrectivo(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagRegistroCorrectivo) => {
        // console.log(data)
        if(data.body.length > 0){
          this.isLoading = true;
          this.isData = true;
          // this.isLoading = true;
          this.srvRegistroC.datosRegistroCorrectivo = data.body
          this.metadata = data.total
        } else {
          this.isLoading = false;
          this.isData = false;
        }
        // console.log('lo que llega', data)
        Swal.close();
        this.dataPagina()
      },
      error: (error) => {
        console.log('Error', error)
      }
    })
  }

  modifyRegistro(id: number){
    // this.srvRegistroC.idRegistroCorrectivoModify = id
    // this.elementForm.form = _form;
    // this.elementForm.title = _title;
    // // this.elementForm.special = false;
    // this.srvModal.setForm(this.elementForm);
    // this.srvModal.openModal()
    this.srvRegistroC.idRegistroCorrectivoModify = id
    this.srvMantenimiento.edidMantenimientoCorrectivo = true
  }

  traspasoTecnico( id: number, _title: string, _form: string){
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    console.log('lo que va ->', id)
    this.srvMantenimiento.setTraspaso(id)
    // this.elementForm.special = false;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.openModal()
  }

  deleteRegistro(id: number){
    Swal.fire({
      title: '¿Está seguro que desea desactivar este mantenimiento?',
      showDenyButton: true,
      // text: 'Al deshabilitar un Mantenimiento, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
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
        this.srvRegistroC
          .deleteRegistroCorrectivo(id)
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
              this.obtenerRegistro();
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
    this.elementPagina.dataLength = this.srvRegistroC.datosRegistroCorrectivo ? this.srvRegistroC.datosRegistroCorrectivo.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerRegistro();
  }

  permisoEditar(path: string){
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_editar ?? false;
  }

  //funcion para permisos de eliminar
  permisoEliminar(path: string){
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_eliminar ?? false;
  }

  handleSearch(result: any) {
    this.searchResult = result;
    // console.log('cual es el result ->', result)
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {

      switch(this.searchResult.parameter){
        case 'tecnico':
          this.searchResult.parameter = 'str_mantenimiento_correctivo_tecnico_responsable'
          break;
        case 'codigo bien':
          this.searchResult.parameter = 'str_codigo_bien'
          break;
        case 'custodio':
          this.searchResult.parameter = 'str_mantenimiento_correctivo_custodio'
        // default:
        //   break;
      }

      // console.log('lo que se va a enviar', this.searchResult)

      this.parameter = this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.obtenerRegistro();        
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
