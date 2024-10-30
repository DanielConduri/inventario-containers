import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagSoporte } from 'src/app/core/models/mantenimiento/soporte';
import { pagTipoMantenimiento } from 'src/app/core/models/mantenimiento/tipoMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-tipo-soporte',
  templateUrl: './editar-tipo.component.html',
  styleUrls: ['./editar-tipo.component.css']
})
export class EditarTipoComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup
  myFormSent!: FormGroup

  isLoading: boolean = false
  isData: boolean = false;

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
    public srvTipo: CaracteristicasMantenimientoService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,


  ) { 
    this.myFormSent = this.fb.group({
      // idSoporte: ["", [Validators.required]],
      // idTipoM: ["", [Validators.required]],
      descripcion: ["", [Validators.required]],
    })
    this.myForm = this.fb.group({
      // idSoporte: [0, [Validators.required]],
      descripcion: ['', [Validators.required]],
      nombre: ['', [Validators.required]]
    })

  }

  ngOnInit(): void {
    // console.log('lo que llega del ver')
    this.idModify()
    this.getSoporte()
  }

  getSoporte(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvTipo.getSoporte({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagSoporte) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvTipo.datosSoporte = data.body
          // this.metadata = data.total
        }
        // console.log('lo que llega', this.srvTipo.datosSoporte)
        // Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  idModify(){
    this.srvTipo.getByIdTipoM(this.srvTipo.idTipoMModify)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:any) => {
        Swal.close()
        console.log('lo que llega', data.body)
        // this.getSoportebyId(data.body.int_tipo_mantenimiento_id)
        this.myForm = this.fb.group({
          nombre: [data.body.str_tipo_mantenimiento_nombre, ],
          descripcion: [data.body.str_tipo_mantenimiento_descripcion, [Validators.required]],
        })
      },
      error: (err) =>{
        console.log(err)
      }
    })
  }

  send(){
    this.myFormSent.value.descripcion = this.myForm.value.descripcion
    Swal.fire({
      title: '¿Está seguro de modificar este Tipo de Mantenimiento ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('formulario ->',this.srvTipo.idTipoMModify ,this.myForm.value);
        this.srvTipo.putTipoMantenimiento(this.srvTipo.idTipoMModify, this.myFormSent.value)
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
                this.obtenerTipoMantenimiento()
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

  obtenerTipoMantenimiento() {
    Swal.fire({
      title: 'Cargando Tipos de Mantenimiento...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvTipo.getTipoMantenimiento(this.mapFiltersToRequest).
    pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagTipoMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvTipo.datosTipoMantenimiento = data.body
          this.metadata = data.total
          // console.log('la metadata ->>>>>', this.metadata)

        }
        
        // console.log('lo que llega', data)
        Swal.close();

        this.dataPagina()
      },
      error: (error) => {console.log(error)}
    },
    )
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvTipo.datosTipoMantenimiento ? this.srvTipo.datosTipoMantenimiento.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerTipoMantenimiento();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
