import { Component, OnInit } from '@angular/core';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { InformesService } from 'src/app/core/services/informes.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { ReportesService } from 'src/app/core/services/reportes.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

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

  constructor(
    public srvMenu: MenuService,
    public srvPersonas: PersonasService,
    public srvReportes: ReportesService,
    public srvInformes: InformesService
  ) { }


  ngOnInit(): void {
    this.srvInformes.typeviw = true
    this.srvInformes.typeview = true
    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabSelect.id = this.listaViews[path.toUpperCase()] || 0;
    this.isValue = 5;

    this.srvReportes.SelectButtonName$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        this.buttonName = data.id
      }
    })

  }

  mostrarGeneral(){
    this.menuTabSelect.id= 6
    this.srvReportes.setButtonName(this.menuTabSelect);
    this.isValue = 9
    // this.srvMantenimiento.typeview = true
  }

  mostrarMantenimiento(){
    this.menuTabSelect.id = 7
    this.srvReportes.setButtonName(this.menuTabSelect);
    this.isValue = 10;
  }

  //funcion para permisos de ver
  permisoVer(path: string) {
    let per = this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_ver ?? false;
    return per
  }

  //funcion para permisos de crear
  permisoCrear(path: string) {
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_crear ?? false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
