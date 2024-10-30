import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from 'src/app/core/services/personas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { personaEditModel } from 'src/app/core/models/personas';
import { MostrarUsuariosComponent } from '../../mostrar-usuarios/mostrar-usuarios.component';
import { PaginacionService } from 'src/app/core/services/paginacion.service';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();
  myForm!: FormGroup;
  idUser: number = 0;
  component!: MostrarUsuariosComponent

  constructor(
     public fbPersona: FormBuilder,
     public srvPersonas: PersonasService ,
     public srvPaginacion: PaginacionService,
     public srvModal: ModalService
  ) {
    this.myForm = this.fbPersona.group({

      per_estado:[
        "",
      ],
      per_apellidos:[
        "",
      ],
      per_nombre:[
       "",
      ],
      per_email:[
       "",
      ],
      per_cedula:[
        "",
      ],
      per_cargo:[
        null,
        [Validators.required],
      ],
      per_telefono:[
        null,
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      });
  }


  ngOnInit(): void {
    this.completeForm()
  }

  completeForm(){
    this.srvModal.selectIdUser$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });
      // console.log("Estoy rcompletar form onInit de editar Usuario....", getId)
      this.idUser = getId
      this.ggetPersona()
    },
    error: (err) => {
      console.log("error =>",err);
    },
    })
  }

  //función para obteer a la persona que se va a editar
  ggetPersona(){
    this.srvPersonas.getPersona(this.idUser)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataPers: personaEditModel) => {
        // console.log("data en", dataPers.body);
        Swal.fire({
            title: 'Cargando',
            didOpen: () => {
              Swal.showLoading()
            },
          });
        this.myForm = this.fbPersona.group({
          per_cedula:[
            dataPers.body.str_per_cedula,
            [Validators.required],
          ],
          per_estado:[
            dataPers.body.str_per_estado,
            [Validators.required],
          ],
          per_apellidos:[
            dataPers.body.str_per_apellidos,
            [Validators.required],
          ],
          per_nombre:[
            dataPers.body.str_per_nombres,
            [Validators.required],
          ],
          per_email:[
            dataPers.body.str_per_email,
            [Validators.required],
          ],
          per_cargo:[
            dataPers.body.str_per_cargo,
            [Validators.required],
          ],
          per_telefono:[
            dataPers.body.str_per_telefono,
            [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
          ],

        })

      },
      error: (err) => {
        console.log("Error =>",err);
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  modifyUsuario(){
    const modifyData = this.myForm.value;
    Swal.fire({
      title: '¿Está seguro que desea modificar este usuario?',
      showDenyButton: true,
      confirmButtonText: 'Modificar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
        Swal.fire({
          title: 'Cargando...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvPersonas.UpdateUsuarios(modifyData,  this.idUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(dataPers) =>{
            if(dataPers.status){
              Swal.close();
              Swal.fire({
                    title: 'Usuario modificado correctamente',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000,
                  });
              this.myForm.reset()
              this.srvModal.closeModal();
            }
            setTimeout(() => {
              this.myForm.reset();
              this.getPersonas();
              }, 3000);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
          }
        })
      }
    })

  }

  getPersonas() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvPersonas.getPersonasP({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {

        Swal.close();
        this.srvPersonas.datosPersonas= data.body;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
