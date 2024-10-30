import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from 'src/app/core/services/personas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { MostrarPerRolComponent } from '../../mostrar-per-rol/mostrar-per-rol.component';
import { editPorfileModel, perfilesModel } from 'src/app/core/models/personas';
import config from 'config/config';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.css']
})
export class ModificarPerfilComponent implements OnInit {

  private destroy$ = new Subject<any>();
  myForm!: FormGroup;
  idUser!: number;

  idPorfile: number = 0;
  component!: MostrarPerRolComponent

  constructor(
    public fbPorfile: FormBuilder,
    public srvPersonas: PersonasService,
    public srvModal: ModalService
  ) { 
    this.myForm = this.fbPorfile.group({
      str_rol_nombre:[
        null, [Validators.required]
      ],
      str_rol_descripcion: [""],
      str_perfil_dependencia:[
        null, [Validators.required]
      ]
    });
  }

  ngOnInit(): void {
    this.completeForm();
    // document.addEventListener('keydown', this.handleKeyDown.bind(this)); //para cerrar el modal

  }

  // handleKeyDown(event: KeyboardEvent) {
  //   // Si se presiona la tecla "Esc"
  //   if (event.key === 'Escape') {
  //     this.srvModal.closeModal();
  //   }
  // }

  completeForm(){
    this.srvModal.selectIdPorfile$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        // console.log("Dentro de CompleteForme, el id es: ", getId)
        this.idPorfile = getId
        this.getPorfile();
      },
      error: (err) => {
        console.log("error =>",err);
      },
    })
  }

  getPorfile(){
    this.srvPersonas.getPorfile(this.idPorfile)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataPerfil: editPorfileModel) => {
        // console.log("Dentro de getPorfile, Body devuelto: ", dataPerfil.body);
        Swal.fire({
          title: 'Cargando datos',
          didOpen: () => {
            Swal.showLoading()
          }
        });
        this.myForm.patchValue({
          str_rol_nombre: dataPerfil.body.str_rol_nombre,
          str_rol_descripcion: dataPerfil.body.str_rol_descripcion,
          str_perfil_dependencia: dataPerfil.body.str_perfil_dependencia
      });
    },
    error: (err) => {
      console.log("error =>",err);
    },
    complete: () => {
      Swal.close();
    }
  })
}

  modifyProfile(){
    this.getIdPorfile()
    // console.log("Dentro de modifyProfile, el id es: ", this.idPorfile);
    const modiData = this.myForm.value;
    Swal.fire({
      title: '¿Está seguro que desea modificar este perfil?',
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
        this.srvPersonas.UpdatePorfile(modiData, this.idPorfile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if(data.status){
            Swal.fire({
              title: 'Perfil modificado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
            });
            this.myForm.reset();
            this.srvModal.closeModal();
          }
          setTimeout(() => {            
            this.myForm.reset();
            this.getPerfiles();
            }, 3000);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          window.location.href = config.URL_BASE_PATH + '/welcome';

        }
      })
    }
  })
  
}

  getIdPorfile(){
    this.srvPersonas.selectData_rol$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:( data )=>{
        this.idUser = data.id;
        // console.log(" RECIBIDO EN MODIFICAR-PERFIL el idUser es: ", this.idUser)
      },
      complete:()=>{
        
      }
    })

  }

  getPerfiles(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.srvPersonas.getPerfiles(this.idUser)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: perfilesModel) => {        
        Swal.close();
        this.srvPersonas.datosPerfiles = data.body
      },error: (err) => {
        console.log(err);
      },
      complete: () =>{
      }
    }) 
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
