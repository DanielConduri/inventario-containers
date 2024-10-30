import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { historicoBienModel } from 'src/app/core/models/Bienes/Inventario/otros';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-historial-bien',
  templateUrl: './historial-bien.component.html',
  styleUrls: ['./historial-bien.component.css']
})
export class HistorialBienComponent implements OnInit {

  private destroy$ = new Subject<any>();

  idBien!: number;
  codBien!: any;


  constructor(
    public srvInventario: InventarioService,
    public srvModal: ModalService,
  ) { }

  ngOnInit(): void {

    //obtenemos el id del Bien
    this.srvModal.SelectID_Bien$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        // console.log("recibiendo informacion del Bien seleccionado =>", getId);
        this.idBien = getId;
      }
    })

    //obtenemos la informacion historica del bien
    this.getHistoricoBien();

  }

  //metodo para obtener la informacion historica del bien por id
  getHistoricoBien(){
    this.srvInventario.getHistorico(this.idBien)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: historicoBienModel) => {
        // console.log('Respuesta del historico del Bien =>', res);
        this.srvInventario.historicoBien = res.body;
        this.codBien = this.srvInventario.historicoBien[0].str_codigo_bien_cod;
        // console.log('Array de historico del Bien =>', this.srvInventario.historicoBien);

      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
