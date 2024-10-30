import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PersonasService } from 'src/app/core/services/personas.service';
import { takeUntil, Subject } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginacionService } from 'src/app/core/services/paginacion.service';

@Component({
  selector: 'app-importar-usuarios',
  templateUrl: './importar-usuarios.component.html',
  styleUrls: ['./importar-usuarios.component.css']
})
export class ImportarUsuariosComponent implements OnInit {

  result!: any;
  table: boolean = true;
  tablaInfo: boolean = false;
  info!: boolean;

  myForm!: FormGroup;
  elementForm: {
    form: string,
    title: string
  } = {
      form: 'masInformationUsu',
      title: 'Más Información'
    }

  private destroy$ = new Subject<any>()
  fil!: File
  data!: any[][]
  colums!: string[];
  clear!: string[][];
  cli!: string[]

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

  constructor(
    private srvPersonas: PersonasService,
    public srvModal: ModalService,
    public fb: FormBuilder,
    public srvPaginacion: PaginacionService

  ) {
    this.myForm = this.fb.group({
      archivo: [
        null,
        [Validators.required],
      ],
    })
  }

  ngOnInit(): void {
    this.data = this.clear
    this.colums = this.cli
    this.myForm.reset()
  }

  selectFile(event: any) {
    this.fil = event.target.files[0];
    const file = event.target.files[0];
    this.info = false


    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        this.parseCsv1(reader.result as string);
      };
    }
  }

  parseCsv1(csvText: string) {
    const rows = csvText.split('\n');
    this.data = rows.map(row => row.split(/[,;]/));
    this.colums = Object.keys(this.data[0])
    // console.log('Dentro de parse Cvs1 que tiene colums => ', this.colums);
  }

  importFile() {
    // console.log('Entre al click')
    const formData = new FormData();
    formData.append('file', this.fil, this.fil.name);
    Swal.fire({
      title: 'Importando Datos de Usuarios',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvPersonas.postFile(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rest) => {
          Swal.close();
          this.result = rest;
          // console.log("Que me responde el homero: ", rest);
          if (rest.status) {
            if (rest.info.cedulasInvalidas.cantidad < 0 || rest.info.usuariosNoIngresados.cantidad < 0 || rest.info.usuariosSinCorreo.cantidad < 0) {
              Swal.close();
              Swal.fire({
                title: rest.message,
                icon: 'success',
                showDenyButton: false,
                confirmButtonText: 'Aceptar',
              });
            } else {
              this.info = true
              Swal.close();
              Swal.fire({
                title: 'Informacion al cargar el archivo',
                html:
                  `
            <div 
            style="
              display: grid;
            ">` +
                  `<div class="cont-message"> <p>${rest.message.messageOne.mensaje} : ${rest.message.messageOne.valor}  </p>
            </div>`
                  + '<br>' +
                  `<p>${rest.message.messageTwo.mensaje} : ${rest.message.messageTwo.valor}</p>`
                  + '<br>' +
                  `<p>${rest.message.messageThree.mensaje} : ${rest.message.messageThree.valor}</p>`
                  + '<br>' +
                  `<p>${rest.message.messageFour.mensaje} : ${rest.message.messageFour.valor}</p>` +
                  ` </div>
            ` ,
                icon: 'warning',
                showDenyButton: false,
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.showUsers();
                }
              })
            }

          } else {
            // console.log("Entra al else: ", rest)
            Swal.close();
            Swal.fire({
              title: rest.message,
              icon: 'error',
              showDenyButton: false,
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.showUsers();
              }
            }
            )
          }
          this.myForm.reset()
        },
        error: (error) => {
          console.log('error: ', error);

        },
        complete: () => {
        }
      })
  }

  showUsers() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvPersonas.getPersonasP({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
        next: (user) => {
          this.srvPersonas.datosPersonas = user.body
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          this.dataPagina()
          Swal.close();
        }
      })
  }

  moreInformation() {
    // console.log("MÁS INFORMACIÓN", this.result);
    this.table = false;
    this.tablaInfo = true;
    this.info = false;
  }

  returnView() {
    // console.log("return");
    this.table = true;
    this.tablaInfo = false;
    this.info = true;
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
