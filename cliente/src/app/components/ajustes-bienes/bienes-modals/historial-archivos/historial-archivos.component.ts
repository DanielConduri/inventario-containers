import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial-archivos',
  templateUrl: './historial-archivos.component.html',
  styleUrls: ['./historial-archivos.component.css']
})
export class HistorialArchivosComponent implements OnInit {
  isLoading: boolean = false
  isData: boolean = false;

  private destroy$ = new Subject<any>();

  constructor(public srvInventario: InventarioService) { }

  ngOnInit(): void {
    this.getArchivos()
  }

  getArchivos(){
    Swal.fire({
      title: 'Cargando Historial...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvInventario.getArchivos()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        Swal.close()
        // this.isLoading = false
        console.log('lo que llega', data)
        this.srvInventario.archivos = data.body
      },
      error: (error) => {
        console.log('Error ->', error)
      }
    })
  }

}
