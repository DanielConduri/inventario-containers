import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { InformesService } from 'src/app/core/services/informes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-informe',
  templateUrl: './modificar-informe.component.html',
  styleUrls: ['./modificar-informe.component.css']
})


export class ModificarInformeComponent implements OnInit {

  paso: number = 0
  arrNotificar: any = []
  arrBien: any = []
  respon!: string

  idUserRespo: any = []
  userResoi: any = []

  idtipo!: string
  nameTipo!: string

  idRespo!: string
  nameRespo!: string

  isLoading: boolean = false
  isData: boolean = false;

  aggButton!: boolean

  space: any = ' '

  iniTipo!: number
  iniPer: {
    int_documento_id: number,
    int_per_id: number,
    str_per_nombres: string
  } = {
      int_documento_id: 0,
      int_per_id: 0,
      str_per_nombres: ''
    }

  private destroy$ = new Subject<any>();

  myForm!: FormGroup

  formDate!: FormGroup
  mesReady!: string
  // meses
  //  meses = {
  //   enero: 1,
  //   febrero: 2,
  //   marzo: 3,
  //   abril: 4,
  //   mayo: 5,
  //   junio: 6,
  //   julio: 7,
  //   agosto: 8,
  //   septiembre: 9,
  //   octubre: 10,
  //   noviembre: 11,
  //   diciembre: 12
  // };
  partes!:any
  fe!:any
  fechaDefinitiva!:any
  tipoInforme: {
    tipo: string[],
    cod: number[]
  } = {
      tipo: [],
      cod: []
    }
    

  constructor(public srvPersona: PersonasService,
    public srvInforme: InformesService,
    public srvInventario: InventarioService,
    public fb: FormBuilder,
    public srvUsuarios: AjustesService,
    public srvModal: ModalService) {
    this.myForm = this.fb.group({
      // str_tipo_documento_nombre: [''],
      int_tipo_documento_id: [0,],
      str_documento_titulo: ['', [Validators.required]],
      str_documento_peticion: [''],
      str_documento_recibe: [''],
      str_documento_introduccion: [''],
      str_documento_desarrollo: [''],
      str_documento_conclusiones: [''],
      str_documento_recomendaciones: [''],
      str_documento_fecha: [''],
      str_documento_estado: [''],
      id_cas_responsables: [{}],
      str_nombres_responsables: [{}],
      str_codigo_bien: [{}]
    })
    this.formDate = this.fb.group({
      str_ciudad: ['']
    })
  }

  ngOnInit(): void {
    this.srvInforme.permisosInforme = true
    this.getDataCreador()
    this.getInfId()
    this.idUserRespo = []
    this.userResoi = []

    this.tipoD()
    // console.log('lo que viene del id ->', this.srvInforme.datosArr);
  }

  // funcionMes(mesEscrito: string){
  //   console.log('lo que llega', mesEscrito)
  //   const  meses = {
  //     enero: 1,
  //     febrero: 2,
  //     marzo: 3,
  //     abril: 4,
  //     mayo: 5,
  //     junio: 6,
  //     julio: 7,
  //     agosto: 8,
  //     septiembre: 9,
  //     octubre: 10,
  //     noviembre: 11,
  //     diciembre: 12
  //   };
  //   const mesMinusculas = mesEscrito.toLowerCase();
  //   return meses[mesMinusculas]
  // }

  funcionMes(mesEscrito: string){
    switch(mesEscrito){
      case 'enero':
        this.mesReady = '1'
        break
      case 'febrero':
        this.mesReady = '2'
        break
      case 'marzo':
        this.mesReady = '3'
        break
      case 'abril':
        this.mesReady = '4'
        break
      case 'mayo':
        this.mesReady = '5'
        break
      case 'junio':
        this.mesReady = '6'
        break
      case 'julio':
        this.mesReady = '7'
        break
      case 'agosto':
        this.mesReady = '8'
        break
      case 'septiembre':
        this.mesReady = '9'
        break
      case 'octubre':
        this.mesReady = '10'
        break
      case 'noviembre':
        this.mesReady = '11'
        break
      case 'diciembre':
        this.mesReady = '12'
        break
    }
  }

  getInfId() {
    


    this.srvInforme.getInfed(this.srvInforme.idInf)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.fire({
            title: 'Cargando',
            didOpen: () => {
              Swal.showLoading()
            },
          });
          // this.iniTipo = data.body.int_tipo_documento_id
          
          // console.log('lo que llega edid ->', data);
          this.srvInforme.datosArr = data.body
          if(data.body.str_documento_fecha != 'Invalid Date'){
            this.partes = data.body.str_documento_fecha.split(',')
            let fechaprueba = this.partes[1].replace(' ', '').trim()
            // console.log('lo que sale de prueba fecha', fechaprueba.match(/(\d{1,2}) de (\w+) de (\d{4})/))
            let fechaseparada = fechaprueba.match(/(\d{1,2}) de (\w+) de (\d{4})/)
            // console.log('la fecha separada -> ', fechaseparada)
            // let fechaUnida = fechaseparada[3] + '-' + fechaseparada[2] + '-' + fechaseparada[1]
            // console.log('la fecha unida -> ', fechaUnida)
            this.funcionMes(fechaseparada[2])
  
            this.fechaDefinitiva = fechaseparada[3] + '-' + this.mesReady + '-' + fechaseparada[1]
            this.fe = new Date(this.fechaDefinitiva)
          }else {
            this.partes[0] = ['']
            this.fe = new Date('2024-01-01')
          }

          // const fechaFormateada = `${anio}-${mes.toString().padStart (2, '0')}-${dia.toString().padStart(2, '0')}`;

          // console.log('lo que sale de partes', this.fe.toISOString())
          // console.log('lo que sale de partes', this.fe.toUTCString())

          // console.log('lo que llega edid al servicio ->', this.srvInforme.datosArr);
          this.myForm = this.fb.group({
            // int_tipo_documento_id: [],
            str_documento_titulo: [data.body.str_documento_titulo, [Validators.required]],
            str_documento_peticion: [data.body.str_documento_peticion],
            str_documento_recibe: [data.body.str_documento_recibe],
            str_documento_introduccion: [data.body.str_documento_introduccion],
            str_documento_desarrollo: [data.body.str_documento_desarrollo],
            str_documento_conclusiones: [data.body.str_documento_conclusiones],
            str_documento_recomendaciones: [data.body.str_documento_recomendaciones],
            str_documento_fecha: [this.fe.toISOString().substring(0, 10)],
            // int_per_id: [{id:[data.body.int_per_id]}],
            str_codigo_bien: [{}]
          })
          this.formDate = this.fb.group({
            str_ciudad: [this.partes[0]]
          })
          this.iniTipo = data.body.int_tipo_documento_id
          this.iniPer = data.body.personas
          this.respon = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos

          // console.log('id ->', this.srvInforme.datosCompletos);
          for (let i = 0; i < data.body.personas.length; i++) {
            const nombre = data.body.personas[i].str_per_nombres;
            const ids = data.body.personas[i].int_per_id;
            if (!this.userResoi.includes(this.respon)) {
              this.userResoi.push(this.respon)
              this.idUserRespo.push(this.srvInforme.datosCompletos.int_per_id)
              // console.log('id ->', this.idUserRespo);
            }
            if (!this.userResoi.includes(nombre)) {
              // console.log('si hay nombre ------->', this.userResoi);
              this.userResoi.push(data.body.personas[i].str_per_nombres)
              // console.log('id ->', this.idUserRespo);
            }
            if (!this.idUserRespo.includes(ids)) {
              // console.log('id ->', this.idUserRespo);
              this.idUserRespo.push(data.body.personas[i].int_per_id)
            }
          }
          // console.log('nombres ->', this.userResoi);
          // console.log('id ->', this.idUserRespo);

          for (let i = 0; i < data.body.bienes.length; i++) {
            // console.log('datos bien ->', data.body.bienes[i].str_bien_nombre);
            this.arrNotificar.push({ index: i, id: data.body.bienes[i].str_codigo_bien, name: data.body.bienes[i].str_bien_nombre })
            this.arrBien.push(data.body.bienes[i].str_codigo_bien)
          }
        },
        error: (err) => {
          console.log('Error ->', err);
        },
        complete: () => {
          Swal.close();
        }
      })
  }


  getDataCreador() {
    let respon: string
    // console.log('datos ->', this.srvPersona.dataMe);
    this.srvInforme.datosCompletos.int_per_id = this.srvPersona.dataMe.int_per_idcas
    respon = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos
    this.userResoi.push(respon)
    this.idUserRespo.push(this.srvPersona.dataMe.int_per_idcas)
  }

  avanzar() {
    // this.paso = this.paso + 1
    // console.log('paso ->', this.paso);
    this.aggButton = true
  }

  regresar() {
    // this.paso = this.paso - 1
    this.srvInforme.typeviw = true
    this.srvInforme.datosSearch = []
    // console.log('lo que sale ->', this.srvInforme.datosSearch);
  }

  changeBien(e: any) {
    const length = e.target.value.length;
    if (length % 2 === 0 && length > 2) {
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
    // console.log('lo que llega del sear ->', e.target.value);

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
          // console.log(' lo que llega de la centralizada ->', res);
          this.srvInforme.usuarioSearch = res.body.nombre + this.space + res.body.apellidos
          // console.log('dentro del servicio ->', this.srvInforme.usuarioSearch);
          this.idUserRespo.push(res.body.per_id)
          this.userResoi.push(this.srvInforme.usuarioSearch)
          this.srvInforme.usuarioSearch = []
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
        }

      }
      );
  }

  // changeUsuario(e: any) {
  //   const length = e.target.value.length;
  //   if (length % 2 === 0 && length > 2) {
  //     const textSearch = Number(e.target.value);
  //     if (isNaN(textSearch)) {
  //       this.searchUser({
  //         filter: {
  //           status: { parameter: 'str_per_estado', data: 'ACTIVO' },
  //           like: { parameter: 'str_per_nombres', data: e.target.value },
  //         },
  //       });
  //     } else {
  //       this.searchUser({
  //         filter: {
  //           status: { parameter: 'str_per_estado', data: 'ACTIVO' },
  //           like: { parameter: 'str_per_apellidos', data: e.target.value },
  //         },
  //       });
  //     }
  //     if (isNaN(textSearch)) {
  //       this.searchUser({
  //         filter: {
  //           status: { parameter: 'str_per_estado', data: 'ACTIVO' },
  //           like: { parameter: 'str_per_cedula', data: e.target.value },
  //         },
  //       });
  //     }

  //   }
  //   console.log('lo que llega del sear ->', e.target.value);

  // }

  searchBien(filter: any) {
    const parametro = filter.filter?.like?.parameter;
    this.srvInventario
      .getfiltro(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resBien: any) => {
          // console.log('Informacion que llega a searchCentro =>', resBien);
          this.srvInforme.datosSearch = resBien.body
          // console.log('dentro del servicio ->', this.srvInforme.datosSearch);
        },
      });
  }

  // searchUser(filter: any) {
  //   const parametro = filter.filter?.like?.parameter;
  //   this.srvPersona
  //     .getPersonasFiltro(filter)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (resUser: any) => {
  //         console.log('Informacion que llega a searchCentro =>', resUser);
  //         this.srvInforme.usuarioSearch = resUser.body
  //         console.log('dentro del servicio ->', this.srvInforme.usuarioSearch);
  //       },
  //     });
  // }

  // datoUser(e: any) {
  //   console.log('lo que llega del select user', e.target);
  //   this.idUserRespo.push(parseInt(e.target.id))
  //   let nameUser = document.getElementById('inp-Centro')
  //   // let nameUser = document.getElementsByClassName("nameUserRespo")
  //   let val = nameUser?.innerHTML
  //   val == ''
  //   console.log('agarrando con el id ->', e.target.textContent);
  //   this.userResoi.push(e.target.textContent)
  //   console.log('lo que tiene los id ->', this.idUserRespo);
  //   console.log('lo que sale de nombres ->', this.userResoi);
  //   this.srvInforme.usuarioSearch = []
  //   this.aggButton = false
  // }

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
          // console.log('datos tipos -->', data);
          this.srvInforme.datosTipos2 = data.body

          this.tipoInforme.tipo = this.srvInforme.datosTipos2.map((fac: any) => fac.str_tipo_documento_nombre)
          this.tipoInforme.cod = this.srvInforme.datosTipos2.map((cod: any) => cod.int_tipo_documento_id)

          // console.log('datos var ->', this.tipoInforme);
        },
        error: (err) => {
          console.log('error ->', err);
        }
      })
  }

  getF(e: any) {
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    //
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.idtipo = selectedId
    this.nameTipo = selectedValue
    // console.log('e ->', selectedOption);
    this.myForm.value.int_tipo_documento_id = selectedOption.id
    this.myForm.value.str_tipo_documento_nombre = selectedOption.value
    // console.log('en el form ->', this.myForm.value.int_tipo_documento_id);
    // this.myForm.value.int_per_id = this.srvPersona.dataMe.int_per_id
    // console.log('datos formulario', this.myForm.value);

  }

  send(a: string) {
    // console.log('lo que llega de fecha', this.myForm.value.str_documento_fecha)
    let fechaPrueba = new Date(this.myForm.value.str_documento_fecha)
    fechaPrueba.setHours(24)
    // console.log('probando', fechaPrueba.toUTCString())
    // console.log('probando', fechaPrueba.toLocaleDateString('es-ES', { weekday: "long", year: "numeric", month: "long", day: "numeric" }))
    // console.log('probando', fechaPrueba.toLocaleTimeString())
    // console.log('proando una vez mas', this.myForm.value.str_documento_fecha.toLocaleDateString('es-ES', { weekday:"long", year:"numeric", month:"long", day:"numeric"}))
    // console.log('lo que viene de ciudad', this.formDate.value.str_ciudad)
    let fechaFinal = this.formDate.value.str_ciudad + ', ' + fechaPrueba.toLocaleDateString('es-ES', { weekday: "long", year: "numeric", month: "long", day: "numeric" }).replace(/,/, '').toString()
    this.myForm.value.str_documento_fecha = fechaFinal
    if (this.idtipo) {
      this.myForm.value.int_tipo_documento_id = this.idtipo
      this.myForm.value.str_tipo_documento_nombre = this.nameTipo
    } else {
      this.myForm.value.int_tipo_documento_id = this.iniTipo
    }

    if (a == 'g') {
      this.myForm.value.str_documento_estado = 'DESARROLLO'
    } else {
      this.myForm.value.str_documento_estado = 'FINALIZADO'
    }

    this.myForm.value.str_codigo_bien = this.arrBien
    this.myForm.value.id_cas_responsables = this.idUserRespo
    this.myForm.value.str_nombres_responsables = this.userResoi
    // console.log('en el form ->', this.myForm.value.int_tipo_documento_id);

    // console.log(this.myForm.value);

    const sendDataAc = this.myForm.value
    // console.log('el enviar ->', sendDataAc);

    if (a === 'g') {
      Swal.fire({
        title: '¿Está seguro modificar este informe? Al guardar puede volver a editar',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.srvInforme.postInfoEd(sendDataAc, this.srvInforme.idInf)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (rest) => {
                // console.log("Res: ", rest)
                if (rest.status) {
                  // console.log('en el if------->');
                  Swal.fire({
                    title: 'Informe modificado Correctamente',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                  });
                  // console.log("Res: ", rest)
                } else {
                  Swal.fire({
                    title: rest.message,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
                setTimeout(() => {
                  // console.log('SettimeOut');
                  // this.showCenter()
                  Swal.close();
                }, 3000);
                this.srvInforme.typeviw = true
              },
              error: (e) => {
                Swal.fire({
                  title: 'No se modifico el informe',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500
                });
                console.log("Error:", e)
              },
              complete: () => {
                // this.srvInforme.typeviw = true

                // this.showCenter()
                this.myForm.reset()
                // this.myFormAd.reset()
                this.srvModal.closeModal()
              }
            })
        }
      })
    } else if (a === 'f') {
      // this.srvInforme.permisosInforme = false
      Swal.fire({
        title: '¿Está seguro modificar este informe? Una vez que finaliza no se puede volver a editar',
        showDenyButton: true,
        confirmButtonText: 'Finalizar',
        denyButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.srvInforme.postInfoEd(sendDataAc, this.srvInforme.idInf)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (rest) => {
                // console.log("Res: ", rest)
                if (rest.status) {
                  // console.log('en el if------->');
                  Swal.fire({
                    title: 'Informe modificado Correctamente',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                  });
                  // console.log("Res: ", rest)
                } else {
                  Swal.fire({
                    title: rest.message,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
                setTimeout(() => {
                  // console.log('SettimeOut');
                  // this.showCenter()
                  Swal.close();
                }, 3000);
                this.srvInforme.typeviw = true
              },
              error: (e) => {
                Swal.fire({
                  title: 'No se modifico el informe',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500
                });
                console.log("Error:", e)
              },
              complete: () => {
                // this.srvInforme.typeviw = true

                // this.showCenter()
                this.myForm.reset()
                // this.myFormAd.reset()
                this.srvModal.closeModal()
              }
            })
            this.srvInforme.typeviw = true
        }
        
      })
    }

    // this.myForm.reset()
    // this.myFormAd.reset()

    // this.srvModal.closeModal()
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
    //     // const tabla = document.getElementById('tchecks') as any;
    const inputall = document.getElementById('flexCheckDefaultAll') as any;
    if (inputall.checked === true) {
      for (let i = 0; i < this.srvInforme.datosSearch.length; i++) {
        if (!this.arrNotificar.includes(this.srvInforme.datosSearch[i].str_bien_nombre)) {

        }
        let vari = document.getElementById(String(i)) as any;
        // console.log('lo que trae code->', this.srvInforme.datosSearch);
        vari.checked = true;
        this.arrNotificar.push({ index: i, id: this.srvInforme.datosSearch[i].str_codigo_bien, name: this.srvInforme.datosSearch[i].str_bien_nombre });
        this.arrBien.push(this.srvInforme.datosSearch[i].str_codigo_bien)
        // this.myForm.value.str_codigo_bien = this.arrNotificar
      }
      // this.arrNotificar.push({ id: this.srvInforme.datosSearch});

    } else {
      for (let i = 0; i < this.srvInforme.datosSearch.length; i++) {
        let vari = document.getElementById(i + '') as any;
        vari.checked = false;
        let index = this.arrNotificar.indexOf(vari.value);
        this.arrNotificar.splice(index, 1);
      }
    }

    //     this.newItemEvent.emit(this.arrNotificar);
    // console.log('lo que sale del check ->', this.arrNotificar);
  }

  getCheckData(e: any, iD: number) {
    // let index = Number(e.target.id);
    // let code = document.getElementById('dato-check')
    // let valor = code?.innerHTML
    // let name = document.getElementById('name-check')
    // let nameDato = name?.innerHTML
    // console.log('datos seleccion->', valor);

    // let position = this.arrNotificar.findIndex((x: any) => x.index === index);
    // if (e.target.checked) {
    //   this.arrNotificar.push({
    //     index: Number(e.target.id),
    //     id: valor,
    //     name: nameDato
    //   });
    //   this.arrBien.push(this.srvInforme.datosSearch[Number(e.target.id)].str_codigo_bien)

    //   console.log('datos del check solo ->', this.arrNotificar);
    // } else {
    //   this.arrNotificar.splice(position, 1);
    //   this.arrBien.splice(position, 1)
    // }
    // //     this.newItemEvent.emit(this.arrNotificar);
    // console.log('lo que sale del check indiviadual ->', this.arrNotificar);
    // console.log('que llega ->', e.target.id, 'vs', iD);
    let index = Number(iD);
    let code = document.getElementById('dato-check')
    let valor = code?.innerHTML
    let name = document.getElementById('name-check')
    let nameDato = name?.innerHTML
    // console.log('datos seleccion->', valor);

    let position = this.arrNotificar.findIndex((x: any) => x.index === index);
    if (e.target.checked) {
      if (!this.arrBien.includes(this.srvInforme.datosSearch[Number(iD)].str_codigo_bien)) {
        // console.log("0Existe ->>>>>");
        this.arrNotificar.push({
          index: Number(iD),
          id: valor,
          name: nameDato
        });
        this.arrBien.push(this.srvInforme.datosSearch[Number(iD)].str_codigo_bien)
      }


      // console.log('datos del check solo ->', this.arrNotificar);
    } else {
      this.arrNotificar.splice(position, 1);
      this.arrBien.splice(position, 1)
    }
    //     this.newItemEvent.emit(this.arrNotificar);
    // console.log('lo que sale del check indiviadual ->', this.arrNotificar);

  }

  deleteUser(i: number) {
    // console.log('despues de borrar ->', this.userResoi);
    // console.log('despues de borrar ->', this.idUserRespo);
    // console.log('lo que llega del borrar->', i);
    this.userResoi.splice(i, 1);
    this.idUserRespo.splice(i, 1)
    // console.log('despues de borrar ->', this.userResoi);
    // console.log('despues de borrar ->', this.idUserRespo);

  }

  getInforme() {
    Swal.fire({
      title: 'Cargando Informes...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvInforme.getInform({})
      .pipe(takeUntil(this.destroy$)).
      subscribe({
        next: (data: any) => {
          if (data.body.length > 0) {
            this.isData = true;
            this.srvInforme.datosInformes = data.body
            // this.metadata = roles.total
          }
          Swal.close();
          // this.pdf = data.body
          //         let viewpdf = document.getElementById('ver-pdf-solicitud');
          //             if (viewpdf) {
          //               viewpdf.innerHTML =
          //                 ' <iframe src="' +
          //                 'data:application/pdf;base64,' +
          //                 this.pdf +
          //                 '" type="application/pdf" width="100%" height="600" />';
          //             }
          // console.log('Lo que llega ->', data);
        },
        error: (err) => {
          console.log('Error ->', err);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
