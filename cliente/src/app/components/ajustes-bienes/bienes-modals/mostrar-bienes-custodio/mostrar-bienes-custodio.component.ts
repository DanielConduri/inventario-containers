import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { BienDataModel } from 'src/app/core/models/Bienes/Inventario/otros';
import { BienDataCustodioModel } from 'src/app/core/models/Bienes/Inventario/otros';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  providers: [DatePipe],
  selector: 'app-mostrar-bienes-custodio',
  templateUrl: './mostrar-bienes-custodio.component.html',
  styleUrls: ['./mostrar-bienes-custodio.component.css']
})
export class MostrarBienesCustodioComponent implements OnInit {

  private destroy$ = new Subject<any>();
  strCodigo!: string;
  strCedula!: string;




  constructor(
    private srvModal:ModalService,
    public srvInventario: InventarioService,
  ) { }

  ngOnInit(): void {
    this.completeModal();
  }

  completeModal() {
    // console.log('Recibiendo información de la cédula seleccionada')

    this.srvModal.SelectCedula_Custodio$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getCedula: string) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        
        this.strCedula = getCedula;
        this.getCedulaCustodio();
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


  getCedulaCustodio(){
    this.srvInventario.getBienesCustodioById(this.strCedula)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataCustodio: BienDataCustodioModel) => {
        // console.log("Informacion de los custodios con cada bien =>", dataCustodio)
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.srvInventario.dataBienCustodiosInfo= dataCustodio.body;
        //console.log('Información de los bienes del custodio', this.srvInventario.dataBienCedulaInfo)
        
      },
      error: (err) => {
        console.log("Error al obtener informacion del Bien =>", err)
      },
      complete: () => {
        Swal.close();
      }
    })
  }
}
