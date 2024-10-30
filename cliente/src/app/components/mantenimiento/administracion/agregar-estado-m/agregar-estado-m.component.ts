import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagEstadoMantenimiento } from 'src/app/core/models/mantenimiento/estadoMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-estado-m',
  templateUrl: './agregar-estado-m.component.html',
  styleUrls: ['./agregar-estado-m.component.css']
})
export class AgregarEstadoMComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup

  isLoading: boolean = false
  isData: boolean = false;

  constructor(
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvEstado: CaracteristicasMantenimientoService
  ) {
    this.myForm = this.fb.group({
      descripcion: ["", [Validators.required]],
      nombre:["", [Validators.required]]
    })
   }

  ngOnInit(): void {
    this.myForm.reset()
  }

  send(){
    // console.log('lo que se va ->', this.myForm.value)
    Swal.fire({
      title:'¿Está seguro de añadir este Estado de Mantenimiento ?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then(( result )=>{
      if(result.isConfirmed){
        this.srvEstado.postEstadoMantenimiento(this.myForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(rest)=>{
            // console.log("Res: ", rest)
            if(rest.status){
              Swal.fire({
                title:'Estado Agregado Correctamente',
                icon:'success',
                showConfirmButton:false,
                timer:1500
              });
              // console.log("Res: ", rest)
            }else{
              Swal.fire({
                title:rest.message,
                icon:'error',
                showConfirmButton:false,
                timer:1500
              });
            }
            setTimeout(() => {
              // console.log('SettimeOut');
              // this.showCenter()
              Swal.close();
            }, 3000);
          },
          error: (e) => {
            Swal.fire({
              title:'No se agrego el Estado',
              icon:'error',
              showConfirmButton:false,
              timer:1500
            });
            console.log("Error:", e)
          },
          complete: () => {
            this.myForm.reset()
            this.srvModal.closeModal()
            this.obtenerEstadoMantenimiento()
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
    this.srvEstado.getEstadoMantenimiento({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagEstadoMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvEstado.datosEstadoMantenimiento = data.body
        }
        // console.log('lo que llega', data)
        Swal.close();
      },
      error: (error) => {console.log(error)}
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
