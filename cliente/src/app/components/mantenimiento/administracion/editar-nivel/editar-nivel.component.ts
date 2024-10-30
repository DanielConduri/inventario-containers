import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { pagSoporte } from 'src/app/core/models/mantenimiento/soporte';
import { pagTipoMantenimiento } from 'src/app/core/models/mantenimiento/tipoMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-nivel',
  templateUrl: './editar-nivel.component.html',
  styleUrls: ['./editar-nivel.component.css']
})
export class EditarNivelComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup
  myFormSent!: FormGroup

  isLoading: boolean = false
  isData: boolean = false;

  soportId!: number
  soportName!: string

  tipoId!: number
  tipoName!: string

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

  constructor(
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvNivel: CaracteristicasMantenimientoService,
    public srvPaginacion: PaginacionService,

  ) { 
    this.myForm = this.fb.group({
      descripcion: ["", [Validators.required]],
      idTipoMantenimiento: ["", [Validators.required]],
      idSoporte: ["", [Validators.required]],
      soporteNom:[""]

    })

    this.myFormSent = this.fb.group({
      descripcion: [0],
      idTipoMantenimiento: [0],
      idSoporte: [""],
    })

  }

  ngOnInit(): void {
    this.getNivelById()
    this.getTipoMantenimiento()
    this.getSoporte()
  }

  getNivelById(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvNivel.getByIdNivelM(this.srvNivel.idNivelMModify)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        console.log(data)
        Swal.close();
        this.myForm = this.fb.group({
          idTipoMantenimiento: [data.body.str_tipo_mantenimiento_nombre,],
          idSoporte:[data.body.str_soporte_nombre],
          descripcion: [data.body.str_nivel_mantenimiento_descripcion,],
          soporteNom:[data.body.str_soporte_nombre]
        })
        this.soportId = data.body.int_soporte_id
        this.tipoId = data.body.int_tipo_mantenimiento_id

        // console.log('el formulario lleno ->', this.myForm.value)
      },
      error: (error) => {console.log(error)}
    })
  }

  getTipoMantenimiento(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvNivel.getTipoMantenimiento({}).
    pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagTipoMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvNivel.datosTipoMantenimiento = data.body
          this.metadata = data.total
          // console.log('la metadata ->>>>>', this.metadata)

        }
        
        // console.log('lo que llega', data)
        Swal.close();

        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    },
    )
  }

  getSoporte() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });

    this.srvNivel.getSoporte({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagSoporte) => {
        if(data.body.length > 0){
          // this.isData = true;
          // this.isLoading = true;
          this.srvNivel.datosSoporte= data.body
        }
      },
      error: (error) => {console.log(error)},
      complete: () => {Swal.close()}
    })

  }

  selectSoporte(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    // console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.soportId = parseInt(selectedId)
    this.soportName = selectedValue
    // console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }
  selectTipo(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    // console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.tipoId = parseInt(selectedId)
    this.tipoName = selectedValue
    // console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }


  send(){
    this.myFormSent.value.idSoporte = this.soportId
    this.myFormSent.value.idTipoMantenimiento = this.tipoId
    this.myFormSent.value.descripcion = this.myForm.value.descripcion
    console.log('lo que viene en el formulario ->', this.myFormSent.value)
    Swal.fire({
      title: '¿Está seguro de modificar este Nivel de Mantenimiento ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('formulario ->',this.srvNivel.idNivelMModify, this.myForm.value);
        this.srvNivel.putNivelMantenimiento(this.srvNivel.idNivelMModify, this.myFormSent.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              if (data.status) {
                Swal.fire({
                  icon: 'success',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
              setTimeout(() => {
                this.obtenerNivelMantenimiento()
                Swal.close();
              }, 3000);
            },
            error: (err) => {
              console.log('error ->', err);
            },
            complete: () => {
              this.srvModal.closeModal()
            }
          })
      }
    })
  }
  obtenerNivelMantenimiento() {
    Swal.fire({
      title: 'Cargando Niveles...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvNivel.getNivelMantenimiento({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagNivelMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvNivel.datosNivelMantenimiento = data.body
          this.metadata = data.total
        }
        // console.log('lo que llega en el nivel ->', data)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
