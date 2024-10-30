import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Subject, takeUntil, Observable, } from 'rxjs';
import { EstadosShowModel } from 'src/app/core/models/Bienes/Caracteristicas/estados';
import { MarcasShowModel } from 'src/app/core/models/Bienes/Caracteristicas/marcas';
import { ProveedorShowModel } from 'src/app/core/models/Bienes/Caracteristicas/proveedores';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { centrosModel } from 'src/app/core/models/centros';
import { PersonasService } from 'src/app/core/services/personas.service';
import { personasModel} from 'src/app/core/models/personas';
import { CatalogoShowModel } from 'src/app/core/models/Bienes/Caracteristicas/catalogo';

@Component({
  selector: 'app-agregar-bien',
  templateUrl: './agregar-bien.component.html',
  styleUrls: ['./agregar-bien.component.css'],
})
export class AgregarBienComponent implements OnInit {

  @ViewChild('dateInput') dateInput!: ElementRef;
  @ViewChild('dateInputFin', {static:false}) dateInputFin!: ElementRef;
  @ViewChild('selectElement') selectElement!: ElementRef;
  @ViewChild('numberInput') numberInput!: ElementRef;

  @ViewChild('inputKey') inputKey!: ElementRef;
  @ViewChild('inputValue') inputValue!: ElementRef;

  dateInit!: Date;
  dateEnd!: Date;
  yearsToAdd: number = 0;

  // fechaActual!: string;


  myForm!: FormGroup;

  bienesForm!: FormGroup;

  jsonForm!: FormGroup;
  items: { key: string, value: any}[][] = [];
  encargadoValue: any;
  fechaActual: string = new Date().toISOString().split('T')[0];
  editarIndex: number = -1;
  disableBtn: boolean = true;
  tablaActualizada: { key: string, value: any }[] = [];



  valueEvent: string = '';
  valueDate: Date = new Date();
  disabledSelectGarantia: boolean = true;



  disabledSelect: boolean = true;

  marcaNombre: any[] = [];
  estadoNombre: any[] = [];


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
  private destroy$ = new Subject<any>();

  constructor(
    public fb_Otros: FormBuilder,
    public srvCentros: CentrosService,
    public srvCaracteristicas: CaracteristcasService,
    public srvModal: ModalService,
    public srvInventario: InventarioService,
    public srvPersonas: PersonasService,
    private cdr: ChangeDetectorRef
  ) {

    this.myForm = this.fb_Otros.group({

      int_centro_id: [''],
      str_centro_nombre: ['', [Validators.required]],
      str_centro_tipo_nombre: ['',],
      str_centro_nombre_sede: ['', ],
      str_centro_nombre_facultad: ['', ],
      str_centro_nombre_dependencia: ['', ],
      str_centro_nombre_carrera: ['', ],
      str_centro_nombre_proceso: ['', ],

      int_proveedor_id: [''],
      str_proveedor_nombre: ['', [Validators.required]],
      str_proveedor_ruc: ['', [Validators.required]],

      int_marca_id: [''],
      str_marca_nombre: ['', Validators.required],

      int_per_id: [''],
      str_per_nombres: ['', [Validators.required]],
      str_per_apellidos: ['', [Validators.required]],
      str_per_cedula: ['', [Validators.required]],
      str_per_cargo: ['',],

      int_catalogo_bien_id: [''],
      str_catalogo_bien_id_bien: ['', [Validators.required]],
      str_catalogo_bien_descripcion: ['', [Validators.required]],

      //requerido
      str_codigo_bien_cod: ['', Validators.required],
      str_bien_bld_bca: [''],
      //requerido
      str_bien_modelo: ['', Validators.required],
      str_bien_critico: [''],
      //requerido
      str_bien_valor_compra: ['', Validators.required],
      //requerido
      str_bien_color: ['', Validators.required],
      str_bien_dimensiones: [''],
      str_bien_habilitado: [''],
      //requerido
      str_bien_origen_ingreso: ['', Validators.required],
      //requerido
      str_bien_numero_compromiso: ['', Validators.required],
      str_bien_contabilizado_acta: [''],
      //requerido
      str_bien_descripcion: ['', Validators.required],
      str_campo_bien_cuenta_contable: [''],
      //requerido
      int_campo_bien_vida_util: ['', Validators.required],
      //requerido
      str_campo_bien_valor_contable: ['', Validators.required],
      str_campo_bien_valor_libros: [''],
      //requerido
      int_bien_numero_acta: ['', Validators.required],
      //requerido
      str_bien_serie: ['', Validators.required],


      str_bien_moneda: [''],
      str_bien_recompra: [''],
      str_bien_material:  [''],
      //requerido
      str_condicion_bien_nombre: ['', Validators.required],
      str_bien_estado: [''],
      str_bien_tipo_ingreso: [''],
      str_bien_estado_acta: [''],
      str_bien_contabilizado_bien: [''],
      //requerido
      int_campo_bien_item_reglon: ['', Validators.required],
      str_campo_bien_depreciable: [''],
      //requerido
      dt_bien_fecha_compra: ['', Validators.required],
      //requerido
      str_fecha_ultima_depreciacion: ['', Validators.required],
      //requerido
      str_campo_bien_fecha_termino_depreciacion: ['', Validators.required],
      str_bien_deprecicacion_acumulada: [''],
      str_campo_bien_valor_residual: [''],
      str_campo_bien_comodato: [''],

      //requerido
      str_bien_garantia: ['', Validators.required],
      //requerido
      //establecemos que solo se puedan ingresar numeros
      int_bien_anios_garantia: ['', [Validators.pattern('^[0-9]*$')]],

      //Informacion adicional del Bien
      str_bien_info_adicional: [
        this.items
      ],

    });




    // Formulario para el JSONDinamico
    this.jsonForm = this.fb_Otros.group({
      key:[
        '', [Validators.required]
      ],
      value:[
        '', [Validators.required]
      ],
      encargado:[
        '', [Validators.required]
      ],
      fecha: new FormControl(new Date().toISOString().split('T')[0])
    })

  }

  ngOnInit(): void {
    this.searchEstado();
    // console.log("Valor del Disabled Buton =>", this.disableBtn )
    this.fechaActual = new Date().toISOString().split('T')[0];
    this.disabledSelect = true;
  }

  //Funcion para agregar Bien
  agregarOtros() {
    const sendOtrosData = this.myForm.value;

    Swal.fire({
      title: 'Esta seguro de añadir este Bien?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvInventario
          .postBienes(sendOtrosData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (bienes: any) => {
              if (bienes.status) {
                Swal.fire({
                  title: 'Bien agregado con éxito!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500,
                });
                // console.log('Data del Bien Agregada =>', bienes);
              } else {
                Swal.fire({
                  title: 'Error al agregar proveedor!',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500,
                });
                // console.log('Error al Cargar la Data del Bien =>', bienes);
              }
              setTimeout(() => {
                this.getBienesOtros();
                Swal.close();
              }, 3000);
            },
            error: (err) => {
              console.log('Error al agregar el Bien', err);
            },
            complete: () => {
              this.getBienesOtros();
              this.myForm.reset();
              this.jsonForm.reset();
              this.items = [];
              this.numberInput.nativeElement.value = '';
              this.selectElement.nativeElement.value = '';
              this.disabledSelect = true;
            },
          });
      }
    });
    // console.log("Valor de myForms => ", this.myForm.value);
  }

  // Funcion para mostrar bienes OTROS
  getBienesOtros() {
    Swal.fire({
      title: 'Cargando Bienes...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvInventario
      .getBienes({}, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bienes: any) => {
          // console.log('Informacion de Bienes Body =>', bienes);
          this.srvInventario.datosOtros = bienes.data;
          Swal.close();
        },
        error: (err) => {
          console.log('Error al obtener los Bienes Otros', err);
        },
        complete: () => {
          Swal.close();
        },
      });
  }



  //Funcion para buscar los Estados

  searchEstado() {
    this.srvCaracteristicas
      .getEstadoActivos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (estado: EstadosShowModel) => {
          // console.log('Informacion de Estados Body =>', estado.body);
          this.estadoNombre = estado.body;
          Swal.close();
        },
        error: (err: any) => {
          console.log(err);
          Swal.close();
        },
      });
  }

  // Funcion para Buscar los Proveedores
  searchProveedor(filter: any) {
    const parametro = filter.filter?.like?.parameter;
    this.srvCaracteristicas
      .getFilterProveedor(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resProveedor: ProveedorShowModel) => {
          // console.log(
          //   'Informacion que llega a searchProveedor =>',
          //   resProveedor
          // );
          this.autocomplete(
            document.getElementById('inp-Proveedor') as HTMLInputElement,
            resProveedor.body,
            parametro,
            'proveedor'
          );
        },
      });
  }

  // Funcion para Buscar los Centros
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
        },
      });
  }

  // Funcion para Buscar los Custodios
  searchCustodio(filter: any) {
    const parametro = filter.filter?.like?.parameter;
    this.srvPersonas.getPersonasFiltro(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resCustodio: personasModel) => {
          // console.log('Informacion que llega a searchCentro =>', resCustodio);
          this.autocomplete(document.getElementById('inp-Custodio') as HTMLInputElement, resCustodio.body, parametro, 'custodio')
        }
      })
  }

  //Funcion para Buscar los Catalogos
  searchCatalogo(filter:any){
    const parametro = filter.filter?.like?.parameter;

    this.srvCaracteristicas.getFilterCatalogo(filter)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(resCatalogo: CatalogoShowModel)=>{
        // console.log("Informacion que llega a searchCatalogo =>", resCatalogo);
        this.autocomplete(document.getElementById('inp-Catalogo') as HTMLInputElement, resCatalogo.body, parametro, 'catalogo')
      }
    })

  }

  // Funcion para Buscar las Marcas

  searchMarca(filter: any) {
    const parametro = filter.filter?.like?.parameter;

    this.srvCaracteristicas.getFilterMarca(filter)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(resMarca: MarcasShowModel)=>{
        // console.log("Informacion que llega a searchMarca =>", resMarca);
        this.autocomplete(document.getElementById('inp-Marca') as HTMLInputElement, resMarca.body, parametro, 'marca')
      }
    });

  }


  // Funcion que realiza la busqueda de los datos de Proveedor
  changeProveedor(e: any) {
    const length = e.target.value.length;
    if (length % 2 === 0) {
      const textSearch = Number(e.target.value);
      if (isNaN(textSearch)) {
        this.searchProveedor({
          filter: {
            status: { parameter: 'str_proveedor_estado', data: 'ACTIVO' },
            like: { parameter: 'str_proveedor_nombre', data: e.target.value },
          },
        });
      } else {
        this.searchProveedor({
          filter: {
            status: { parameter: 'str_proveedor_estado', data: 'ACTIVO' },
            like: { parameter: 'str_proveedor_ruc', data: e.target.value },
          },
        });
      }
    }
  }

  // Funcion que realiza la busqueda de los datos de Proveedor
  changeCustodio(e: any) {
    const length = e.target.value.length;
    if(length % 2 === 0){
      const textSearch = Number(e.target.value);
      if(isNaN(textSearch)){
        this.searchCustodio({
          filter: {
            status: { parameter: 'str_per_estado', data: 'ACTIVO' },
            like: { parameter: 'str_per_apellidos', data: e.target.value },
          },
        });
      } else{
        this.searchCustodio({
          filter: {
            status: { parameter: 'str_per_estado', data: 'ACTIVO' },
            like: { parameter: 'str_per_cedula', data: e.target.value },
          },
        });
      }
    }
  }

  // Funcion que realiza la busqueda de los datos de Centro
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

  //Funcion que realiza la busqueda de los datos de Catalogo
  changeCatalogo(e:any){
    const length = e.target.value.length;
    if(length % 2 === 0){
      const textSearch = Number(e.target.value);
      if(isNaN(textSearch)){
      this.searchCatalogo({
        filter: {
          status: { parameter: 'str_catalogo_bien_estado', data: 'ACTIVO' },
          like: { parameter: 'str_catalogo_bien_descripcion', data: e.target.value },
        }
      })
    } else{
      this.searchCatalogo({
        filter: {
          status: { parameter: 'str_catalogo_bien_estado', data: 'ACTIVO' },
          like: { parameter: 'str_catalogo_bien_id_bien', data: e.target.value },
        }
      });
    }
    }
  }

  //Funcion que realiza la busqueda de los datos de Marca
  changeMarca(e:any){
    const length = e.target.value.length;
    if(length % 2 === 0){
      this.searchMarca({
        filter:{
          status: { parameter: 'str_marca_estado', data: 'ACTIVO' },
          like: { parameter: 'str_marca_nombre', data: e.target.value },
        }
      })
    }
  }

  // Funcion que realiza el autocompletado de los datos
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
            // console.log(
            //   'Esto es lo que se le asigna a dataCentros =>',
            //   ithis.dataCentros
            // );
            switch (name) {
              case 'centro':
                ithis.myForm
                  .get('int_centro_id')!
                  .setValue(arr[i].int_centro_id);
                ithis.myForm
                  .get('str_centro_nombre')!
                  .setValue(arr[i].str_centro_nombre);
                ithis.myForm
                  .get('str_centro_tipo_nombre')!
                  .setValue(arr[i].str_centro_tipo_nombre);
                ithis.myForm
                  .get('str_centro_nombre_sede')!
                  .setValue(arr[i].str_centro_nombre_sede);
                ithis.myForm
                  .get('str_centro_nombre_facultad')!
                  .setValue(arr[i].str_centro_nombre_facultad);
                ithis.myForm
                  .get('str_centro_nombre_dependencia')!
                  .setValue(arr[i].str_centro_nombre_dependencia);
                ithis.myForm
                  .get('str_centro_nombre_carrera')!
                  .setValue(arr[i].str_centro_nombre_carrera);
                ithis.myForm
                  .get('str_centro_nombre_proceso')!
                  .setValue(arr[i].str_centro_nombre_proceso);

                break;
              case 'proveedor':
                ithis.myForm
                  .get('int_proveedor_id')!
                  .setValue(arr[i].int_proveedor_id);
                ithis.myForm
                  .get('str_proveedor_nombre')!
                  .setValue(arr[i].str_proveedor_nombre);
                ithis.myForm
                  .get('str_proveedor_ruc')!
                  .setValue(arr[i].str_proveedor_ruc);
                break;
              case 'custodio':
                ithis.myForm
                  .get('int_per_id')!
                  .setValue(arr[i].int_per_id);
                ithis.myForm
                  .get('str_per_nombres')!
                  .setValue(arr[i].str_per_nombres);
                ithis.myForm
                  .get('str_per_apellidos')!
                  .setValue(arr[i].str_per_apellidos);
                ithis.myForm
                  .get('str_per_cedula')!
                  .setValue(arr[i].str_per_cedula);
                ithis.myForm
                  .get('str_per_cargo')!
                  .setValue(arr[i].str_per_cargo);
                break;
              case 'catalogo':
                ithis.myForm
                  .get('int_catalogo_bien_id')!
                  .setValue(arr[i].int_catalogo_bien_id);
                ithis.myForm
                  .get('str_catalogo_bien_id_bien')!
                  .setValue(arr[i].str_catalogo_bien_id_bien);
                ithis.myForm
                .get('str_catalogo_bien_descripcion')!
                .setValue(arr[i].str_catalogo_bien_descripcion);
                break;
                case 'marca':
                ithis.myForm
                  .get('int_marca_id')!
                  .setValue(arr[i].int_marca_id);
                ithis.myForm
                  .get('str_marca_nombre')!
                  .setValue(arr[i].str_marca_nombre);
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





  // Funcion para permitir ingresar garantia si es que esta una fecha de compra antes
  onDateInput(event: any){
    const dateValue = event.target.value;
    const selectElement = this.selectElement.nativeElement;
    this.dateInit = new Date(dateValue);
    // console.log("Valor de DateInit => ", this.dateInit)
    if(dateValue){
      selectElement.disabled = false;
    }else{
      selectElement.disabled = true;
    }
  }

  onNumberInput(event: any){
    if(this.selectElement.nativeElement.value === 'SI'){
      const numberValue = event.target.value;
      const anios = parseInt(this.numberInput.nativeElement.value);
      // console.log("valor de yearsToAdd => ", anios);
      this.disabledSelect = false;
      if(this.numberInput.nativeElement.value === '' || this.numberInput.nativeElement.value === null){
        this.myForm.get('dt_garantia_fecha_final')?.setValue('');
      }else{
        const fechaFinal = new Date(this.dateInit.getFullYear() + anios, this.dateInit.getMonth(), this.dateInit.getDate());
        this.dateInputFin.nativeElement.value = fechaFinal.toISOString().slice(0,10);
        this.myForm.get('dt_garantia_fecha_final')?.setValue(this.dateInputFin.nativeElement.value);
        // console.log("Valor de la Fecha Final =>", this.myForm.get('dt_garantia_fecha_final')?.value);
      }
    }else{
      this.disabledSelect = true;
      this.numberInput.nativeElement.value = 0;
      this.dateInputFin.nativeElement.value = '';
      this.myForm.get('dt_garantia_fecha_final')?.setValue('');
    }

  }

  // Funcion para validad si tiene o no garantia
  changeValueGarantia(event: any){
      this.valueEvent = event.target.value;
      const numberInput = this.numberInput.nativeElement;
      if(this.valueEvent === 'SI'){
        this.disabledSelectGarantia = false;
      }else{
        this.disabledSelectGarantia = true;
        numberInput.value = '';
        this.yearsToAdd = 0;
        this.dateInputFin.nativeElement.value = '';
        this.myForm.get('dt_garantia_fecha_final')?.setValue('');
      }
  }






  //Funcion que resea los valores del formulario
  resetFormValues(){
    this.jsonForm.get('key')?.reset();
    this.jsonForm.get('value')?.reset();
    this.jsonForm.get('encargado')?.reset();
  }

  // Funciones para JSON Dinamico
  onSubmit(){
    const clave = this.inputKey.nativeElement.value;
    const valor = this.inputValue.nativeElement.value;
    const encargado = this.jsonForm.get('encargado')?.value;
    const itemClaveValor = { key: clave, value: valor};
    const itemEncargado = { key: 'encargado', value: encargado};
    const itemFecha = { key: 'fecha', value: this.fechaActual};
    const newItem = [itemClaveValor, itemEncargado, itemFecha];
    this.items.push(newItem);

    this.resetFormValues();

    // console.log("Valor de items => ", this.items);

  }


  eliminarItem(item: any) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      if (this.editarIndex === index) {
        this.editarIndex = -1;
        this.disableBtn = true;
      }
    }
    // console.log("Valor de items => ", this.items);
  }


  editarItem(item: any) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.editarIndex = index;
      const i = this.items[index];
      this.jsonForm.get('key')?.setValue(i[0].key);
      this.jsonForm.get('value')?.setValue(i[0].value);
      this.jsonForm.get('encargado')?.setValue(i[1].value);
      this.disableBtn = false;
    }
  }


  guardarCambios() {
    if (this.editarIndex !== -1) {
      const item = this.items[this.editarIndex];
      item[0].key = this.jsonForm.get('key')?.value;
      item[0].value = this.jsonForm.get('value')?.value;
      item[1].value = this.jsonForm.get('encargado')?.value;
      item[2].value = this.jsonForm.get('fecha')?.value;
      this.resetFormValues();
      this.editarIndex = -1;
      this.disableBtn = true;
    }
    // console.log("Valor de items => ", this.items);
  }

  verConsola(){
    //Ver el contenido de myForm en consola
    // console.log("Valor de myForms => ", this.myForm.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
