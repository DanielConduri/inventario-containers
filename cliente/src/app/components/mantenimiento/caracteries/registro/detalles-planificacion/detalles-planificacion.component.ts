import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { detalleCent } from 'src/app/core/models/centros';
import { CentrosService } from 'src/app/core/services/centros.service';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-planificacion',
  templateUrl: './detalles-planificacion.component.html',
  styleUrls: ['./detalles-planificacion.component.css']
})
export class DetallesPlanificacionComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup;
  formCentro!: FormGroup;
  dataCentros!: detalleCent
  nivel!: string
  planificacion!: any

  arrayBienes: any = []

  onlyBienes: any = []

  idP!: number
  idU!: number
  // nivel!: string

  constructor(
    public srvPlanificacion: CaracteristicasMantenimientoService,
    public fb: FormBuilder,
    public srvCentros: CentrosService,
    public srvRegistro: RegistroMantenimientoService,

  ) {
    this.myForm = this.fb.group({

      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      ubicacionId: [''],
      nombreCentro: [''],
      cantidadBienes: [0,],
      codigosBienes: [[],],
      int_nivel_mantenimiento_id: [0,],
    })
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        // this.isLoading = true;
        // this.isData = true;
      },
    });
    this.srvPlanificacion.SelectIdP$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.idP = data
        }
      })
    this.srvPlanificacion.SelectUbiP$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) =>{
          // console.log('lo que llega ->', data)
          this.idU = data
        }
      })
    // this.detalles()
    // this.getDetallesC(this.idU)
    this.srvCentros.getDetalles(this.idU)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('los detalles de centro', data.body)
          this.srvPlanificacion.detallesCentro = data.body
          this.dataCentros = data.body
        },
        error: (err) => {
          console.log('error ->', err);
        },
        complete: () => {
        }
      })
      this.srvRegistro.obetnerMantenimientoP(this.idP)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('lo que llega mantenimiento ----->', data.body)
          this.onlyBienes = data.body
          console.log('imprimiendo salvacion --->', this.onlyBienes)
        }
      })
      this.srvPlanificacion.getByIdPlanificacion(this.idP)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('los detalles', data.body)
          this.planificacion = {
            inicio: data.body.dt_fecha_inicio,
            fin: data.body.dt_fecha_fin
            
          }
          this.getNivelById(data.body.int_nivel_mantenimiento_id)
          this.getBienes(data.body.bienes, this.onlyBienes)
          Swal.close();
        }
      })

      
    }
    
    descripcion(bien: any) {
      for(let i = 0; i < bien.length; i++){
      this.arrayBienes.push({
        descrip: bien[i].str_mantenimiento_descripcion
      })

      }
      console.log('funciona???', this.arrayBienes)
  }

  getNivelById(id: number){
    // console.log('lo que llega de id ->', id)
    // Swal.fire({
    //   title: 'Cargando...',
    //   didOpen: () => {
    //     Swal.showLoading();
    //     // this.isLoading = true;
    //     // this.isData = true;
    //   },
    // });
    this.srvPlanificacion.getByIdNivelM(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        // Swal.close();
        console.log('lo que llega en nivel', data)
        this.nivel = data.body.str_nivel_mantenimiento_descripcion
        // this.formNivel = this.fb.group({
        //   nivel_descripción: [data.body.str_nivel_mantenimiento_descripcion]
        // })

      },
      error: (error) => {console.log(error)}
    })
  }

  // getDetallesC(id: number) {
  //   this.srvCentros.getDetalles(id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (data: any) => {
  //         // Swal.close();
  //         console.log('los detalles de centro', data.body)
  //         this.srvPlanificacion.detallesCentro = data.body
  //         this.dataCentros = data.body
  //       },
  //       error: (err) => {
  //         console.log('error ->', err);
  //       },
  //       complete: () => {
  //         // Swal.close()
  //         // // console.log('se completa');
  //         // this.elementForm.form = 'detallesCentro'
  //         // this.elementForm.title = 'detalles'
  //         // this.srvModal.setForm(this.elementForm);
  //       }
  //     })
  // }

  getBienes(bien:any, desc:any){
    console.log('lo que va ->', bien)
    for(let i = 0; i < bien.length; i++){
      this.arrayBienes.push({
        codigo: bien[i].str_codigo_bien ,
        nombre: bien[i].str_bien_nombre,
        descrip: desc[i].str_mantenimiento_descripcion
      })
    }
    console.log('SALVADO=?', this.arrayBienes)
  }



}
