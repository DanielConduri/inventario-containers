import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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

  id_bien!: number
  cedula_custodio!: string
  nombre_custodio!: string
  nombre_tecnico!: string
  nivel_id!: number
  nivel_nombre!: string

  constructor(public srvMantenimiento: MantenimientoService,
    public srvInventario: InventarioService,
    public srvCaracteristicas: CaracteristcasService,
    public srvNivelM: CaracteristicasMantenimientoService,
    public srvRegistro: RegistroMantenimientoService,
    public srvPersona: PersonasService,
    public fb: FormBuilder) {
    this.myForm = this.fb.group({
      int_bien_id: [''],
      str_correctivo_problema: [''],
      str_correctivo_solucion: [''],
      str_correctivo_telefono: [''],
      int_correctivo_nivel_mantenimiento: [''],
      str_correctivo_nivel_nombre: [''],
      str_correctivo_tecnico_responsable: [''],
      str_correctivo_cedula_custodio: [''],
      str_correctivo_nombre_custodio: [''],
      // str_correctivo_dependencia: [''],
      dt_fecha_ingreso: ['', [Validators.required]],
      dt_fecha_entrega: ['', Validators.required],

    })
  }



  ngOnInit(): void {
    this.nivelMantenimiento()
    this.getDataCreador()

  }

  regresar() {
    // this.paso = this.paso - 1
    // this.srvInforme.typeviw = true
    // this.srvInforme.datosSearch = []
    // console.log('lo que sale ->', this.srvInforme.datosSearch);
    // this.srvMantenimiento.typeviw = true
    this.srvMantenimiento.especial = false
    this.srvMantenimiento.typeview = false
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
          console.log('lo que llega en el nivel ->', data)
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
    console.log('lo que llega en el buscar', e.target)
    const length = e.target.value.length;
    if (length % 2 === 0 && length > 2) {
      const textSearch = Number(e.target.value);
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
    console.log('lo que llega del sear ->', e.target.value);

  }

  searchBien(filter: any) {

    const parametro = filter.filter?.like?.parameter;
    this.srvInventario
      .getfiltro(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resBien: any) => {
          const checkbox = document.getElementById("flexCheckDefaultAll") as HTMLInputElement;
          // const checku = document.getElementsByClassName("flexCheckUs")
          let aux = 0
          // checkbox.checked = false
          console.log('Informacion que llega a searchCentro =>', resBien);
          this.srvMantenimiento.datosSearch = resBien.body
          console.log('dentro del servicio ->', this.srvMantenimiento.datosSearch);
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
    console.log('lo que llega del click ->', e)
    // this.myForm.value.int_bien_id = parseInt(e)
    // console.log('lo que se debe poner ->', this.myForm.value.int_bien_id)

    this.srvInventario.getBienById(e)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datosbien) => {
          console.log('lo que llega del bien ->', datosbien.body)
          this.cedula_custodio = datosbien.body.str_custodio_cedula
          this.nombre_custodio = datosbien.body.str_custodio_nombre
          this.id_bien = datosbien.body.int_bien_id
          // console.log('cedula ->>>>>>>>',  this.srvInventario.dataBienInfo.str_custodio_cedula)
          // console.log('formulario segun ', this.myForm.value.str_correctivo_cedula_custodio)
          this.srvInventario.dataBienInfo = datosbien.body
          console.log('lo que se debe poner ->', this.myForm.value.int_bien_id)

        },
        error: (err) => {
          console.log('error al obtener el bien', err)
        }
      })
  }

  getNivelName(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.nivel_id = parseInt(selectedId)
    this.nivel_nombre = selectedValue
    console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }

  getDataCreador() {
    // let respon: string
    console.log('datos ->', this.srvPersona.dataMe);

    this.nombre_tecnico = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos

  }


  send() {
    this.myForm.value.int_bien_id = this.id_bien
    this.myForm.value.str_correctivo_cedula_custodio = this.cedula_custodio
    this.myForm.value.str_correctivo_nombre_custodio = this.nombre_custodio
    this.myForm.value.str_correctivo_tecnico_responsable = this.nombre_tecnico
    this.myForm.value.int_correctivo_nivel_mantenimiento = this.nivel_id
    this.myForm.value.str_correctivo_nivel_nombre = this.nivel_nombre

    const sendCorrectivo = this.myForm.value

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
                  title: 'Informe creado Correctamente',
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
                console.log('SettimeOut');
                // this.showCenter()
                Swal.close();
              }, 3500);
              // this.srvInforme.typeviw = true
              this.srvMantenimiento.especial = false
              this.srvMantenimiento.typeview = false

            },
            error: (err) => {
              Swal.fire({
                title: 'No se agrego el Informe',
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

}
