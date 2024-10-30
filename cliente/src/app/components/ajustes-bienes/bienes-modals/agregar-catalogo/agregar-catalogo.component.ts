import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CatalogoShowModel } from 'src/app/core/models/Bienes/Caracteristicas/catalogo';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-catalogo',
  templateUrl: './agregar-catalogo.component.html',
  styleUrls: ['./agregar-catalogo.component.css']
})
export class AgregarCatalogoComponent implements OnInit {

// Declararmos el myForm
  myForm!: FormGroup;
//Declaramos el destroy$
  private destroy$ = new Subject<any>()

//Configuramos el Constructor
  constructor(
    //Declaramos el FormBuilder
    public fb_Catalogo: FormBuilder,
    //Llmamos al servicio de caracteristicas
    public srvCaracteristicas: CaracteristcasService,
    //Llamamos al servicio de modal
    public srvModal: ModalService,
    ) {
      //Configuramos el myForm
      this.myForm = this.fb_Catalogo.group({
        str_catalogo_bien_id_bien: [
          null,
          [Validators.required, Validators.pattern(/^[0-9]/)]
        ],
        str_catalogo_bien_descripcion: [
          null,
          [Validators.required, Validators.pattern(/^[a-zA-Z]/)]
        ],
        int_catalogo_bien_item_presupuestario: [
          null,
          [Validators.required, Validators.pattern(/^[0-9]/)]
        ],
        str_catalogo_bien_cuenta_contable: [
          null,
          [Validators.required]
        ],
      })
    }

  ngOnInit(): void {
  }

  agregarCatalogo(){
    //Declaramos una constante para enviar los datos del formulario
    const sendCatalogoData = this.myForm.value;

    //Configuramos el SweetAlert
    Swal.fire({
      title:'Esta seguro de añadir este catalogo?',
      showDenyButton:true,
      //Configuramos para que no puedan dar click a las afueras del sweetalert
      allowOutsideClick:false,
      //configuramos para que no puedan usar el escape y cerrar el sweetalert
      allowEscapeKey:false,
      //Configuramos para que no puedan dar click en el boton de cancelar
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        //llamamos al servicio de caracteristicas y le enviamos los datos del formulario
        this.srvCaracteristicas.postCatalogo(sendCatalogoData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resCatalogo) => {
            // console.log("Recibiendo data del AgregarCatalogo =>", resCatalogo);
            if(resCatalogo.status){
              //Configuramos el SweetAlert
              Swal.fire({
                title:'Catalogo agregado con exito!',
                icon:'success',
                showConfirmButton:false,
                timer:1500,
              })
              // console.log("Data Agregada con exito");
            }else{
              //Configuramos el SweetAlert
              Swal.fire({
                title:'Error al agregar el catalogo',
                icon:'error',
                showConfirmButton:false,
                timer:1500,
              })
              // console.log("Error al agregar el catalogo");
            }
            //configuramos un setTiomout para que el sweetalert se cierre y luego se cierre el modal
            setTimeout(()=>{
              this.getCatalogo();
              Swal.close();
            }, 3000)
          },
          error: (err) => {
            //configuramos el mensaje de error
            // console.log("Error al agregar el catalogo =>", err);
            //Configuramos el SweetAlert
            Swal.fire({
              title:'Error al agregar el catalogo',
              icon:'error',
              showConfirmButton:false,
              timer:1500,
            })
          },
          complete: () => {
            // console.log("Petición catalogo completa");
            //configuramos un setTiomout para que el sweetalert se cierre y luego se cierre el modal
            setTimeout(()=>{
              this.getCatalogo();
              this.myForm.reset();
              this.srvModal.closeModal();
            } , 3000)
          }
        })
      }
    });
  }

  //Funcion para obtener los catalogos
  getCatalogo(){
    //llamamos al servicio de caracteristicas y le enviamos los datos del formulario
    this.srvCaracteristicas.getCatalogo({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resCatalogo: CatalogoShowModel) => {
        this.srvCaracteristicas.datosCatalogo = resCatalogo.body;
      },
      error: (err) => {
        console.log("Error al obtener los catalogos =>", err);
        //configuramos el sweetalert
        Swal.fire({
          title:'Error al obtener los catalogos',
          icon:'error',
          showConfirmButton:false,
          timer:1500,
        })
      },
      complete: () => {
        // console.log("Peticion catalogos completa");
        //reiniciamos el formulario
        this.myForm.reset();
      }
    });
  }

  //Funcion del NgDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
