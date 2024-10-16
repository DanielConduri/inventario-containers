import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BienesService } from 'src/app/core/services/Bienes-Services/bienes.service';

@Component({
  selector: 'app-mostrar-caracteristicas',
  templateUrl: './mostrar-caracteristicas.component.html',
  styleUrls: ['./mostrar-caracteristicas.component.css']
})
export class MostrarCaracteristicasComponent implements OnInit {

  menuTabSelected: number = 0;
  typeView: boolean = false;
  isValue: number = 3;
  condiciones: number = 0;

  listaViews: any = {
    ESTADOS: 0,
    PROVEEDORES: 1,
    MARCAS: 2
  }

  buttonName!: number;
  private destroy$ = new Subject<any>();

  constructor(
    public srvBienes: BienesService,
  ) { }

  ngOnInit(): void {
    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabSelected = this.listaViews[path.toUpperCase()] || 0;
    this.isValue = 5;

  // Llamado al behaviorSubject
  this.srvBienes.SelectButtonName$
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (data) =>{
      this.buttonName = data;
    }
  });
  }

  mostrarEstados(){
    this.menuTabSelected = 6;
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 9;
  }

  mostrarProveedores(){
    this.menuTabSelected = 7;
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 10;
  }

  mostrarMarcas(){
    this.menuTabSelected = 8;
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 11;
  }

  mostrarCatalogo(){
    this.menuTabSelected = 9;
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 12;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
