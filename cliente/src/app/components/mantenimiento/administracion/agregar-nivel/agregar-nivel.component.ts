import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { pagTipoMantenimiento } from 'src/app/core/models/mantenimiento/tipoMantenimiento';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-nivel',
  templateUrl: './agregar-nivel.component.html',
  styleUrls: ['./agregar-nivel.component.css']
})
export class AgregarNivelComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup

  isLoading: boolean = false
  isData: boolean = false;

  constructor(
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvNivel: CaracteristicasMantenimientoService
  ) {
    this.myForm = this.fb.group({
      descripcion: ["", [Validators.required]],
      idTipoMantenimiento: ["", [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.getMantenimiento()
  }

  getMantenimiento(){
    Swal.fire({
      title: 'Cargando Soportes...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvNivel.getTipoMantenimiento({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagTipoMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvNivel.datosTipoMantenimiento = data.body
          // this.metadata = data.total
        }
        console.log('lo que llega', this.srvNivel.datosTipoMantenimiento)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  send(){
    console.log('valores ->', this.myForm.value)
    Swal.fire({
      title:'¿Está seguro de añadir este Nivel de Mantenimiento  ?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then(( result )=>{
      if(result.isConfirmed){
        this.srvNivel.postNivelMantenimiento(this.myForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(rest)=>{
            console.log("Res: ", rest)
            if(rest.status){
              Swal.fire({
                title:'Nivel Agregado Correctamente',
                icon:'success',
                showConfirmButton:false,
                timer:1500
              });
              console.log("Res: ", rest)
            }else{
              Swal.fire({
                title:rest.message,
                icon:'error',
                showConfirmButton:false,
                timer:1500
              });
            }
            setTimeout(() => {
              console.log('SettimeOut');
              // this.showCenter()
              Swal.close();
            }, 3000);
          },
          error: (e) => {
            Swal.fire({
              title:'No se agrego el Nivel',
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
            this.obtenerNivelMantenimiento()
          }
        })
      }
    })
  }

  obtenerNivelMantenimiento() {
    Swal.fire({
      title: 'Cargando Niveles...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvNivel.getNivelMantenimiento({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:pagNivelMantenimiento) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvNivel.datosNivelMantenimiento = data.body
          // this.metadata = data.total
        }
        console.log('lo que llega en el nivel ->', data)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

}
