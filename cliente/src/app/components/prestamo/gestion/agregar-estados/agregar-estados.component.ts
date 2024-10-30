import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { GestionService } from 'src/app/core/services/prestamos/gestion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-estados-p',
  templateUrl: './agregar-estados.component.html',
  styleUrls: ['./agregar-estados.component.css']
})
export class AgregarEstadosComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup


  constructor(
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvEstadoPrestamo: GestionService
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
    Swal.fire({
      title:'¿Está seguro de añadir este Estado de Prestamo?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then(( result )=>{
      if(result.isConfirmed){
        this.srvEstadoPrestamo.postEstadoMantenimiento(this.myForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(rest: any)=>{
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
            this.srvEstadoPrestamo.obtenerEstadosPrestamo({})
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
