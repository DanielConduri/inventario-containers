import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-bien',
  templateUrl: './modificar-bien.component.html',
  styleUrls: ['./modificar-bien.component.css'],
})
export class ModificarBienComponent implements OnInit {
  @ViewChild('inputKey') inputKey!: ElementRef;
  @ViewChild('inputValue') inputValue!: ElementRef;
  @ViewChild('inputEncargado') inputEncargado!: ElementRef;
  @ViewChild('inputDescripcion') inputDescripcion!: ElementRef;
  @ViewChild('inputCaracteristica') inputCaracteristica!: ElementRef;

  private destroy$ = new Subject<any>();

  myForm!: FormGroup;
  idBien!: number;

  jsonForm!: FormGroup;
  items: { key: string; value: any }[][] = [];


  valItems: any[] = [];

  encargadoValue: any;
  fechaActual: string = new Date().toISOString().split('T')[0];
  editarIndex: number = -1;
  disableBtn: boolean = true;
  tablaActualizada: { key: string; value: any }[] = [];
  disabledSelect: boolean = true;

  constructor(
    public fb_Otros: FormBuilder,
    public srvModal: ModalService,
    public srvInventario: InventarioService,
    private cdr: ChangeDetectorRef,
    public srvUsuarios: AjustesService
  ) {
    this.myForm = this.fb_Otros.group({
      valorLLeno: ['', [Validators.required]],
      str_bien_info_adicional: [this.items],
    });

    this.jsonForm = this.fb_Otros.group({
      //key: ['', [Validators.required]],
      //value: ['', [Validators.required]],
      caracteristica: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      encargado: ['', [Validators.required]],
      fecha: new FormControl(new Date().toISOString().split('T')[0]),
    });
  }

  ngOnInit(): void {
    this.srvModal.SelectID_Bien$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (getId: number) => {
        this.idBien = getId;
        // console.log('Reciebiendo el valor del ID del Bien =>', this.idBien);
        // console.log('valor del idBien => ', this.idBien);
      },
    });
    this.fechaActual = new Date().toISOString().split('T')[0];
    this.disabledSelect = true;

    // this.getBienID();
  }

  //Funcion para obtener los datos del bien
  getBienID(){
    this.srvInventario.getBienById(this.idBien)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataBien) => {
        // console.log("Informacion General del Bien =>", dataBien)
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        this.srvInventario.dataBienInfo = dataBien.body;
        this.valItems = Object.values(dataBien.body.str_bien_info_adicional);
        // console.log("items =>", this.items)
      },
      error: (err) => {
        console.log("Error al obtener informaicon del Bien =>", err)
      },
      complete: () => {
        Swal.close();
      }
    })
  }



  //Funcion para obtener los datos del usuario de la centralizada
  obtenerDatosCentralizada(e: any) {
    let cedula = document.getElementById('cedula_user') as any;
    // console.log('Entra ' + cedula.value);
    Swal.fire({
      title: 'Buscando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvUsuarios
      .getCentralizada(cedula.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          // console.log(' lo que llega de la centralizada ->', res);
          if (res.status) {
            Swal.close();
            Swal.fire({
              title: 'Usuario encontrado',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            });
            //Agregarmos el nombre y apellido del usuario encontrado a la tabla de responsables
            const encargardo = res.body.nombre + ' ' + res.body.apellidos;
            this.encargadoValue = encargardo;
            // console.log('encargadoValue =>', this.encargadoValue);
            //Enviamos al viewChild de #inputEncargado el valor de encargado
            this.inputEncargado.nativeElement.value = this.encargadoValue;
            //Colocamos el valor de encargadoValue en el formulario encargado
            this.jsonForm.get('encargado')?.setValue(this.encargadoValue);

            // Imprimimos el valor de JsonForm
            // console.log('Valor de JsonForm => ', this.jsonForm.value);
          } else {
            Swal.close();
            Swal.fire({
              title: 'Usuario no encontrado',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        },
        error: (error) => {
          console.log('err', error);
        },
        complete: () => {
          // this.datoUser()
        },
      });
  }

  // Funciones para JSON Dinamico
  onSubmit() {
    //const clave = this.inputKey.nativeElement.value;
    //const valor = this.inputValue.nativeElement.value;
    const caracteristica = this.inputCaracteristica.nativeElement.value;
    const descripcion = this.inputDescripcion.nativeElement.value;
    const encargado = this.inputEncargado.nativeElement.value;

    const itemCaracteristica = { key: 'caracteristica', value: caracteristica };
    const itemDescripcion = { key: 'descripcion', value: descripcion };
    //const itemClaveValor = { key: clave, value: valor };
    const itemEncargado = { key: 'encargado', value: encargado };
    const itemFecha = { key: 'fecha', value: this.fechaActual };
    const newItem = [itemCaracteristica, itemDescripcion, itemEncargado, itemFecha];
    this.items.push(newItem);

    //le damos el valor de true a valorLLeno
    this.myForm.get('valorLLeno')?.setValue(1);

    //imprimimos el valor de valorLleno
    // console.log(
    //   'Valor de valorLleno => ',
    //   this.myForm.get('valorLLeno')?.value
    // );

    this.resetFormValues();

    // console.log('Valor de items => ', this.items);
  }

  //Funcion que resea los valores del formulario
  resetFormValues() {
    this.jsonForm.get('caracteristica')?.reset();
    this.jsonForm.get('descripcion')?.reset();
    this.jsonForm.get('encargado')?.reset();
  }

  //Funcion para eliminar un item del JSON
  eliminarItem(item: any) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      if (this.editarIndex === index) {
        this.editarIndex = -1;
        this.disableBtn = true;
      }
    }
    // console.log('Valor de items => ', this.items);

    //imprimimos el valor de valorLeno
    // console.log(
    //   'Valor de valorLleno => ',
    //   this.myForm.get('valorLLeno')?.value
    // );
  }

  eliminarItemActual(index:number){
  // Perform deletion logic here
  this.valItems.splice(index, 1);
  this.myForm.get('valorLLeno')?.setValue(1);
  // console.log("Valor de valItems =>", this.valItems)
  // console.log("Valor de valorLleno =>", this.myForm.get('valorLLeno')?.value)

  //Enviamos la informacion al servidor
  this.srvInventario.putEditBien(this.idBien, this.myForm.value)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (res) => {
      // console.log("Respuesta del servidor =>", res)
      Swal.fire({
        title: 'Item eliminado',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  })
  }

  //Funcion para editar un item del JSON
  editarItem(item: any) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.editarIndex = index;
      const i = this.items[index];
      this.jsonForm.get('caracteristica')?.setValue(i[0].value);
      this.jsonForm.get('descripcion')?.setValue(i[1].value);
      this.jsonForm.get('encargado')?.setValue(i[2].value);
      this.disableBtn = false;
      this.disableBtn = false;
    }
  }

  //Funcion para guardar los cambios de un item del JSON
  guardarCambios() {
    if (this.editarIndex !== -1) {
      const item = this.items[this.editarIndex];
      item[0].value = this.jsonForm.get('caracteristica')?.value;
      item[1].value = this.jsonForm.get('descripcion')?.value;
      item[2].value = this.jsonForm.get('encargado')?.value;
      item[3].value = this.jsonForm.get('fecha')?.value;
      this.resetFormValues();
      this.editarIndex = -1;
      this.disableBtn = true;
    }
    // console.log('Valor de items => ', this.items);
    
  }

  //Funcion para Guardar todo el JSON en el formulario
  modifyBien() {
    // console.log('Valor del formulario => ', this.myForm.value);
    const modifyData = {
      str_bien_info_adicional: this.items,
      valorLleno: 1
    }
    Swal.fire({
      title: '¿Está seguro que desea Agregar estas Caracteristicas?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvInventario
          .putEditBien(this.idBien, modifyData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              if (resp.status) {
                // console.log('Respuesta del servidor => ', resp);
                Swal.fire({
                  icon: 'success',
                  title: resp.message,
                  showConfirmButton: false,
                  timer: 2500,
                });

                this.jsonForm.reset();
                this.srvModal.closeModal();
              }
              setTimeout(() => {
                this.jsonForm.reset();
              }),
                3000;
            },
            error: (err) => {
              console.log('Se genero un error');
            },
            complete: () => {
              // console.log('Peticion finalizada');
            },
          });
      }
    });
  }

  getKey(item: any): string {
    return Object.keys(item)[0];
  }

  getValue(item: any): string {
    return item[Object.keys(item)[0]];
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
