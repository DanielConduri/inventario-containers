import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InformesService } from 'src/app/core/services/informes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-tipo',
  templateUrl: './modificar-tipo.component.html',
  styleUrls: ['./modificar-tipo.component.css']
})
export class ModificarTipoComponent implements OnInit {

  private destroy$ = new Subject<any>() //Se crea para que no exista desbordamiento de datos

  myForm!: FormGroup

  isLoading: boolean = false
  isData: boolean = false;

  constructor(public fb: FormBuilder,
    public srvInformes: InformesService,
    public srvModal: ModalService) {
      this.myForm = this.fb.group({
        str_tipo_documento_nombre: ["", [Validators.required]],
        str_tipo_documento_descripcion: ["",],
      })
     }

  ngOnInit(): void {
    this.modifyType()
  }

  modifyType(){
    Swal.fire({
      title: 'Cargando Tipo de Documento...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvInformes.getTiposId(this.srvInformes.idModifyT)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data:any) => {
      Swal.close()
      // console.log('lo que llega ->', data)
      this.myForm = this.fb.group({
        str_tipo_documento_nombre: [data.body.str_tipo_documento_nombre, [Validators.required]],
        str_tipo_documento_descripcion: [data.body.str_tipo_documento_descripcion,],})
      },
      error: (err) => {
        console.log('Error ->', err)
      }
    })
  }

  send(){
    // console.log('valores ->', this.myForm.value);
    Swal.fire({
      title:'¿Está seguro de modificar este Tipo de Informe ?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then(( result )=>{
      if(result.isConfirmed){
        this.srvInformes.putTipos(this.myForm.value, this.srvInformes.idModifyT)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(rest)=>{
            // console.log("Res: ", rest)
            if(rest.status){
              Swal.fire({
                title:'Tipo Modificado Correctamente',
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
            this.getTipos()
            // this.myFormAd.reset()
            this.srvModal.closeModal()
          }
        })
      }
    })
  }

  getTipos(){
    Swal.fire({
      title: 'Cargando Tipos de Informes...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvInformes.getTipos({})
    .pipe(takeUntil(this.destroy$)).
    subscribe({
      next: (data: any) => {
        if(data.body.length > 0){
          this.isData = true;
          this.srvInformes.datosTipos = data.body
          // this.metadata = roles.total
        }
        Swal.close();
        // this.pdf = data.body
//         let viewpdf = document.getElementById('ver-pdf-solicitud');
//             if (viewpdf) {
//               viewpdf.innerHTML =
//                 ' <iframe src="' +
//                 'data:application/pdf;base64,' +
//                 this.pdf +
//                 '" type="application/pdf" width="100%" height="600" />';
//             }
        // console.log('Lo que llega ->', data);
      },
      error: (err) =>{
        console.log('Error ->', err);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
