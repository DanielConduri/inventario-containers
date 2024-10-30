import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import { InformesService } from 'src/app/core/services/informes.service';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-editar-mantenimiento-preventivo',
  templateUrl: './editar-mantenimiento-preventivo.component.html',
  styleUrls: ['./editar-mantenimiento-preventivo.component.css']
})


export class EditarMantenimientoPreventivoComponent implements OnInit {

  paso: number = 0
  arrNotificar: any = []
  arrBien: any = []
  manBien: any = []

  myForm!: FormGroup
  formPlanificacion!: FormGroup
  formCentro!: FormGroup
  formSent!: FormGroup
  formNivel!: FormGroup
  formSent2!: FormGroup

  descriptionForm!: FormGroup
  inventoryForm!: FormGroup

  // FormPrueba!: FormGroup

  planificacionID!: number


  bien!: string
  idSelect!: number

  nivel_id!: number
  nivel_nombre!: string

  mantenimientoId!: number

  checkbo!: boolean

  fields: any;

  cantidad!: number

  aggButton!: boolean
  userResoi: any = []
  idUserRespo: any = []
  valido!: boolean
  count: number = 0
  space: any = ' '

  responsablesBien: { [key: number]: { id: number, nombre: string, cedula: string ,int_mantenimiento_id: number } } = {}; // Estructura para guardar el responsable por bien
  responsablesBienes: any = []


  private destroy$ = new Subject<any>();


  constructor(
    public srvNivelM: CaracteristicasMantenimientoService,
    public srvInforme: InformesService,
    public srvInventario: InventarioService,
    public fb: FormBuilder,
    public srvRegistro: RegistroMantenimientoService,
    public srvCentros: CentrosService,
    public srvMantenimiento: MantenimientoService,
    public srvPersona: PersonasService,
    public srvUsuarios: AjustesService,
    private cdr: ChangeDetectorRef
  ) {


    this.formPlanificacion = this.fb.group({
      fechaInicio: ['',],
      fechaFin: ['',],
      ubicacionId: [''],
      nombreCentro: [''],
      cantidadBienes: [0,],
      codigosBienes: [[],],
      int_nivel_mantenimiento_id: [0,],
      str_planificacion_estado: ['']
    })

    this.formCentro = this.fb.group({

      // str_planificacion_centro: [''],

      int_centro_id: [''],
      str_centro_nombre: ['',],
      str_centro_tipo_nombre: ['',],
      str_centro_nombre_sede: ['',],
      str_centro_nombre_facultad: ['',],
      str_centro_nombre_dependencia: ['',],
      str_centro_nombre_carrera: ['',],
      str_centro_nombre_proceso: ['',],


    });

    this.formNivel = this.fb.group({
      nivel_descripción: [''],
      // int_nivel_mantenimiento_id:[0]
    })

    this.formSent = fb.group({
      // int_nivel_mantenimiento_id: [0],
      responsablesMantenimiento: [{}],
      bienesDescripcion: [{}],
      idPlanificacion: [0],
      estadoPlanificacion: ['']
    })

    this.descriptionForm = this.fb.group({
      description: ['',],
      code: ['',],
    });

    this.inventoryForm = this.fb.group({
      inventoryItems: this.fb.array([]),
    });

  }


  ngOnInit(): void {
    this.aggButton = true

    this.idUserRespo = []
    this.userResoi = []

    let respon: string

    this.srvNivelM.SelectUbicacionC$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.srvRegistro.ubicacionPreventivo = data
          if (data > 0) {
            this.getInfocentros(data)
          }
        }
      })
    this.srvNivelM.SelectPlanEdid
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.planificacionID = data
          this.getPlanificacionById(data)
          this.getMantenimientoID(data)
          this.getMantenimiento2(data)
        }
      })
    this.srvRegistro.SelectCantidadBienes$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
        }
      })
    this.myForm = this.fb.group({
      area: this.fb.array([])
    })
  }

  deleteUser(bienIndex: number) {
    delete this.responsablesBien[bienIndex];
    Swal.fire({
      title: 'Responsable eliminado',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }



  getMantenimiento2(id: number) {
    this.srvNivelM.dormirHoy(this.srvRegistro.idRegistroPreventivoModify)
    this.srvRegistro.obetnerMantenimientoP(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.myForm.patchValue({
            area: data.body.map((item: any) => item.str_mantenimiento_descripcion)
          });
        }
      })
  }

  getMantenimientoID(id: number) {
    this.srvRegistro.getPreventivoById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('data', data)
          for (let i = 0; i < data.body.bienes.length; i++) {
            (this.myForm.get('area') as FormArray).push(this.fb.control(''));
          }
          console.log('myForm', this.myForm.value)
          this.agregarBienes(data.body)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  getPlanificacionById(id: number) {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvNivelM.getByIdPlanificacion(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close();
          this.formPlanificacion = this.fb.group({
            fechaInicio: [data.body.dt_fecha_inicio.substring(0, 10),],
            fechaFin: [data.body.dt_fecha_fin.substring(0, 10),],
            ubicacionId: [data.body.int_ubicacion_id],
            cantidadBienes: [data.body.int_planificacion_cantidad_bienes,],
            nombreCentro: [data.body.str_planificacion_centro],
            int_nivel_mantenimiento_id: [data.body.int_nivel_mantenimiento_id,],

          })

          this.getInfocentros(data.body.int_ubicacion_id)
          this.getNivelById(data.body.int_nivel_mantenimiento_id)

        },
        error: (error) => { console.log(error) }
      })
  }



  agregarBienes(bienes: any) {
    for (let i = 0; i < bienes.bienesNombre.length; i++) {
      this.arrNotificar.push({
        cod: bienes.bienesNombre[i].str_codigo_bien,
        name: bienes.bienesNombre[i].str_nombre_bien,
        id: bienes.bienes[i].int_mantenimiento_id,
        desc: bienes.bienes[i].str_mantenimiento_descripcion,
        responsable: bienes.bienes[i].str_mantenimiento_preventivo_responsable_nombre
      })
      const newItemFormGroup = this.fb.group({
        descripcion: bienes.bienes[i].str_mantenimiento_descripcion,
        int_mantenimiento_id: bienes.bienes[i].int_mantenimiento_id,
      });

      (this.inventoryForm.get('inventoryItems') as FormArray).push(newItemFormGroup);
      this.arrBien.push(bienes.bienesNombre[i].str_codigo_bien)
    }
    console.log('arrNotificar', this.arrNotificar)
  }

  nivelMantenimiento() {
    this.srvNivelM.getNivelMantenimiento({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: pagNivelMantenimiento) => {
          if (data.body.length > 0) {
            this.srvNivelM.datosNivelMantenimiento = data.body
          }
        },
        error: (error) => { console.log(error) }
      })
  }
  getNivelById(id: number) {
    this.srvNivelM.getByIdNivelM(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.formNivel = this.fb.group({
            nivel_descripción: [data.body.str_nivel_mantenimiento_descripcion]
          })

        },
        error: (error) => { console.log(error) }
      })
  }

  getInfocentros(id: number) {
    this.srvCentros.getDetalles(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close()
          this.formCentro = this.fb.group({
            str_centro_nombre: [data.body.str_centro_nombre,],
            str_centro_tipo_nombre: [data.body.str_centro_tipo_nombre,],
            str_centro_nombre_sede: [data.body.str_centro_nombre_sede,],
            str_centro_nombre_facultad: [data.body.str_centro_nombre_facultad,],
            str_centro_nombre_dependencia: [data.body.str_centro_nombre_dependencia,],
            str_centro_nombre_carrera: [data.body.str_centro_nombre_carrera,],
            str_centro_nombre_proceso: [data.body.str_centro_nombre_proceso,],
          })
        },
        error: (err) => {
          console.log(err)
        }
      })
  }



  getNivelName(e: any) {
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.nivel_id = parseInt(selectedId)
    this.nivel_nombre = selectedValue
    this.myForm.value.int_preventivo_nivel_mantenimiento = this.nivel_id
  }


  regresar() {
    this.srvMantenimiento.preventivo = false

  }

  send() {
    this.formSent.value.bienesDescripcion = this.inventoryForm.value.inventoryItems
    const sendDataAc = this.myForm.value
    this.myForm.value.str_codigo_bien = this.arrBien
    this.formSent.value.idPlanificacion = this.planificacionID
    this.formSent.value.estadoPlanificacion = 'FINALIZADO'
    this.formSent.value.responsablesMantenimiento = [this.responsablesBien]


    Swal.fire({
      title: '¿Está seguro que desea agregar las observaciones?',
      text: 'Al confirmar se finalizará la planificación y no podrá realizar cambios',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvRegistro.putMantenimientoP(this.formSent.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              console.log(' todo bien')
            },
            error: (err) => {
              console.log(err)
            },
            complete: () => {
              this.srvMantenimiento.preventivo = false
              // this.actualizarEstado()
            }
          })
      }
    })
  }

  saved() {
    this.formSent.value.bienesDescripcion = this.inventoryForm.value.inventoryItems
    const sendDataAc = this.myForm.value
    this.myForm.value.str_codigo_bien = this.arrBien
    this.formSent.value.idPlanificacion = this.planificacionID
    this.formSent.value.estadoPlanificacion = 'EN PROCESO'
    this.formSent.value.responsablesMantenimiento = this.responsablesBienes
    // this.formSent.get('responsablesMantenimiento')?.setValue(this.responsablesBien)
    console.log('formSent', this.formSent.value)


    Swal.fire({
      title: '¿Está seguro que desea agregar las observaciones?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvRegistro.putMantenimientoP(this.formSent.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              console.log(' todo bien')
            },
            error: (err) => {
              console.log(err)
            },
            complete: () => {
              this.srvMantenimiento.preventivo = false
              // this.actualizarEstado()
            }
          })
      }
    })
  }


  observaciones(loqsea: string, e: any, i: number) {
    if (this.manBien.length > this.idSelect) {
      if (this.bien == this.manBien[this.idSelect].codigo) {
        this.manBien[this.idSelect].descripcion = this.myForm.value.area
      } else {
        this.manBien.push({
          descripcion: this.myForm.value.area[i],
          int_mantenimiento_id: loqsea
        })
      }
    } else {
      this.manBien.push({
        descripcion: this.myForm.value.area[i],
        int_mantenimiento_id: loqsea
      })
    }
    console.log('manBien', this.manBien)
    this.modiSoloUno(this.manBien)
  }

  modiSoloUno(bie: any) {
    for (let i = 0; i < bie.length; i++) {
      for (let j = 0; j < this.arrNotificar.length; j++) {
        if (this.arrNotificar[j].id == bie[i].int_mantenimiento_id) {
          this.inventoryForm.value.inventoryItems[j].descripcion = bie[i].descripcion
          console.log('inventoryItems', this.inventoryForm.value.inventoryItems)
        }
      }
    }
  }

  selectArea(id: number) {
    this.bien = ''
    this.bien = this.arrBien[id]
    this.idSelect = id
  }

  selectResponsable(id: number) {
    console.log('lo que llega ->', id)
  }

  obtenerDatosCentralizada(idMan:string ,e: any, bienIndex: number) {
    let cedula = document.getElementById(`cedula_user_${bienIndex}`) as any
    Swal.fire({
      title: 'Buscando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvUsuarios
      .getCentralizada(cedula.value)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          console.log('res', res);
          if (res.status) {
            Swal.close();
            Swal.fire({
              title: 'Usuario encontrado',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
            });
            const usuarioNombre = res.body.nombre + ' ' + res.body.apellidos;
            this.comprobarUser(bienIndex, parseInt(res.body.per_id))
            if (this.valido) {
              // this.idUserRespo.push(parseInt(res.body.per_id))
              // this.userResoi.push(this.srvInforme.usuarioSearch)
              this.responsablesBien[bienIndex] = { id: parseInt(res.body.per_id), nombre: usuarioNombre, cedula: cedula.value, int_mantenimiento_id: parseInt(idMan) };
              console.log('responsablesBien', this.responsablesBien);
              this.responsablesBienes.push({
                id: parseInt(res.body.per_id),
                nombre: usuarioNombre,
                cedula: cedula.value,
                int_mantenimiento_id: parseInt(idMan)
              })
              console.log('responsablesBienes', this.responsablesBienes);
              Swal.fire({
                title: 'Usuario añadido correctamente',
                icon: 'success',
                showDenyButton: false,
                confirmButtonText: 'Aceptar',
              });
              this.cdr.detectChanges();
            } else {
              Swal.fire({
                title: 'Usuario ya incluido en el manteniiento',
                icon: 'success',
                showDenyButton: false,
                confirmButtonText: 'Aceptar',
              });
            }
            this.srvInforme.usuarioSearch = []
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

  comprobarUser(bienIndex: number, userId: number) {
    // Verifica si el bien ya tiene un responsable con el mismo ID
    if (this.responsablesBien[bienIndex] && this.responsablesBien[bienIndex].id === userId) {
      this.valido = false; // Ya existe un responsable asignado para este bien
    } else {
      this.valido = true; // No existe responsable, se puede asignar
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
