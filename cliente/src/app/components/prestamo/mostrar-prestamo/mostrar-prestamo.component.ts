import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { PrestamosService } from 'src/app/core/services/prestamos/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-prestamo',
  templateUrl: './mostrar-prestamo.component.html',
  styleUrls: ['./mostrar-prestamo.component.css']
})
export class MostrarPrestamoComponent implements OnInit {
  private destroy$ = new Subject<any>();

  isLoading: boolean = false
  isData: boolean = false;

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

  currentPage = 1;
  metadata: any;

  cedulaPrestamo!: string
  cedulaLogin!: string

  reporte!: boolean

     //Variables para el filtro
    options: string[] = ['codigo','persona'];
    searchResult: any = null;
    data: string = '';
    parameter: string = '';

    elementForm: {
      form: string;
      title: string;
      special: boolean;
    } = {
      form: '',
      title: '',
      special: true,
    }

  constructor(
    public srvPrestamos: PrestamosService,
    public srvPaginacion: PaginacionService,
    public srvModal: ModalService,
    public srvPersona: PersonasService,

  ) { }

  ngOnInit(): void {
    // this.srvPrestamos.obtenerPrestamosConEstado({})
    this.reporte = false
    this.srvPrestamos.typeview = false
    this.srvPrestamos.base64 = false

    //console.log(this.srvPersona.dataMe) 

    if(this.srvPersona.dataMe.str_per_cedula.length<9){
      this.cedulaLogin = '0'+ this.srvPersona.dataMe.str_per_cedula
    }else{
      this.cedulaLogin = this.srvPersona.dataMe.str_per_cedula
    }

    


    this.pasarPagina(1)
  }

  getPrestamos(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvPrestamos.getPrestamosConEstado(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        if(data.body.length === 0){
          this.isData = false,
          this.isLoading = false
        }else{
          this.isLoading = data.status
          this.isData = data.status
        }
        console.log('lo que viene --->',data.body)
        this.srvPrestamos.datosPrestamo = data.body
        this.metadata = data.total

        

        this.dataPagina()

        Swal.close()
        console.log('data', data.body)
      },
      error(err) {
        console.log('Error: ', err)
      }
    })
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvPrestamos.datosPrestamo ? this.srvPrestamos.datosPrestamo.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.getPrestamos();
  }

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.reporte = false
      this.pasarPagina(1);
    } else {
      if(this.searchResult.parameter === 'persona'){
      this.parameter = 'str_prestamo_' + this.searchResult.parameter + '_nombre';
      // this.srvPrestamos.solicitanteNombre = this.searchResult.para
      } else {
        this.parameter = 'str_prestamo_' + this.searchResult.parameter;
      }
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.reporte = true
      this.getPrestamos();
    }
  }

  interaccionCustodio(id: number, _title: string, _form: string, especial: boolean, idS: number, custodio:string, finalizado: boolean){
    this.srvPrestamos.linkOneDrive=''
    this.srvPrestamos.cedulaCustodio = custodio
    this.srvPrestamos.finalizado = finalizado
    // console.log('cedula custodio', custodio)
    this.srvPrestamos.especial = especial
    this.srvPrestamos.idEstados = idS
    this.srvPrestamos.idPrestamo = id
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()

  }

  agregarFirma(id: number, _title: string, _form: string, estadoP: number){
    this.srvPrestamos.linkOneDrive=''
    this.srvPrestamos.idPrestamo = id
    this.srvPrestamos.idEstados = estadoP
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()
  }

  getReporte(_title: string, _form: string, reporte: boolean){
    this.srvPrestamos.linkOneDrive=''
    this.srvPrestamos.reporte = reporte
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()
  }

  getpdf(id: number, _title: string, _form: string, cedula: string, estado:string, proceso: number, idEstado: number, custodio: string){
    this.srvPrestamos.linkOneDrive=''
    this.srvPrestamos.cedulaCustodio = custodio
    this.srvPrestamos.reporte = false
    console.log('cedula custodio', custodio)
    this.srvPrestamos.cedulaPrestamo = cedula
    this.srvPrestamos.estadoPrestamo = estado
    this.srvPrestamos.proceso = proceso
    this.srvPrestamos.idEstados = idEstado
    this.srvPrestamos.base64=false
    this.srvPrestamos.pdf = id
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()

  }

  getFirma(id: number, _title: string, _form: string, estado: string ,cedula: string, custodio: string, proceso: number, idEstado: number, horario: number){
    this.srvPrestamos.linkOneDrive = ''
    this.srvPrestamos.cedulaCustodio = custodio
    // this.srvPrestamos.horarioId = horario
    // this.obtenerDecano(horario)
    this.srvPrestamos.reporte = false

    this.srvPrestamos.horarioId = horario
    console.log('cedula custodio', custodio)
    this.srvPrestamos.cedulaPrestamo = cedula
    this.srvPrestamos.estadoPrestamo = estado
    this.srvPrestamos.idEstados = idEstado
    this.srvPrestamos.proceso = proceso
    this.srvPrestamos.base64=true
    this.srvPrestamos.pdf = id
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()
  }

  getOneDrive(id: number,_title: string, _form: string, link: string){
    this.srvPrestamos.linkOneDrive = link
    this.srvPrestamos.pdf = id
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()
  }

  obtenerDecano(id: number){
    this.srvPrestamos.getDecano(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:any) => {
        console.log('data decano->', data);
        this.srvPrestamos.cedulaDecano = data.body.listado[0].strCedulaDecano
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({})
    this.destroy$.complete()
  }

}
