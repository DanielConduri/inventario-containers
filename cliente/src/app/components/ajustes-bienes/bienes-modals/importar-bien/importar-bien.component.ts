import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { takeUntil, Subject } from 'rxjs';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-importar-bien',
  templateUrl: './importar-bien.component.html',
  styleUrls: ['./importar-bien.component.css'],
})
export class ImportarBienComponent implements OnInit {
  // ViewChilds
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('stepperDos') stepperDos!: MatStepper;
  @ViewChild('stepperTres') stepperTres!: MatStepper;

  control: FormControl = new FormControl('', [Validators.required])

  // Variables
  result!: any;
  table: boolean = true;
  tablaInfo: boolean = false;
  info!: boolean;
  public formType: string = '';

  myForm!: FormGroup;

  private destroy$ = new Subject<any>();
  fil!: File;
  filName!: string

  mostrarTable!: boolean
  inser!:number
  noInser!:number
  data!: any[][];
  colums!: string[];
  clear!: string[][];
  cli!: string[];

  // Formulario para el Step 1
  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  //Formulario para el Step 2
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
    resolucion: ['', Validators.required],
  });
  //Formulario para el Step 3
  thirdFormGroup = this.fb.group({
    thirdCtrl: ['', Validators.required],
  })

  // Variables para los stepper
  isLinear = false;
  isProcess = false;
  message = false;
  unDisabled = false;
  checker: boolean = false;
  dataLength: number = 0;

  constructor(
    private srvInventario: InventarioService,
    public srvModal: ModalService,
    public fb: FormBuilder,
    public srvPaginacion: PaginacionService
  ) {
    this.myForm = this.fb.group({
      archivo: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.data = this.clear;
    this.colums = this.cli;
    this.myForm.reset();
  }

  // Funcion para cargar el archivo .csv
  async selectFile(event: any) {
    this.mostrarTable=true
    this.fil = event.target.files[0];
    this.filName = this.fil.name;
    console.log('el archivo ->>>>>>>>>', this.filName)

    const file = event.target.files[0];
    this.info = false;

    if (file) {
      console.log('Seleccionando archivo');

      Swal.fire({
        title: 'Cargando Archivo',
        allowOutsideClick: false, // no se puede cerrar con click fuera
        allowEscapeKey: false, // no se puede cerrar con escape
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const reader = new FileReader();
      reader.readAsText(file);
      Swal.close();
      reader.onload = () => {
        this.parseCsv1(reader.result as string);
      };
    }
  }

  // Funcion para parsear el archivo .csv
  parseCsv1(csvText: string) {
    const rows = csvText.split('\n');
    this.data = rows.map((row) => row.split(/[;:]/));
    this.dataLength = this.data.length;
    this.colums = Object.keys(this.data[0]);
    console.log('Dentro de parse Csv1 que tiene columnas =>', this.colums);
  }

  // Funcion para importar & Procesar el archivo .csv
  importFile() {
    console.log('Entrando a importar archivo');
    const formData = new FormData();
    formData.append('file', this.fil, this.fil.name);
    const resolucion = this.secondFormGroup.value.resolucion;
    const resol = document.getElementById('resolucion') as HTMLInputElement
    console.log('Resolucion =>', resolucion);

    console.log('File =>', formData);

    Swal.fire({
      title: '¿Estás seguro de Cargar y Procesar estos Datos?',
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false, // no se puede cerrar con click fuera
      allowEscapeKey: false, // no se puede cerrar con escape
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // El usuario ha aceptado la alerta
        console.log('El usuario ha aceptado la alerta');
        this.isLinear = true;
        this.unDisabled = true;
        console.log('Valor de isLinear =>', this.isLinear);
        //Funcion para cargar los datos del archivo .csv
        this.srvInventario
          .postFileBienes(formData, this.dataLength, resolucion)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res:any) => {
              Swal.close();
              this.result = res;
              console.log('Respuesta del servidor =>', res);

              if (res.status) {

                Swal.fire({
                  title: res.message,
                  icon: 'success',
                  showDenyButton: false,
                  confirmButtonText: 'Aceptar',
                });
                this.isLinear = false;
                this.message = true;
                this.checker = res.status;
                
                this.inser = res.body.int_registro_num_filas_insertadas
                this.noInser = res.body.int_registro_num_filas_no_insertadas
                this.secondFormGroup.get('secondCtrl')?.setValue(res.message);
                setTimeout(() => {
                  this.stepper.next();
                }, 2000);
              } else {
                Swal.close();
                Swal.fire({
                  title: res.message,
                  icon: 'error',
                  showDenyButton: false,
                  confirmButtonText: 'Aceptar',
                });
              }
            },
            error: (err) => {
              Swal.close();
              Swal.fire({
                title: 'Error al importar el archivo',
                icon: 'error',
                showDenyButton: false,
                confirmButtonText: 'Aceptar',
              });
            },
            complete: () => {
              console.log('Complete');
              this.unDisabled = false;
            },
          });
      } else if (result.isDismissed) {
        // El usuario ha cancelado la alerta
        console.log('El usuario ha cancelado la alerta');
      }
    });
  }




  // Funcion para procesar el archivo .csv y llenar tablas
  ProcessFile(){
    console.log('Entrando a procesar archivo');

    this.isProcess = true;
    this.message = true;

    this.srvInventario
      .postProcesoBienes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Dentro del subscribe de proceso de datos');
          Swal.close();
          this.result = res;
          console.log('Respuesta del servidor para el PRoceso =>', res);
          if (res) {
            Swal.fire({
              title: 'Los Bienes se han procesado correctamente!',
              icon: 'success',
              showDenyButton: false,
              confirmButtonText: 'Aceptar',
            });
            this.isProcess = false;
            this.thirdFormGroup.get('thirdCtrl')?.setValue('res.message');
                setTimeout(() => {
                  this.stepper.next();
                }, 2000);
          } else {
            Swal.fire({
              title: 'Los Bienes no se han procesado correctamente!',
              icon: 'error',
              showDenyButton: false,
              confirmButtonText: 'Aceptar',
            });
          }
        },
        error: (err) => {
          Swal.close();
          Swal.fire({
            title: err.message,
            icon: 'error',
            showDenyButton: false,
            confirmButtonText: 'Aceptar',
          });
        },
        complete: () => {
          console.log('Complete');
        }
      });
  }

  // Funcion para limpiar el formulario
  stepperFinalizado() {
    this.myForm.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();

    // this.stepperTres.reset();
    this.stepper.reset();
    this.srvInventario.setData_Bool$(true)

  }

  // Funcion para obtener los bienes de la base de datos
  getBienesOtros() {
    Swal.fire({
      title: 'Cargando Bienes...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvInventario
      .getBienes({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dataOtros: any) => {

          if (dataOtros.body) {

            console.log(
              'Obteniendo Bienes Otros de la base de Datos',
              dataOtros
            );
            this.srvInventario.datosOtros = dataOtros.body;
          }
        },
        error: (err) => {
          console.log('Error al obtener los Bienes Otros', err);
        },
        complete: () => {
          Swal.close();
        },
      });
  }

  //Funcion NgOnDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
