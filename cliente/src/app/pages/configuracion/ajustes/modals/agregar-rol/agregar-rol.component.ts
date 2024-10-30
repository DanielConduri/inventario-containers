import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjustesService } from '../../../../../core/services/ajustes.service';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../../../core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import config from 'config/config';

@Component({
  selector: 'app-agregar-rol',
  templateUrl: './agregar-rol.component.html',
  styleUrls: ['./agregar-rol.component.css']
})
export class AgregarRolComponent implements OnInit, OnDestroy {

  myForm!: FormGroup;
  request = false;
  private destroy$ = new Subject<any>()

  elementPagina: {
    dataLength:     number,
    metaData:       number,
    currentPage:    number
  } = {
    dataLength:     0,
    metaData:       0,
    currentPage:    0
  }

    currentPage = 1;
    metadata: any;
    mapFiltersToRequest: any = {};


  constructor(
    public fbRol:FormBuilder,
    public srvAjustes:AjustesService,
    public srvPaginacion: PaginacionService,
    public srvModal:ModalService
    ) {

      this.myForm = this.fbRol.group({
        rol_nombre: [
          "",[Validators.required, Validators.pattern(/^[a-zA-Z]/)]
        ],
        rol_descripcion: [
          "",[Validators.required]
        ]
        // rol_cod:[
        //   "",[Validators.required]
        // ]
      })

    }



  ngOnInit(): void {

  }

  //funcion para agregar un rol nuevo 

    send(){
      // console.log('Form: =>', this.myForm.value)
      const sendData = this.myForm.value
      Swal.fire({
        title:'Esta seguro de anadir este rol?',
        showDenyButton:true,
        confirmButtonText:'Agregar',
        denyButtonText:'Cancelar'
      }).then(( result )=>{
        if(result.isConfirmed){
          this.srvAjustes
          .postRoles(sendData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next:(rest)=>{
              // console.log("Res: ", rest)
              if(rest.status){
                Swal.fire({
                  title:'Rol Agregado Correctamente',
                  icon:'success',
                  showConfirmButton:false,
                  timer:1500
                });
              }else{
                Swal.fire({
                  title:rest.message,
                  icon:'error',
                  showConfirmButton:false,
                  timer:1500
                });
              }
              setTimeout(() => {
                this.showRoles()
                Swal.close();
              }, 3000);
            },
            error: (e) => {
              Swal.fire({
                title:'No se agrego el Rol',
                icon:'error',
                showConfirmButton:false,
                timer:3000
              });
              console.log("Error: ", e)
            },
            complete: () => {
              this.showRoles()
              this.myForm.reset()
              this.srvModal.closeModal()
              window.location.href = config.URL_BASE_PATH + '/welcome';

            }
          })
        }
      })
      this.myForm.reset()
    }

    //funcion para hacer una recarga a los roles 

    showRoles(){
      let mapFiltersToRequest = { size: 10, page:1, parameter: '', data: 0 };
      this.srvAjustes.getRolesP(mapFiltersToRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(roles)=>{
          this.srvAjustes.datosRoles=roles.body
        },
        error:(err)=>{
          console.log(err)
        },
        complete:()=>{
          this.myForm.reset()
        }
      })
    }

    cleanForm(){
      this.myForm.reset()
    }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
