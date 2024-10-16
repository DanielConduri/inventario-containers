import { Component, OnInit } from '@angular/core';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { AjustesService } from 'src/app/core/services/ajustes.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  
  baseUrl = config.URL_BASE_PATH;
  menuTabsSelected: number = 0;
  //creamos la propiedad "elementForm"
  elementForm: {
    //Establecemos los elementos "formulario" y "title" a los que les
    //designaremos sus respectivos tipos
    form: string,
    title: string,
    special: boolean
  } = {
      //inicializamos los elementos en vacio
      form: '',
      title: '',
      special: true
    }
  typeView: boolean = true;
  typeViewMenu: boolean = true;

  isValue: number = 0;  // This is a class property. By initializing with a value, you can set the default button highlighted
  path: string = '';
  private destroy$ = new Subject<any>();

    

  constructor(public srvSideBar: SidebarService,
    public srvModal: ModalService,
    public srvPersonas: PersonasService,
    public srvMenu: MenuService,
    public srvAjustes: AjustesService
    
  ) { 
    this.path = window.location.pathname.split('/').pop() || '';
    this.menuTabsSelected = this.listaViews[this.path.toUpperCase()] || 0;
    
  }

  listaViews: any = {
    AJUSTES: 0,
    CUENTA: 0,
    MENUS: 1,
    USUARIOS: 2,
    ROLES: 3
  };

  // permiso: {
  //   rol_bln_crear: boolean,
  //   rol_bln_ver: boolean,
  //   menu_bln_crear: boolean,
  //   menu_bln_ver: boolean,
  //   user_bln_crear: boolean,
  //   user_bln_ver: boolean,
  // } = {
  //   rol_bln_crear: false,
  //   rol_bln_ver: false,
  //   menu_bln_crear: false,
  //   menu_bln_ver: false,
  //   user_bln_crear: false,
  //   user_bln_ver: false,    
  // }

  permisosCargados = false;

  height!: number;

  open = false;
  id!: any;
  b!: boolean 

  ngOnInit(): void {
  let c: boolean = this.b

  // this.permisos();
    // const path: string = window.location.pathname.split('/').pop() || '';
    // this.menuTabsSelected = this.listaViews[path.toUpperCase()] || 0;
    
    console.log('probando 1-------->', this.menuTabsSelected);
    this.srvAjustes.setDataVistaConfiguracion(this.menuTabsSelected);
    console.log('probando 2-------->', this.menuTabsSelected);
    this.srvPersonas.selectData_rol$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('lo que llega en configuracion ->', data);
          this.typeView = data.status;
        }

      })

      this.srvMenu.selectData_menu$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.typeViewMenu = data.status;

        }
      })
    this.id = "nav-home-tab"
    this.isValue = 1
    // let pathfull: string
    // let per: boolean = false
    // if(this.path!='ajustes'){
    //    pathfull = 'ajustes/'+this.path;
    // }else{
    //    pathfull = this.path;
    // }
    // per = this.srvMenu.permisos.find(p => p.str_menu_path === pathfull)?.bln_ver ?? false;
    // if(per==false){
    //   console.log('no tiene permiso para ver');
    //   //rederigir a denegado
    //   window.location.href = '/denegado';
    // }
    // console.log('permiso ver ->', per);
  }

  // permisos(){
  //   this.permiso = {
  //     rol_bln_crear: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/roles')?.bln_crear ?? false,
  //     rol_bln_ver: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/roles')?.bln_ver ?? false,
  //     menu_bln_crear: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/menus')?.bln_crear ?? false,
  //     menu_bln_ver: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/menus')?.bln_ver ?? false,
  //     user_bln_crear: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/usuarios')?.bln_crear ?? false,
  //     user_bln_ver: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/usuarios')?.bln_ver ?? false,
      
  //   };
  //   this.permisosCargados = true;
  //   // console.log('probando permisos en configuracion-------->', this.permiso);
  // }

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
