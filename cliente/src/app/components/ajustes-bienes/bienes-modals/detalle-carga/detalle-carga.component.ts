import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detalle-carga',
  templateUrl: './detalle-carga.component.html',
  styleUrls: ['./detalle-carga.component.css']
})
export class DetalleCargaComponent implements OnInit {

  private destroy$ = new Subject<any>();
  idArchivo!: number;

  codigos: any[] = [];
  estadoCodigos!: boolean;

  constructor(
    private srvModal:ModalService,
    public srvInventario: InventarioService,
  ) { }

  ngOnInit(): void {
    this.completeModal();
  }

  completeModal() {
    this.srvModal.SelectID_Archivo$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.idArchivo = getId;
        this.getArchivoId();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        Swal.close();
        this.srvModal.closeModal();
      }

    })
  }

  getArchivoId() {
    this.srvInventario.getArchivoById(this.idArchivo)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.estadoCodigos = false
        if(data.body) {       
          this.codigos = Object.values(data.body) 
          this.estadoCodigos = true;
        }
        this.srvInventario.detalleCarga = data.data;
        //this.estadoCodigos = false
        
      },
      error: (err) => {
        console.log("Error al obtener información de la carga del archivo", err)
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
