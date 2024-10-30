import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';
import { Subject, takeUntil } from 'rxjs';
import { dataNewMenu } from 'src/app/core/models/permisos-menu';
import { dataUser } from 'src/app/core/models/personas';
import { ModalService } from 'src/app/core/services/modal.service';

import Swal from 'sweetalert2';
import config from 'config/config';

@Component({
  selector: 'app-mostrar-submenu',
  templateUrl: './mostrar-submenu.component.html',
  styleUrls: ['./mostrar-submenu.component.css']
})
export class MostrarSubmenuComponent implements OnInit {

  private destroy$ = new Subject<any>();
  _idMenu: number = 0;
  typeViewMenu!: boolean;
  dataMenu!: dataNewMenu;

  elementForm!: dataUser

   addForm: {
    form: string,
    title: string,
    special: boolean
  } = {
    form: '',
    title: '',
    special: true
  }

  permiso: {
    bln_crear: boolean,
    bln_editar: boolean,
    bln_eliminar: boolean
  } = {
    bln_crear: false,
    bln_editar: false,
    bln_eliminar: false
  }

  constructor(
    public srvMenu: MenuService,
    public srvModal: ModalService,
  ) { }

  ngOnInit(): void {
    this.srvMenu.selectData_menu$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:( data )=>{
        this._idMenu = data.id;
        this.getMenu();
        this.getSubMenus();
      },
      complete:()=>{
        this.srvMenu.setData_menu(this._idMenu,true)
      }
    })
    this.permisos();
  }

  returnView(){
    this.srvMenu.setData_menu(this._idMenu,true);
  }

  getMenu() {
    this.srvMenu.getMenuId(this._idMenu)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data)=>{
        this.dataMenu = data.body;
      },
      error: (err)=>{
        console.log("Error al llenar el form: ",err);
      },
      complete: ()=>{
        Swal.close();
      }
    });
  }

  getSubMenus(){
    console.log('llega al get submenus')
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.srvMenu.datosSubMenu = []; // Reinicializa el arreglo datosSubMenu
    this.srvMenu.datosSubMenu = this.srvMenu.datosMenu.filter( item => item.int_menu_id === this._idMenu)
    this.srvMenu.getSubMenu(this._idMenu)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        // console.log(" DATOS SUBMENU: ", data);
        if(data.status){
          // console.log('DATOS SUBMENU HOMERO: ', data.body);
          this.srvMenu.dataSubMenu = data.body;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        Swal.close();
      }
    })
  }

  addMenu(_tittle: string, _form: string){
    this.addForm.title = _tittle
    this.addForm.form = _form
    this.srvModal.setForm(this.addForm)
    this.srvModal.openModal();
  }

  editarSubmenu(_id: number){
    this.srvMenu.selectData_menu$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.typeViewMenu = data.status;
        }
      }) 
     this.srvMenu.setData_subMenu(_id, this.typeViewMenu);
    this.addForm.form = 'editarMenu';
    this.addForm.title = 'Modificar SubMenú';
    this.srvModal.setForm(this.addForm);
    this.srvModal.openModal();
  }

  cambiarEstado( _id: number){
    Swal.fire({
      title: "¿Está seguro que desea activar/desactivar este Menú?",
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
              this.getMenu();
              this.getSubMenus();
              window.location.href = config.URL_BASE_PATH + '/welcome';
            },3000)
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            //location.reload();
          }
        })
      } else if (result.isDenied) {
        Swal.fire('No se ha realizado ningún cambio', '', 'info')
      }
    })

   }

   permisos(){
    this.permiso = {
      bln_crear: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/menus')?.bln_crear ?? false,
      bln_editar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/menus')?.bln_editar ?? false,
      bln_eliminar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/menus')?.bln_eliminar ?? false
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
