import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EstadosShowModel } from 'src/app/core/models/Bienes/Caracteristicas/estados';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-estados',
  templateUrl: './agregar-estados.component.html',
  styleUrls: ['./agregar-estados.component.css']
})
export class AgregarEstadosComponent implements OnInit {

  myForm!: FormGroup;
  private destroy$ = new Subject<any>()


  constructor(
    public fb_Estado: FormBuilder,
    public srvCaracteristicas: CaracteristcasService,
    public srvModal: ModalService,
  ) {
    this.myForm = this.fb_Estado.group({
      str_estado_bien_nombre: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z]/)]
      ],
      str_estado_bien_estado: [
        'ACTIVO',
        [Validators.required]
      ]
    })
  }

  ngOnInit(): void {
  }

  agregarEstado(){
    const sendEstadoData = this.myForm.value;

    Swal.fire({
      title:'Esta seguro de añadir este estado?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        this.srvCaracteristicas.postEstados(sendEstadoData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resEstado) => {
            // console.log('Recibiendo data del AgregarEstado =>', resEstado);
            if(resEstado.status){
              Swal.fire({
                title:'Estado agregado con exito!',
                icon:'success',
                showConfirmButton:false,
                timer:1500
              })
              // console.log('Data Agregada del AgregarEstado =>', resEstado);
            }else{
              Swal.fire({
                title:'Error al agregar el Estado!',
                icon:'error',
                showConfirmButton:false,
                timer:1500
              });
            }
            setTimeout(() => {
              this.showEstados();
              Swal.close();
            }, 3000);
          },
          error: (err) => {
            console.log('Error al agregar el estado =>', err);
          },
          complete: () => {
            this.showEstados();
            this.myForm.reset();
            this.srvModal.closeModal();
          }
        });
      }
    })
  }

  showEstados(){
    this.srvCaracteristicas.getEstado()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resEstado: EstadosShowModel) => {
        this.srvCaracteristicas.datosEstados = resEstado.body;
      },
      error: (err) => {
        // console.log('Error al mostrar los estados =>', err);
      },
      complete: () => {
        this.myForm.reset();
      }
    });
  }

  cleanForm(){
    this.myForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
