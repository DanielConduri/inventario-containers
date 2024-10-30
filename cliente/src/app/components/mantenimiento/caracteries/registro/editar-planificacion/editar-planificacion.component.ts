import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { centrosModel } from 'src/app/core/models/centros';
import { pagNivelMantenimiento } from 'src/app/core/models/mantenimiento/nivelMantenimiento';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import { InformesService } from 'src/app/core/services/informes.service';
import { CaracteristicasMantenimientoService } from 'src/app/core/services/mantenimiento/caracteristicas-mantenimiento.service';
import { RegistroMantenimientoService } from 'src/app/core/services/mantenimiento/registro-mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-planificacion',
  templateUrl: './editar-planificacion.component.html',
  styleUrls: ['./editar-planificacion.component.css']
})
export class EditarPlanificacionComponent implements OnInit {

  paso: number = 0
  arrNotificar: any = []
  arrBien: any = []

  planificacionID!: number

  idUserRespo: any = []
  userResoi: any = []

  idtipo!: string
  nameTipo!: string

  idRespo!: string
  nameRespo!: string

  isLoading: boolean = false
  isData: boolean = false;

  aggBien: boolean = true
  verResumen: boolean = false

  aggButton!: boolean
  checkbo!: boolean

  space: any = ' '

  nivel_id!: number
  nivel_nombre!: string
  nivel_select!: string

  private destroy$ = new Subject<any>();

  myForm!: FormGroup

  formNivel!: FormGroup

  elementPagina: {
    dataLength: number,
    metaData: number,
    currentPage: number
  } = {
      dataLength: 0,
      metaData: 0,
      currentPage: 0
    }

  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};

  tipoInforme: {
    tipo: string[],
    cod: number[]
  } = {
      tipo: [],
      cod: []
    }


  elementCenterAc: {
    name: string,
    type: string,
    sede: string,
    codfacultad: string,
    codcarrera: string,
  } = {
      name: '',
      type: '',
      sede: '',
      codfacultad: '',
      codcarrera: '',
    }

  elementCenterAd: {
    name: string,
    type: string,
    sede: string,
    dependenciaId: number,
    ubicacion: string
  } = {
      name: '',
      type: '',
      sede: '',
      dependenciaId: 0,
      ubicacion: ''
    }
  facultad: {
    facult: string[];
    cod: string[];
  } = {
      facult: [],
      cod: [],
    }

  carrera: {
    carrera: string[];
    cod: string[]
  } = {
      carrera: [],
      cod: []
    }

  dependencia: {
    depen: string[];
    cod: string[]
  } = {
      depen: [],
      cod: []
    }

  ubicacion: {
    ubica: string[];
    cod: string[]
  } = {
      ubica: [],
      cod: []
    }


  formCentro!: FormGroup;


  dataCentros: {
    int_centro_id: number;
    int_centro_id_dependencia: number;
    int_centro_id_proceso: number;
    int_centro_nivel: number;
    int_centro_sede_id: number;
    int_centro_tipo: number;
    str_centro_cod_carrera: string;
    str_centro_cod_facultad: string;
    str_centro_estado: string;
    str_centro_nombre: string;
    str_centro_nombre_carrera: string;
    str_centro_nombre_dependencia: string;
    str_centro_nombre_facultad: string;
    str_centro_nombre_proceso: string;
    str_centro_nombre_sede: string;
    str_centro_tipo_nombre: string;
  } = {
      int_centro_id: 0,
      int_centro_id_dependencia: 0,
      int_centro_id_proceso: 0,
      int_centro_nivel: 0,
      int_centro_sede_id: 0,
      int_centro_tipo: 0,
      str_centro_cod_carrera: '',
      str_centro_cod_facultad: '',
      str_centro_estado: '',
      str_centro_nombre: '',
      str_centro_nombre_carrera: '',
      str_centro_nombre_dependencia: '',
      str_centro_nombre_facultad: '',
      str_centro_nombre_proceso: '',
      str_centro_nombre_sede: '',
      str_centro_tipo_nombre: '',
    };


  constructor(
    public srvPersona: PersonasService,
    public srvInforme: InformesService,
    public srvInventario: InventarioService,
    public fb: FormBuilder,
    public srvUsuarios: AjustesService,
    public srvModal: ModalService,
    public srvNivelM: CaracteristicasMantenimientoService,
    public srvRegistro: RegistroMantenimientoService,
    public srvCentros: CentrosService,
    public srvPaginacion: PaginacionService,

  ) {
    this.myForm = this.fb.group({
      // str_codigo_bien: [{},],

      // int_preventivo_nivel_mantenimiento: [''],

      fechaInicio: ['',[Validators.required] ],
      fechaFin:['', [Validators.required]],
      ubicacionId: [''],
      nombreCentro: [''],
      cantidadBienes:[0, ],
      codigosBienes:[[],],
      int_nivel_mantenimiento_id:[0,],
      str_planificacion_estado: ['']

      // nombreCentro: ['']
    })

    this.formNivel = this.fb.group({
      nivel_descripción: [''],
      // int_nivel_mantenimiento_id:[0]
    })

    this.formCentro = this.fb.group({

      int_centro_id: [''],
      str_centro_nombre: ['',],
      str_centro_tipo_nombre: ['',],
      str_centro_nombre_sede: ['',],
      str_centro_nombre_facultad: ['',],
      str_centro_nombre_dependencia: ['',],
      str_centro_nombre_carrera: ['',],
      str_centro_nombre_proceso: ['',],


    });


  }

  ngOnInit(): void {
    this.srvInforme.datosSearch = []

    this.srvNivelM.SelectUbicacionC$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('lo que asoma----->', data)
          this.srvRegistro.ubicacionPreventivo = data
          if (data > 0) {
            // console.log('entrando al if del behavor')
            this.getInfocentros(data)
          }
        }
      })
      this.srvNivelM.SelectPlanEdid
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('lo que llega', data)
          this.planificacionID = data
          this.getPlanificacionById(data)
        }
      })
    // console.log('llegando al modal con la ubicacion -------->', this.srvRegistro.ubicacionPreventivo)
    // this.nivelMantenimiento()
    // this.getPlanificacionById(this.srvRegistro.idRegistroPreventivoModify)
    this.nivelMantenimiento()
  }



  getPlanificacionById(id: number) {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvNivelM.getByIdPlanificacion(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('datos de la planificacion ->', data);
          this.myForm = this.fb.group({
            fechaInicio: [data.body.dt_fecha_inicio.substring(0, 10), [Validators.required]],
            fechaFin: [data.body.dt_fecha_fin.substring(0, 10), [Validators.required]],
            ubicacionId: [data.body.int_ubicacion_id],
            cantidadBienes:[data.body.int_planificacion_cantidad_bienes, ],
            // fechaInicio: ['',[Validators.required] ],
      // fechaFin:['', [Validators.required]],
      // ubicacionId: [''],
            nombreCentro: [data.body.str_planificacion_centro],
            // cantidadBienes:[0, ],
            // codigosBienes:[[],],
            int_nivel_mantenimiento_id:[data.body.int_nivel_mantenimiento_id,],
            str_planificacion_estado: ['DESARROLLO']
            
            // nombreCentro: [data.body.str_planificacion_centro]
          })
          // ithis.dataCentros = 
          this.nivel_nombre = data.body.str_planificacion_centro
          console.log('los bieness ->>>', data.body.bienes)
          // this.arrBien = data.body.bienes.str_codigo_bien
          this.getNivelById(data.body.int_nivel_mantenimiento_id)
          this.agregarBienes(data.body.bienes)
          this.nivel_id = data.body.int_nivel_mantenimiento_id
          // this.getInfocentros(data.body.int_ubicacion_id)
          // this.myForm.patchValue({
          //   str_codigo_bien: data.str_codigo_bien,
          //   int_preventivo_nivel_mantenimiento: data.int_preventivo_nivel_mantenimiento,
          // })
        },
        error: (error) => { console.log(error) }
      })
  }

  agregarBienes(bienes: any){
    for(let i=0; i< bienes.length; i ++){
      this.arrNotificar.push({
        id: bienes[i].str_codigo_bien,
        name: bienes[i].str_bien_nombre
      })

      this.arrBien.push(bienes[i].str_codigo_bien)
    }
  }

  getInfocentros(id: number) {

    this.srvCentros.getDetalles(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close()
          // console.log('datos de centro ->', data);
          this.formCentro = this.fb.group({
            str_centro_nombre: [data.body.str_centro_nombre,],
            str_centro_tipo_nombre: [data.body.str_centro_tipo_nombre,],
            str_centro_nombre_sede: [data.body.str_centro_nombre_sede,],
            str_centro_nombre_facultad: [data.body.str_centro_nombre_facultad,],
            str_centro_nombre_dependencia: [data.body.str_centro_nombre_dependencia,],
            str_centro_nombre_carrera: [data.body.str_centro_nombre_carrera,],
            str_centro_nombre_proceso: [data.body.str_centro_nombre_proceso,],

            // centro_nombre: [data.body.str_centro_nombre,],
            // centro_tipo: [data.body.str_centro_tipo_nombre],
            // centro_sede: [data.body.str_centro_nombre_sed],
            // nombre_facultad: [data.body.str_centro_nombre_facultad],
            // codigo_facultad: [""],
            // nombre_carrera: [data.body.str_centro_nombre_carrera],
            // codigo_carrera: [""],
            // nombre_ubicacion: [""],
            // codigo_ubicacion: [""],
            // nombre_dependencia: [data.body.str_centro_nombre_dependencia,],
            // codigo_dependencia: [""]

          })
          this.dataCentros = data.body
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  cambio() {
    // this.elementCenterAc.name = this.myForm.value.centro_nombre
    // this.elementCenterAc.type = this.myForm.value.centro_tipo
    // this.elementCenterAc.sede = this.myForm.value.centro_sede
    // this.elementCenterAc.codfacultad = this.myForm.value.codigo_facultad
    // this.elementCenterAc.codcarrera = this.myForm.value.codigo_carrera

    // this.elementCenterAd.name = this.myForm.value.centro_nombre
    // this.elementCenterAd.type = this.myForm.value.centro_tipo
    // this.elementCenterAd.sede = this.myForm.value.centro_sede
    // this.elementCenterAd.dependenciaId = this.myForm.value.codigo_dependencia
    // this.elementCenterAd.ubicacion = this.myForm.value.codigo_carrera

    if (this.elementCenterAc.type == 'ACADÉMICO') {
      // this.facul()
      // this.myForm.reset()
    } else
    // if(this.elementCenterAc.type == 'ADMINISTRATIVO')
    {

      // this.ubi()
      // console.log('entro');
    }
  }

  changeCentro(e: any) {
    const length = e.target.value.length;
    if (length % 2 === 0) {
      this.searchCentro({
        filter: {
          status: { parameter: 'str_centro_estado', data: 'ACTIVO' },
          like: { parameter: 'str_centro_nombre', data: e.target.value },
        },
      });
    }
  }

  searchCentro(filter: any) {
    const parametro = filter.filter?.like?.parameter;
    this.srvCentros
      .getCentrosFiltrados(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resCentro: centrosModel) => {
          // console.log('Informacion que llega a searchCentro =>', resCentro);
          this.autocomplete(
            document.getElementById('inp-Centro') as HTMLInputElement,
            resCentro.body,
            parametro,
            'centro'
          );
          //  console.log('se llena ->', ithis.dataCentros)

        },
      });
  }

  autocomplete(inp: HTMLInputElement, arr: any[], valor: string, name: string) {
    let ruc: string = '';
    let nombreC = '';
    let currentFocus: number;
    let ithis = this;
    inp?.addEventListener('input', function (e) {
      e.preventDefault();
      let a,
        b,
        i,
        val = this.value;
      closeAllLists(arr);
      if (!val) {
        return false;
      }
      currentFocus = -1;
      a = document.createElement('DIV');
      a.setAttribute('id', this.id + 'autocomplete-list');
      a.style.position = 'absolute';
      a.style.width = '100%';
      a.style.maxHeight = '200px'; // Limita la altura máxima
      a.style.overflowY = 'auto';  // Agrega scroll vertical
      a.style.zIndex = '1000';     // Se asegura que los elementos se vean por encima de otros
      a.setAttribute('class', 'autocomplete-items');
      this.parentNode?.appendChild(a);

      let count = 0;

      for (let i = 0; i < arr.length; i++) {
        const text = arr[i][valor]?.toUpperCase();
        if (text?.includes(val.trim().toUpperCase())) {
          count++;
          b = document.createElement('DIV');

          const textDivList = text.split(val.toUpperCase());
          b.innerHTML = arr[i][valor].substr(0, textDivList[0].length);
          b.innerHTML +=
            '<strong>' +
            arr[i][valor].substr(textDivList[0].length, val.length) +
            '</strong>';
          b.innerHTML += arr[i][valor].substr(
            textDivList[0].length + val.length
          );
          b.innerHTML += "<input type='hidden' value='" + arr[i][valor] + "'>";

          if (valor.startsWith('str_ruc')) {
            nombreC = arr[i]['str_nombre_contratista'];
            b.innerHTML += ` - ${nombreC}`;
          }

          b.addEventListener('click', function (e) {
            inp.value = this.getElementsByTagName('input')[0].value;
            ithis.dataCentros = arr[i];

            switch (name) {
              case 'centro':
                ithis.myForm
                  .get('ubicacionId')!
                  .setValue(arr[i].int_centro_id);
                  ithis.myForm
                  .get('nombreCentro')!
                  .setValue(arr[i].str_centro_nombre);
                ithis.formCentro
                  .get('str_centro_nombre')!
                  .setValue(arr[i].str_centro_nombre);
                ithis.formCentro
                  .get('str_centro_tipo_nombre')!
                  .setValue(arr[i].str_centro_tipo_nombre);
                ithis.formCentro
                  .get('str_centro_nombre_sede')!
                  .setValue(arr[i].str_centro_nombre_sede);
                ithis.formCentro
                  .get('str_centro_nombre_facultad')!
                  .setValue(arr[i].str_centro_nombre_facultad);
                ithis.formCentro
                    .get('str_centro_nombre_carrera')!
                    .setValue(arr[i].str_centro_nombre_carrera);
                ithis.formCentro
                  .get('str_centro_nombre_dependencia')!
                  .setValue(arr[i].str_centro_nombre_dependencia);
                ithis.formCentro
                  .get('str_centro_nombre_proceso')!
                  .setValue(arr[i].str_centro_nombre_proceso);

                break;
            }
            localStorage.setItem(
              'dataForm',
              JSON.stringify(ithis.myForm.value)
            );
            closeAllLists(arr);
          });
          a.appendChild(b);
        }
      }
      return true;
    });

    /*execute a function presses a key on the keyboard:*/
    inp?.addEventListener('keydown', function (e) {
      var x = document.getElementById(this.id + 'autocomplete-list') as any;
      if (x) x = x.getElementsByTagName('div');
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x: any) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      x[currentFocus].classList.add('autocomplete-active');
      return true;
    }
    function removeActive(x: any) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove('autocomplete-active');
      }
    }
    function closeAllLists(elmnt: any) {
      /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
      var x = document.getElementsByClassName('autocomplete-items');
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode?.removeChild(x[i]);
        }
      }
    }
  }


  avanzarB(){
    this.aggBien = false
    this.verResumen = false
  }

  avanzarR(){
    this.aggBien = true
    this.verResumen = true
  }

  regresar(){
    this.aggBien = true
    this.verResumen = false
    this.srvInforme.datosSearch = []
  }

  regresar2(){
    this.aggBien = false
    this.verResumen = false
  }

  updateandFin(){
    this.myForm.value.cantidadBienes = this.arrBien.length
    this.myForm.value.codigosBienes = this.arrBien
    this.myForm.value.int_nivel_mantenimiento_id = this.nivel_id
    this.myForm.value.str_planificacion_estado = 'EN PROCESO'
    console.log('lo que se va ->', this.myForm.value)
    Swal.fire({
      title: '¿Está seguro de modificar esta planificación ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('formulario ->', this.myForm.value);
        this.srvNivelM.putPlanificacion(this.planificacionID, this.myForm.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              if (data.status) {
                Swal.fire({
                  icon: 'success',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
              setTimeout(() => {
                // this.getCentros()
                Swal.close();
              }, 3000);
            },
            error: (err) => {
              console.log('error ->', err);
            },
            complete: () => {
              this.srvModal.closeModal()
              this.obtenerRegistro()

            }
          })
      }
    })
  }

  update() {
    this.myForm.value.cantidadBienes = this.arrBien.length
    this.myForm.value.codigosBienes = this.arrBien
    this.myForm.value.int_nivel_mantenimiento_id = this.nivel_id
    this.myForm.value.str_planificacion_estado = 'DESARROLLO'

  console.log('lo que se va ->', this.myForm.value)

    Swal.fire({
      title: '¿Está seguro de modificar esta planificación ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('formulario ->', this.myForm.value);
        this.srvNivelM.putPlanificacion(this.planificacionID, this.myForm.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              if (data.status) {
                Swal.fire({
                  icon: 'success',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
              setTimeout(() => {
                // this.getCentros()
                Swal.close();
              }, 3000);
            },
            error: (err) => {
              console.log('error ->', err);
            },
            complete: () => {
              this.srvModal.closeModal()
              this.obtenerRegistro()
            }
          })
      }
    })
  }

  changeBien(e: any) {

    // console.log('lo que llega ->', checkbox);
    // if(checkbox.checked === true){

    // }
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
    console.log('lo que llega del sear ->', e.target.value);

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
          for (let i = 0; i < this.srvInforme.datosSearch.length; i++) {
            let va = document.getElementById(String(i)) as any;
            // var dataId =  chekAux.getAttribute("data-id")
            // console.log("lo que sale del aux ->", dataId);
            if (this.arrBien.includes(this.srvInforme.datosSearch[i].str_codigo_bien)) {
              // checku.checked = true

              aux = aux + 1
              va.checked = true
              console.log(' input check->', va);
            }
            else {
              this.checkbo = false
              // this.checkbo = true
              va.checked = false
              console.log('el false ->', this.checkbo);
            }
          }
          if (aux == this.srvInforme.datosSearch.length) {
            checkbox.checked = true

          }
        },
      });
  }

  getAllChecks() {

    this.arrNotificar = []
    this.arrBien = []
    const inputall = document.getElementById('flexCheckDefaultAll') as any;
    console.log('datos del check ->', this.srvInforme.datosSearch);
    console.log('el check ->', inputall.checked);
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

  nivelMantenimiento() {
    this.srvNivelM.getNivelMantenimiento({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: pagNivelMantenimiento) => {
          if (data.body.length > 0) {
            // this.isData = true;
            // this.isLoading = true;
            this.srvNivelM.datosNivelMantenimiento = data.body
            // this.metadata = data.total
          }
          // console.log('lo que llega en el nivel ->', data)
          // Swal.close();
          // this.dataPagina()
        },
        error: (error) => { console.log(error) }
      })
  }

  getNivelName(e: any) {
    // console.log('para agarrar el nivel', e.value)
    const selectedOption: HTMLOptionElement = e.target['options'][e.target['selectedIndex']]; // 
    // console.log('lo que llega ->', selectedOption)
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    this.nivel_id = parseInt(selectedId)
    this.nivel_nombre = selectedValue
    console.log('lo que esta en el nivel', this.nivel_id, '---->', this.nivel_nombre)
    this.myForm.value.int_nivel_mantenimiento_id = this.nivel_id

    // console.log('el id y el nombre', selectedId, selectedValue)
    // this.myForm.value.int_correctivo_nivel_mantenimiento = selectedId
    // this.myForm.value.str_correctivo_nivel_nombre = selectedValue

  }

  getNivelById(id: number){
    console.log('lo que llega de id ->', id)
    // Swal.fire({
    //   title: 'Cargando...',
    //   didOpen: () => {
    //     Swal.showLoading();
    //     this.isLoading = true;
    //     this.isData = true;
    //   },
    // });
    this.srvNivelM.getByIdNivelM(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        // Swal.close();
        console.log('lo que llega en nivel', data)
        this.formNivel = this.fb.group({
          nivel_descripción: [data.body.str_nivel_mantenimiento_descripcion]
        })

      },
      error: (error) => {console.log(error)}
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
    this.srvNivelM.getPlanificacion({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        if(data.body.length > 0){
          this.isData = true;
          this.isLoading = true;
          this.srvNivelM.datosPlanificacion = data.body
          this.metadata = data.total
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

  
  // dataPagina() {
  //   this.elementPagina.dataLength = this.srvNivelM.datosPlanificacion ? this.srvNivelM.datosPlanificacion.length : 0;
  //   this.elementPagina.metaData = this.metadata;
  //   this.elementPagina.currentPage = this.mapFiltersToRequest.page
  //   this.srvPaginacion.setPagination(this.elementPagina)
  // }

  // pasarPagina(page: number) {
  //   this.mapFiltersToRequest = { size: 10, page, parameter: '', data: 0  };
  //   // console.log('mapFiltersToRequest', this.mapFiltersToRequest);
  //   this.obtenerRegistro();
  // }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
