import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataEstadosPrestamo } from 'src/app/core/models/prestamos/gestion';
import { ModalService } from 'src/app/core/services/modal.service';
import { GestionService } from 'src/app/core/services/prestamos/gestion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-estados',
  templateUrl: './mostrar-estados.component.html',
  styleUrls: ['./mostrar-estados.component.css']
})
export class MostrarEstadosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  isLoading: boolean = false
  isData: boolean = false;

  elementForm: {
    form: string;
    title: string;
    special: boolean;
  } = {
    form: '',
    title: '',
    special: true,
  }

  estadosPrestamo: DataEstadosPrestamo[] = [];

  constructor(private srvEstadosPrestamos: GestionService,
    private srvModal: ModalService
  ) { }

  ngOnInit(): void {
    this.srvEstadosPrestamos.obtenerEstadosPrestamo({})

    this.srvEstadosPrestamos.SelectMetadataEstadoPrestamo$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.isLoading = data.status
        this.isData = data.status
      },
      error(err) {
        console.log('Error: ', err)
      }
    })

    this.srvEstadosPrestamos.SelectDataEstadoPrestamo$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.estadosPrestamo = data;
      },
      error(err) {
        console.log('Error: ', err)
      }
    })
  }

  modificarEstado(id: number, _title: string, _form: string){
    // this.srvEstadosPrestamos.setSelectIdEstadoPrestamo(id)
    this.srvEstadosPrestamos.idEstados = id
    this.elementForm.title = _title
    this.elementForm.form = _form
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal()
  }

  deleteEstado(id: number){
    Swal.fire({
      title: '¿Está seguro que desea modificar este Estado de Prestamo?',
      showDenyButton: true,
      text: 'Al deshabilitar un Estado de Prestamo, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Estado de Prestamo...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvEstadosPrestamos.deleteEstadoPrestamo(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res:any) => {
              if (res.status) {
                Swal.fire({
                  title: 'Estado de Prestamo modificado corectamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  title: 'No se modifico el Estado de Prestamo',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              setTimeout(() => {
                Swal.close();
              }, 3000);
            },
            error: (error) => {
              console.log('err', error);
            },
            complete: () => {
              this.srvEstadosPrestamos.obtenerEstadosPrestamo({})
            },
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
