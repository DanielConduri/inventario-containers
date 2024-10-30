import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from 'src/app/core/services/personas.service';
import { perfilesModel } from 'src/app/core/models/personas';
import { ModalService } from 'src/app/core/services/modal.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { rolesModel } from 'src/app/core/models/roles';
import config from 'config/config';

@Component({
  selector: 'app-agregar-perfil',
  templateUrl: './agregar-perfil.component.html',
  styleUrls: ['./agregar-perfil.component.css']
})
export class AgregarPerfilComponent implements OnInit {

  myForm!: FormGroup;
  request = false;
  idUser!: number;
  rolNombre: string[] = [];
  // status!: boolean;

  private destroy$ = new Subject<any>();

  constructor(
    public fb: FormBuilder,
    public srvPersonas: PersonasService,
    public srvModal: ModalService,
    public srvAjustes: AjustesService

  ) { 

    this.myForm = this.fb.group({

    int_per_id:[
      null,
    ],
      str_rol_nombre:[
      'Seleccione un Rol',
      [Validators.required],
    ],
    str_rol_dependencia:[
      null,
      [Validators.required],
    ]

    });
  }

  ngOnInit(): void {
    this.searchRol();
  }

  //CObtiene el ID de la persona
  getIdPorfile(){
    this.srvModal.selectIdUser$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        
      // console.log("Dentro de CompleteForme, el id es: ", getId)
      this.idUser = getId
      this.myForm.value.int_per_id = this.idUser
      // this.ggetPersona()
    },
    error: (err) => {
      console.log("error =>",err);
    },
    })
  }


  addProfile(){ 
    // console.log("Funciona el click");
    this.getIdPorfile()
    const data = this.myForm.value;
    // console.log("ADDpROFILE: ", data);

    Swal.fire({
      title: '¿Está seguro que desea agregar este perfil?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if ( result.isConfirmed) {
        this.request = true;
        this.srvPersonas
        .postPerUsuario(data)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => {
            if(res.status){
              Swal.fire({
                title: 'Perfil agregado correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
              this.myForm.reset();
              this.srvModal.closeModal();
              
            }else {
              Swal.fire({
                title: res.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 3000,
              });
            }
            // console.log('Agregar Perfil', res);
            setTimeout(() => {            
              this.myForm.reset();
              this.getPerfiles();
            }, 1500);
          },error: (error) => {
            this.myForm.reset();
            console.log('err', error);
          },
          complete:()=>{
            window.location.href = config.URL_BASE_PATH + '/welcome';

          }
        })
      }
    });
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
  


  searchRol(){
    // console.log('formulario ->', this.myForm.value.str_rol_nombre);
    this.srvAjustes.getRoles() //se llama a la funcion que se solicita en ajustes.service.ts
      .pipe(takeUntil(this.destroy$)) //
      .subscribe({
        next: (roles: rolesModel) => {
          // console.log("Roles Body =>", roles.body)
          // this.srvAjustes.datosRoles = roles.body 
          this.rolNombre = roles.body.map((rol: any) => rol.str_rol_nombre)
          Swal.close();
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
