import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OtrosOtros, OtrosShowModelPag } from 'src/app/core/models/Bienes/Inventario/otros';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { InformesService } from 'src/app/core/services/informes.service';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { ReportesService } from 'src/app/core/services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-reporte-mantenimiento',
  templateUrl: './mostrar-reporte-mantenimiento.component.html',
  styleUrls: ['./mostrar-reporte-mantenimiento.component.css']
})
export class MostrarReporteMantenimientoComponent implements OnInit {

  @ViewChild('verPdfSolicitud', { static: false }) verPdfSolicitud: any;


  reporteJson: number[] = [1, 2, 3]
  variable: boolean = true

  selectedCheckboxes: number = 0;
  checkboxLimit: number = 5; // Establece aquí el límite deseado
  areCheckboxesDisabled: boolean = false;

  private destroy$ = new Subject<any>();

  pdf: any = ""
  myForm!: FormGroup;

  isLoading!: boolean;
  message!: string;

  date!: any

  garant: boolean = false
  auxG: boolean = false

  fechaCompra: boolean = false

  fechaActual: Date = new Date();
  fechaFormateada1!: any;
  fechaFormateada2!: any;
  fechaUsar1!: string
  fechaUsar2!: string
  options4: string[] = ['centro'];
  catalog!: boolean
  _catalog!: boolean
  searchResult: any = null;
  data: string = '';
  parameter: string = '';
  mapFiltersToRequest: any = {};

  // dataCatalogo!: CatalogoData[]

  options: string[] = ['descripcion'];
  idCatalogo!: string

  // dataMarca!: MarcasData[]
  // dataUbicacion!: dataUbicacionReporte[]
  dataHistorial!: OtrosOtros[]
  dataUsuarios!: any[]

  auxiliar!: boolean

  tecnico!: string

  options1: string[] = ['centro'];
  marc!: boolean
  _marc!: boolean

  options2: string[] = ['cedula', 'nombres', 'apellidos'];;
  ubic!: boolean
  _ubic!: boolean

  options3: string[] = ['codigo_bien'];
  histo!: boolean
  _histo!: boolean
  count: number = 0

  fechas: {
    fechaI: any,
    fechaF: any
  } = {
      fechaI: '',
      fechaF: ''
    }
  // datePipe: any;

  constructor(
    private srvReportes: ReportesService,
    private datePipe: DatePipe,
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvInformes: InformesService,
    public srvInventario: InventarioService,
    public srvPersonas: PersonasService,
    public srvRegistroP: CaracteristicasMantenimientoService,

  ) {
    this.fechaFormateada1 = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy')
    this.fechaUsar1 = this.fechaFormateada1.toString()
    this.fechaFormateada2 = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd')
    this.fechaUsar2 = this.fechaFormateada2.toString()
    // console.log('la fecha es ->>>>>>', this.fechaUsar1, this.fechaUsar2)

    this.myForm = this.fb.group({
      // marca: new FormControl({value:'marca', disabled:true}),
      reporte_marca: [
        false,
      ],
      reporte_color: [
        false,
      ],
      reporte_material: [
        false,
      ],
      reporte_condicion: [
        false,
      ],
      reporte_estado: [
        false,
      ],
      reporte_bodega: [
        false,
      ],
      reporte_origen: [
        false,
      ],
      reporte_custodios: [
        false,
      ],
      reporte_fecha_ingreso: [
        false,
      ],
    })
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.auxiliar = false
    this.srvInformes.typeviw = true
    this.srvInformes.typeview = true
  }

  onCheckboxChange(e: any,) {
    this.auxG = false
    this.fechaCompra = false
    this.garant = false
    this.catalog = false
    this.marc = false
    this.ubic = false
    this.histo = false
    this._catalog = false
    this._marc = false
    this._ubic = false
    this._histo = false

    this.selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked').length;
    // console.log('cantidad->', this.selectedCheckboxes);
    this.areCheckboxesDisabled = this.selectedCheckboxes >= this.checkboxLimit;
    // console.log('bloqueo ->', this.areCheckboxesDisabled);
    // console.log('valor ->', this.myForm.value);
    // console.log('que arroja el e->', e.target);

    this.date = this.myForm.value.reporte_fecha_ingreso
    // const checked = (e.target as HTMLInputElement)?.checked
    // console.log('que es->');
    // console.log('valor individual ->', e.target.value);
    switch (e.target.value) {
      case '1':
        // this.getIngresoOrigen()
        // this.garant = true
        this.auxG = true

        break
      case '2':
        this.histo = true
        // this.getTipoIngreso()
        break
      case '3':
        // this.fechaCompra = true
        this.ubic = true
        break
      case '4':
        this.marc = true
        break
      case '5':
        this.catalog = true
        break
      // case '6':
      //   this.marc = true
      //   break
      // case '7':
      //   // this.getUbicacionBien()
      //   this.ubic = true
      //   break
      // case '8':
      //   break
    }
  }

  funcionPrincipalG() {
    this.auxG = false
    const check = document.getElementById('SelectD') as HTMLInputElement
    if (check.checked) {
      this.auxG = true
      // console.log('esta en el si')
    }
  }

  getFechaG(e: any) {
    if (e) {
      this.count = this.count + 1
    }
    if (this.count == 2) {
      this.garant = true
      console.log(this.garant)
    }
  }

  funcionGarantia() {
    if (this.auxG) {
      // const check = document.getElementById('SelectD') as HTMLInputElement
      const fechI = document.getElementById('dateI') as HTMLInputElement
      const fechF = document.getElementById('dateF') as HTMLInputElement

      const uFechI = this.datePipe.transform(fechI.value, 'dd/MM/yyyy')
      const uFechF = this.datePipe.transform(fechF.value, 'dd/MM/yyyy')
      this.fechas.fechaI = uFechI?.toString()
      this.fechas.fechaF = uFechF?.toString()
      console.log('las fechas ->', fechI.value, fechF.value)
      this.getMantenimientoF(this.fechas)
    }

    if (this.ubic) {
      const fechI = document.getElementById('dateI') as HTMLInputElement
      const fechF = document.getElementById('dateF') as HTMLInputElement

      const uFechI = this.datePipe.transform(fechI.value, 'dd/MM/yyyy')
      const uFechF = this.datePipe.transform(fechF.value, 'dd/MM/yyyy')
      this.fechas.fechaI = uFechI?.toString()
      this.fechas.fechaF = uFechF?.toString()

      this.getTecnicoFechas(this.tecnico, this.fechas)

    }

  }

  getMantenimientoF(fechas: any) {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });

    this.srvReportes.getMantenimientoCorrectivoPorFechas(fechas)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = data.status
          if (data.status) {
            this.pdf = data.body
            Swal.close()
            this.loadPdfInIframe(this.pdf)
          } else {
            this.pdf = ''
            this.message = data.message;
            Swal.close()
            this.clearIframe();
          }
        },
        error: (error) => {
          console.log('Error ->', error);
        }

      })

  }

  handleSearch(result: any) {
    this.searchResult = result;
    if (this.catalog) {
      if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
        // this.srvModal.report = false
        this.parameter = ''
        this.data = '';
        // this.pasarPagina(1);
      } else {
        this.srvModal.report = true
        this.parameter = 'str_catalogo_bien_' + this.searchResult.parameter;
        this.data = this.searchResult.data;
        this.mapFiltersToRequest = { size: 1000, page: 1, parameter: this.parameter, data: this.searchResult.data };
        // console.log('lo que llega del filtro ->', this.searchResult.data)
        // this.getCatalogo();
        // this.getBienesCatalogo()
      }
    }
    if (this.ubic) {
      // console.log('si entra aqui')
      if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
        this.parameter = ''
        this.data = '';
        // this.pasarPagina(1);
      } else {
        this.parameter = 'str_per_' + this.searchResult.parameter;
        this.data = this.searchResult.data;
        this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
        this.getPersonas();
      }
    }

    if (this.marc) {
      this.searchResult = result;
      // console.log('lo que llega', result)
      if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
        this.parameter = ''
        this.data = '';
        // this.pasarPagina(1);
      } else {
        if (result === 'estados') {
          this.searchResult.parameter = 'estado'
        }
        this.parameter = 'str_planificacion_' + this.searchResult.parameter;
        this.data = this.searchResult.data;
        this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
        // this.getCentros();
        this.obtenerRegistro()
      }
    }

    if (this.histo) {
      if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
        this.parameter = ''
        this.data = '';
        // this.pasarPagina(1);
      } else {
        //console.log('handleSearch else -> como lega el parametro', this.searchResult.parameter);
        //'nombre', 'modelo', 'marca', 'serie', 'estado'
        if (this.searchResult.parameter === 'estado_logico' || this.searchResult.parameter === 'nombre' || this.searchResult.parameter === 'modelo' || this.searchResult.parameter === 'serie') {
          this.parameter = 'str_bien_' + this.searchResult.parameter;
        }
        //'ubicacion','bodega','condicion_bien','marca'
        else if (this.searchResult.parameter === 'ubicacion' || this.searchResult.parameter === 'bodega' || this.searchResult.parameter === 'condicion_bien' || this.searchResult.parameter === 'marca') {
          this.parameter = 'int_' + this.searchResult.parameter + '_id';
          this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: parseInt(this.searchResult.data) };

        } else {
          this.parameter = 'str_' + this.searchResult.parameter;
          this.getIdHistorial(this.searchResult.data);
        }
        //console.log('handleSearch else -> como queda el parametro ->', this.parameter);
        this.data = this.searchResult.data;
        //console.log('data', this.data)
        this.mapFiltersToRequest = { size: 10, page: 1, parameter: this.parameter, data: this.searchResult.data };
        //this.getBienesOtros();
        //this.getBienesHistorial()
      }
    }
    if(this.catalog){
      if (this.searchResult.data === '' || this.searchResult.data === null || this.searchResult.data === undefined) {
        this.parameter = ''
        this.data = '';
        // this.pasarPagina(1);
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

  }

  obtenerRegistro() {
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
          this._marc = true
          this._catalog = true
          if (data.body.length > 0) {
            // this.isData = true;
            // this.isLoading = true;
            this.srvRegistroP.datosPlanificacion = data.body
            // this.metadata = data.total
          }
          // console.log('lo que llega', data)
          Swal.close();
          // this.dataPagina()
        },
        error: (error) => {
          console.log('Error', error)
        }
      })
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
          if (data.body.length > 0) {
            this._ubic = true
            console.log('lo que llega', data.body)
            this.dataUsuarios = data.body
            // this.isData = true;
            // this.srvPersonas.datosPersonas = data.body;
            // this.metadata = data.total
            Swal.close();
          } else {
            Swal.fire({
              title: 'Usuario no encontrado',
              icon: 'warning',
              showDenyButton: false,
              confirmButtonText: `Aceptar`,
            });
          }
          // this.dataPagina()
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
        }
      });
  }

  getBienesHistorial() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });

    this.srvInventario.getBienes(this.mapFiltersToRequest, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: OtrosShowModelPag) => {
          this._histo = true
          // console.log('lo que llega de bienes ->', data.body)
          this.dataHistorial = data.body
          this.getIdHistorial(data.body[0].str_codigo_bien)


        },
        error: (err) => {
          console.log("Error al obtener los Bienes Otros", err);
        },
        complete: () => {
          Swal.close()
        }
      })

  }

  getCentroPreventivo(e: any) {
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; //  
    const selectedId: number = parseInt(selectedOption.id);
    console.log(selectedOption)

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });

    this.srvReportes.getBienesMantenimientoPreventivoPorCentro(selectedId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = data.status
          if (data.status) {
            this.pdf = data.body
            Swal.close()
            this.loadPdfInIframe(this.pdf)
          } else {
            this.pdf = ''
            this.message = data.message;
            Swal.close()
            this.clearIframe();
          }
        },
        error: (error) => {
          console.log('Error ->', error);
        }
      })
  }

  getPlanificacion(e: any) {
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; //  
    const selectedId: number = parseInt(selectedOption.id);
    console.log(selectedOption)

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });

    this.srvReportes.getBienesMantenimientoPreventivoPorPlanificacion(selectedId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = data.status
          if (data.status) {
            this.pdf = data.body
            Swal.close()
            this.loadPdfInIframe(this.pdf)
          } else {
            this.pdf = ''
            this.message = data.message;
            Swal.close()
            this.clearIframe();
          }
        },
        error: (error) => {
          console.log('Error ->', error);
        }
      })


  }

  getIdHistorial(e: any) {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });

    this.srvReportes.getmantenimientosCorrectivosPorCodigoBien(e)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = data.status
          if (data.status) {
            this.pdf = data.body
            Swal.close()
            this.loadPdfInIframe(this.pdf)
          } else {
            this.pdf = ''
            this.message = data.message;
            Swal.close()
            this.clearIframe();
          }
        },
        error: (error) => {
          console.log('Error ->', error);
        }
      })

  }

  getTecnico(e: any) {

    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; //  
    const selectedId: number = parseInt(selectedOption.id);
    this.tecnico = selectedOption.value
    // this.auxG = true
    this.auxiliar = true
    // console.log('lo que llega ->', selectedOption.value)
  }

  getTecnicoFechas(tecnico: string, fechas: any) {
    console.log('se van ambos ->', tecnico, fechas)
    this.srvReportes.getmantenimientosCorrectivosPorTecnicoFechas(tecnico, fechas)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = data.status
          if (data.status) {
            this.pdf = data.body
            Swal.close()
            this.loadPdfInIframe(this.pdf)
          } else {
            this.pdf = ''
            this.message = data.message;
            Swal.close()
            this.clearIframe();
          }
        },
        error: (err) => {
          console.log('Error ->' ,err)
        }
      })
  }

  clearIframe() {
    if (this.verPdfSolicitud) {
      this.verPdfSolicitud.nativeElement.innerHTML = '';
    }
  }

  loadPdfInIframe(pdfBase64: string) {
    if (this.verPdfSolicitud) {
      this.clearIframe(); // Limpiar antes de cargar
      this.verPdfSolicitud.nativeElement.innerHTML =
        '<iframe src="data:application/pdf;base64,' +
        pdfBase64 +
        '" type="application/pdf" width="100%" height="600"></iframe>';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
