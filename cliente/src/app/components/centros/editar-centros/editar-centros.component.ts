import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  Carrera,
  CentroAcademico,
  CentroAdministrativo,
  Dependencia,
  Facultad,
  Ubicacion,
  cargaLoading,
  pagCenter,
} from 'src/app/core/models/centros';
import { CentrosService } from 'src/app/core/services/centros.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-centros',
  templateUrl: './editar-centros.component.html',
  styleUrls: ['./editar-centros.component.css'],
})
export class EditarCentrosComponent implements OnInit, OnDestroy {
  elementPagina: {
    dataLength: number;
    metaData: number;
    currentPage: number;
  } = {
    dataLength: 0,
    metaData: 0,
    currentPage: 0,
  };

  currentPage = 1;
  metadata: any;
  mapFiltersToRequest: any = {};

  isLoading: boolean = false;
  isData: boolean = false;

  myForm!: FormGroup;
  request = false;

  private destroy$ = new Subject<any>(); //Se crea para que no exista desbordamiento de datos
  // myForm!: FormGroup

  elementCenterAc: CentroAcademico = {
    name: '',
    type: '',
    sede: '',
    codfacultad: '',
    codcarrera: '',
  };

  elementCenterAd: CentroAdministrativo = {
    name: '',
    type: '',
    sede: '',
    dependenciaId: 0,
    ubicacion: '',
  };
  facultad: Facultad = {
    facult: [],
    cod: [],
  };

  carrera: Carrera = {
    carrera: [],
    cod: [],
  };

  dependencia: Dependencia = {
    depen: [],
    cod: [],
  };

  ubicacion: Ubicacion = {
    ubica: [],
    cod: [],
  };

  ubicacionF!: string;
  carreraF!: string;
  ubicacionD!: string;
  dependenciaD!: string;

  especial: boolean = false;

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
    private srvCentros: CentrosService,
    private srvModal: ModalService,
    private srvPaginacion: PaginacionService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      centro_nombre: [''],
      centro_tipo: [''],
      centro_sede: [''],
      nombre_facultad: [''],
      codigo_facultad: [''],
      nombre_carrera: [''],
      codigo_carrera: [''],
      nombre_ubicacion: [''],
      codigo_ubicacion: [''],
      nombre_dependencia: [''],
      codigo_dependencia: [''],
      dc_centro_coordenada_uno: [''],
      dc_centro_coordenada_dos: [''],
    });

    // Google Maps inicializacion
    this.mapTypeId = 'hybrid';

    this.mapOptions = {
      center: { lat: -1.6561367374635219, lng: -78.67699743361786 },
      zoom: 14,
    };
  }

  selecTipo!: boolean;

  selec: boolean = false;

  ngOnInit(): void {
    this.myForm.reset();
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
        this.isLoading = true;
        this.isData = true;
      },
    });
    this.srvCentros.obtenerCentros(this.srvCentros.idModify);
    setTimeout(() => {
      this.modifyCenter();
      this.especial = false;
    }, 1000);
  }

  modifyCenter() {
    this.myForm.reset();
    this.srvCentros
      .getDetalles(this.srvCentros.idModify)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          Swal.close();

          if (this.srvCentros.datosFacultad) {
            this.especial = true;
            this.facultad.facult = this.srvCentros.datosFacultad.map(
              (fac: any) => fac.strNombre
            );
            this.facultad.cod = this.srvCentros.datosFacultad.map(
              (cod: any) => cod.strCodFacultad
            );
            this.elementCenterAc.name = data.body.str_centro_nombre;
            this.elementCenterAc.type = data.body.str_centro_tipo_nombre;
            this.elementCenterAc.sede = data.body.str_centro_nombre_sede;
            this.ubicacionF = data.body.str_centro_nombre_facultad;
            this.carreraF = data.body.str_centro_nombre_carrera;
          }

          if (this.srvCentros.datosDependencia) {
            this.especial = true;
            this.dependencia.depen = this.srvCentros.datosDependencia.map(
              (depe: any) => depe.procesoDependencia
            );
            this.dependencia.cod = this.srvCentros.datosDependencia.map(
              (cod: any) => cod.dependenciaId
            );
            this.elementCenterAd.name = data.body.str_centro_nombre;
            this.elementCenterAd.type = data.body.str_centro_tipo_nombre;
            this.elementCenterAd.sede = data.body.str_centro_nombre_sede;
            this.ubicacionD = data.body.str_centro_nombre_proceso;
            this.dependenciaD = data.body.str_centro_nombre_dependencia;
          }

          this.myForm = this.fb.group({
            centro_nombre: [data.body.str_centro_nombre, [Validators.required]],
            centro_tipo: [data.body.str_centro_tipo_nombre],
            centro_sede: [data.body.str_centro_nombre_sede],
            nombre_facultad: [data.body.str_centro_nombre_facultad],
            codigo_facultad: [data.body.str_centro_cod_facultad],
            nombre_carrera: [data.body.str_centro_nombre_carrera],
            codigo_carrera: [data.body.str_centro_cod_carrera],
            nombre_ubicacion: [data.body.str_centro_nombre_proceso],
            codigo_ubicacion: [data.body.int_centro_id_proceso],
            nombre_dependencia: [data.body.str_centro_nombre_dependencia],
            codigo_dependencia: [data.body.int_centro_id_dependencia],
            dc_centro_coordenada_uno: [data.body.dc_centro_coordenada_uno],
            dc_centro_coordenada_dos: [data.body.dc_centro_coordenada_dos],
          });
          console.log('formulario ->', this.myForm.value);
          if (this.myForm.value.str_centro_tipo_nombre) {
            this.selec = true;
          }
          if (
            this.myForm.value.str_centro_tipo_nombre &&
            this.myForm.value.str_centro_nombre_sede
          ) {
            this.cambio();
          }

          this.marker = {
            position: {
              lat: parseFloat(data.body.dc_centro_coordenada_uno),
              lng: parseFloat(data.body.dc_centro_coordenada_dos),
            },
          };

          // this.cambio();
        },
        error: (err) => {
          console.log('error ->', err);
        },
      });
  }

  cambio() {
    console.log('entra?');
    this.elementCenterAc.name = this.myForm.value.centro_nombre;
    this.elementCenterAc.type = this.myForm.value.centro_tipo;
    this.elementCenterAc.sede = this.myForm.value.centro_sede;

    this.elementCenterAd.name = this.myForm.value.centro_nombre;
    this.elementCenterAd.type = this.myForm.value.centro_tipo;
    this.elementCenterAd.sede = this.myForm.value.centro_sede;

    if (this.elementCenterAc.type && this.elementCenterAc.sede) {
      if (this.elementCenterAc.type == 'ACADÉMICO') {
        this.facul();
        this.selecTipo = true;
      } else {
        this.ubi();
        this.selecTipo = false;
      }
    }
  }

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
          this.srvCentros.datosFacultad = data.body;
          this.facultad.facult = this.srvCentros.datosFacultad.map(
            (fac: any) => fac.strNombre
          );
          this.facultad.cod = this.srvCentros.datosFacultad.map(
            (cod: any) => cod.strCodFacultad
          );
          if (this.myForm.value.nombre_carrera) {
            this.elementCenterAc.codfacultad =
              this.myForm.value.codigo_facultad;
            this.carrer();
          }
        },
        error: (err) => {
          console.log('error ->', err);
        },
      });
  }

  getF(e: any) {
    //
    //esta funcion nos permite obtener la facultad y el id para luego seleccionarlos
    const selectedOption: HTMLOptionElement =
      e.target['options'][e.target['selectedIndex']]; //
    //
    const selectedValue: string = selectedOption.value;
    const selectedId: string = selectedOption.id;
    console.log('e ->', selectedOption);

    if (selectedId) {
      this.myForm.get('codigo_facultad')?.setValue(selectedId);
      this.elementCenterAc.codfacultad = this.myForm.value.codigo_facultad;
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
          console.log('loque sale del servicio ->', data);
          // console.log('body ->', this.elementCenterAc);
          this.srvCentros.datosCarrera = data.body;
          this.carrera.carrera = this.srvCentros.datosCarrera.map(
            (car: any) => car.strNombre
          );
          this.carrera.cod = this.srvCentros.datosCarrera.map(
            (car: any) => car.strCodCarrera
          );
          console.log('se envía carrera ->', this.carrera);
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
      this.myForm.value.codigo_ubicacion = 0;
    }
  }

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
    console.log('entra?');
    const selectedOption: HTMLOptionElement =
      e.target['options'][e.target['selectedIndex']]; //
    const selectedValue: string = selectedOption.value;
    const selectedId: number = parseInt(selectedOption.id);
    console.log('si agarra -->', selectedId);
    if (selectedId) {
      this.myForm.get('codigo_ubicacion')?.setValue(selectedId);
      this.elementCenterAd.ubicacion = this.myForm.value.codigo_ubicacion;
    }

    // console.log('lo que llega -->', this.myFormP.value)
  }

  /*------------------------------------------
    --------------------------------------------
    moveMap()
    --------------------------------------------
    --------------------------------------------*/
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.mapOptions.center = event.latLng.toJSON();

    console.log('event ->', event.latLng?.toJSON());

    this.myForm
      .get('dc_centro_coordenada_uno')
      ?.setValue(this.mapOptions.center?.lat);
    this.myForm
      .get('dc_centro_coordenada_dos')
      ?.setValue(this.mapOptions.center?.lng);

    this.deshabilitar = false;

    console.log(
      'formulario en el Mapa cordenada 1 ->',
      this.myForm.value.dc_centro_coordenada_uno
    );

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

  update() {
    Swal.fire({
      title: '¿Está seguro de modificar este Centro ?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('formulario ->', this.myForm.value);
        this.srvCentros
          .editCentros(this.srvCentros.idModify, this.myForm.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              if (data.status) {
                Swal.fire({
                  icon: 'success',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: data.message,
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              setTimeout(() => {
                this.getCentros();
                Swal.close();
              }, 3000);
            },
            error: (err) => {
              console.log('error ->', err);
            },
            complete: () => {
              this.srvModal.closeModal();
            },
          });
      }
    });
  }

  getCentros() {
    Swal.fire({
      title: 'Cargando Centros...',
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
              },
            });
          }
          Swal.close();
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
