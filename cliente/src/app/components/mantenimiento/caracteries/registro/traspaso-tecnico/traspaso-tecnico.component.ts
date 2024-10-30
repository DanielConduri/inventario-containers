import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { pagRegistroCorrectivo } from 'src/app/core/models/mantenimiento/registro';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { InformesService } from 'src/app/core/services/informes.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-traspaso-tecnico',
  templateUrl: './traspaso-tecnico.component.html',
  styleUrls: ['./traspaso-tecnico.component.css']
})
export class TraspasoTecnicoComponent implements OnInit {

  paso: number = 0
  arrNotificar: any = []
  arrBien: any = []

  idUserRespo: any = []
  userResoi: any = []
  user_Remp: any = []

  idMantenimiento!: number

  mostrar!: boolean

  idtipo!: string
  nameTipo!: string

  idRespo!: string
  nameRespo!: string

  isLoading: boolean = false
  isData: boolean = false;

  aggButton!: boolean
  checkbo!: boolean

  space: any = ' '

  private destroy$ = new Subject<any>();

  myForm!: FormGroup
  myFormSent!: FormGroup

  active: boolean = false

  constructor(
    public srvInforme: InformesService,
    public srvPersona: PersonasService,
    public srvInventario: InventarioService,
    public fb: FormBuilder,
    public srvUsuarios: AjustesService,
    public srvModal: ModalService,
    public srvMantenimiento: MantenimientoService,
    public srvRegistroC: RegistroMantenimientoService
  ) {
    this.myForm = this.fb.group({
      str_codigo_bien: ['']
    })

    this.myFormSent = this.fb.group({
      idMantenimiento: [],
      cedulaTecnico: ['']
    })

  }

  ngOnInit(): void {
    this.idUserRespo = []
    this.userResoi = []
    this.getDataCreador()
    // this.tipoD()
    this.arrNotificar.length = 0;
    this.srvMantenimiento.SelectTraspaso$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.myFormSent.value.idMantenimiento = data
          this.idMantenimiento = data
        }
      })
    
    // this.srvRegistroC.getCorrectivoById(this.idMantenimiento)
    // .pipe(takeUntil(this.destroy$))
    // .subscribe({
    //   next: (data: any) =>{

    //   }
    // })
  }

  getDataCreador() {
    let respon: string
    // console.log('datos ->', this.srvInforme.usuarioSearch);
    this.srvInforme.datosCompletos.int_per_id = this.srvPersona.dataMe.int_per_idcas
    respon = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos
    this.userResoi = [respon]
    // console.log('usuario ->', respon)
    this.idUserRespo = [this.srvPersona.dataMe.int_per_idcas]
    // console.log('responsable propio ->', this.idUserRespo);
  }

  avanzar() {
    // this.paso = this.paso + 1
    // console.log('paso ->', this.paso);
    this.aggButton = true
  }

  obtenerDatosCentralizada(e: any) {
    let cedula = document.getElementById('cedula_user') as any
    // console.log("Entra " + cedula.value);
    Swal.fire({
      title: 'Buscando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvUsuarios
      .getCentralizada(cedula.value)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          console.log(' lo que llega de la centralizada ->', res);
          this.srvInforme.usuarioSearch = res.body.nombre + this.space + res.body.apellidos
          // console.log('dentro del servicio ->', this.srvInforme.usuarioSearch);
          this.idUserRespo = [res.body.per_id]
          // this.userResoi = [this.srvInforme.usuarioSearch]
          this.user_Remp = [this.srvInforme.usuarioSearch]
          this.srvInforme.usuarioSearch = []
          // console.log('LO QUE SE LLENA', this.idUserRespo)
          this.aggButton = false
          if (res.status) {
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
          // this.datoUser()
          console.log('lo que llega', this.srvInforme.datosCompletos.int_per_id)
          if (this.idUserRespo != this.srvInforme.datosCompletos.int_per_id) {
            this.active = true
            this.mostrar = true
            this.myFormSent.value.cedulaTecnico = cedula.value
          } else {
            this.active = false
            this.mostrar = false
            Swal.fire({
              title: 'El usuario es el responsable actual',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000,
            });
            this.user_Remp = ['']

          }
        }

      }
      );
  }


  send() {
    console.log('lo que se va', this.myFormSent.value)

    Swal.fire({
      title: '¿Está seguro de realizar el traspaso?',
      showDenyButton: true,
      confirmButtonText: 'Realizar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvMantenimiento.postTraspaso(this.myFormSent.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data: any) => {
              // console.log('lo que llega', data)
              if (data.status) {
                Swal.fire({
                  title: 'Mantenimiento creado Correctamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3500
                });
                // console.log("Res: ", rest)
              } else {
                Swal.fire({
                  title: data.message,
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3500
                });
              }
              setTimeout(() => {
                // console.log('SettimeOut');
                // this.showCenter()
                Swal.close();
              }, 3500);
              this.obtenerRegistro()
            },
            error: (err) => {
              console.log(err)
            },
            complete: () => {
              this.mostrar = false
              this.myFormSent.reset()
              this.srvModal.closeModal()
            }
          })
      }

    })

  }

  obtenerRegistro(){
    Swal.fire({
      title: 'Cargando Registros...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvRegistroC.getRegistroCorrectivo({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: pagRegistroCorrectivo) => {
        console.log(data)
        if(data.body.length > 0){
          this.isData = true;
          // this.isLoading = true;
          this.srvRegistroC.datosRegistroCorrectivo = data.body
          // this.metadata = data.total
        }
        // console.log('lo que llega', data)
        Swal.close();
        // this.dataPagina()
      },
      error: (error) => {
        console.log('Error', error)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
