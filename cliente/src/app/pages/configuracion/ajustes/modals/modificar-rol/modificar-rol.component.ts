import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { modRolesModel } from '../../../../../core/models/roles';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { ModalService } from '../../../../../core/services/modal.service';
import { MostrarRolesComponent } from '../../mostrar-roles/mostrar-roles.component';
import { PaginacionService } from 'src/app/core/services/paginacion.service';

@Component({
  selector: 'app-modificar-rol',
  templateUrl: './modificar-rol.component.html',
  styleUrls: ['./modificar-rol.component.css']
})
export class ModificarRolComponent implements OnInit, OnDestroy {


  private destroy$ = new Subject<any>()
  myForm!: FormGroup;
  id: number = 0;
  component!: MostrarRolesComponent

  constructor(
    public fbRol: FormBuilder,
    public srvAjustes: AjustesService,
    public srvPaginacion: PaginacionService,
    public srvModal: ModalService,
  ) {

    this.myForm = this.fbRol.group({
      rol_nombre: [
        "", [Validators.required]
      ],
      rol_descripcion: [
        "", [Validators.required]
      ]
    })

  }

  ngOnInit(): void {
    this.completeForm();
  }

  completeForm() {

    this.srvModal.SelectIdRol$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (getId: number) => {

          this.id = getId
          this.ggetRol()
        },
        error: (e: any) => {
          console.log('err =>', e)
        }
      })
  }

  //funcion para llenar los parametros existentes del rol 

  ggetRol() {
    Swal.fire({
      title: 'Cargando Roles...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvAjustes.getRolId(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dataRol: modRolesModel) => {


          this.myForm = this.fbRol.group({

            rol_nombre: [ //datos que nosotros vamos a enviar
              dataRol.body.str_rol_nombre, [Validators.required]
            ],
            rol_descripcion: [
              dataRol.body.str_rol_descripcion, [Validators.required]
            ],
            rol_cod: [
              dataRol.body.str_rol_cod, [Validators.required]
            ]
          })

        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          Swal.close();
        }

      })

  }
  //////////////////////////////
  //funcion para modificar un rol existente
  modifyRol(id: number) {

    Swal.fire({
      title: '¿Está seguro que desea modificar este rol?',
      showDenyButton: true,
      confirmButtonText: 'Modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Rol...',
          didOpen: () => {
            Swal.showLoading()
          },
        });

        const modifyData = this.myForm.value
        this.srvAjustes.putRol(id, modifyData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              if (data) {
                Swal.fire({
                  title: 'Cargando Roles...',
                  didOpen: () => {
                    // console.log('cargados');
                  },
                });
                data.message
                this.myForm.reset()
              }
              this.ggetRol();
              setTimeout(() => {
                Swal.close();
              }, 3000);
            },
            error: (err) => {
              console.log('Error =>', err);
            },
            complete: () => {
              this.srvModal.closeModal()
              this.showRoles()
              
            }
          })
      }
    });
  }

  /////////////////////////////////////////////
  //funcion para recargar los roles existentes 

  showRoles() {
    let mapFiltersToRequest = { size: 10, page:1, parameter: '', data: 0 };
    
    this.srvAjustes.getRolesP(mapFiltersToRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles: any) => {
          this.srvAjustes.datosRoles = roles.body
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          this.myForm.reset()
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }
}
