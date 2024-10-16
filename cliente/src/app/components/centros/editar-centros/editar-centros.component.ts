import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { cargaLoading, pagCenter } from 'src/app/core/models/centros';
import { CentrosService } from 'src/app/core/services/centros.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-centros',
  templateUrl: './editar-centros.component.html',
  styleUrls: ['./editar-centros.component.css']
})
export class EditarCentrosComponent implements OnInit, OnDestroy {

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

  isLoading: boolean = false
  isData: boolean = false;

  private destroy$ = new Subject<any>() //Se crea para que no exista desbordamiento de datos
  myForm!: FormGroup

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
    cod: string []
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
    ubica: string [];
    cod: string []
  } = {
    ubica: [],
    cod: []
  }

  constructor(private srvCentros: CentrosService,
              private srvModal: ModalService,
              private srvPaginacion: PaginacionService,
              private fb: FormBuilder) {
                this.myForm = this.fb.group({
                  centro_nombre: [
                    "", [Validators.required]
                  ],
                  centro_tipo: [
                    ""
                  ],
                  centro_sede: [
                    null
                  ],
                  nombre_facultad: [
                    ""
                  ],
                  codigo_facultad: [
                    ""
                  ],
                  nombre_carrera: [
                    ""
                  ],
                  codigo_carrera: [
                    ""
                  ],
                  nombre_ubicacion: [
                    ""
                  ],
                  codigo_ubicacion: [
                    ""
                  ],
                  nombre_dependencia: [
                    ""
                  ],
                  codigo_dependencia: [
                    ""
                  ]
                })

   }

  ngOnInit(): void {
    // console.log(this.srvCentros.idModify);
    this.pasarPagina(1)
    this.modifyCenter()
  }

  modifyCenter(){
    Swal.fire({
      title: 'Cargando Centros...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvCentros.getDetalles(this.srvCentros.idModify)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        Swal.close()
        console.log('datos modify ->', data.body);
        if(data.body.str_centro_tipo_nombre == 'ACADÉMICO'){
          this.myForm = this.fb.group({
            centro_nombre: [
              data.body.str_centro_nombre, [Validators.required]
            ],
            centro_tipo: [
              data.body.str_centro_tipo_nombre, /*[Validators.required]*/
            ],
            centro_sede: [
              data.body.str_centro_nombre_sede, /*[Validators,require]*/
            ],
            nombre_facultad: [
              data.body.str_centro_nombre_facultad, /*[Validators,require]*/
            ],
            codigo_facultad: [
              data.body.str_centro_cod_facultad,
            ],
            nombre_carrera: [
              data.body.str_centro_nombre_carrera,
            ],
            codigo_carrera: [
              data.body.str_centro_cod_carrera
            ]
          })
          console.log('formulario ->', this.myForm.value);
          this.cambio()
        } else{
          this.myForm = this.fb.group({
            centro_nombre: [
              data.body.str_centro_nombre, [Validators.required]
            ],
            centro_tipo: [
              data.body.str_centro_tipo_nombre, /*[Validators.required]*/
            ],
            centro_sede: [
              data.body.str_centro_nombre_sede, /*[Validators,require]*/
            ],
            nombre_ubicacion: [
              data.body.str_centro_nombre_proceso, /*[Validators.required]*/
            ],
            codigo_ubicacion: [
              data.body.int_centro_id_proceso, /*[Validators.required]*/
            ],
            nombre_dependencia: [
              data.body.str_centro_nombre_dependencia, /*[Validators.required]*/
            ],
            codigo_dependencia: [
              data.body.int_centro_id_dependencia, /*[Validators.required]*/
            ]
          })
          console.log('formulario ->', this.myForm);
          this.cambio()
        }
      },
      error: (err) => {
        console.log('error ->', err);
      }
    })
  }


  cambio(){
    this.elementCenterAc.name = this.myForm.value.centro_nombre
    this.elementCenterAc.type = this.myForm.value.centro_tipo
    this.elementCenterAc.sede = this.myForm.value.centro_sede
    this.elementCenterAc.codfacultad = this.myForm.value.codigo_facultad
    this.elementCenterAc.codcarrera = this.myForm.value.codigo_carrera

    this.elementCenterAd.name = this.myForm.value.centro_nombre
    this.elementCenterAd.type = this.myForm.value.centro_tipo
    this.elementCenterAd.sede = this.myForm.value.centro_sede
    this.elementCenterAd.dependenciaId = this.myForm.value.codigo_dependencia
    this.elementCenterAd.ubicacion = this.myForm.value.codigo_carrera

    if(this.elementCenterAc.type == 'ACADÉMICO'){
      // this.facul()
        // this.myForm.reset()
    }else 
    // if(this.elementCenterAc.type == 'ADMINISTRATIVO')
    {

      // this.ubi()
      // console.log('entro');
    }
  }

  
  update(){
    Swal.fire({
      title:'¿Está seguro de modificar este Centro ?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then(( result )=>{
      if(result.isConfirmed){
    console.log('formulario ->', this.myForm.value);
    this.srvCentros.editCentros(this.srvCentros.idModify, this.myForm.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(data) =>{
        if(data.status){
          Swal.fire({
            icon:'success',
            title: data.message,
            showConfirmButton:false,
            timer:3000
          })
        }else{
          Swal.fire({
            icon:'error',
            title: data.message,
            showConfirmButton:false,
            timer:3000
          })
        }
        setTimeout(() => {
        this.getCentros()
        Swal.close();
        }, 3000);
      }, 
      error: (err) =>{
        console.log('error ->', err);
      },
      complete: () =>{
        this.srvModal.closeModal()
      }
    })
  }})
  }


  getCentros() {
    Swal.fire({
      title: 'Cargando Centros...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvCentros.getCenter({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (center: pagCenter) => {
          if (center.body.length > 0) {
            this.isData = true;
            this.isLoading = true;
            this.srvCentros.datosCentros = center.body
            this.metadata = center.total;
          this.dataPagina()

          } else {
            this.srvCentros.SelectIsCarga$
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (load: cargaLoading) => {
                  this.isLoading = load.isLoading;
                  this.isData = load.isData;
                }
              })
          }
          Swal.close();
        }
        , error: (err) => {
          console.log('error ->', err);
        },
        complete: () => {
        }
      })
  }

  dataPagina() {
    this.elementPagina.dataLength = this.srvCentros.datosCentros ? this.srvCentros.datosCentros.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = this.mapFiltersToRequest.page
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  pasarPagina(page: number) {
    this.mapFiltersToRequest = { saze: 10, page };
    console.log('que sale map --->', this.mapFiltersToRequest);
    this.getCentros();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }


}
