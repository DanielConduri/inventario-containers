import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagEstadoMantenimiento } from 'src/app/core/models/mantenimiento/estadoMantenimiento';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-mantenimiento',
  templateUrl: './agregar-mantenimiento.component.html',
  styleUrls: ['./agregar-mantenimiento.component.css']
})
export class AgregarMantenimientoComponent implements OnInit {
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

  fechaActual = new Date()
  fechaValidacion!: string

  constructor(public srvMantenimiento: MantenimientoService,
    public srvInventario: InventarioService,
    public srvCaracteristicas: CaracteristcasService,
    public srvNivelM: CaracteristicasMantenimientoService,
    public srvRegistro: RegistroMantenimientoService,
    public srvPersona: PersonasService,
    public fb: FormBuilder) {

      if(this.fechaActual.getMonth() + 1 < 10){
        this.fechaValidacion = this.fechaActual.getFullYear() + '-0' + (this.fechaActual.getMonth() + 1) + '-' + this.fechaActual.getDate()
      } else {
        this.fechaValidacion = this.fechaActual.getFullYear() + '-' + (this.fechaActual.getMonth() + 1) + '-' + this.fechaActual.getDate()
      }

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
      dt_mantenimiento_correctivo_fecha_revision: [this.fechaValidacion, [Validators.required]],
      dt_mantenimiento_correctivo_fecha_entrega: ['', [Validators.required]],

    })
  }



  ngOnInit(): void {
    this.nivelMantenimiento()
    this.getDataCreador()
    this.obtenerEstadoMantenimiento()
  }

  regresar() {
    this.srvMantenimiento.especial = false
    this.srvMantenimiento.typeview = false
  }

  obtenerEstadoMantenimiento(){
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
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvNivelM.datosEstadoMantenimiento = data.body
          // this.metadata = data.total
        }
        // console.log('lo que llega', data)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
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

  changeBien(e: any) {
    this.moTabla2 = false
    // console.log('lo que llega ->', checkbox);
    // if(checkbox.checked === true){

    // }
    // console.log('lo que llega en el buscar', e.target.value)
    const length = e.target.value.length;
    if ( length > 2) {
      const textSearch = Number(e.target.value);
      // console.log('lo que sale aqui->>>>>>>>>>>>', textSearch)
      if (isNaN(textSearch)) {
        this.searchBien({
          filter: {
            status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
            like: { parameter: 'str_bien_nombre', data: e.target.value },
          },
        });
      } else {
        this.searchBien({
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
          console.log('lo que llega del search ->', resBien.body);
          const checkbox = document.getElementById("flexCheckDefaultAll") as HTMLInputElement;
          // const checku = document.getElementsByClassName("flexCheckUs")
          let aux = 0
          // checkbox.checked = false
          // console.log('Informacion que llega a searchCentro =>', resBien);
          this.srvMantenimiento.datosSearch = resBien.body
          // console.log('dentro del servicio ->', this.srvMantenimiento.datosSearch);
          this.moTabla = true
          
          
        },
      });
  }

  checkData(e: any) {
    this.srvMantenimiento.datosSearch = []
    this.moTabla = false
    this.moTabla2 = true
    let aux = document.getElementById('inp-Centro') as HTMLInputElement
    aux.value = ''
    // console.log('lo que llega del click ->', e)
    // this.myForm.value.int_bien_id = parseInt(e)
    // console.log('lo que se debe poner ->', this.myForm.value.int_bien_id)

    this.srvInventario.getBienById(e)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datosbien) => {
          // console.log('lo que llega del bien ->', datosbien.body)
          this.cedula_custodio = datosbien.body.str_custodio_cedula
          this.nombre_custodio = datosbien.body.str_custodio_nombre
          this.id_bien = datosbien.body.str_codigo_bien_cod
          this.myForm.get('int_bien_id')?.setValue(datosbien.body.int_bien_id)
          // console.log('cedula ->>>>>>>>',  this.srvInventario.dataBienInfo.str_custodio_cedula)
          // console.log('formulario segun ', this.myForm.value.str_correctivo_cedula_custodio)
          this.srvInventario.dataBienInfo = datosbien.body
          // console.log('lo que se debe poner ->', this.myForm.value.int_bien_id)

        },
        error: (err) => {
          console.log('error al obtener el bien', err)
        }
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

    console.log('lo que se envia', this.myForm.value)

    const sendCorrectivo = this.myForm.value
    // console.log('lo que se envia', sendCorrectivo)
    Swal.fire({
      title: '¿Está seguro de crear este mantenimiento?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvRegistro.postRegistroCorrectivo(sendCorrectivo)
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
