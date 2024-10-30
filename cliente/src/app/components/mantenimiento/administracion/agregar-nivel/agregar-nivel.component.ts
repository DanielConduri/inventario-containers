import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { pagSoporte } from 'src/app/core/models/mantenimiento/soporte';
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

  soportId!: number
  soportName!: string

  tipoId!: number
  tipoName!: string

  // tiposM:string[] = []

  constructor(
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvNivel: CaracteristicasMantenimientoService,
    public srvSoporte: CaracteristicasMantenimientoService
  ) {
    this.myForm = this.fb.group({
      descripcion: ["", [Validators.required]],
      idSoporte: [0, [Validators.required]],
      idTipoMantenimiento: [0, [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.myForm.reset()
    this.getMantenimiento()
    this.getSoporte()
  }

  getSoporte() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });

    this.srvSoporte.getSoporte({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagSoporte) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvSoporte.datosSoporte= data.body
        }
      },
      error: (error) => {console.log(error)},
      complete: () => {Swal.close()}
    })

  }

  getMantenimiento(){
    Swal.fire({
      title: 'Cargando...',
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
        }
      },
      error: (error) => {console.log(error)},
      complete: () => {Swal.close()}
    })
  }

  selectSoporte(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    // console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.soportId = parseInt(selectedId)
    this.soportName = selectedValue
    // console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }
  selectTipo(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    // console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.tipoId = parseInt(selectedId)
    this.tipoName = selectedValue
    // console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }

  send(){
    this.myForm.value.idSoporte = this.soportId
    this.myForm.value.idTipoMantenimiento = this.tipoId
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
        // console.log('lo que llega en el nivel ->', data)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {console.log(error)}
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
