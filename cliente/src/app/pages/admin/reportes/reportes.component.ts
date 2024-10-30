import { Component, OnInit } from '@angular/core';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { InformesService } from 'src/app/core/services/informes.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { ReportesService } from 'src/app/core/services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  isValue: number = 0;  // This is a class property. By initializing with a value, you can set the default button highlighted
  baseUrl = config.URL_BASE_PATH;

  // typeView: boolean = true;
  typeViewMenu: boolean = true;
  id!: any;

  private destroy$ = new Subject<any>();


  constructor(public srvMenu: MenuService,
    public srvPersonas: PersonasService,
    public srvReportes: ReportesService,
    public srvInformes: InformesService
    ) { }
    menuTabsSelected: number = 0;
  menuTabInventory: number = 0;

  

  listaViews: any = {
    REPORTE: 0,
    INFORME: 1,
    TIPO:2
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
    this.srvInformes.typeviw = true
    // this.srvInformes.typeviw = true
    // this.srvInforme.datosSearch = []

    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabsSelected = this.listaViews[path.toUpperCase()] || 0;
    // console.log('probando -------->', this.menuTabsSelected);
    this.srvReportes.SelectButtonName$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.menuTabInventory = data;
          // console.log('lo que viene del type ->', data);
          // this.srvInformes.typeviw = data.status;
          // console.log('que sale ->', this.menuTabInventory);
        }

      })

      this.id = "nav-inventory"
    this.isValue = 1
    this.menuTabInventory = 0;

      // this.srvMenu.selectData_menu$
      // .pipe(takeUntil(this.destroy$))
      // .subscribe({
      //   next: (data) => {
      //     this.typeViewMenu = data.status;

      //   }
      // })

  }

  reinicio(){
    console.log('si entra a la funcion')
    this.srvInformes.typeviw = true
    // this.srvInformes.typeview = true
    console.log('se debio cambiar')
    // this.srvInformes.typeviw = true
  }

    //funcion para permisos de ver
    permisoVer(path: string){
      let per = this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_ver ?? false;
      return per
    }
  
    //funcion para permisos de crear
    permisoCrear(path: string){
      return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_crear ?? false;
    }
    
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
