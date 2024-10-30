import { Component, OnInit } from '@angular/core';
import { CentrosService } from 'src/app/core/services/centros.service';

@Component({
  selector: 'app-detalles-centros',
  templateUrl: './detalles-centros.component.html',
  styleUrls: ['./detalles-centros.component.css']
})
export class DetallesCentrosComponent implements OnInit {

  detalles: any

  constructor(public srvCentros: CentrosService) { }

  ngOnInit(): void {
    console.log('lo que llega ->', this.srvCentros.datosDetalles)
    this.detalles = this.srvCentros.datosDetalles
  }

}
