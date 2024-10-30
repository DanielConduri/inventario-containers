import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProveedorShowModel,ModelPagProveedor } from 'src/app/core/models/Bienes/Caracteristicas/proveedores';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-agregar-proveedor',
  templateUrl: './agregar-proveedor.component.html',
  styleUrls: ['./agregar-proveedor.component.css']
})
export class AgregarProveedorComponent implements OnInit {

  myForm!: FormGroup;
  private destroy$ = new Subject<any>()

  //Variables para paginacion
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
    public fb_Proveedor: FormBuilder,
    public srvCaracteristicas: CaracteristcasService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService
  ) {
    this.myForm = this.fb_Proveedor.group({
      str_proveedor_nombre: [
        null,
        [Validators.required,
          Validators.pattern(/^[a-zA-Z!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?]/)]
      ],
      str_proveedor_ruc:
      ['', [Validators.required, Validators.pattern('[0-9]{13}')]],
      str_proveedor_estado: [
        'ACTIVO',
        [Validators.required ,Validators.pattern(/^[a-zA-Z]/)]
      ]
    });
  }
  ngOnInit(): void {
  }



  agregarProveedor(){
    const sendProveedorData = this.myForm.value;

    Swal.fire({
      title:'Esta seguro de añadir este proveedor?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then((result) =>{
      if(result.isConfirmed){
        this.srvCaracteristicas.postProveedor(sendProveedorData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resProveedor) => {
            if(resProveedor.status){
              Swal.fire({
                title:'Proveedor agregado con éxito!',
                icon:'success',
                showConfirmButton: false,
                timer: 1500
              })
              // console.log("Data del proveedor Agregada =>", resProveedor);
            }else{
              Swal.fire({
                title:'Error al agregar proveedor!',
                icon:'error',
                showConfirmButton: false,
                timer: 1500
              })
              // console.log("Error al agregar proveedor =>", resProveedor);
            }
            setTimeout(() => {
              this.showProveedor();
              Swal.close();
            }, 3000);
          },
          error: (err) => {
            console.log("Error al agregar proveedor =>", err);
          },
          complete: () => {
            this.showProveedor();
            this.myForm.reset();
            this.srvModal.closeModal();
          }
        });
      }
    });
  }

  showProveedor(){
    this.srvCaracteristicas.getProveedorP({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resProveedor: ModelPagProveedor) => {
        // console.log("Data del proveedor =>", resProveedor);
        this.srvCaracteristicas.datosProveedor = resProveedor.body;
        this.metadata = resProveedor.total
      },
      error: (err) => {
        console.log("Error al mostrar proveedor =>", err);
      },
      complete: () => {
        // console.log("Proveedor mostrado con exito!");
        this.dataPagina();
        this.myForm.reset();
      }
    });
  }

  dataPagina(){
    this.elementPagina.dataLength = this.srvCaracteristicas.datosProveedor ? this.srvCaracteristicas.datosProveedor.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = 1
    this.srvPaginacion.setPagination(this.elementPagina)
  }
  

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
