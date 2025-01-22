import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OtrosShowModelPag } from 'src/app/core/models/Bienes/Inventario/otros';
import { cargaLoading, pagCenter } from 'src/app/core/models/centros';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import { HorarioService } from 'src/app/core/services/horario.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { PrestamosService } from 'src/app/core/services/prestamos/prestamos.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-agregar-prestamo',
  templateUrl: './agregar-prestamo.component.html',
  styleUrls: ['./agregar-prestamo.component.css']
})
export class AgregarPrestamoComponent implements OnInit {
  private destroy$ = new Subject<any>();

  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};
  cedulaLogin: any = {};

  data: string = '';
  parameter: string = '';

  elementPagina: {
    dataLength: number,
    metaData: number,
    currentPage: number
  } = {
      dataLength: 0,
      metaData: 0,
      currentPage: 0
    }

  isLoading: boolean = false
  isData: boolean = false;

  arrBien: any = []
  checkbo!: boolean

  moTabla!: boolean
  moTabla2!: boolean
  srvMantenimiento: any;

  cedulaCustodio!: string

  bienesSelect: any = []
  bienesCustodio: any = []
  prueba!: any

  dias!: string[]
  horarios!: any[]
  id!: any[]
  inicio!: string[]
  fin!: string[]
  aux!: any[]

  ubicacion!: string
  celularCustodio!: string

  myForm!: FormGroup

  fechaActual = new Date()
  fechaValidacion!: string
  fechasSemana: any[] = []
  aux1!: number
  diasemanaActual: string[] = []

  diaActual!: number

  acept: boolean = false

  sinHorario: boolean = false

  tipoP: boolean = false
  diaNombre!: string
  intervalos: any[] = []
  fec!: string
  hora!: string

  horarioId!: number
  fechaPrestamo!: string

  tablaFecha: boolean = false

  
  comprobante!: number
  estadosTecnicos: any = []


  constructor(
    public srvPrestamos: PrestamosService,
    public srvInventario: InventarioService,
    public srvCentros: CentrosService,
    public srvHorario: HorarioService,
    public srvPersona: PersonasService,
    public fb: FormBuilder,
    public srvUsuarios: AjustesService,

  ) {
    this.myForm = this.fb.group({
      codigoBien: [[]],
      personaId: [''],
      objetoInvestigacion: ['', Validators.required],
      horarioId: [''],
      fechaPrestamo: ['', Validators.required],
      estadoId: [5],
      personaNombre: [''],
      custodioId: [''],
      custodioNombre: [''],
      induccion: [''],
      // fsalida: [''],
      fdevolucion: [''],
      estadoTecnico:[[]],
    })
    
  }

  ngOnInit(): void {
    console.log(this.srvPersona.dataMe)
    // console.log('fecha actual ->', this.fechaActual)
    if(this.fechaActual.getMonth() + 1 < 10){
      this.fechaValidacion = this.fechaActual.getFullYear() + '-0' + (this.fechaActual.getMonth() + 1) + '-' + this.fechaActual.getDate()
    } else {
      this.fechaValidacion = this.fechaActual.getFullYear() + '-' + (this.fechaActual.getMonth() + 1) + '-' + this.fechaActual.getDate()
    }

    
    const horas = this.fechaActual.getHours().toString().padStart(2, '0');
    const minutos = this.fechaActual.getMinutes().toString().padStart(2, '0');
    const segundos = this.fechaActual.getSeconds().toString().padStart(2, '0');
    this.hora = `${horas}:${minutos}:${segundos}`;
    console.log('hora ->', this.hora)
    // this.fechaValidacion = this.fechaActual.getFullYear() + '-' + (this.fechaActual.getMonth() + 1) + '-' + this.fechaActual.getDate()
    console.log('fecha validacion ->', this.fechaValidacion)
    //this.srvPrestamos.typeview = false
    this.tipoP = true
    this.srvHorario.horarioPrestamo = []
    this.bienesSelect = []
    this.fechaSemana(this.fechaActual)
    this.srvPrestamos.obtenerPrestamo()
    this.myForm.get('personaId')?.setValue(this.srvPersona.dataMe.str_per_cedula)
    this.myForm.get('personaNombre')?.setValue(this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos)
    // console.log('form ->', this.myForm.value)

    this.srvHorario.horarioPrestamo = []

  }

  regresar() {
    this.srvPrestamos.typeview = false
  }

  changeBien(e: any) {
    this.moTabla2 = false
    const length = e.target.value.length;
    if (length % 2 === 0 && length > 2) {
      const textSearch = Number(e.target.value);
      if (isNaN(textSearch)) {
        this.searchBien2({
          filter: {
            status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
            like: { parameter: 'str_bien_nombre', data: e.target.value },
          },
        });
      } else {
        this.searchBien2({
          filter: {
            status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
            like: { parameter: 'str_codigo_bien', data: e.target.value },
          },
        });
      }

    }
    // console.log('lo que llega del sear ->', e.target.value);

  }

  searchBien(filter: any) {
    const parametro = filter.filter?.like?.parameter;
    this.srvInventario
      .getfiltro(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resBien: any) => {
          // this.srvPrestamos.datosSearch = resBien.body
          this.srvPrestamos.datosSearch = resBien.body.filter((bien: any) => bien.int_bien_estado_historial !== 0)
          this.moTabla = true
        },
      });
  }

  searchBien2(filter: any) {
    this.srvPrestamos
    .getFiltroBien(filter)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resBien: any) => {
        // this.srvPrestamos.datosSearch = resBien.body
        console.log('resBien ->', resBien.body)
        this.srvPrestamos.datosSearch = resBien.body.filter((bien: any) => bien.int_bien_estado_historial !== 0)
        console.log('datos search ->', this.srvPrestamos.datosSearch)
        this.moTabla = true
      },
    });
  }

  checkData(e: any) {
    this.srvPrestamos.datosSearch = []
    this.moTabla = false
    this.moTabla2 = true
    this.srvInventario.getBienById(e)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datosbien) => {
          console.log('datos bien ->', datosbien.body)
          this.getValidacion(datosbien.body.str_codigo_bien_cod)
          this.ubicacion = datosbien.body.str_ubicacion_nombre
          this.srvInventario.dataBienInfo = datosbien.body
          this.cedulaCustodio = datosbien.body.str_custodio_cedula
          this.obtenerDatosCentralizada(this.cedulaCustodio)
          this.bienesSelect.push(datosbien.body)
          this.bienesCustodio = []
          this.getBienesOtros()
          this.traerCentro()
        },
        error: (err) => {
          console.log('error al obtener el bien', err)
        }
      })
  }

  obtenerDatosCentralizada(e: string) {
    // let cedula = document.getElementById('cedula_user') as any
    Swal.fire({
      title: 'Buscando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvUsuarios
      .getCentralizada(e)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          if (res.status) {
            Swal.close();
            Swal.fire({
              title: 'Usuario encontrado',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
            });
            console.log('res ->', res.body)
          } else {
            Swal.close();
            Swal.fire({
              title: 'Usuario no encontrado',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000,
            });
          }
          // this.srvInforme.usuarioSearch = res.body.nombre + this.space + res.body.apellidos
          // this.comprobarUser(parseInt(res.body.per_id))
          // if(this.valido){
          //   this.idUserRespo.push(parseInt(res.body.per_id))
          //   this.userResoi.push(this.srvInforme.usuarioSearch)
          // }else{
          //   Swal.fire({
          //     title: 'Usuario ya incluido en el informe',
          //     icon: 'success',
          //     showDenyButton: false,
          //     confirmButtonText: 'Aceptar',
          //   });
          // }
          // this.srvInforme.usuarioSearch = []
          // this.aggButton = false
        },
        error: (error) => {
          console.log('err', error);
        },
        complete: () => {
          // this.datoUser()
        }

      }
      );
  }

  getValidacion(cod:string){
    console.log('si entra al getValidacion')
    this.srvPrestamos.getValidacion(cod)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:any) => {
        console.log('data ->', data.body)
        if(data.body){
          this.fechaPrestamo = data.body[0].dt_fecha_prestamo
          this.fechaPrestamo = this.fechaPrestamo.split('T')[0]
          console.log('fecha prestamo ->', this.fechaPrestamo)
          this.horarioId = data.body[0].int_horario_id
          console.log('horario id ->', this.horarioId)
        }
      },
      error: (err) => {
        console.log('error ->', err)
      }
    })  
  }

  getBienesOtros() {
    this.acept = false
    this.mapFiltersToRequest = {
      size: 100,
      page: 1,
      parameter: '',
      data: '',
    };

    Swal.fire({
      title: 'Cargando Bienes...',
      didOpen: () => {
        Swal.showLoading()
      }
    });


    this.srvInventario.getBienesPorCustodio(this.mapFiltersToRequest, this.cedulaCustodio)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dataOtros: OtrosShowModelPag) => {
          this.isData = false;
          if (dataOtros.body.length > 0) {

            this.isData = true;
            this.srvInventario.datosOtros = dataOtros.body;
            // });
            const bienesSelectIds = new Set(this.bienesSelect.map((bien: any) => bien.int_bien_id));

            this.bienesCustodio = this.srvInventario.datosOtros.filter(
              dato => !bienesSelectIds.has(dato.int_bien_id)
            );
            if (this.sinHorario == false) {
              Swal.close();
            }
          }

        },
        error: (err) => {
          console.log("Error al obtener los Bienes Otros", err);
        },
        complete: () => {

          // this.dataPagina()
        }
      })
  }

  Agregar(bien: any) {
    this.checkData(bien)

  }

  quitarBien(index: number) {
    this.estadosTecnicos.splice(index, 1)

    this.bienesSelect.splice(index, 1)
    this.getBienesOtros()
  }

  traerCentro() {
    this.mapFiltersToRequest = {
      size: 10,
      page: 1,
      parameter: 'str_centro_nombre',
      data: this.ubicacion,
    };
    this.srvCentros
      .getCenter(this.mapFiltersToRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (center: pagCenter) => {
          console.log('centro ->', center.body)
          this.srvHorario.getHorarios(center.body[0].int_centro_id)
          this.celularCustodio = center.body[0].str_centro_celular_custodio
          this.horario()

        },
        error: (err) => {
          console.log('error ->', err);
        },
        complete: () => { },
      });

  }

  horario() {
    this.srvHorario.SelectHorarioCentro$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.srvHorario.horarioPrestamo = data.body
          if (this.srvHorario.horarioPrestamo) {
            if (this.srvHorario.horarioPrestamo.length > 0) {
              this.ordenarHorario(this.srvHorario.horarioPrestamo)
              this.fechasSemana.forEach((fecha, index) => {
                this.fechasSemana[index].intervalos = this.srvHorario?.horarioPrestamo[index].intervalos
              })
              this.sinHorario = false
              this.moTabla2 = true
            } else {
              // console.log('no hay horarios disponibles', this.srvHorario.horarioPrestamo)
              Swal.fire({
                icon: 'warning',
                title: 'No hay horarios disponibles',
              })
              this.sinHorario = true
              this.moTabla2 = false
              // console.log('bienes select ->', this.bienesSelect)
              if (this.bienesSelect.length > 1) {
                this.bienesSelect.splice(0, 1)
              }
              // this.bienesSelect.splice(0,1)
            }
          }
        },
        error: (err) => {
          console.log('error ->', err);
        },
      })
  }



  ordenarHorario(horario: any) {
    const diasSemanaOrden: { [key: string]: number } = {
      "Lunes": 0,
      "Martes": 1,
      "Miércoles": 2,
      "Jueves": 3,
      "Viernes": 4,
      // "Sábado": 5,
      // "Domingo": 6
    };
    const horarioU: any = horario

    const sortedHorario = horarioU.sort((a: any, b: any) => {
      return diasSemanaOrden[a.dia] - diasSemanaOrden[b.dia];
    }
    )


  }

  EstadoTecnico(e: any){
    this.comprobante = 0
    // console.log('e', e)
    if(this.estadosTecnicos){
      if(this.estadosTecnicos.length > 0){
        // this.estadosTecnicos = this.estadosTecnicos.filter((estado:any) => estado.id !== e.target.id)
        for(let i = 0; i < this.estadosTecnicos.length; i++){
          if(this.estadosTecnicos[i].id !== e.target.id){
            console.log('entra al if 3', this.estadosTecnicos)
            // this.estadosTecnicos.splice(i, 1)
            this.estadosTecnicos.push({
              estado: e.target.value,
              id: e.target.id
            })
          }else if(this.estadosTecnicos[i].id === e.target.id && this.comprobante === 0){
            this.estadosTecnicos.splice(i, 1)


            this.estadosTecnicos.push({
              estado: e.target.value,
              id: e.target.id
            })
            this.comprobante = 1
          }
        }
      }else{
        this.estadosTecnicos.push({
          estado: e.target.value,
          id: e.target.id
        })
      }
    }else{
      this.estadosTecnicos.push({
        estado: e.target.value,
        id: e.target.id
      })
    }
  
  }

  agregarPrestamo() {
    // this.myForm.value.codigoBien = this.bienesSelect.map((bien: any) => bien.str_codigo_bien_cod)
    this.myForm.get('codigoBien')?.setValue(this.bienesSelect.map((bien: any) => bien.str_codigo_bien_cod))
    this.myForm.get('custodioId')?.setValue(this.cedulaCustodio)
    this.myForm.get('custodioNombre')?.setValue(this.srvInventario.dataBienInfo.str_custodio_nombre)
    this.myForm.get('estadoTecnico')?.setValue(this.estadosTecnicos)
    console.log('form ->', this.myForm.value)
    Swal.fire({
      title: '¿Está seguro de crear este prestamo ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvPrestamos.crearPrestamo(this.myForm.value)
        this.srvPrestamos.typeview = false

      }
    })
    // this.getPrestamos()
    // this.srvPrestamos.obtenerPrestamosConEstado({})
  }

  fechaSemana(fechaActual: any) {
    const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
    const diaActual = fechaActual.getDay()
    this.diaActual = fechaActual.getDate()
    this.aux1 = diaActual
    const lunesDeEstaSemana = new Date(fechaActual);
    lunesDeEstaSemana.setDate(fechaActual.getDate() - diaActual + (diaActual === 0 ? -6 : 1)); // Obtener el lunes de la semana actual
    for (let i = 0; i < 5; i++) {
      if (this.aux1 <= i) {
        this.diasemanaActual.push(dias[i])
      }
      const fecha = new Date(lunesDeEstaSemana);
      fecha.setDate(lunesDeEstaSemana.getDate() + i);
      this.fechasSemana.push({
        fecha: fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate(),
        diaNum: fecha.getDate(),
      })
    }

  }

  obtenerfecha(e: any) {
    console.log('fecha ->', e.target.value)
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo',]

    const fecha = new Date(e.target.value)
    const dia = fecha.getDay()
    this.diaNombre = dias[dia]
    // this.fec= fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate()
    // console.log('dia ->', this.fec)
    this.fec = e.target.value
    console.log('fecha fec ->', this.fec, ' fechaPrestamo', this.fechaPrestamo, 'fechaValidacion' , this.fechaValidacion)

    const formattedDate = fecha.toISOString().split('T')[0];
    if (this.diaNombre === 'Domingo' || this.diaNombre === 'Sabado') {
      this.tablaFecha = false
      Swal.fire({
        icon: 'warning',
        title: 'Los fines de semana no estan disponibles para prestamos',
      })
    } else {
      this.tablaFecha = true
      this.myForm.get('fdevolucion')?.setValue(formattedDate)
      for (let i = 0; i < this.srvHorario.horarioPrestamo.length; i++) {
        if (this.diaNombre === this.srvHorario.horarioPrestamo[i].dia) {

          if (this.srvHorario.horarioPrestamo[i].intervalos.length > 0) {
            this.intervalos = this.srvHorario.horarioPrestamo[i].intervalos
            this.sinHorario = false
          }
        }
      }
      console.log('intervalos ->', this.intervalos) 
    }
  }

  getPrestamos() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvPrestamos.getPrestamosConEstado({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data.body.length === 0) {
            this.isData = false,
              this.isLoading = false
          } else {
            this.isLoading = data.status
            this.isData = data.status
          }
          console.log('lo que viene --->', data.body)
          this.srvPrestamos.datosPrestamo = data.body
          this.metadata = data.total



          // this.dataPagina()

          Swal.close()
        },
        error(err) {
          console.log('Error: ', err)
        }
      })
  }


  tipoPrestamo(tipo: string) {
    this.myForm.get('induccion')?.setValue(tipo)
    
  }

  agregarHorario(e: any) {
    this.acept = true
    this.myForm.get('horarioId')?.setValue(e.target.id)
    // this.myForm.get('fechaPrestamo')?.setValue(this.fec)
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }



}
