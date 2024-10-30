import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { modProveedorModel, ProveedorShowModel, ModelPagProveedor } from 'src/app/core/models/Bienes/Caracteristicas/proveedores';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { MostrarProveedorComponent } from '../mostrar-proveedor/mostrar-proveedor.component';
@Component({
  selector: 'app-modificar-proveedor',
  templateUrl: './modificar-proveedor.component.html',
  styleUrls: ['./modificar-proveedor.component.css']
})
export class ModificarProveedorComponent implements OnInit {

  private destroy$ = new Subject<any>()
  myForm!: FormGroup;
  idProveedor!: number;
  component!: MostrarProveedorComponent;


  constructor(
    private srvModal:ModalService,
    private srvCaracteristicas: CaracteristcasService,
    private fb_Proveedor: FormBuilder,
  ) {
    this.myForm = this.fb_Proveedor.group({
      str_proveedor_nombre: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z]/)]
      ],
      str_proveedor_ruc:
      ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      str_proveedor_estado: [
        null,
        [Validators.required]
      ]
    });
   }

  ngOnInit(): void {
    this.completeForm();
  }

  completeForm(){
    // console.log("Recibiendo el Valor del ID PROVEEDOR =>", this.srvModal.SelectID_Proveedor$)
    this.srvModal.SelectID_Proveedor$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        this.idProveedor = getId;
        this.getProveedorID();
      },
      error: (err) => {
        console.log("Error =>", err)
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  getProveedorID(){
    this.srvCaracteristicas.getProveedorId(this.idProveedor)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataProveedor: modProveedorModel) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        this.myForm = this.fb_Proveedor.group({
          str_proveedor_nombre: [
            dataProveedor.body.str_proveedor_nombre,
            [Validators.required, Validators.pattern(/^[a-zA-Z]/)],
          ],
          str_proveedor_ruc: [
            dataProveedor.body.str_proveedor_ruc,
            [Validators.required, Validators.pattern('[0-9]{13}')],
          ]
        });
      },
      error: (err) => {
        console.log("Error =>", err)
      },
      complete: () => {
        Swal.close();
      }
    });
  }

  modifyProveedor(){
    const modifyData = this.myForm.value;
    Swal.fire({
      title: '¿Está seguro que desea modificar este proveedor?',
      showDenyButton: true,
      confirmButtonText: 'Modificar',
      denyButtonText: 'Cancelar',
    }).then((result) =>{
      if(result.isConfirmed){
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          }
        });
        this.srvCaracteristicas.putProveedorById(this.idProveedor, modifyData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (dataProveedor) => {
            if(dataProveedor.status){
              Swal.fire({
                title: 'Proveedor modificado con éxito',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
              });
              this.myForm.reset();
              this.srvModal.closeModal();
            }
            setTimeout(() => {
              this.myForm.reset();
              this.getProveedorID();
            }), 3000;
          },
          error: (err) => {
            console.log("Error =>", err)
          },
          complete: () => {
            this.showProveedor();
          }
        });
      }
    });
  }

  showProveedor(){
    Swal.fire({
      title: 'Cargando',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvCaracteristicas.getProveedorP({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataProveedor: ModelPagProveedor) => {
        Swal.close();
        this.srvCaracteristicas.datosProveedor = dataProveedor.body;
      },
      error: (err) => {
        console.log("Error =>", err)
      },
      complete: () => {
        this.myForm.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
