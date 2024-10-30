import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { takeUntil, Subject } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
@Component({
  selector: 'app-importar-catalogo',
  templateUrl: './importar-catalogo.component.html',
  styleUrls: ['./importar-catalogo.component.css']
})
export class ImportarCatalogoComponent implements OnInit {

  //delcramos las variables a utilizar
  result!: any;
  table: boolean = true;
  tablaInfo: boolean = false;
  info!: boolean;

  //Declramos el destroy$
  private destroy$ = new Subject<any>();

  //Declaramos el formulario
  myForm!: FormGroup;

  //Delcramos las variables para el archivo CSV
  fil!: File
  data!: any[][]
  colums!: string[];
  clear!: string[][];
  cli!: string[]


  constructor(
    private srvCaracteristicas: CaracteristcasService,
    private srvModal: ModalService,
    private fb: FormBuilder,
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

  //funcion para seleccionar el archivo
  selectFile(event: any) {
    this.fil = event.target.files[0];
    const file = event.target.files[0];
    this.info = false


    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        this.parseCSV(reader.result as string);
      };
    }
  }

  //funcion para parsear el archivo CSV
  parseCSV(csvText: string) {
    const rows = csvText.split('\n');
    this.data = rows.map(row => row.split(/[,;]/));
    this.colums = Object.keys(this.data[0])
    // console.log('Dentro de parse Cvs1 que tiene colums => ', this.colums);
  }

  //funcion para importar el archivo CSV
  importFile() {
    // console.log('Entre al click')
    const formData = new FormData();
    formData.append('file', this.fil, this.fil.name);

    // console.log('file => ', formData)

    Swal.fire({
      title: 'Importando Datos de Catalogo',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCaracteristicas.postFileCatalogo(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rest) => {
          Swal.close();
          this.result = rest;
          // console.log("Que me responde el homero: ", rest);
          if (rest.status) {
            Swal.close();
              // this.myForm.reset()
              if(rest.repetidos > 0){
                Swal.fire({
                  title: "Existen registros repetidos",
                  icon: 'warning',
                  text: `Se importaron ${rest.insertados} nuevos registros`,
                  showDenyButton: false,
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.data = this.clear
                    this.colums = this.cli
                    this.getCatalogo();
                  }
                });
              }else{
                Swal.fire({
                  title: "Catalogo importado correctamente",
                  icon: 'success',
                  text: `Se importaron ${rest.insertados} nuevos registros`,
                  showDenyButton: false,
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.data = this.clear
                    this.colums = this.cli
                    this.getCatalogo();
                  }
                });
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
                this.getCatalogo();
              }
            }
            )
          }
          setTimeout(() => {
            this.getCatalogo();
            Swal.close();
          }, 3000);
        },
        error: (error) => {
          console.log('error: ', error);
        },
        complete: () => {
          // console.log('Importacion Completada xD');
          this.data = this.clear
          this.colums = this.cli
          this.myForm.reset()
          this.srvModal.closeModal();
          this.getCatalogo();
        }
      })
  }


  //Funcion para mostrar el catalogo
  getCatalogo(){
    //llamamos al servicio de caracteristicas y le enviamos los datos del formulario
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCaracteristicas.getCatalogo({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resCatalogo) => {
        // console.log("Exito!");
        this.srvCaracteristicas.datosCatalogo = resCatalogo.body;

      },
      error: (err) => {
        console.log("Error al obtener los catalogos =>", err);
        //configuramos el sweetalert
        Swal.fire({
          title:'Error al obtener los catalogos',
          icon:'error',
          showConfirmButton:false,
          timer:1500,
        })
      },
      complete: () => {
        // console.log("Peticion catalogos completa");
        //reiniciamos el formulario
        this.myForm.reset();
      }
    });
  }



  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
