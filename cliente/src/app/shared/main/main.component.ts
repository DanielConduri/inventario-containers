import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuService } from 'src/app/core/services/menu.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private destroy$ = new Subject<any>();

  time: boolean = false
  nombreRol: string = 'PÚBLICO';

  // widt = this.srvSideBar.setSize();
  widt = 1053
  constructor( public srvMenu: MenuService,
    public srvPersona: PersonasService,
    public srvSideBar: SidebarService) { 
    // this.getWithd()
    // this.getPermisos()
    
  }
  
  ngOnInit(): void {
    // console.log('el main ejecutandose')
   
  
  }


  // getPermisos(){
  //   Swal.fire({
  //     title: 'Cargando...',
  //     didOpen: () => {
  //       Swal.showLoading()
  //     },
  //   });
  //   console.log('me ejecute de segundo_>>>>>>>>><')

  //   this.nombreRol = this.srvPersona.nameRol;
  //   this.srvMenu.getPermisosLogin(this.nombreRol)
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe( {
  //     next: (resp) => {
        
  //       Swal.close()
  //       console.log('lo que viene en respuesta->>',resp)
  //     if(resp.status){

  //       this.srvMenu.permisos = resp.permisos;
  //       const ajustesIndex = resp.menus.findIndex(menu => menu.str_menu_path === 'ajustes'); // Buscar el índice del objeto dataPermisoMenu que tiene 'str_menu_path' igual a 'ajustes'
  //       if (ajustesIndex !== -1) { // Si existe el índice
  //         this.srvMenu.ajustesMenu = resp.menus[ajustesIndex];
  //         console.log('mrnu impreso',this.srvMenu.ajustesMenu.str_menu_path)
  //         console.log('me ejecute de segundo')
  //         if ( resp.menus[ajustesIndex].str_menu_path === 'ajustes' ) {
  //         resp.menus.splice(ajustesIndex, 1); // Eliminar el objeto de la posición del índice
  //         }
  //       }
  //       this.srvMenu.menuItems = resp.menus;
  //       console.log("lo que llega ----->", ajustesIndex);
  //       console.log("lo que llega 2 --->", resp);
  //     }
  //     },
  //     error: (err) => {
  //       console.log('err ->',err);
  //     },
  //     complete: () => {
  //       // this.location.reload();
  //       console.log('se completoo--->>>')
  //     },
  //   })
  // }
  
  



  


  
}
