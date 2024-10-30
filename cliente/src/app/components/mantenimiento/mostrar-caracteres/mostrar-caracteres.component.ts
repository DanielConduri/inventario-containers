import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';

@Component({
  selector: 'app-mostrar-caracteres',
  templateUrl: './mostrar-caracteres.component.html',
  styleUrls: ['./mostrar-caracteres.component.css']
})
export class MostrarCaracteresComponent implements OnInit {

  menuTabSelected: number = 0;
  typeView: boolean = false;
  isValue: number = 3;
  condiciones: number = 0;

  listaViews: any = {
    SOPORTE: 0,
    TIPO: 1,
    NIVEL: 2,
    ESTADO: 3,
    REGISTRO: 4,
    PLANIFICACION: 5
    // MARCAS: 2
  }

  menuTabSelect:{
    id: number,
    status: boolean,
  } = {
    id: 0,
    status: false
  }

  buttonName!: number;
  private destroy$ = new Subject<any>();

  constructor( public srvMantenimiento: MantenimientoService) { }

  ngOnInit(): void {
    this.srvMantenimiento.preventivo = false
    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabSelect.id = this.listaViews[path.toUpperCase()] || 0;
    this.isValue = 5;

    // Llamado al behaviorSubject
    this.srvMantenimiento.SelectButtonName$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.buttonName = data.id;
          // console.log('lo mque llega ->>>>', this.buttonName)
        }
      });
  }

  mostrarSoporte() {
    this.menuTabSelect.id= 6
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 9
    this.srvMantenimiento.typeview = true
    
  }

  mostrarTipo() { 
    this.menuTabSelect.id = 7
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 10;
  }

  mostrarNivel() {
    this.menuTabSelect.id = 8
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 11;
  }

  mostrarEstado() {
    this.menuTabSelect.id = 9
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 12;
  }

  mostrarRegistro() {
    this.menuTabSelect.id = 10
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 13;
  }

  mostrarPlanificacion() {
    this.menuTabSelect.id = 11
    this.srvMantenimiento.setButtonName(this.menuTabSelect);
    this.isValue = 14;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
