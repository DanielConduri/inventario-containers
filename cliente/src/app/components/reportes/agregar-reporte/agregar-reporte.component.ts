import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { ReportesService } from 'src/app/core/services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-reporte',
  templateUrl: './agregar-reporte.component.html',
  styleUrls: ['./agregar-reporte.component.css']
})
export class AgregarReporteComponent implements OnInit {

  selectedCheckboxes: number = 0;
  checkboxLimit: number = 5; // Establece aquí el límite deseado
  areCheckboxesDisabled: boolean = false;

  private destroy$ = new Subject<any>()

  values: {
    marca: number,
    color: number,
    material: number,
    condicion: number,
    estado: number,
    bodega: number, 
    origen: number,
    custodio: number,
    fechaI:any
  } = {
    marca: 0,
    color: 0,
    material: 0,
    condicion: 0,
    estado: 0,
    bodega: 0, 
    origen: 0,
    custodio: 0,
    fechaI:''
  }

  origenIngreso: boolean = false
  
  myForm!: FormGroup;
  
  date!: any

  constructor(public fb: FormBuilder,
    public srvReportes: ReportesService,
    public srvModal: ModalService,) { 
    this.myForm = this.fb.group({
      // marca: new FormControl({value:'marca', disabled:true}),
      reporte_marca: [
        false, 
      ],
      reporte_color: [
        false, 
      ],
      reporte_material: [
        false, 
      ],
      reporte_condicion: [
        false, 
      ],
      reporte_estado: [
        false, 
      ],
      reporte_bodega: [
        false, 
      ],
      reporte_origen: [
        false, 
      ],
      reporte_custodios: [
        false, 
      ],
      reporte_fecha_ingreso: [
        false, 
      ],
      
    })
  }


  ngOnInit(): void {
  }

  send() {
    // for (const field in this.myForm.controls){
    //   if (this.myForm.controls.hasOwnProperty(field)){
    //     const control = this.myForm.controls[field];
    //     const value = control.value;

    //     if (value) {
    //       // console.log(`El campo ${field} está lleno.`);
    //       // this.values.push(field)
    //       // console.log('valores ->', this.values);
    //       // if(this.date){
    //       //   this.values.push(this.date)
    //       // }
          
    //     } 
    //   }
    // }

    Swal.fire({
      title:'¿Está seguro de añadir este Centro ?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then(( result )=>{
      if(result.isConfirmed){
        this.srvReportes.getPDF(this.values)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(rest:any)=>{
            // console.log("Res: ", rest)
            if(rest.status){
              Swal.fire({
                title:'Centro Agregado Correctamente',
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
              title:'No se agrego el Centro',
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
          }
        })
      }
    })
    this.myForm.reset()
  }

  onCheckboxChange(e: any, ) {
    
    this.values.marca=0
    this.values.color=0
    this.values.bodega=0
    this.values.condicion=0
    this.values.custodio=0
    this.values.estado=0
    this.values.material=0
    this.values.origen=0
    
    this.selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked').length;
    // console.log('cantidad->', this.selectedCheckboxes );
    this.areCheckboxesDisabled = this.selectedCheckboxes >= this.checkboxLimit;
    // console.log('bloqueo ->', this.areCheckboxesDisabled);
    // console.log('valor ->',this.myForm.value);
    // console.log('que arroja el e->', e.target);
    
    this.date=this.myForm.value.reporte_fecha_ingreso
   // const checked = (e.target as HTMLInputElement)?.checked
    // console.log('que es->');
    // console.log('valor individual ->', );
    switch(e.target.value){
      case '1':
        this.getIngresoOrigen()
        this.origenIngreso = true
        break
      case '2':
        this.values.color = 1
        break
      case '3':
        this.values.material = 1
        break
      case '4':
        this.values.condicion = 1
        break
      case '5':
        this.values.estado = 1
        break
      case '6':
        this.values.bodega = 1
        break
      case '7':
        this.values.origen = 1
        break
      case '8':
        this.values.custodio = 1
        break
      case '9':
        this.values.fechaI = this.myForm.value.reporte_fecha_ingreso
        break
    }

    // console.log('case ->', this.values);
  }

  getIngresoOrigen(){
    this.srvReportes.getOrigenIngreso()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:() =>{

      },
      error: (error) =>{
        console.log('Error ->', error);
      }
      
    })
  }
  

}
