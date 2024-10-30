import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { Subject, takeUntil } from 'rxjs';
import { CentralizadaModel } from 'src/app/core/models/ajustes';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import config from 'config/config';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  dataForm!: FormGroup;


  request = false;

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

  private destroy$ = new Subject<any>();

  constructor(
    public fb: FormBuilder,
    public srvAjustes: AjustesService,
    public srvPersonas: PersonasService,
    public srvPaginacion: PaginacionService,
    public srvModal: ModalService,
   ) {

    const nombre = ''
    const apellidos = ''
    const correo = ''
    const perId = 0

this.dataForm = this.fb.group({
  per_cedula:[
    null,
    [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
  ],
  per_cargo:[
    null,
    [Validators.required],
  ],
  per_telefono:[
    null,
    [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
  ],


})

this.myForm = this.fb.group({

  per_cedula:[
      null,
      [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
    ],
    per_cargo:[
      null,
      [Validators.required],
    ],
    per_telefono:[
      null,
      [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
    ],
    per_nombre:[
      null,     [Validators.required],
    ],
    per_apellidos:[
      null,     [Validators.required],
    ],
    per_correo:[
      null,     [Validators.required],
    ]
});
}

  ngOnInit(): void {
    // document.addEventListener('keydown', this.handleKeyDown.bind(this)); //para cerrar el modal

  }
//para cerrar el modal con la tecla escape
  // handleKeyDown(event: KeyboardEvent) {
  //   // Si se presiona la tecla "Esc"
  //   if (event.key === 'Escape') {
  //     this.srvModal.closeModal();
  //   }
  // }

  // onSubmit(){
  //   this.agregarUsuario();
  // }

//Buscar usuario en la centralizada y obtención de sus datos
  obtenerDatosCentralizada(_cedula: string){
    // console.log("Entra "+_cedula);
    Swal.fire({
      title: 'Buscando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
this.srvAjustes
.getCentralizada(_cedula)
.pipe(takeUntil(this.destroy$)).subscribe({
  next: (res: CentralizadaModel) => {
    // this.srvAjustes.centralizada = res.body;
    this.myForm.get('per_nombre')?.setValue(res.body.nombre);
    this.myForm.get('per_apellidos')?.setValue(res.body.apellidos);
    this.myForm.get('per_correo')?.setValue(res.body.correo);
    if(res.status){
      Swal.close();
      Swal.fire({
        title: 'Usuario encontrado',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      Swal.close();
      Swal.fire({
        title: 'Usuario no encontrado',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,
      });
    }

  },
  error: (error) => {
    console.log('err', error);
  },
  complete: () => {
  }

})
;}

//Funcion para agregar usuario
agregarUsuario(){
  // console.log("Entra a agregar");

  this.dataForm.patchValue(this.myForm.value);
  const data = this.dataForm.value;
  Swal.fire({
    title: '¿Está seguro que desea agregar este usuario?',
    showDenyButton: true,
    confirmButtonText: 'Agregar',
    denyButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed){
      Swal.fire({
        title: 'Cargando...',
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.srvPersonas
      .postUsuarios(data)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if(res.status){
            Swal.close();
            Swal.fire({
              title: 'Usuario agregado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
            });
            this.myForm.reset();
            this.srvModal.closeModal();

          } else {
            Swal.close();
            Swal.fire({
              title: res.message,
              icon: 'error',
              showConfirmButton: false,
              timer: 3000,
            });
          }
          setTimeout(() => {
          this.myForm.reset();
            this.getPersonas();
          }, 3000);
        },
        error: (error) => {
          console.log('err', error);
        },
        complete:()=>{
          window.location.href = config.URL_BASE_PATH + '/welcome';

        }
      })
    }
  });
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
    next: (data) => {
      this.srvPersonas.datosPersonas= data.body;
      this.metadata = data.total;
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {
      this.dataPagina()
      Swal.close();
    }
  });
 }

 dataPagina(){
  this.elementPagina.dataLength = this.srvPersonas.datosPersonas ? this.srvPersonas.datosPersonas.length : 0;
  this.elementPagina.metaData = this.metadata;
  this.elementPagina.currentPage = 1
  this.srvPaginacion.setPagination(this.elementPagina)
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
