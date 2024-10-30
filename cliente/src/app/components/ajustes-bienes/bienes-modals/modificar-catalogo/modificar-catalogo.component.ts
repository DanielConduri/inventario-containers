import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CatalogoShowModel, modCatalogoModel } from 'src/app/core/models/Bienes/Caracteristicas/catalogo';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { MostrarCatalogoComponent } from '../mostrar-catalogo/mostrar-catalogo.component';

@Component({
  selector: 'app-modificar-catalogo',
  templateUrl: './modificar-catalogo.component.html',
  styleUrls: ['./modificar-catalogo.component.css']
})
export class ModificarCatalogoComponent implements OnInit {

  private destroy$ = new Subject<any>()

  myForm!: FormGroup;
  idCatalogo!: number;
  component!: MostrarCatalogoComponent;

  constructor(
    private srvModal:ModalService,
    private srvCaracteristicas: CaracteristcasService,
    private fb_Catalogo: FormBuilder,
  ){
    this.myForm = this.fb_Catalogo.group({
      int_catalogo_bien_id_bien: [
        null,
        [Validators.required]
      ],
      str_catalogo_bien_descripcion: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z]/)]
      ],
      int_catalogo_bien_item_presupuestario:[
        null,
        [Validators.required]
      ],
      str_catalogo_bien_cuenta_contable: [
        null,
        [Validators.required]
      ]
    });
  }

  ngOnInit(): void {
    this.completeForm();
  }

  completeForm(){
    // console.log("Recibiendo el Valor del ID PROVEEDOR =>", this.srvModal.SelectID_Catalogo$)
    this.srvModal.SelectID_Catalogo$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.idCatalogo = getId;
        this.getCatalogoID();

      },
      error: (err) => {
        console.log("Error =>",err);
      },
      complete: () => {
        Swal.close();
      }
    });
  }

  getCatalogoID(){
    this.srvCaracteristicas.getCatalogoId(this.idCatalogo)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataCatalogo: modCatalogoModel) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.myForm = this.fb_Catalogo.group({
          str_catalogo_bien_id_bien: [
            dataCatalogo.body.str_catalogo_bien_id_bien,
            [Validators.required]
          ],
          str_catalogo_bien_descripcion: [
            dataCatalogo.body.str_catalogo_bien_descripcion,
            [Validators.required, Validators.pattern(/^[a-zA-Z]/)]
          ],
          int_catalogo_bien_item_presupuestario:[
            dataCatalogo.body.int_catalogo_bien_item_presupuestario,
            [Validators.required]
          ],
          str_catalogo_bien_cuenta_contable: [
            dataCatalogo.body.str_catalogo_bien_cuenta_contable,
            [Validators.required]
          ]
        });

      },
      error: (err) => {
        console.log("Error =>",err);
      },
      complete: () => {
        Swal.close();
      }
    });
  }

  modifyCatalogo(){
    const modifyData = this.myForm.value;

    Swal.fire({
      title: '¿Está seguro que desea modificar este catalogo?',
      showDenyButton: true,
      confirmButtonText: 'Modificar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          }
        });
        this.srvCaracteristicas.putCatalogoById(this.idCatalogo, modifyData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dataCatalogo) => {
            if(dataCatalogo.status){
              Swal.fire({
                title: 'Catalogo modificado con éxito',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
              });
              this.myForm.reset();
              this.srvModal.closeModal();
            }
            setTimeout(() => {
              this.myForm.reset();
              this.getCatalogo();
            }), 3000;
          },
          error: (err) => {
            console.log("Error =>",err);
          },
          complete: () => {
            Swal.close();
            this.getCatalogo();
          }
        });
      }
    })
  }


  getCatalogo(){
    Swal.fire({
      title: 'Cargando',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.srvCaracteristicas.getCatalogo({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataCatalogo: CatalogoShowModel) => {
        Swal.close();
        this.srvCaracteristicas.datosCatalogo = dataCatalogo.body;
      },
      error: (err) => {
        console.log("Error =>",err);
      },
      complete: () => {
        this.myForm.reset();
      }
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next({})
    this.destroy$.complete()
  }


}
