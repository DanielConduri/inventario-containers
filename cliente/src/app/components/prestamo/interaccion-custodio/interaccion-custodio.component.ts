import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
// import { pagCenter } from 'src/app/core/models/centros';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { PrestamosService } from 'src/app/core/services/prestamos/prestamos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-interaccion-custodio',
  templateUrl: './interaccion-custodio.component.html',
  styleUrls: ['./interaccion-custodio.component.css']
})
export class InteraccionCustodioComponent implements OnInit {
  private destroy$ = new Subject<any>();

  informacion!: any

  myForm!: FormGroup

  aux: boolean = false

  // mapFiltersToRequest: any = {};
  // ubicacion!: string

  horaEntrada!: string
  lugar!: string

  cedulaLogin!: string


  constructor(
    public srvPrestamos: PrestamosService,
    public srvInventario: InventarioService,
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvCentros: CentrosService,
    public srvPersona: PersonasService,


  ) {
    this.myForm = this.fb.group({
      str_prestamo_observacion: [''],
      int_estado_id: [0],
      int_estados_prestamo_id: [0],
      int_prestamo_estado: [],
      bl_prestamo_observacion: [],
      str_prestamo_revision_custodio: [''],
      str_prestamo_revision_persona: [''],
    })
  }

  ngOnInit(): void {
    if(this.srvPersona.dataMe.str_per_cedula.length<9){
      this.cedulaLogin = '0'+ this.srvPersona.dataMe.str_per_cedula
    }else{
      this.cedulaLogin = this.srvPersona.dataMe.str_per_cedula
    }

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvPrestamos.getPrestamoId(this.srvPrestamos.idPrestamo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data)
          this.informacion = data.body
          this.srvPrestamos.getHorario(this.informacion.int_horario_id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (data) => {
                this.horaEntrada = data.body.tm_horario_hora_inicio
                this.getDetalles(data.body.int_centro_id)
              },
              error(err) {
                console.log('Error: ', err)
              }
            })
        },
        error(err) {
          console.log('Error: ', err)
        }
      })

  }

  getDetalles(id: number) {
    this.srvCentros
      .getDetalles(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.lugar = data.body.str_centro_nombre
        },
        error: (err) => {
          console.log('error ->', err);
        },
        complete: () => {
          Swal.close();
        },
      });
  }

  aceptar() {
    this.myForm.get('int_estado_id')?.setValue(5)
    this.myForm.get('int_estados_prestamo_id')?.setValue(this.srvPrestamos.idEstados)
    this.myForm.get('int_prestamo_estado')?.setValue(1)
    Swal.fire({
      title: '¿Está seguro de Aceptar este préstamo?',
      text: 'Al aceptar esta permitiendo el préstamo de los bienes seleccionados',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
        this.srvModal.closeModal()
        this.srvPrestamos.obtenerPrestamosConEstado({})
      }
    }
    )
    // this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
    // this.srvModal.closeModal()
  }

  rechazar() {
    if (this.myForm.get('str_prestamo_observacion')?.value.length == 0) {
      this.aux = true
    }
    if (this.myForm.get('str_prestamo_observacion')?.value.length > 0) {
      this.aux = false
      this.myForm.get('int_estado_id')?.setValue(4)
      this.myForm.get('int_estados_prestamo_id')?.setValue(this.srvPrestamos.idEstados)
      this.myForm.get('int_prestamo_estado')?.setValue(2);

      Swal.fire({
        title: '¿Está seguro de Rechazar este préstamo?',
        text: 'Al rechazar este préstamo, este no podra ser aceptado nuevamente',
        showDenyButton: true,
        confirmButtonText: 'Agregar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
          this.srvModal.closeModal()
          this.srvPrestamos.obtenerPrestamosConEstado({})
        }
      }
      )
      // this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
      // this.srvModal.closeModal()
    }
  }

  finalizar() {
    this.myForm.get('int_estado_id')?.setValue(7)
    this.myForm.get('int_estados_prestamo_id')?.setValue(this.srvPrestamos.idEstados)
    // this.myForm.get('int_prestamo_estado')?.setValue(1);

    // this.myForm.get('bl_prestamo_observacion')?.setValue(true)

    console.log('el form-->', this.myForm.value)
    Swal.fire({
      title: '¿Está seguro de Finalizar este préstamo?',
      text: 'Al finalizar este préstamo, indica que el prestador ha devuelto los bienes',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('el form-->', this.myForm.value)
        this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
        this.srvModal.closeModal()
        this.srvPrestamos.obtenerPrestamosConEstado({})
      }
    }
    )
    // this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
    // this.srvModal.closeModal()
  }


  asistencia(asistencia: boolean) {
    if (asistencia) {
      this.myForm.get('int_estado_id')?.setValue(6)
      this.myForm.get('int_estados_prestamo_id')?.setValue(this.srvPrestamos.idEstados)
      // this.myForm.get('bl_prestamo_observacion')?.setValue(true)
      Swal.fire({
        title: '¿Está seguro de Marcar como Asistido?',
        text: 'Al marcar como asistido, indica que el custodio ha asistido a la cita',
        showDenyButton: true,
        confirmButtonText: 'Agregar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
          this.srvModal.closeModal()
          this.srvPrestamos.obtenerPrestamosConEstado({})
        }
      }
      )
      // this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
      // this.srvModal.closeModal()
    }
    else {
      this.myForm.get('int_estado_id')?.setValue(7)
      this.myForm.get('int_estados_prestamo_id')?.setValue(this.srvPrestamos.idEstados)
      Swal.fire({
        title: '¿Está seguro de Marcar como No Asistido?',
        text: 'Al marcar como no asistido, indica que el custodio no ha asistido a la cita',
        showDenyButton: true,
        confirmButtonText: 'Agregar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
          this.srvModal.closeModal()
          this.srvPrestamos.obtenerPrestamosConEstado({})
        }
      })
    }
  }

  obsrvaciones() {
    if(this.informacion.paso == null){
      this.myForm.get('int_estado_id')?.setValue(7)
      this.myForm.get('int_estados_prestamo_id')?.setValue(this.srvPrestamos.idEstados)
      this.myForm.get('bl_prestamo_observacion')?.setValue(true)
      this.myForm.get('int_prestamo_estado')?.setValue(2);

      Swal.fire({
        title: '¿Está seguro de enviar esta observación?',
        text: 'Al enviar esta observación, se mostrará en la información del préstamo',
        showDenyButton: true,
        confirmButtonText: 'Agregar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // this.srvPrestamos.observacion = 
          this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
          this.srvModal.closeModal()
          this.srvPrestamos.obtenerPrestamosConEstado({})
        }
      }
      )
    }
    if (this.informacion.paso == true){
      this.myForm.get('int_estado_id')?.setValue(1)
      this.myForm.get('int_estados_prestamo_id')?.setValue(this.srvPrestamos.idEstados)
      this.myForm.get('int_prestamo_estado')?.setValue(1);
      Swal.fire({
        title: '¿Está seguro de enviar esta observación?',
        text: 'Al enviar esta observación, se mostrará en la información del préstamo',
        showDenyButton: true,
        confirmButtonText: 'Agregar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // this.srvPrestamos.observacion = 
          this.srvPrestamos.actualizarPrestamo(this.srvPrestamos.idPrestamo, this.myForm.value)
          this.srvModal.closeModal()
          this.srvPrestamos.obtenerPrestamosConEstado({})
        }
      }
      )
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


}
