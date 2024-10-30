import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EstadosShowModel, modEstadoModel } from 'src/app/core/models/Bienes/Caracteristicas/estados';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { MostrarEstadosComponent } from '../mostrar-estados/mostrar-estados.component';

@Component({
  selector: 'app-modificar-estados',
  templateUrl: './modificar-estados.component.html',
  styleUrls: ['./modificar-estados.component.css']
})
export class ModificarEstadosComponent implements OnInit {

  private destroy$ = new Subject<any>()
  myForm!: FormGroup;
  idEstado!: number;
  component!: MostrarEstadosComponent;

  constructor(
    private srvModal:ModalService,
    private srvCaracteristicas: CaracteristcasService,
    private fb_Estado: FormBuilder,
  ) {
    this.myForm = this.fb_Estado.group({
      str_estado_bien_nombre: [
        null,
        [Validators.required]
      ],
      str_estado_bien_estado: [
        "",
      ]
    });
  }

  ngOnInit(): void {
    this.completeForm();
  }

  completeForm(){
    // console.log("Recibiendo el Valor del ID ESTADO =>", this.srvModal.SelectID_Estado$)
    this.srvModal.SelectID_Estado$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        this.idEstado = getId;
        this.getEstadoID();
      },
      error: (err) => {
        console.log("Error =>", err)
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  getEstadoID(){
    this.srvCaracteristicas.getEstadoId(this.idEstado)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataEstado: modEstadoModel) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        this.myForm = this.fb_Estado.group({
          str_estado_bien_nombre: [
            dataEstado.body.str_estado_bien_nombre,
            [Validators.required]
          ],
          str_estado_bien_estado: [
            dataEstado.body.str_estado_bien_estado,
          ],
        });

      },
      error: (err) => {
        console.log("Error =>", err)
      },
      complete: () => {
        Swal.close();
      }
    });
  }

  modifyEstado(){
    const modifyData = this.myForm.value;
    Swal.fire({
      title: '¿Está seguro que desea modificar este estado?',
      showDenyButton: true,
      confirmButtonText: 'Modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if(result.isConfirmed){
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.srvCaracteristicas.putEstadoById(this.idEstado, modifyData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dataEstado) => {
            if(dataEstado.status){
              Swal.close();
              Swal.fire({
                title: 'Estado modificado con éxito',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
              });
              this.myForm.reset();
              this.srvModal.closeModal();
            }
            setTimeout(() => {
              this.myForm.reset();
              this.getEstadoID();
            },3000);
          },
          error: (err) => {
            console.log("Error =>", err)
          },
          complete: () => {
            this.showEstados();
          }
        });
      }
    });
  }

  showEstados(){
    Swal.fire({
      title: 'Cargando',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCaracteristicas.getEstado()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataEstado: EstadosShowModel) => {
        Swal.close();
        this.srvCaracteristicas.datosEstados = dataEstado.body;
      },
      error: (err) => {
        console.log("Error =>", err)
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
