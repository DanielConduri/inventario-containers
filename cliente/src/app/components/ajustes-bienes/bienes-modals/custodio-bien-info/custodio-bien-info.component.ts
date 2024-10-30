import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustodioService } from 'src/app/core/services/Bienes-Services/custodio-service/custodio.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { custodiosIDModel, custodiosShowModel } from 'src/app/core/models/Bienes/Custodios/custodios';

@Component({
  providers: [DatePipe],
  selector: 'app-custodio-bien-info',
  templateUrl: './custodio-bien-info.component.html',
  styleUrls: ['./custodio-bien-info.component.css']
})
export class CustodioBienInfoComponent implements OnInit {

  private destroy$ = new Subject<any>();
  idBien!: number;
  idCustodio!: number;

  constructor(
    private srvModal:ModalService,
    public srvInventario: InventarioService,
    public srvCustodio: CustodioService,
  ) { }

  ngOnInit(): void {
    this.completeModal();
  }

  completeModal(){
    // console.log("recibiendo informacion del Bien seleccionado =>", this.srvModal.SelectID_Bien$)

    this.srvModal.SelectID_Bien$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        Swal.fire({
          title: 'Cargando',
          didOpen: () => {
            Swal.showLoading()
          },
        });

        this.idBien = getId;
        this.getBienID();

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
        // this.idCustodio = dataBien.body.int_custodio_id;
        // console.log("Informacion del Bien Escogido =>", this.srvInventario.dataBienInfo)

        const id = this.srvInventario.dataBienInfo.int_bien_id;
        // console.log("id del Bien =>", id)
        this.getCustodioID(id);

      },
      error: (err) => {
        console.log("Error al obtener informaicon del Bien =>", err)
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  getCustodioID(int_bien_id: number){
    // console.log("data en onInit Custodio =>", this.idCustodio)

    this.srvCustodio.getCustodioID(int_bien_id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataCustodio: custodiosIDModel) => {
        // console.log("Informacion del Custodio =>", dataCustodio.body)
        if(dataCustodio.body.length > 0){
          this.srvCustodio.datosCustodios = dataCustodio.body;
          // console.log("Informacion del Custodio =>", this.srvCustodio.datosCustodios)
        }
      },
      error:(err) =>{
        console.log("Error =>", err)
        Swal.fire({
          title: 'Error al cargar Custodio!',
        });
      },
      complete: () => {
        // console.log("Complete")
        Swal.close();
      }
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
