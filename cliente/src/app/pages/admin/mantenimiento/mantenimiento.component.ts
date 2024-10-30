import { Component, OnInit, OnDestroy } from '@angular/core';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit, OnDestroy {

  isValue: number = 0;
  baseUrl = config.URL_BASE_PATH;
  typeViewMenu: boolean = true;
  id!: any;

  private destroy$ = new Subject<any>();


  constructor(public srvMenu: MenuService, public srvMantenimiento: MantenimientoService) {
   }
  menuTabsSelected: number = 0;
  menuTabInventory: number = 0;


  listaViews: any = {
    MANTENIMIENTOS: 0,
    CARACTERES: 1,
    ADMINISTRACION: 2
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

  special!: boolean 
  special_agg!: boolean

  ngOnInit(): void {
    this.srvMantenimiento.especial = false
    this.srvMantenimiento.edidMantenimientoCorrectivo = false
    this.srvMantenimiento.preventivo = false
    // this.special = true
    if(this.srvMantenimiento.typeviw){
      // console.log('dentro del if')
      // this.special_agg = true
    }else{
      // console.log('fuera del if')
    }

    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabsSelected = this.listaViews[path.toUpperCase()] || 0;
    // console.log('probando -------->', this.menuTabsSelected);
    this.srvMantenimiento.SelectButtonName$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.menuTabInventory = data.id;
          // console.log('lo que viene del type ->', data);
          this.srvMantenimiento.typeviw = data.status;
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

    this.srvMantenimiento.typeviw = true
  }

  agg(){
    this.srvMantenimiento.especial = true
    this.srvMantenimiento.typeview = false
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
