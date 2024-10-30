import { Component, OnInit } from '@angular/core';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { MenuService } from 'src/app/core/services/menu.service';
import { PrestamosService } from 'src/app/core/services/prestamos/prestamos.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {

  private destroy$ = new Subject<any>();

  isValue: number = 0;
  baseUrl = config.URL_BASE_PATH;
  typeViewMenu: boolean = true;
  id!: any;


  constructor(
    public srvMenu: MenuService,
    public srvPrestamo: PrestamosService
  ) { }

  menuTabsSelected: number = 0;
  menuTabInventory: number = 0;


  listaViews: any = {
    PRESTAMOS: 0,
    PRESTAMO: 1,
    GESTION: 2
  };

  elementForm: {
    form: string,
    title: string,
    special: true
  } = {
      form: '',
      title: '',
      special: true
    }

  dataValue: any = {
    typeView: true,
    valorView: 0
  }


  ngOnInit(): void {

    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabsSelected = this.listaViews[path.toUpperCase()] || 0;
    console.log('probando -------->', this.menuTabsSelected);
    this.srvPrestamo.SelectButtonName$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.menuTabInventory = data.id;
          // console.log('lo que viene del type ->', data);
          // this.srvPrestamo.typeviw = data.status;
          // console.log('que sale ->', this.menuTabInventory);
          // if (!this.srvMantenimiento.typeviw && this.menuTabInventory != 0) {
          //   this.special = true;
          //   // console.log('en el if otra vez')
          // } 
        }

      })


    this.id = "nav-inventory"
    this.isValue = 1
    this.menuTabInventory = 0;

  }

  agg(){
    this.srvPrestamo.typeview = true
  }

  permisoCrear(path: string) {
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_crear ?? false;
  }

  permisoVer(path: string) {
    let per = this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_ver ?? false;
    return per
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
