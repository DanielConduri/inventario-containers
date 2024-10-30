import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import Swal from 'sweetalert2';
import { cargaLoading, pagCenter } from 'src/app/core/models/centros';

@Component({
  selector: 'app-agregar-centros',
  templateUrl: './agregar-centros.component.html',
  styleUrls: ['./agregar-centros.component.css'],
})
export class AgregarCentrosComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isData: boolean = false;

  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};

  myFormP!: FormGroup;
  myFormAc!: FormGroup;
  myFormAd!: FormGroup;
  myForm!: FormGroup;
  request = false;
  private destroy$ = new Subject<any>();

  elementCenterAc: {
    name: string;
    type: string;
    sede: string;
    codfacultad: string;
    codcarrera: string;
  } = {
    name: '',
    type: '',
    sede: '',
    codfacultad: '',
    codcarrera: '',
  };

  elementCenterAd: {
    name: string;
    type: string;
    sede: string;
    dependenciaId: number;
    ubicacion: string;
  } = {
    name: '',
    type: '',
    sede: '',
    dependenciaId: 0,
    ubicacion: '',
  };

  facultad: {
    facult: string[];
    cod: string[];
  } = {
    facult: [],
    cod: [],
  };

  carrera: {
    carrera: string[];
    cod: string[];
  } = {
    carrera: [],
    cod: [],
  };

  dependencia: {
    depen: string[];
    cod: string[];
  } = {
    depen: [],
    cod: [],
  };

  ubicacion: {
    ubica: string[];
    cod: string[];
  } = {
    ubica: [],
    cod: [],
  };

  // depen

  codFacul!: string;
  carreras: string[] = [];

  // Google Maps declaracion data

  deshabilitar: boolean = true;

  lati!: string;
  lngi: number = 0;
  zoom: number = 6;
  mapTypeId: string = '';

  mapOptions: google.maps.MapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 0,
  };

  marker: {
    position: {
      lat: number;
      lng: number;
    };
  } = {
    position: { lat: 0, lng: 0 },
  };
  // Fin Google Maps declaracion data

  constructor(
    public fb: FormBuilder,
    public srvModal: ModalService,
    public srvCentros: CentrosService
  ) {
    this.myForm = this.fb.group({
      centro_nombre: ['', [Validators.required]],
      centro_tipo: ['', [Validators.required]],
      centro_sede: ['', [Validators.required]],
      // })

      // this.myFormAc = this.fb.group({
      //   // academico
      //   nombre_facultad: [
      //     "", [Validators.required]
      //   ],
      //   codigo_facultad: [
      //     "", [Validators.required]
      //   ],
      //   nombre_carrera: [
      //     "", [Validators.required]
      //   ],
      //   codigo_carrera: [
      //     "", [Validators.required]
      //   ],
      //   // administrativo
      // })

      // this.myFormAd = this.fb.group({
      //   nombre_ubicacion: [
      //     "", [Validators.required]
      //   ],
      //   codigo_ubicacion: [
      //     "", [Validators.required]
      //   ],
      //   nombre_dependencia: [
      //     "", [Validators.required]
      //   ],
      //   codigo_dependencia: [
      //     "", [Validators.required]
      //   ]
      // })

      // this.myFormP = this.fb.group({
      // centro_nombre: [
      //   ""
      // ],
      // centro_tipo: [
      //   ""
      // ],
      // centro_sede: [
      //   null
      // ],
      nombre_facultad: [''],
      codigo_facultad: [''],
      nombre_carrera: [''],
      codigo_carrera: [''],
      nombre_ubicacion: [''],
      codigo_ubicacion: [0],
      nombre_dependencia: [''],
      codigo_dependencia: [0],
      dc_centro_coordenada_uno: [0],
      dc_centro_coordenada_dos: [0],
    });

    this.mapTypeId = 'hybrid';

    this.mapOptions = {
      center: { lat: -1.6561367374635219, lng: -78.67699743361786 },
      zoom: 14,
    };
  }

  ngOnInit(): void {}

  //funcion que detecta los cambios que se producen en sede y tipo de centro
  //con el fin de enviar los datos para obtener las demas ubicaciones

  cambio() {
    console.log('ENTRA?');
    // this.myFormP.reset()
    this.elementCenterAc.name = this.myForm.value.centro_nombre;
    this.elementCenterAc.type = this.myForm.value.centro_tipo;
    this.elementCenterAc.sede = this.myForm.value.centro_sede;

    this.elementCenterAd.name = this.myForm.value.centro_nombre;
    this.elementCenterAd.type = this.myForm.value.centro_tipo;
    this.elementCenterAd.sede = this.myForm.value.centro_sede;

    // this.myFormP.value.centro_nombre  = this.myForm.value.centro_nombre
    // this.myFormP.value.centro_tipo    = this.myForm.value.centro_tipo
    // this.myFormP.value.centro_sede    = this.myForm.value.centro_sede

    // console.log(this.elementCenterAc);
    if (this.elementCenterAc.type && this.elementCenterAc.sede) {
      if (this.elementCenterAc.type == 'ACADÉMICO') {
        this.facul();
        // this.myFormAd.reset()
      } else {
        this.ubi();
        // this.myFormAc.reset()
      }
    }
  }

  //funcion que se ejecuta si se trata de un centro de tipo academico
  //con esa informacion enviada, se devuelven las facultades

  facul() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCentros
      .getTypeAc(this.elementCenterAc)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close();
          // console.log('datos', data);

          this.srvCentros.datosFacultad = data.body;
          // this.srvCentros.codFacultad = data.body
          this.facultad.facult = this.srvCentros.datosFacultad.map(
            (fac: any) => fac.strNombre
          );
          this.facultad.cod = this.srvCentros.datosFacultad.map(
            (cod: any) => cod.strCodFacultad
          );
          // this.facultad = data.body
        },
        error: (err) => {
          console.log('error ->', err);
        },
      });
  }

  //esta funcion se ejecuta directamente en el html para detectar la facultad seleccionada
  //con este dato, se guarda el id de esta para ser enviada

  getF(e: any) {
    //
    //esta funcion nos permite obtener la facultad y el id para luego seleccionarlos
    const selectedOption: HTMLOptionElement =
      e.target['options'][e.target['selectedIndex']]; //
    //
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    // console.log('e ->', selectedOption.id);

    if (selectedId) {
      this.myForm.get('codigo_facultad')?.setValue(selectedId);
      this.elementCenterAc.codfacultad = this.myForm.value.codigo_facultad;
      // this.myFormP.value.codigo_facultad = this.myFormAc.value.codigo_facultad
      // this.myFormP.value.nombre_facultad = this.myFormAc.value.nombre_facultad
    }

    this.carrer();
  }

  //una vez obtenido ese valor, se envia para obtener las carreras de esa facultad

  carrer() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCentros
      .getCarrera(this.elementCenterAc)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close();
          // console.log('body ->', this.elementCenterAc);
          this.srvCentros.datosCarrera = data.body;
          this.carrera.carrera = this.srvCentros.datosCarrera.map(
            (car: any) => car.strNombre
          );
          this.carrera.cod = this.srvCentros.datosCarrera.map(
            (car: any) => car.strCodCarrera
          );
          // console.log('se envía carrera ->', this.carrera.cod)
        },
        error: (err) => {
          console.log('Error ->', err);
        },
      });
  }

  //de igual manera se necesita obtener el id de la carrera que se seleccione para enviar esos datos

  getC(e: any) {
    //
    const selectedOption: HTMLOptionElement =
      e.target['options'][e.target['selectedIndex']];
    //
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;

    if (selectedId) {
      this.myForm.get('codigo_carrera')?.setValue(selectedId);
      this.elementCenterAc.codcarrera = this.myForm.value.codigo_carrera;
      // this.myFormP.value.codigo_carrera = this.myFormAc.value.codigo_carrera
      // this.myFormP.value.nombre_carrera = this.myFormAc.value.nombre_carrera
      this.myForm.value.codigo_dependencia = 0;
      this.myForm.value.nombre_dependencia = null;
      this.myForm.value.codigo_ubicacion = 0;
    }
  }

  //==========================================================================================

  //procesos cuando se trata de un centro administrativo

  //esta funcion se ejecuta si se trata de un proceso administrativo
  //se envia los datos paraobtener las dependencias

  ubi() {
    this.srvCentros
      .getTypeAd(this.elementCenterAd)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.srvCentros.datosDependencia = data.body;

          this.dependencia.depen = this.srvCentros.datosDependencia.map(
            (depe: any) => depe.procesoDependencia
          );
          this.dependencia.cod = this.srvCentros.datosDependencia.map(
            (cod: any) => cod.dependenciaId
          );
        },
        error: (err) => {
          console.log('error ->', err);
        },
      });
  }

  //similar al proceso anterio, se requiere obtener el id de la dependencia seleccionada,
  //esta funcion cumple ese cometido
  //tambien se envian esos datos para obtener las ubicaciones de esas dependencias

  depende(e: any) {
    //
    const selectedOption: HTMLOptionElement =
      e.target['options'][e.target['selectedIndex']]; //
    //
    const selectedValue: string = selectedOption.value;
    const selectedId: number = parseInt(selectedOption.id);
    if (selectedId) {
      this.myForm.get('codigo_dependencia')?.setValue(selectedId);
      this.elementCenterAd.dependenciaId = this.myForm.value.codigo_dependencia;
      // this.myFormP.value.codigo_dependencia = this.myFormAd.value.codigo_dependencia
      // this.myFormP.value.nombre_dependencia = this.myFormAd.value.nombre_dependencia
      // console.log('my form ->',this.myForm.value);
    }

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCentros
      .getDependencia(this.elementCenterAd)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close();
          // console.log('ubicaciones ->', data);
          this.srvCentros.datosUbicacion = data.body;

          this.ubicacion.ubica = this.srvCentros.datosUbicacion.map(
            (ubi: any) => ubi.procesoDescripcion
          );
          this.ubicacion.cod = this.srvCentros.datosUbicacion.map(
            (cod: any) => cod.procesoId
          );
        },
        error: (err) => {
          console.log('error ->', err);
        },
      });
  }

  //similar al proceso anterio, se requiere obtener el id de la ubicacion seleccionada,
  //esta funcion cumple ese cometido

  getUbi(e: any) {
    const selectedOption: HTMLOptionElement =
      e.target['options'][e.target['selectedIndex']]; //
    // Get the selected option's value and ID
    const selectedValue: string = selectedOption.value;
    const selectedId: number = parseInt(selectedOption.id);
    if (selectedId) {
      this.myForm.get('codigo_ubicacion')?.setValue(selectedId);
      this.elementCenterAd.ubicacion = this.myForm.value.codigo_ubicacion;
      // this.myFormP.value.codigo_ubicacion = this.myFormAd.value.codigo_ubicacion
      // this.myFormP.value.nombre_ubicacion = this.myFormAd.value.nombre_ubicacion
    }
  }

  /*------------------------------------------
    --------------------------------------------
    moveMap()
    --------------------------------------------
    --------------------------------------------*/
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.mapOptions.center = event.latLng.toJSON();

    this.myForm
      .get('dc_centro_coordenada_uno')
      ?.setValue(this.mapOptions.center?.lat);
    this.myForm
      .get('dc_centro_coordenada_dos')
      ?.setValue(this.mapOptions.center?.lng);

    this.deshabilitar = false;

    if (this.myForm.value.dc_centro_coordenada_uno != null) {
      this.marker = {
        position: {
          lat: parseFloat(this.myForm.value.dc_centro_coordenada_uno),
          lng: parseFloat(this.myForm.value.dc_centro_coordenada_dos),
        },
      };
    }
  }
  changeCordenada1(e: any) {
    this.myForm
      .get('dc_centro_coordenada_uno')
      ?.setValue(this.mapOptions.center?.lat);
    this.myForm
      .get('dc_centro_coordenada_dos')
      ?.setValue(this.mapOptions.center?.lng);

    if (this.myForm.value.dc_centro_coordenada_uno != null) {
      this.marker = {
        position: {
          lat: parseFloat(this.myForm.value.dc_centro_coordenada_uno),
          lng: parseFloat(this.myForm.value.dc_centro_coordenada_dos),
        },
      };
    }
  }

  changeCordenada2(e: any) {
    this.myForm
      .get('dc_centro_coordenada_uno')
      ?.setValue(this.mapOptions.center?.lat);
    this.myForm
      .get('dc_centro_coordenada_dos')
      ?.setValue(this.mapOptions.center?.lng);

    if (this.myForm.value.dc_centro_coordenada_uno != null) {
      this.marker = {
        position: {
          lat: parseFloat(this.myForm.value.dc_centro_coordenada_uno),
          lng: parseFloat(this.myForm.value.dc_centro_coordenada_dos),
        },
      };
    }
  }

  //finalemte esta funcion se encarga de enviar los respectivos datos para llenar la base de datos

  send() {
    console.log('lo que sale', this.myForm.value);
    const sendDataAc = this.myForm.value;
    // console.log('lo que envio ->', sendDataAc)
    Swal.fire({
      title: '¿Está seguro de añadir este Centro ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.srvCentros
          .postFile(sendDataAc)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (rest) => {
              // console.log("Res: ", rest)
              if (rest.status) {
                Swal.fire({
                  title: 'Centro Agregado Correctamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500,
                });
                // console.log("Res: ", rest)
              } else {
                Swal.fire({
                  title: rest.message,
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
              setTimeout(() => {
                // console.log('SettimeOut');
                // this.showCenter()
                Swal.close();
              }, 3000);
            },
            error: (e) => {
              Swal.fire({
                title: 'No se agrego el Centro',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500,
              });
              console.log('Error:', e);
            },
            complete: () => {
              this.showCenter();
              // this.myFormAc.reset()
              // this.myFormAd.reset()
              this.srvModal.closeModal();
            },
          });
      }
    });
    // this.myFormAc.reset()
    // this.myFormAd.reset()
  }

  //funcion que nos permite hacer una "recarga" para obtener los datos nuevos,
  //se utiliza tambien la paginacion

  showCenter() {
    Swal.fire({
      title: 'Cargando Roles...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvCentros
      .getCenter({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (center: pagCenter) => {
          if (center.body.length > 0) {
            this.isData = true;
            this.isLoading = true;
            this.srvCentros.datosCentros = center.body;
            this.metadata = center.total;
          } else {
            this.srvCentros.SelectIsCarga$.pipe(
              takeUntil(this.destroy$)
            ).subscribe({
              next: (load: cargaLoading) => {
                this.isLoading = load.isLoading;
                this.isData = load.isData;
                // this.isLoading = false
              },
            });
          }
          Swal.close();
          //  this.dataPagina()
        },
        error: (err) => {
          console.log('error ->', err);
        },
        complete: () => {},
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
