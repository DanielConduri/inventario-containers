import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagSoporte } from 'src/app/core/models/mantenimiento/soporte';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-soporte',
  templateUrl: './editar-soporte.component.html',
  styleUrls: ['./editar-soporte.component.css']
})
export class EditarSoporteComponent implements OnInit {

  private destroy$ = new Subject<any>()

  isLoading: boolean = false
  isData: boolean = false;

  myForm!: FormGroup

  currentPage = 1;
  metadata: any;
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

  constructor(
    public fb: FormBuilder,
    public srvSoporte: CaracteristicasMantenimientoService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService,
  ) {
    this.myForm = this.fb.group({
      nombre: ["", [Validators.required]],
      descripcion: ["", [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.idModify()
  }

  idModify() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvSoporte.getById(this.srvSoporte.idTipoSModify)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close()
          // console.log('en el editar ->', data.body)
          this.myForm = this.fb.group({
            nombre: [data.body.str_soporte_nombre],
            descripcion: [data.body.str_soporte_descripcion, [Validators.required]]

          })
        },
        error: (err) => {
          console.log(err)
        }
      })
  }


  send() {
    Swal.fire({
      title: '¿Está seguro de modificar este Tipo de Soporte ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('formulario ->', this.myForm.value);
        this.srvSoporte.putSoporte(this.srvSoporte.idTipoSModify, this.myForm.value)
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
                this.obtenerSoporte()
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

  obtenerSoporte(){
    Swal.fire({
      title: 'Cargando Soportes...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvSoporte.getSoporte({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagSoporte) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvSoporte.datosSoporte = data.body
          this.metadata = data.total
          // console.log('la metadata ->>>>>', this.metadata)
        }
        // console.log('lo que llega', data)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvSoporte.datosSoporte ? this.srvSoporte.datosSoporte.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
