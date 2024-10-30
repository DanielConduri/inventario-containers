import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataEstadosPrestamo, EstadosPrestamoModal } from 'src/app/core/models/prestamos/gestion';
import { ModalService } from 'src/app/core/services/modal.service';
import { GestionService } from 'src/app/core/services/prestamos/gestion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-estados-p',
  templateUrl: './modificar-estados.component.html',
  styleUrls: ['./modificar-estados.component.css']
})
export class ModificarEstadosComponent implements OnInit {
  private destroy$ = new Subject<any>()

  loading = true;

  myForm !: FormGroup

  datosEstadosP!: DataEstadosPrestamo[]

  constructor(
    public srvEstadoPrestamo: GestionService,
    public fb: FormBuilder,
    public srvModal: ModalService
  ) {
    this.myForm = this.fb.group({
      descripcion: ["", [Validators.required]],
      nombre:["", [Validators.required]]
    })
   }

  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando Datos...',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      this.loading = false;
    }, 400);
    console.log('se abre por primera vez')
    console.log('llega', this.srvEstadoPrestamo.idEstados)
    this.obtenerEstadoPrestamoId(this.srvEstadoPrestamo.idEstados)
    this.srvEstadoPrestamo.SelectIdEstadoPrestamo$
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
        console.log('lo que llega ->', data)
        this.obtenerEstadoPrestamoId(data)
      
    })
  }

  obtenerEstadoPrestamoId(id: number){
    this.srvEstadoPrestamo.getEstadoPrestamoId(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (rest: any) =>{
        this.myForm = this.fb.group({
          descripcion: [rest.body.str_estado_prestamo_descripcion, [Validators.required]],
          nombre:[rest.body.str_estado_prestamo_nombre, [Validators.required]]
        })
        
        Swal.close()
      },
      error(err) {
        console.log('Error: ', err)
      },
    })
  }

  update(){
    console.log('lo que va ->', this.myForm.value)
    Swal.fire({
      title: '¿Está seguro de modificar este Estado de Prestamo?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvEstadoPrestamo.putEstadoPrestamo(this.srvEstadoPrestamo.idEstados, this.myForm.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data:any) => {
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
                this.srvEstadoPrestamo.obtenerEstadosPrestamo({})
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

}
