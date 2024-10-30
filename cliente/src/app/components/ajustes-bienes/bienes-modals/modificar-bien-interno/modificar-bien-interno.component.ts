import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { centrosModel } from 'src/app/core/models/centros';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { CentrosService } from 'src/app/core/services/centros.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-bien-interno',
  templateUrl: './modificar-bien-interno.component.html',
  styleUrls: ['./modificar-bien-interno.component.css']
})
export class ModificarBienInternoComponent implements OnInit {

  myForm!: FormGroup;
  idBien!: number;
  private destroy$ = new Subject<any>();

  custodioValue: any;


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
    public fb: FormBuilder,
    public srvInventario: InventarioService,
    public srvUsuarios: AjustesService,
    public srvModal: ModalService,
    public srvCentros: CentrosService
  ) {
    this.myForm = this.fb.group({
      valorLleno: [2],
      cedula_user: ['', [Validators.required]],
      str_custodio_interno: ['', [Validators.required]],
      dt_bien_fecha_compra_interno: ['', [Validators.required]],
      str_ubicacion_nombre_interno: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.srvModal.SelectID_Bien$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.idBien = res;
        // console.log('ID del bien => ', this.idBien);
      }
    });

    this.getInfoBien();

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
            this.custodioValue = encargardo;
            // console.log('encargadoValue =>', this.custodioValue);
            this.myForm.get('str_custodio_interno')?.setValue(this.custodioValue);
            this.myForm.get('cedula_user')?.setValue(cedula.value);

            // this.inputEncargado.nativeElement.value = this.custodioValue;
            // this.jsonForm.get('encargado')?.setValue(this.custodioValue);
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

  //Función para obtener la información del bien seleccionado.
  getInfoBien() {
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.srvInventario.getBienById(this.idBien)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          // console.log('Respuesta RES => ', res);
          if (res.body) {
            Swal.close();

            //imprimimos el valor que me llega a la consola
            // console.log('Valor de la respuesta => ', res.body);

            this.srvInventario.dataBienInfo = res.body;

            this.myForm.get('str_custodio_interno')?.setValue(res.body.str_custodio_interno);
            this.myForm.get('cedula_user')?.setValue(res.body.str_custodio_cedula);
            this.myForm.get('dt_bien_fecha_compra_interno')?.setValue(res.body.dt_bien_fecha_compra_interno);
            this.myForm.get('str_ubicacion_nombre_interno')?.setValue(res.body.str_ubicacion_nombre_interno);
            
          } else {
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: 'No se pudo obtener la información del bien',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000
            });
          }
        },
        error: (error) => {
          console.log('Error => ', error);
        },
        complete: () => {
          // console.log('Completado');
        }
      });
  }

  //Funcion para buscar los centros
  getCentros(filter: any) {
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

  // Funcion que realiza la busqueda de los datos de Centro
  changeCentro(e: any) {
    const length = e.target.value.length;
    if (length % 2 === 0) {
      this.getCentros({
        filter: {
          status: { parameter: 'str_centro_estado', data: 'ACTIVO' },
          like: { parameter: 'str_centro_nombre', data: e.target.value },
        },
      });
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
        //return false;
      }
      currentFocus = -1;
      a = document.createElement('DIV');
      a.setAttribute('id', this.id + 'autocomplete-list');
      a.style.position = 'absolute';
      a.style.width = '100%';
      a.setAttribute('class', 'autocomplete-items');
      this.parentNode?.appendChild(a);

      
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

  //Funcion para guardar los cambios

  saveChanges(){

    Swal.fire({
      title: '¿Está seguro de guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if(result.isConfirmed){
        // console.log('Valor del myForm =>', this.myForm.value);
        this.srvInventario.putEditBien(this.idBien ,this.myForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            // console.log('Respuesta de la edicion =>', res);
            Swal.fire({
              title: 'Se ha editado correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            })
            //Cerramos el modal
            this.srvModal.closeModal();
            //Actualizamos la tabla

          },
          error: (err) => {
            console.log('Error al editar =>', err);
            Swal.fire({
              title: 'Error al editar',
              text: err,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            })
          },
          complete: () => {
          }
        });
      }else{
        Swal.fire({
          title: 'No se han guardado los cambios',
          icon: 'info',
          confirmButtonText: 'Aceptar',
        })
      }
    });
  }

  //Funcion getBienes
  getBienes(){
    this.srvInventario.getBienes(1,0)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        // console.log('Respuesta de los bienes =>', res);
      },
      error: (err) => {
        console.log('Error al obtener los bienes =>', err);
      },
      complete: () => {
      }
    });
  }


  //Funcion ngOnDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
