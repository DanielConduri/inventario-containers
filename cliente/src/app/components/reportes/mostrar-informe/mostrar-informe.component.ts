import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InformesService } from 'src/app/core/services/informes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { ReportesService } from 'src/app/core/services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-informe',
  templateUrl: './mostrar-informe.component.html',
  styleUrls: ['./mostrar-informe.component.css']
})
export class MostrarInformeComponent implements OnInit {
  private destroy$ = new Subject<any>();

  pdf: any = ""

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

  fechas: any = []
  lugar!: string[]
  partes!: any[]
  parte: {
    lugar: string[],
    fecha: string[]
  } = {
    lugar: [],
    fecha: []
  }

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

      //Variables para el filtro
  options: string[] = ['titulo','id'];
  searchResult: any = null;
  data: string = '';
  parameter: string = '';

  constructor(public srvInformes: InformesService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
  ) { }

  ngOnInit(): void {
    this.srvInformes.typeviw = true
    this.srvInformes.datosSearch = []
    this.pasarPagina(1);
    this.getInforme()
  }

  getInforme(){
    Swal.fire({
      title: 'Cargando Informes...',
      didOpen: () => {
        Swal.showLoading()
        // this.isLoading = true
        // this.isData = true
      },
    });
    this.srvInformes.getInform(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$)).
    subscribe({
      next: (data: any) => {
        Swal.close();
        if(data.body.length > 0){
          // this.isData = true;
          this.isData = true;
          this.isLoading = true;
          this.srvInformes.datosInformes = data.body
          this.metadata = data.total
          // this.metadata = roles.total
        }
        this.dataPagina()
        
        // this.pdf = data.body
        //         let viewpdf = document.getElementById('ver-pdf-solicitud');
        //             if (viewpdf) {
          //               viewpdf.innerHTML =
          //                 ' <iframe src="' +
          //                 'data:application/pdf;base64,' +
          //                 this.pdf +
          //                 '" type="application/pdf" width="100%" height="600" />';
          //             }
        // console.log('Lo que llega ->', data);
      },
      error: (err) =>{
        console.log('Error ->', err);
      }
    })
  }

  extraer(fechalugar: any){
    // console.log('lleha la fecha', fechalugar)
    // const partes 
    for(let i = 0; i < fechalugar.length; i++){
      this.partes = fechalugar[i].str_documento_fecha.split(',');
      // console.log('sale o no sale ->', this.partes)
      this.parte.fecha[i] = this.partes[0]
      this.parte.lugar[i] = this.partes[1]
      this.fechas.push(this.partes[1])
      // console.log('sellena--->', this.fechas)
    }
    // console.log('las fechas', this.parte.fecha)
    // console.log('las lugares', this.parte.lugar)
  }

  mostrarPDF(id: number, _title: string ,_form: string){
    this.srvInformes.pdf = id
    // this.srvCentros.idModify = id
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.openModal();
  }

  edidInf(id: number){
    this.srvInformes.idInf = id
    this.srvInformes.typeviw = false
    this.srvInformes.typeview = true 
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.getInforme();
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvInformes.datosInformes ? this.srvInformes.datosInformes.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
      this.parameter = ''
      this.data = '';
      this.pasarPagina(1);
    } else {
      this.parameter = 'str_documento_' + this.searchResult.parameter;
      this.data = this.searchResult.data;
      this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
      this.getInforme();
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
