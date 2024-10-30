import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { pagRegistroCorrectivo, pagRegistroMantenimiento, pagRegistroPreventivo } from 'src/app/core/models/mantenimiento/registro';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-registro-p',
  templateUrl: './mostrar-registro-p.component.html',
  styleUrls: ['./mostrar-registro-p.component.css']
})
export class MostrarRegistroPComponent implements OnInit {

  private destroy$ = new Subject<any>()

  isLoading: boolean = false
  isData: boolean = false;
  idubi!: number

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


    options: string[] = ['codigo', 'centro', 'estados'];
     searchResult: any = null;
     data: string = '';
     parameter: string = '';

  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};

  constructor(
    public srvMenu: MenuService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
    // public srvRegistro: CaracteristicasMantenimientoService,
    public srvRegistroP: CaracteristicasMantenimientoService,
    public srvPreventivo: RegistroMantenimientoService,
    public srvMantenimiento: MantenimientoService

  ) { }

  ngOnInit(): void {
    this.pasarPagina(1)
    this.obtenerRegistro()
    // this.srvRegistroC.obtenetRegitroCorrectivo({})
  }

  obtenerRegistro(){
    Swal.fire({
      title: 'Cargando Registros...',
      didOpen: () => {
        Swal.showLoading();
        // this.isLoading = true;
        // this.isData = true;
      },
    });
    this.srvRegistroP.getPlanificacion(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        // console.log('lo que l')
        // this.idubi = data.body.int_ubicacion_id
        console.log('lo que llega ->', data.body)
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvRegistroP.datosPlanificacion = data.body
          this.metadata = data.total
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

  modifyRegistro(id: number, _title: string, _form: string){
    console.log('lo que envia el id ->', id)
    this.srvPreventivo.idRegistroPreventivoModify = id
    this.srvRegistroP.setPlanEditar(id)
    this.getPlanificacionById(id)
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    // this.elementForm.special = false;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.openModal()
  }

  getPlanificacionById(ids: number) {
    console.log('llega id', ids)
    this.srvRegistroP.getByIdPlanificacion(ids)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
          console.log('en el mostrar ----->', data)
          this.srvRegistroP.setUbicacionC(data.body.int_ubicacion_id)
          this.srvPreventivo.setCantidadBienes(data.body.int_planificacion_cantidad_bienes)
        },
        error: (error) => { console.log(error) }
      })

  }

  deleteRegistro(id: number){}


  ModifyBienById(idBien: number, _tittle:string, _form:string){
    // console.log('entra al boton')
    this.srvMantenimiento.preventivo = true
    // console.log('lo que sale en el bool',  this.srvMantenimiento.preventivo)
    // this.agg()
    console.log("Funcion para editar el bien por ID", idBien)
    
    this.srvRegistroP.setPlanEditar(idBien)
    this.getPlanificacionById(idBien)
    this.srvPreventivo.idRegistroPreventivoModify = idBien
    // this.getPlanificacionById(idBien)

    // this.elementForm.form = 'preventivo';
    // this.elementForm.title = 'Editar Mantenimiento Preventivo';
    // this.srvModal.setForm(this.elementForm);
    // this.srvModal.setSelectID_Bien(idBien);
    // this.srvModal.openModal();
  };

  mostrarInfo(id: number, ubi:number ,_tittle:string, _form:string){
    this.elementForm.form = _form
    this.elementForm.title = _tittle
    this.srvRegistroP.setPlanificacionId(id)
    // console.log('lo que va en ub ->', ubi)
    this.srvRegistroP.setUbicaPlan(ubi)
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Bien(id);
    this.srvModal.openModal();
  }

  agg(){
    // this.srvMantenimiento.especial = true
    // this.srvMantenimiento.typeview = false
  }


  dataPagina() {
    this.elementPagina.dataLength =  this.srvRegistroP.datosPlanificacion?  this.srvRegistroP.datosPlanificacion.length : 0;
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
    // console.log('lo que llega', result)
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      if(result === 'estados'){
        this.searchResult.parameter = 'estado'
      }
      this.parameter = 'str_planificacion_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      // this.getCentros();
      this.obtenerRegistro()
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
