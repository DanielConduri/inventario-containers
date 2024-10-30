import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import config from 'config/config';

@Component({
  selector: 'app-mostrar-menus',
  templateUrl: './mostrar-menus.component.html',
  styleUrls: ['./mostrar-menus.component.css']
})
export class MostrarMenusComponent implements OnInit {

  isData: boolean = false;
  private destroy$ = new Subject<any>();

  elementForm: {
    //Establecemos los elementos "formulario" y "title" para inicializarlos en el modal
    form: string,
    title: string,
    special: boolean
  } = {
    //inicializamos los elementos en vacio
    form: 'editarMenu',
    title: 'Modificar Menú',
    special: true
  }

  permiso: {
    bln_editar: boolean,
    bln_eliminar: boolean,
  } = {
    bln_editar: false,
    bln_eliminar: false
  }

  constructor( public srvMenu: MenuService, public srvModal: ModalService ) { }

  ngOnInit(): void {
    this.getMenus();
    this.permisos();
  }

  getMenus(){
    console.log('llega al get menus')
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.srvMenu.getMenu()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        if(data.status){
          this.isData = true;
          this.srvMenu.datosMenu = data.body;
          // console.log('datosMenu: ', data);
          Swal.close();
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
      }
    })
  }

  selectView( _id: number){
   this.srvMenu.setData_menu(_id, false);
   }

   editarMenu( _id: number){
    this.srvMenu.setData_menu(_id, true);
   this.srvModal.setForm(this.elementForm);
    this.srvModal.openModal();
   }

   cambiarEstado( _id: number){
    Swal.fire({
      title: "¿Está seguro que desea desactivar este Menú?",
      text: 'Al deshabilitar un Menú, este no podra aparecer en el sistema. Este cambio puede ser revertido en cualquier momento',
      showDenyButton: true,
      confirmButtonText: `Si, cambiar`,
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvMenu.deleteMenuId(_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            if(data.status){
              Swal.fire({
                title: data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
              });
            }else{
              Swal.fire({
                title: data.message,
                icon: 'warning',
                showDenyButton: false,
                confirmButtonText: `Aceptar`
              });
            }
            setTimeout(() => {
              this.getMenus();
            },3000)
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
          window.location.href = config.URL_BASE_PATH + '/welcome';
            location.reload()
          }
        })
      } else if (result.isDenied) {
        Swal.fire('No se ha realizado ningún cambio', '', 'info')
      }
    })
   }

   permisos(){
    console.log('donde llegaaa')
    this.permiso = {
      bln_editar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/menus')?.bln_editar ?? false,
      bln_eliminar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/menus')?.bln_eliminar ?? false
    };
  }

   ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
