import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { modMarcaModel } from 'src/app/core/models/Bienes/Caracteristicas/marcas';
import { BienDataModel } from 'src/app/core/models/Bienes/Inventario/otros';

@Component({
  selector: 'app-mostrar-info-bien',
  templateUrl: './mostrar-info-bien.component.html',
  styleUrls: ['./mostrar-info-bien.component.css']
})
export class MostrarInfoBienComponent implements OnInit {

  private destroy$ = new Subject<any>();
  idBien!: number;
  idMarca!: number;
  info: any;

  items: any[] = [];

  custodios: any[] = [];


  constructor(
    private srvModal:ModalService,
    public srvInventario: InventarioService,
    public srvCaracteristicas: CaracteristcasService,
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
      }
    })
  }

  data() {
    return {
      info: this.srvInventario.dataBienInfo.str_bien_info_adicional
    }
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
        this.srvInventario.arrayCustodios = dataBien.custodioInterno;
        //console.log("Contenido de dataBien", dataBien)
        //console.log("Contenido de Historial de custodios", dataBien.custodioInterno)
        // console.log("contenido del dataBien", dataBien.body)
        this.idMarca = dataBien.body.int_marca_id;
        // console.log("id de la marca obtenido del Body=>", this.idMarca)
        this.getMarcaID();
        // console.log("Informacion del Bien Escogido =>", this.srvInventario.dataBienInfo)



        this.items = Object.values(dataBien.body.str_bien_info_adicional);
        // console.log("items =>", this.items)
        
        //this.custodios = dataBien.custodioInterno;
      },
      error: (err) => {
        console.log("Error al obtener informaicon del Bien =>", err)
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  getKey(item: any): string {
    return Object.keys(item)[0];
  }

  getValue(item: any): string {
    return item[Object.keys(item)[0]];
  }

  getMarcaID(){
    // console.log("data en oninit id Marca=>",this.idMarca)
    this.srvCaracteristicas.getMarcaId(this.idMarca)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dataMarca: modMarcaModel) => {
        // console.log("Llegando data modMarcaModel =>", dataMarca.body)
        this.srvCaracteristicas.dataMarca = dataMarca.body;
      },
      error:(err) =>{
        console.log("Error =>", err)
        Swal.fire({
          title: 'Error al cargar la marca!',
        });
      },
      complete: () => {
        // console.log("Complete")
        Swal.close();
      }
    });
   }

   deleteInfoAdicional(id: number){
      // console.log("id de la info adicional =>", id)
      // console.log("id del bien =>", this.idBien)
      const idBienSelected = this.idBien;

    Swal.fire({
      title: '¿Estas seguro de eliminar esta informacion adicional?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `No eliminar`,
    }).then((result) => {
      if(result.isConfirmed){
        this.srvInventario.EliminarInfoAdicional(idBienSelected, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            // console.log("data =>", data)
            Swal.fire({
              title: 'Informacion adicional eliminada!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (err) => {
            console.log("Error =>", err)
            Swal.fire({
              title: 'Error al eliminar la informacion adicional!',
            });
          },
          complete: () => {
            // console.log("Complete")
            this.getBienID();
            Swal.close();
          }
        })
      }
    })
   }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
