import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { dataNewMenu } from 'src/app/core/models/permisos-menu';
import Swal from 'sweetalert2';
import config from 'config/config';


@Component({
  selector: 'app-modificar-menu',
  templateUrl: './modificar-menu.component.html',
  styleUrls: ['./modificar-menu.component.css']
})
export class ModificarMenuComponent implements OnInit {

  private destroy$ = new Subject<any>();
  myForm!: FormGroup;
  dataMenu!: dataNewMenu;
  menuPadre: {nombre: string, id: number} = {nombre: '', id: 0};
  typeViewMenu!: boolean;
  idMenu: number = 0;
  idMenuPadre: number = 1;

  constructor( public srvMenu: MenuService,
    public srvModal: ModalService,
    public fb: FormBuilder,
    ) { 
      this.myForm = this.fb.group({

        str_menu_icono:[
        null,
      ],
      int_menu_padre:[
        null,
      ],
      str_menu_nombre:[
        null,
        [Validators.required],
      ],
      str_menu_descripcion:[
        null,
        [Validators.required],
      ],
      str_menu_path:[
        null,
        [Validators.required],
      ]
      });
    }

    ngOnInit(): void {

      
      this.completeForm();

      this.srvMenu.datosMenu.forEach(item => {
        if (item.int_menu_id === /*1*/ this.idMenuPadre) {
          this.menuPadre={nombre: item.str_menu_nombre, id: item.int_menu_id};
          // console.log('menu padre: ', this.menuPadre);
        }
      });
    }

  
    onIconSelect(event: any) {
      this.myForm.patchValue({
        str_menu_icono: event.target.value
      });
    }
  
    onOPtionSelect(event: any) {
      const iconControl = this.myForm.get('str_menu_icono');
      const menuPadreControl = this.myForm.get('int_menu_padre');
      if(this.typeViewMenu){
        iconControl!.setValidators([Validators.required]);
        menuPadreControl!.clearValidators();
        iconControl!.patchValue(null);
      }else if(!this.typeViewMenu){
        iconControl!.clearValidators();
        menuPadreControl!.setValidators([Validators.required]);
        menuPadreControl!.patchValue(null);
      }
      iconControl!.updateValueAndValidity();
      menuPadreControl!.updateValueAndValidity();
      // console.log('Form en onOPtionSelect: ', this.myForm.value);
    }

    completeForm() {
      this.srvMenu.selectData_menu$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data)=>{
          Swal.fire({
            title: 'Cargando',
            didOpen: () => {
              Swal.showLoading()
            },
          });
          this.typeViewMenu = data.status;
          this.idMenuPadre = data.id;

          if(this.typeViewMenu){
            // console.log('en el if de completeform de modificar menu')
            this.idMenu = data.id;
          }else{
            // console.log('en el else de completeform de modificar menu')
            this.srvMenu.selectData_subMenu$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (data)=>{
                this.idMenu = data.id;
              }
            });
          }
          // console.log('typeViewMenu: ', this.typeViewMenu, 'idMenu: ', this.idMenu);
          this.getMenu();
        }
        
      });
    }

    getMenu() {
      this.srvMenu.getMenuId(this.idMenu)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data)=>{
          
         // console.log("Data: ",data);
          // if(data.body.int_menu_padre === 1) {
          //   this.selectedOption = 'Menú Padre';
          // }else {
          //   this.selectedOption = 'SubMenú';
          // }
          this.myForm.patchValue({
            str_menu_icono: data.body.str_menu_icono,
            int_menu_padre: data.body.int_menu_padre,
            str_menu_nombre: data.body.str_menu_nombre,
            str_menu_descripcion: data.body.str_menu_descripcion,
            str_menu_path: data.body.str_menu_path
          })
          // console.log("Form: ",this.myForm.value);
        },
        error: (err)=>{
          console.log("Error al llenar el form: ",err);
        },
        complete: ()=>{
          Swal.close();
        }
      });
    }

  modifyMenu(){

    if(this.typeViewMenu){
      this.myForm.patchValue({
        int_menu_padre: 1
      });
      // console.log('Menu Padre debe ser 1: ', this.myForm.value.int_menu_padre);
    } else {
      this.myForm.patchValue({
        str_menu_icono: 'subdirectory_arrow_right',
        int_menu_padre: this.idMenuPadre
      });
    }
      const data = this.myForm.value;
    // console.log('Form en modifyMenu: ', data);
      Swal.fire({
        title: '¿Está seguro que desea editar este Menú?',
        showDenyButton: true,
        confirmButtonText: 'Agregar',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Cargando...',
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this.srvMenu.putMenuId(this.idMenu, data)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data)=>{
              if (data.status){
                Swal.fire({
                  title: data.message,
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000
                });
                this.myForm.reset();
                this.srvModal.closeModal();
              }else{
                Swal.fire({
                  title: data.message,
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000
                });
              }
              setTimeout(() => {            
                this.myForm.reset();
                this.getMenus();
                this.getSubMenus();
              }, 3000);
            },error: (error) => {
              this.myForm.reset();
              console.log('err', error);
            },
            complete:()=>{
              // console.log('complete') 
              // location.reload()
              window.location.href = config.URL_BASE_PATH + '/welcome';

            }
          })
        }
      });
  }

  getMenus(){
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
          this.srvMenu.datosMenu = data.body;
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

  getSubMenus(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.srvMenu.getSubMenu(this.idMenuPadre)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        // console.log('DATOS SUBMENU: ', data, 'idMenuPadre: ', this.idMenuPadre);
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
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
