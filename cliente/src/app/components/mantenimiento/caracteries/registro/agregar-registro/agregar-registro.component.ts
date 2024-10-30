import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagRegistroMantenimiento } from 'src/app/core/models/mantenimiento/registro';
import { pagSoporte } from 'src/app/core/models/mantenimiento/soporte';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-registro',
  templateUrl: './agregar-registro.component.html',
  styleUrls: ['./agregar-registro.component.css']
})
export class AgregarRegistroComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup

  isLoading: boolean = false
  isData: boolean = false;

  constructor(
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvRegistro: CaracteristicasMantenimientoService
  ) {
    this.myForm = this.fb.group({
      // idSoporte: ["", [Validators.required]],
      int_soporte_id: ["", [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.getSoporte()
  }

  getSoporte(){
    Swal.fire({
      title: 'Cargando Soportes...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvRegistro.getSoporte({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagSoporte) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvRegistro.datosSoporte = data.body
          // this.metadata = data.total
        }
        // console.log('lo que llega', this.srvTipo.datosSoporte)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  send(){
    // console.log('lo que sale->', this.myForm.value)
    Swal.fire({
      title:'¿Está seguro de añadir este Registro ?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then(( result )=>{
      if(result.isConfirmed){
        this.srvRegistro.postRegistro(this.myForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(rest)=>{
            // console.log("Res: ", rest)
            if(rest.status){
              Swal.fire({
                title:'Tipo Agregado Correctamente',
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
              title:'No se agrego el Tipo',
              icon:'error',
              showConfirmButton:false,
              timer:1500
            });
            console.log("Error:", e)
          },
          complete: () => {
            // this.showCenter()
            this.myForm.reset()
            this.srvModal.closeModal()
            // this.obtenerTipoMantenimiento()
            this.obtenerRegistro()
          }
        })
      }
    })
  }

  obtenerRegistro(){
    Swal.fire({
      title: 'Cargando Registros...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvRegistro.getRegistro({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagRegistroMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvRegistro.datosRegistro = data.body
          // this.metadata = data.total
        }
        // console.log('lo que llega', data)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {
        console.log('Error', error)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
