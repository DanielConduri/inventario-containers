import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, filter, takeUntil } from 'rxjs';
import { CentralizadaModel } from 'src/app/core/models/ajustes';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { InformesService } from 'src/app/core/services/informes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-informe',
  templateUrl: './agregar-informe.component.html',
  styleUrls: ['./agregar-informe.component.css']
})
export class AgregarInformeComponent implements OnInit {

  paso: number = 0
  arrNotificar: any = []
  arrBien: any = []

  idUserRespo: any = []
  userResoi: any = []

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

  formDate!: FormGroup

  tipoInforme: {
    tipo: string[],
    cod: number[]
  } = {
      tipo: [],
      cod: []
    }
  
  valido!: boolean
  count:number = 0

  fechaActual = new Date()
  fechaValidacion!: string

  validarBoton!: boolean

  constructor(public srvPersona: PersonasService,
    public srvInforme: InformesService,
    public srvInventario: InventarioService,
    public fb: FormBuilder,
    public srvUsuarios: AjustesService,
    public srvModal: ModalService) {
      if(this.fechaActual.getMonth() + 1 < 10){
        this.fechaValidacion = this.fechaActual.getFullYear() + '-0' + (this.fechaActual.getMonth() + 1) + '-' + this.fechaActual.getDate()
      } else {
        this.fechaValidacion = this.fechaActual.getFullYear() + '-' + (this.fechaActual.getMonth() + 1) + '-' + this.fechaActual.getDate()
      }
    
    this.myForm = this.fb.group({
      // str_tipo_documento_nombre: [''],
      int_tipo_documento_id: [0, Validators.required],
      str_documento_titulo: ['', ],
      str_documento_peticion: ['', ],
      str_documento_recibe: ['', ],
      // str_documento_fecha:[''],
      str_documento_introduccion: [''],
      str_documento_desarrollo: [''],
      str_documento_conclusiones: [''],
      str_documento_recomendaciones: [''],
      str_documento_fecha: [this.fechaValidacion],
      str_documento_estado: [''],
      id_cas_responsables: [{}],
      str_nombres_responsables: [{}],
      str_codigo_bien: [{},]
    })
    this.formDate = this.fb.group({
      str_ciudad:['']
    })
  }

  ngOnInit(): void {

    this.validarBoton = false

    this.idUserRespo = []
    this.userResoi = []
    this.getDataCreador()
    this.tipoD()
    this.arrNotificar.length = 0;
    this.srvInforme.datosSearch = []
    this.arrNotificar= []

  }

  getDataCreador() {
    let respon: string
    this.srvInforme.datosCompletos.int_per_id = this.srvPersona.dataMe.int_per_idcas
    respon = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos
    this.userResoi.push(respon)
    this.idUserRespo.push(this.srvPersona.dataMe.int_per_idcas)
  }

  avanzar() {
    this.aggButton = true
  }

  regresar() {
    this.srvInforme.typeviw = true
    this.srvInforme.datosSearch = []
  }

  changeBien(e: any) {
    const length = e.target.value.length;
    if (length > 2) {
      const textSearch = Number(e.target.value);
      if (isNaN(textSearch)) {
        this.searchBien({
          filter: {
            status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
            like: { parameter: 'str_bien_nombre', data: e.target.value },
          },
        });
      } else {
        this.searchBien({
          filter: {
            status: { parameter: 'str_bien_estado', data: 'ACTIVO' },
            like: { parameter: 'str_codigo_bien', data: e.target.value },
          },
        });
      }

    }
  }

  obtenerDatosCentralizada(e: any) {
    let cedula = document.getElementById('cedula_user') as any
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
          this.srvInforme.usuarioSearch = res.body.nombre + this.space + res.body.apellidos
          this.comprobarUser(parseInt(res.body.per_id))
          if(this.valido){
            this.idUserRespo.push(parseInt(res.body.per_id))
            this.userResoi.push(this.srvInforme.usuarioSearch)
          }else{
            Swal.fire({
              title: 'Usuario ya incluido en el informe',
              icon: 'success',
              showDenyButton: false,
              confirmButtonText: 'Aceptar',
            });
          }
          this.srvInforme.usuarioSearch = []
          this.aggButton = false
        },
        error: (error) => {
          console.log('err', error);
        },
        complete: () => {
          // this.datoUser()
        }

      }
      );
  }

  comprobarUser(userId: number){
    // console.log('lo que llega a la funcion - >>', userId)
    if(this.idUserRespo.length>0){
      // console.log('entra añ if ')
      for(let i=0; i<this.idUserRespo.length; i++){
        // console.log('comparando ---------------------')
        // console.log('lo que compara ->', this.idUserRespo[i], ' este es el que llega', userId)
        if(userId == this.idUserRespo[i]){
          this.count = this.count + 1
          // this.valido = false
        }else{
          // this.valido = true
          this.count = this.count
        }
      }
    }

    if(this.count > 0){
      this.valido = false
    } else{
      this.valido = true
    }
  }

  searchBien(filter: any) {

    const parametro = filter.filter?.like?.parameter;
    this.srvInventario
      .getfiltro(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resBien: any) => {
          const checkbox = document.getElementById("flexCheckDefaultAll") as HTMLInputElement;
          let aux = 0
          checkbox.checked = false
          this.srvInforme.datosSearch = resBien.body
          for (let i = 0; i < this.srvInforme.datosSearch.length; i++) {
            let va = document.getElementById(String(i)) as any;
            if (this.arrBien.includes(this.srvInforme.datosSearch[i].str_codigo_bien)) {
              aux = aux + 1
              va.checked = true
            }
            else {
              this.checkbo = false
              va.checked = false
            }
          }
          if (aux == this.srvInforme.datosSearch.length) {
            checkbox.checked = true

          }
        },
      });
  }

  tipoD() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.srvInforme.getTipos({}).
      pipe(takeUntil(this.destroy$)).
      subscribe({
        next: (data: any) => {
          Swal.close()
          this.srvInforme.datosTipos2 = data.body
          this.tipoInforme.tipo = this.srvInforme.datosTipos2.map((fac: any) => fac.str_tipo_documento_nombre)
          this.tipoInforme.cod = this.srvInforme.datosTipos2.map((cod: any) => cod.int_tipo_documento_id)
        },
        error: (err) => {
          console.log('error ->', err);
        }
      })
  }

  getF(e: any) {
    this.validarBoton = true

    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    //
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.idtipo = selectedId
    this.nameTipo = selectedValue
    this.myForm.value.int_tipo_documento_id = selectedOption.id
    this.myForm.value.str_tipo_documento_nombre = selectedOption.value
  }

  
  send() {
    let fechaPrueba = new Date(this.myForm.value.str_documento_fecha)
    fechaPrueba.setHours(24)
    let fechaFinal = this.formDate.value.str_ciudad + ', ' + fechaPrueba.toLocaleDateString('es-ES', { weekday:"long", year:"numeric", month:"long", day:"numeric"}).replace(/,/, '').toString()
    this.myForm.value.str_documento_fecha = fechaFinal
    this.myForm.value.int_tipo_documento_id = this.idtipo
    this.myForm.value.str_tipo_documento_nombre = this.nameTipo
    this.myForm.value.str_codigo_bien = this.arrBien
    this.myForm.value.id_cas_responsables = this.idUserRespo
    this.myForm.value.str_nombres_responsables = this.userResoi
    this.myForm.value.str_documento_estado = 'DESARROLLO'
    const sendDataAc = this.myForm.value

    Swal.fire({
      title: '¿Está seguro de crear este informe ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvInforme.postInfo(sendDataAc)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (rest) => {
              if (rest.status) {
                Swal.fire({
                  title: 'Informe creado Correctamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3500
                });
              } else {
                Swal.fire({
                  title: rest.message,
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3500
                });
              }
              setTimeout(() => {
                Swal.close();
              }, 3500);
              this.srvInforme.typeviw = true
            },
            error: (e) => {
              Swal.fire({
                title: 'No se agrego el Informe',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
              });
              console.log("Error:", e)
            },
            complete: () => {
              this.myForm.reset()
            }
          })
      }
    })
  }

  getTipos() {
    Swal.fire({
      title: 'Cargando Tipos de Informes...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvInforme.getTipos({})
      .pipe(takeUntil(this.destroy$)).
      subscribe({
        next: (data: any) => {
          if (data.body.length > 0) {
            this.isData = true;
            this.srvInforme.datosTipos = data.body
            // this.metadata = roles.total
          }
          Swal.close();
          // console.log('Lo que llega ->', data);
        },
        error: (err) => {
          console.log('Error ->', err);
        }
      })
  }

  /////////////////////////////////////////
  getAllChecks() {
    this.arrNotificar = []
    this.arrBien = []
    const inputall = document.getElementById('flexCheckDefaultAll') as any;
    if (inputall.checked === true) {
      for (let i = 0; i < this.srvInforme.datosSearch.length; i++) {
        let vari = document.getElementById(String(this.srvInforme.datosSearch[i].str_codigo_bien)) as any;
        vari.checked = true;
        this.arrNotificar.push({ index: i, id: this.srvInforme.datosSearch[i].str_codigo_bien, name: this.srvInforme.datosSearch[i].str_bien_nombre });
        this.arrBien.push(this.srvInforme.datosSearch[i].str_codigo_bien)
      }
    } else {
      for (let i = 0; i < this.srvInforme.datosSearch.length; i++) {
        let vari = document.getElementById(String(this.srvInforme.datosSearch[i].str_codigo_bien)) as any;
        vari.checked = false;
        let index = this.arrNotificar.indexOf(vari.value);
        this.arrNotificar.splice(index, 1);
        this.arrBien.splice(index, 1)
      }
    }
  }

  getCheckData(e: any, iD: number, bien: any, name1: any) {
    let index = Number(iD);
    let code = document.getElementById('dato-check')
    let valor = code?.innerHTML
    let name = document.getElementById('name-check')
    let nameDato = name?.innerHTML
    let position = this.arrNotificar.findIndex((x: any) => x.index === index);
    if (e.target.checked) {
      if (!this.arrBien.includes(this.srvInforme.datosSearch[Number(iD)].str_codigo_bien)) {
        this.arrNotificar.push({
          index: Number(iD),
          id: bien,
          name: name1
        });
        this.arrBien.push(this.srvInforme.datosSearch[Number(iD)].str_codigo_bien)
        console.log('datos del check solo ->', this.arrNotificar);
      }
    } else {
      this.arrNotificar.splice(position, 1);
      this.arrBien.splice(position, 1)
    }

  }

  deleteUser(i: number) {
    this.userResoi.splice(i, 1);
    this.idUserRespo.splice(i, 1)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

