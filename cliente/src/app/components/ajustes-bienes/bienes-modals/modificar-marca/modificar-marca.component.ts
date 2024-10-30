import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { MostrarMarcaComponent } from '../mostrar-marca/mostrar-marca.component';
import { modMarcaModel,pagMarcas } from '../../../../core/models/Bienes/Caracteristicas/marcas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-marca',
  templateUrl: './modificar-marca.component.html',
  styleUrls: ['./modificar-marca.component.css']
})
export class ModificarMarcaComponent implements OnInit {

  private destroy$ = new Subject<any>()
  myForm!: FormGroup;
  id!: number;
  component!: MostrarMarcaComponent;

  constructor(
    private srvModal: ModalService,
    private srvCaracteristicas: CaracteristcasService,
    private fb_Marca: FormBuilder,
  ) {
    this.myForm = this.fb_Marca.group({
      str_marca_nombre: [
        null,
        [Validators.required]
      ],
      str_marca_estado:[
        "",
      ]
    });
  }

  ngOnInit(): void {
    this.completeForm();
  }

   completeForm(){
    this.srvModal.SelectID_Marca$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          }
        });
        // console.log("Estoy recibiendo el id de la marca...", getId)
        this.id = getId
        this.getMarcaID();
      },
      error: (err) => {
        console.log("Error =>", err)
      }
    });
   }

   getMarcaID(){
    // console.log("data en oninit id Marca=>",this.id)
    this.srvCaracteristicas.getMarcaId(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataMarca: modMarcaModel) => {
        // console.log("Llegando data modMarcaModel =>", dataMarca.body)
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          }
        });
        this.myForm = this.fb_Marca.group({
          str_marca_nombre: [
            dataMarca.body.str_marca_nombre,
            [Validators.required]
          ],
          str_marca_estado:[
            dataMarca.body.str_marca_estado,
            [Validators.required]
          ]
        });
      },
      error:(err) =>{
        console.log("Error =>", err)
        Swal.fire({
          title: 'Error al cargar la marca!',
        });
      },
      complete: () => {
        // console.log("Complete")
        Swal.close();
      }
    });
   }

  //  Modificar marca
  // modifyMarca(id: number){
  //   Swal.fire({
  //     title: 'Esta seguro de modificar la marca?',
  //     showDenyButton: true,
  //     confirmButtonText: `Modificar`,
  //     denyButtonText: `Cancelar`,
  //   }).then((result)=>{
  //     if(result.isConfirmed){
  //       Swal.fire({
  //         title: 'Modificando marca...',
  //         didOpen: () => {
  //           Swal.showLoading()
  //         }
  //       });
  //       const modifyDataMarca = this.myForm.value
  //       this.srvCaracteristicas.putMarcaById(id, modifyDataMarca)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (dataMarca) => {
  //           if(dataMarca){
  //             Swal.fire({
  //               title: 'Marca modificada correctamente!',
  //               didOpen: () => {
  //                 console.log('Marca Cargada');
  //               },
  //             });
  //             dataMarca.message
  //             this.myForm.reset();
  //           }
  //           this.getMarcaID();
  //           setTimeout(()=>{
  //             Swal.close();
  //           }, 3000);
  //         },
  //         error: (err) => {
  //           console.log("Error =>", err)
  //         },
  //         complete: () => {
  //           this.srvModal.closeModal();
  //           this.showMarcas();
  //         }
  //       })
  //     }
  //   });
  // }

  modifyMarca(){
    // console.log("id en modifyMArca =>", this.id)
    const modifyDataMarca = this.myForm.value;
    Swal.fire({
      title: 'Esta seguro de modificar la marca?',
      showDenyButton: true,
      confirmButtonText: 'Modificar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
        Swal.fire({
          title: 'Cargando...',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        //
        this.srvCaracteristicas.putMarcaById(this.id, modifyDataMarca)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dataMarca) => {
            if(dataMarca.status){
              Swal.close();
              Swal.fire({
                title: 'Marca modificada correctamente!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500
              });
              this.myForm.reset();
              this.srvModal.closeModal();
            }
            setTimeout(()=>{
              this.myForm.reset();
              this.showMarcas();
            }, 3000);
          },
          error: (err) => {
            console.log("Error =>", err)
          },
          complete: () => {

          }
        });
      }
    })
  }

  showMarcas(){
    const mapFiltersToRequest = { size: 10, page:1, parameter: '', data: 0 };

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCaracteristicas.getMarcasP({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resMarca: pagMarcas) => {
        Swal.close();
        this.srvCaracteristicas.datosMarcas = resMarca.body;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.myForm.reset();
      }
    });
  }


   ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
   }

}
