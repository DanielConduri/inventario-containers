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
      id_cas_responsables: [{}],
      str_nombres_responsables: [{}],
      str_codigo_bien: [{}]
    })
  }

  ngOnInit(): void {
    this.idUserRespo = []
    this.userResoi = []
    this.getDataCreador()
    this.tipoD()
    this.arrNotificar.length = 0;
    // this.srvInforme.datosSearch=[]
    // this.arrNotificar=0
    // this.prueba()
  }

  getDataCreador() {
    let respon: string
    console.log('datos ->', this.srvPersona.dataMe);
    this.srvInforme.datosCompletos.int_per_id = this.srvPersona.dataMe.int_per_idcas
    respon = this.srvPersona.dataMe.str_per_nombres + ' ' + this.srvPersona.dataMe.str_per_apellidos
    this.userResoi.push(respon)
    this.idUserRespo.push(this.srvPersona.dataMe.int_per_idcas)
    console.log('responsable propio ->', this.idUserRespo);
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
    console.log('lo que sale ->', this.srvInforme.datosSearch);
  }

  changeBien(e: any) {

    // console.log('lo que llega ->', checkbox);
    // if(checkbox.checked === true){

    // }
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
    console.log('lo que llega del sear ->', e.target.value);

  }

  obtenerDatosCentralizada(e:any){
    let cedula = document.getElementById('cedula_user') as any
    console.log("Entra "+ cedula.value);
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
    console.log('dentro del servicio ->', this.srvInforme.usuarioSearch);
    this.idUserRespo.push(res.body.per_id)
    this.userResoi.push(this.srvInforme.usuarioSearch)
    this.srvInforme.usuarioSearch = []
    this.aggButton = false
    // this.srvAjustes.centralizada = res.body;
    // this.myForm.get('per_nombre')?.setValue(res.body.nombre);
    // this.myForm.get('per_apellidos')?.setValue(res.body.apellidos);
    // this.myForm.get('per_correo')?.setValue(res.body.correo);
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
    // this.datoUser()
  }
 
}
);
}


  searchBien(filter: any) {

    const parametro = filter.filter?.like?.parameter;
    this.srvInventario
      .getfiltro(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resBien: any) => {
          const checkbox = document.getElementById("flexCheckDefaultAll") as HTMLInputElement;
          // const checku = document.getElementsByClassName("flexCheckUs")
          let aux = 0
          checkbox.checked = false
          console.log('Informacion que llega a searchCentro =>', resBien);
          this.srvInforme.datosSearch = resBien.body
          console.log('dentro del servicio ->', this.srvInforme.datosSearch);
          for(let i = 0; i<this.srvInforme.datosSearch.length; i++){
            let va = document.getElementById(String(i)) as any;
            // var dataId =  chekAux.getAttribute("data-id")
            // console.log("lo que sale del aux ->", dataId);
            if(this.arrBien.includes(this.srvInforme.datosSearch[i].str_codigo_bien)){
              // checku.checked = true
              
              aux = aux +1
              va.checked = true
              console.log(' input check->', va);
            }
            else{
              this.checkbo = false
              // this.checkbo = true
              va.checked = false
              console.log('el false ->', this.checkbo);
            }
          }
          if(aux == this.srvInforme.datosSearch.length){
            checkbox.checked = true

          }
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
  //         // this.autocomplete(
  //         //   document.getElementById('inp-Centro') as HTMLInputElement,
  //         //   resCentro.body,
  //         //   parametro,
  //         //   'centro'
  //         // );
  //       },
  //     });
  // }

  // datoUser(e: any, id: number) {
  //   console.log('lo que llega del select user', e.target);
  //   this.idUserRespo.push(id)
  //   let nameUser = document.getElementById('inp-Centro')
  //   // let nameUser = document.getElementsByClassName("nameUserRespo")
  //   // let val = nameUser?.innerHTML
  //   // val == ''
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
          console.log('datos tipos -->', data);
          this.srvInforme.datosTipos2 = data.body

          this.tipoInforme.tipo = this.srvInforme.datosTipos2.map((fac: any) => fac.str_tipo_documento_nombre)
          this.tipoInforme.cod = this.srvInforme.datosTipos2.map((cod: any) => cod.int_tipo_documento_id)

          console.log('datos var ->', this.tipoInforme);
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
    console.log('e ->', selectedOption);
    this.myForm.value.int_tipo_documento_id = selectedOption.id
    this.myForm.value.str_tipo_documento_nombre = selectedOption.value
    console.log('en el form ->', this.myForm.value.int_tipo_documento_id);
    // this.myForm.value.int_per_id = this.srvPersona.dataMe.int_per_id
    console.log('datos formulario', this.myForm.value);

  }

  send() {
    console.log('entre a this.send');
    this.myForm.value.int_tipo_documento_id = this.idtipo
    this.myForm.value.str_tipo_documento_nombre = this.nameTipo
    this.myForm.value.str_codigo_bien = this.arrBien
    this.myForm.value.id_cas_responsables = this.idUserRespo
    this.myForm.value.str_nombres_responsables = this.userResoi
    console.log('en el form ->', this.myForm.value.int_tipo_documento_id);

    console.log(this.myForm.value);
    // this.srvInforme.typeviw = true

    const sendDataAc = this.myForm.value
    console.log('el enviar ->', sendDataAc);

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
              console.log("Res: ", rest)
              if (rest.status) {
                Swal.fire({
                  title: 'Informe creado Correctamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3500
                });
                // console.log("Res: ", rest)
              } else {
                Swal.fire({
                  title: rest.message,
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3500
                });
              }
              setTimeout(() => {
                console.log('SettimeOut');
                // this.showCenter()
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
              // this.showCenter()
              this.myForm.reset()
              // this.myFormAd.reset()
              // this.srvModal.closeModal()
              // this.srvInforme.typeviw = true

            }
          })
      }
    })
    this.myForm.reset()
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
          console.log('Lo que llega ->', data);
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
        if(!this.arrNotificar.includes(this.srvInforme.datosSearch[i].str_bien_nombre)){
          console.log('no hay, incgresa ->');
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
        this.arrBien.splice(index, 1)
      }
    }

    //     this.newItemEvent.emit(this.arrNotificar);
    console.log('lo que sale del check ->', this.arrNotificar);
  }

  getCheckData(e: any, iD:number) {
    console.log('que llega ->', e.target.id, 'vs', iD);
    let index = Number(iD);
    let code = document.getElementById('dato-check')
    let valor = code?.innerHTML
    let name = document.getElementById('name-check')
    let nameDato = name?.innerHTML
    console.log('datos seleccion->', valor);

    let position = this.arrNotificar.findIndex((x: any) => x.index === index);
    if (e.target.checked) {
      if(!this.arrBien.includes(this.srvInforme.datosSearch[Number(iD)].str_codigo_bien)){
        // console.log("0Existe ->>>>>");
        this.arrNotificar.push({
          index: Number(iD),
          id: valor,
          name: nameDato
        });
        this.arrBien.push(this.srvInforme.datosSearch[Number(iD)].str_codigo_bien)
      }
     

      console.log('datos del check solo ->', this.arrNotificar);
    } else {
      this.arrNotificar.splice(position, 1);
      this.arrBien.splice(position, 1)
    }
    //     this.newItemEvent.emit(this.arrNotificar);
    console.log('lo que sale del check indiviadual ->', this.arrNotificar);

  }

  deleteUser(i: number) {
    console.log('despues de borrar ->', this.userResoi);
    console.log('despues de borrar ->', this.idUserRespo);
    console.log('lo que llega del borrar->', i);
    this.userResoi.splice(i, 1);
    this.idUserRespo.splice(i, 1)
    console.log('despues de borrar ->', this.userResoi);
    console.log('despues de borrar ->', this.idUserRespo);

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

