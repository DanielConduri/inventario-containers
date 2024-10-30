import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagEstadoMantenimiento } from 'src/app/core/models/mantenimiento/estadoMantenimiento';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { pagRegistroCorrectivo } from 'src/app/core/models/mantenimiento/registro';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-correctivo',
  templateUrl: './editar-correctivo.component.html',
  styleUrls: ['./editar-correctivo.component.css']
})
export class EditarCorrectivoComponent implements OnInit {

  private destroy$ = new Subject<any>();

  isLoading: boolean = false
  isData: boolean = false;

  arrBien: any = []
  checkbo!: boolean

  moTabla!: boolean
  moTabla2!: boolean

  myForm!: FormGroup

  id_bien!: string
  cedula_custodio!: string
  nombre_custodio!: string
  nombre_tecnico!: string
  nivel_id!: number
  nivel_nombre!: string
  estado_id!: number
  estado_nombre!: string

  codBien!: string

  constructor(
    public srvInventario: InventarioService,
    public srvMantenimiento: MantenimientoService,
    public srvCaracteristicas: CaracteristcasService,
    public srvNivelM: CaracteristicasMantenimientoService,
    public srvRegistro: RegistroMantenimientoService,
    public srvPersona: PersonasService,
    public fb: FormBuilder) {
    this.myForm = this.fb.group({
      int_nivel_mantenimiento_id: [''],
      int_estado_mantenimiento_id: [''],
      int_bien_id: [''],
      str_codigo_bien: [''],
      str_mantenimiento_correctivo_motivo: [''],
      str_mantenimiento_correctivo_descripcion_solucion: [''],
      int_mantenimiento_diagnostico: [''],
      str_mantenimiento_correctivo_telefono: [''],
      str_correctivo_nivel_nombre: [''],
      str_mantenimiento_correctivo_tecnico_responsable: [''],
      // str_correctivo_cedula_custodio: [''],
      // str_correctivo_nombre_custodio: [''],
      // str_correctivo_dependencia: [''],
      dt_mantenimiento_correctivo_fecha_revision: ['', [Validators.required]],
      dt_mantenimiento_correctivo_fecha_entrega: ['', [Validators.required]],
      str_estado_mantenimiento_nombre:[''],
      str_nivel_mantenimiento_descripcion:['']
    })
  }

  ngOnInit(): void {
    // this.changeBien(this.srvRegistro.idRegistroCorrectivoModify)
    this.obtenerMantenimientoId()
    this.nivelMantenimiento()
    this.getDataCreador()
    this.obtenerEstadoMantenimiento()
  }

  obtenerMantenimientoId() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvRegistro.getCorrectivoById(this.srvRegistro.idRegistroCorrectivoModify)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.moTabla2 = true
          console.log('lo que llega', data)
          // this.codBien = data.body.str_codigo_bien
          // this.changeBien(data.body.str_codigo_bien)
          // this.searchBien({
          //   filter: {
          //     status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
          //     like: { parameter: 'str_codigo_bien', data: data.body.str_codigo_bien },
          //   },
          // });
          this.checkData(data.body.int_bien_id)

          this.myForm = this.fb.group({
            int_nivel_mantenimiento_id: [data.body.int_nivel_mantenimiento_id],
            int_estado_mantenimiento_id: [data.body.int_estado_mantenimiento_id],
            int_bien_id: [data.body.int_bien_id],
            str_codigo_bien: [data.body.str_codigo_bien],
            str_mantenimiento_correctivo_motivo: [data.body.str_mantenimiento_correctivo_motivo],
            str_mantenimiento_correctivo_descripcion_solucion: [data.body.str_mantenimiento_correctivo_descripcion_solucion],
            int_mantenimiento_diagnostico: [data.body.int_mantenimiento_diagnostico],
            str_mantenimiento_correctivo_telefono: [data.body.str_mantenimiento_correctivo_telefono],
            str_correctivo_nivel_nombre: [data.body.str_correctivo_nivel_nombre],
            str_mantenimiento_correctivo_tecnico_responsable: [data.body.str_mantenimiento_correctivo_tecnico_responsable],
            // str_correctivo_cedula_custodio: [''],
            // str_correctivo_nombre_custodio: [''],
            // str_correctivo_dependencia: [''],
            dt_mantenimiento_correctivo_fecha_revision: [data.body.dt_mantenimiento_correctivo_fecha_revision.substring(0, 10), [Validators.required]],
            dt_mantenimiento_correctivo_fecha_entrega: [data.body.dt_mantenimiento_correctivo_fecha_entrega.substring(0, 10), [Validators.required]],
            str_estado_mantenimiento_nombre: [data.body.str_estado_mantenimiento_nombre],
            str_nivel_mantenimiento_descripcion: [data.body.str_nivel_mantenimiento_descripcion]
          })
        },
        error: (error) => { console.log(error) },
        complete: () => {
          Swal.close();
        }
      })
  }

  regresar() {
    this.srvMantenimiento.edidMantenimientoCorrectivo = false
  }

  // changeBien(e: any) {
  //   // console.log('en la funcion para editar-->', e)

  //   if (e.length > 0) {
  //     // console.log('entra al si')
  //     const length = e.length;
  //     if (length % 2 === 0 && length > 2) {
  //       const textSearch = Number(e);
  //       if (isNaN(textSearch)) {
  //         this.searchBien({
  //           filter: {
  //             status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
  //             like: { parameter: 'str_bien_nombre', data: e },
  //           },
  //         });
  //       } else {
  //         this.searchBien({
  //           filter: {
  //             status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
  //             like: { parameter: 'str_codigo_bien', data: e },
  //           },
  //         });
  //       }

  //     }
  //   } else {

  //     const length = e.target.value.length;
  //     if (length % 2 === 0 && length > 2) {
  //       const textSearch = Number(e.target.value);
  //       if (isNaN(textSearch)) {
  //         this.searchBien({
  //           filter: {
  //             status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
  //             like: { parameter: 'str_bien_nombre', data: e.target.value },
  //           },
  //         });
  //       } else {
  //         this.searchBien({
  //           filter: {
  //             status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
  //             like: { parameter: 'str_codigo_bien', data: e.target.value },
  //           },
  //         });
  //       }

  //     }
  //   }

  //   // this.moTabla2 = false
  //   // console.log('lo que llega ->', checkbox);
  //   // if(checkbox.checked === true){

  //   // }
  //   // console.log('lo que llega en el buscar', e.target.value)
  //   // console.log('lo que llega del sear ->', e.target.value);

  // }

  // searchBien(filter: any) {
  //   console.log('lo que llega en el buscar', filter);
  //   // this.moTabla2 = true

  //   const parametro = filter.filter?.like?.parameter;
  //   this.srvInventario
  //     .getfiltro(filter)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (resBien: any) => {
  //         const checkbox = document.getElementById("flexCheckDefaultAll") as HTMLInputElement;
  //         // const checku = document.getElementsByClassName("flexCheckUs")
  //         let aux = 0
  //         // checkbox.checked = false
  //         if (resBien.body.length > 1) {
  //           this.srvMantenimiento.datosSearch = resBien.body
  //           console.log('lo que llega del bien ->', resBien.body)
  //           this.moTabla = true
  //         } else {
  //           this.checkData(resBien.body[0].int_bien_id)
  //         }
  //         // console.log('Informacion que llega a searchCentro =>', resBien);
  //         // console.log('dentro del servicio ->', this.srvMantenimiento.datosSearch);


  //       },
  //     });
  // }

  checkData(e: any) {
    console.log('lo que llega del check ->', e)
    this.srvMantenimiento.datosSearch = []
    this.moTabla = false
    // let aux = document.getElementById('inp-Centro') as HTMLInputElement
    // aux.value = ''
    // console.log('lo que llega del click ->', e)
    // this.myForm.value.int_bien_id = parseInt(e)
    // console.log('lo que se debe poner ->', this.myForm.value.int_bien_id)

    this.srvInventario.getBienById(e)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datosbien) => {
          console.log('lo que llega del bien ->', datosbien.body)
          this.cedula_custodio = datosbien.body.str_custodio_cedula
          this.nombre_custodio = datosbien.body.str_custodio_nombre
          this.id_bien = datosbien.body.str_codigo_bien_cod
          // console.log('cedula ->>>>>>>>',  this.srvInventario.dataBienInfo.str_custodio_cedula)
          // console.log('formulario segun ', this.myForm.value.str_correctivo_cedula_custodio)
          this.srvInventario.dataBienInfo = datosbien.body
          // console.log('lo que se debe poner ->', this.srvInventario.dataBienInfo)
          this.moTabla2 = true

        },
        error: (err) => {
          console.log('error al obtener el bien', err)
        }
      })
  }

  obtenerEstadoMantenimiento() {
    Swal.fire({
      title: 'Cargando Estados...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvNivelM.getEstadoMantenimiento({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: pagEstadoMantenimiento) => {
          if (data.body.length > 0) {
            this.isData = true;
            this.isLoading = true;
            this.srvNivelM.datosEstadoMantenimiento = data.body
            // this.metadata = data.total
          }
          // console.log('lo que llega', data)
          Swal.close();
          // this.dataPagina()
        },
        error: (error) => { console.log(error) }
      })
  }

  nivelMantenimiento() {
    this.srvNivelM.getNivelMantenimiento({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: pagNivelMantenimiento) => {
          if (data.body.length > 0) {
            this.isData = true;
            this.isLoading = true;
            this.srvNivelM.datosNivelMantenimiento = data.body
            // this.metadata = data.total
          }
          // console.log('lo que llega en el nivel ->', data)
          // Swal.close();
          // this.dataPagina()
        },
        error: (error) => { console.log(error) }
      })
  }

  getNivelName(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    // console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.nivel_id = parseInt(selectedId)
    this.nivel_nombre = selectedValue
    // console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }
  getEstadoName(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    // console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.estado_id = parseInt(selectedId)
    this.estado_nombre = selectedValue
    // console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }

  getDataCreador() {
    // let respon: string
    // console.log('datos ->', this.srvPersona.dataMe);

    this.nombre_tecnico = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos

  }

  send() {
    this.myForm.value.str_codigo_bien = this.id_bien
    // this.myForm.value.str_correctivo_cedula_custodio = this.cedula_custodio
    // this.myForm.value.str_correctivo_nombre_custodio = this.nombre_custodio
    this.myForm.value.str_mantenimiento_correctivo_tecnico_responsable = this.nombre_tecnico
    this.myForm.value.int_nivel_mantenimiento_id = this.nivel_id
    this.myForm.value.str_correctivo_nivel_nombre = this.nivel_nombre
    this.myForm.value.int_estado_mantenimiento_id = this.estado_id

    const sendCorrectivo = this.myForm.value
    // console.log('lo que se envia', sendCorrectivo)
    Swal.fire({
      title: '¿Está seguro de modificar este mantenimiento?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvRegistro.putRegistroCorrectivo(this.srvRegistro.idRegistroCorrectivoModify, sendCorrectivo)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (rest) => {

              if (rest.status) {
                Swal.fire({
                  title: 'Mantenimiento creado Correctamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3500
                });
                // console.log("Res: ", rest)
              } else {
                Swal.fire({
                  title: rest.message,
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3500
                });
              }
              setTimeout(() => {
                // console.log('SettimeOut');
                // this.showCenter()
                this.obtenerRegistro()
                Swal.close();
              }, 3500);
              // this.srvInforme.typeviw = true
              this.srvMantenimiento.especial = false
              this.srvMantenimiento.typeview = false

            },
            error: (err) => {
              console.log(err)
              Swal.fire({
                title: 'No se agrego el Mantenimiento',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
              });

            },
            complete: () => {
              this.myForm.reset()

            },
          })
      }

    })
  }

  obtenerRegistro(){
    Swal.fire({
      title: 'Cargando Registros...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvRegistro.getRegistroCorrectivo({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagRegistroCorrectivo) => {
        if(data.body.length > 0){
          this.isData = true;
          // this.isLoading = true;
          // this.srvRegistroC.datosRegistroCorrectivo = data.body
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


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
