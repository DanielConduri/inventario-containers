import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  private destroy$ = new Subject<any>();
  nombreRol: string = 'PÚBLICO';

  constructor(
    public srvSideBar: SidebarService,
    public srvMenu: MenuService,
    public srvPersona: PersonasService,
    // private location: Location

    ) {

      srvPersona.selectPermisoRol$.
      subscribe((rol) => {
        this.nombreRol = rol;
        this.getPermisos()
      })

      // console.log('me ejecute de primero', srvMenu.menuItems)
      // this.getPermisos()

   }

  ngOnInit(): void {

    let buttonSidebar = document.getElementById('toggle-sidebar')
    let pContainer = document.querySelector('.pContainer');
    let sidebarBody = document.querySelector(".sidebar");
    let sidebarA = document.querySelector('.link-opcion');
    let settings = document.querySelector('.settings');
    

      sidebarA?.classList.remove('close')
      pContainer?.classList.remove('close')
     settings?.classList.remove('close')
     buttonSidebar?.classList.remove('close')
     sidebarBody?.classList.remove('close')
     this.srvSideBar.getBool(false)

    //  this.getPermisos()

  }

  ngAfterViewInit() {

      this.toggleSidebarBody();
      // this.getPermisos()

  }

  open = false;
  screenWidth = 0;

  toggleSidebar() {
    this.open = !this.open;

    const dividAside = document.querySelector('#idAside') as HTMLDivElement
    let buttonSidebar = document.getElementById('toggle-sidebar')
    let pContainer = document.querySelector('.pContainer');
    let sidebarBody = document.querySelector(".sidebar");
    let sidebarA = document.querySelector('.link-opcion');
    let settings = document.querySelector('.settings');


    if(window.innerWidth < 768){
      // console.log("window.innerWidth < 768")
      let pAside = document.querySelector(".pAside")
      pAside?.classList.toggle('close');


    }else{
    const sidebar = document.getElementById('pSidebar')
    const aside = document.getElementById('idAside')

    if(this.open === true){
      aside?.classList.toggle('close')
    }else{
      aside?.classList.remove('close')
    }

    this.srvSideBar.getBool(this.open)
  }

    if (dividAside.classList.contains('close')) {
      sidebarA?.classList.toggle('close')
      pContainer?.classList.toggle('close')
     settings?.classList.toggle('close')
     buttonSidebar?.classList.toggle('close')
     sidebarBody?.classList.toggle('close')
     this.srvSideBar.getBool(true)


   } else {
      sidebarA?.classList.remove('close')
      pContainer?.classList.remove('close')
     settings?.classList.remove('close')
     buttonSidebar?.classList.remove('close')
     sidebarBody?.classList.remove('close')
     this.srvSideBar.getBool(false)

   }
  }

  toggleSidebarBody(){

      const arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++){
      arrow[i].addEventListener("click", (e)=>{
         let arrowParent = (e.target as Element).parentElement?.parentElement;
         arrowParent?.classList.toggle("showMenu")
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getPermisos(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    // console.log('me ejecute de segundo')
    // this.nombreRol = this.srvPersona.nameRol;
    //console.log('nombre rol aside -->',this.srvPersona.nameRol)
    // console.log('nombre rol',this.nombreRol)
    this.srvMenu.getPermisosLogin(this.nombreRol)
    .pipe(takeUntil(this.destroy$))
    .subscribe( {
      next: (resp) => {
        Swal.close()
        //console.log('permisos aside ->',resp)
      if(resp.status){
        this.srvMenu.permisos = resp.permisos;
        const ajustesIndex = resp.menus.findIndex(menu => menu.str_menu_path === 'ajustes'); // Buscar el índice del objeto dataPermisoMenu que tiene 'str_menu_path' igual a 'ajustes'
        if (ajustesIndex !== -1) { // Si existe el índice
          this.srvMenu.ajustesMenu = resp.menus[ajustesIndex];
          // console.log('mrnu impreso',this.srvMenu.ajustesMenu)
          // console.log('me ejecute de segundo')
          if ( resp.menus[ajustesIndex].str_menu_path === 'ajustes' ) {
          resp.menus.splice(ajustesIndex, 1); // Eliminar el objeto de la posición del índice
          }
        }
        this.srvMenu.menuItems = resp.menus;
        // console.log("lo que llega ----->", ajustesIndex);
        // console.log("lo que llega 2 --->", resp.menus);
      }
      },
      error: (err) => {
        console.log('err ->',err);
      },
      complete: () => {
        // this.location.reload();
      },
    })
  }


}
