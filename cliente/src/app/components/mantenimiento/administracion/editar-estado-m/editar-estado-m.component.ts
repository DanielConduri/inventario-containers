import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagEstadoMantenimiento } from 'src/app/core/models/mantenimiento/estadoMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-estado-m',
  templateUrl: './editar-estado-m.component.html',
  styleUrls: ['./editar-estado-m.component.css']
})
export class EditarEstadoMComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup

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
    public srvModal: ModalService,
    public srvEstado: CaracteristicasMantenimientoService,
    public srvPaginacion: PaginacionService,

  ) { 
    this.myForm = this.fb.group({
      descripcion: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getEstadoMById()
  }

  getEstadoMById(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvEstado.getByIdEstadoM(this.srvEstado.idEstadoMModify)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        Swal.close();
        this.myForm = this.fb.group({
           descripcion: [data.body.str_estadoMantenimiento_descripcion, [Validators.required]],
        })
      },
      error: (error) => {console.log(error)}
    })
  }

  send(){
    Swal.fire({
      title: '¿Está seguro de modificar este Estado de Mantenimiento ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('formulario ->',this.srvEstado.idEstadoMModify,this.myForm.value);
        this.srvEstado.putEstadoMantenimiento(this.srvEstado.idEstadoMModify, this.myForm.value)
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
                this.obtenerEstadoMantenimiento()
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

  obtenerEstadoMantenimiento(){
    Swal.fire({
      title: 'Cargando Estados...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvEstado.getEstadoMantenimiento(this.mapFiltersToRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagEstadoMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvEstado.datosEstadoMantenimiento = data.body
          this.metadata = data.total
        }
        // console.log('lo que llega', data)
        Swal.close();
        this.dataPagina()

      },
      error: (error) => {console.log(error)}
    })
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvEstado.datosEstadoMantenimiento? this.srvEstado.datosEstadoMantenimiento.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
    // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
    this.obtenerEstadoMantenimiento();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
