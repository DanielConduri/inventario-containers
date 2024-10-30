import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { pagMarcas} from 'src/app/core/models/Bienes/Caracteristicas/marcas';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from '../../../../core/services/modal.service';
import { PaginacionService } from 'src/app/core/services/paginacion.service';

@Component({
  selector: 'app-agregar-marca',
  templateUrl: './agregar-marca.component.html',
  styleUrls: ['./agregar-marca.component.css']
})
export class AgregarMarcaComponent implements OnInit {

  myForm!: FormGroup;
  private destroy$ = new Subject<any>()

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
    public fb_Marca: FormBuilder,
    public srvCaracteristicas: CaracteristcasService,
    public srvModal: ModalService,
    public srvPaginacion: PaginacionService
  ) {
    this.myForm = this.fb_Marca.group({
      str_marca_nombre: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z]/)]
      ],
      str_marca_estado:[
        "ACTIVO",
        [Validators.required]
      ]
    })
  }

  ngOnInit(): void {
  }

  agregarMarca(){
    const sendMarcaData = this.myForm.value;
    Swal.fire({
      title:'Esta seguro de añadir esta marca?',
      showDenyButton:true,
      confirmButtonText:'Agregar',
      denyButtonText:'Cancelar'
    }).then((result) =>{
      if(result.isConfirmed){
        this.srvCaracteristicas
          .postMarcas(sendMarcaData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resMarca) => {
              // console.log('Recibiendo data del AgregarMarca =>', resMarca);
              if(resMarca.status){
                Swal.fire({
                  title:'Marca agregada con éxito!',
                  icon:'success',
                  showConfirmButton:false,
                  timer:1500
                })
                // console.log('Data Agregada del AgregarMarca =>', resMarca);
              }else{
                Swal.fire({
                  title:'Error al agregar la marca!',
                  icon:'error',
                  showConfirmButton:false,
                  timer:1500
                });
              }
              setTimeout(()=>{
                this.showMarcas();
                Swal.close();
              }, 3000)
            },
            error: (err) => {
              Swal.fire({
                title:'Error al agregar la marca!',
                icon:'error',
                showConfirmButton:false,
                timer:1500
              })
            },
            complete: () => {
              this.showMarcas()
              this.myForm.reset()
              this.srvModal.closeModal()
            }
          });
      }
    })
  }

  showMarcas(){
    this.srvCaracteristicas.getMarcasP({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resMarca: pagMarcas) => {
        this.srvCaracteristicas.datosMarcas = resMarca.body;
        this.metadata = resMarca.total;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.myForm.reset();
        this.dataPagina();
      }
    });
  }

  dataPagina(){
    this.elementPagina.dataLength = this.srvCaracteristicas.datosMarcas ? this.srvCaracteristicas.datosMarcas.length : 0;
    this.elementPagina.metaData = this.metadata;
    this.elementPagina.currentPage = 1
    this.srvPaginacion.setPagination(this.elementPagina)
  }

  cleanForm(){
    this.myForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
