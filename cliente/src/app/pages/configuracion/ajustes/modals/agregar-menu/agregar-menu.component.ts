import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, Subject} from 'rxjs';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { dataNewMenu } from 'src/app/core/models/permisos-menu';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-agregar-menu',
  templateUrl: './agregar-menu.component.html',
  styleUrls: ['./agregar-menu.component.css']
})
export class AgregarMenuComponent implements OnInit {

  private destroy$ = new Subject<any>();
  myForm!: FormGroup;
  selectedOption!: string;
  // dataSubMenu!: any;
  dataMenu!: dataNewMenu;
  menuPadre: {nombre: string, id: number} = {nombre: '', id: 0};
  typeViewMenu!: boolean;
  _idMenu: number = 0;
 // showIconSelect: boolean = false;

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
    // console.log("SI ENTRO AL componente agregar menu")


    this.srvMenu.selectData_menu$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.typeViewMenu = data.status;
          this._idMenu = data.id;
        }
      })

      // console.log('ID MENU: ', this._idMenu);

      // this.menuPadre = {nombre: this.srvMenu.datosMenu[this._idMenu].str_menu_nombre, id: this.srvMenu.datosMenu[this._idMenu].int_menu_id}

      this.srvMenu.datosMenu.forEach(item => {
        if (item.int_menu_id === /*1*/ this._idMenu) {
          this.menuPadre={nombre: item.str_menu_nombre, id: item.int_menu_id};
        }
      });

      this.onOPtionSelect();
  }

  onIconSelect(event: any) {
    this.myForm.patchValue({
      str_menu_icono: event.target.value
    });
  }

  onOPtionSelect(/*event: any*/) {
    const iconControl = this.myForm.get('str_menu_icono');
    const menuPadreControl = this.myForm.get('int_menu_padre');
    // this.selectedOption = event.target.value;
    // console.log('this.typeViewMenu: ', this.typeViewMenu);
    if(/*this.selectedOption === 'Menú Padre'*/this.typeViewMenu){
      iconControl!.setValidators([Validators.required]);
      menuPadreControl!.clearValidators();
    }else{
      iconControl!.clearValidators();
      menuPadreControl!.setValidators([Validators.required]);
    }
    iconControl!.updateValueAndValidity();
    menuPadreControl!.updateValueAndValidity();
  }

  agregarMenu(){
    console.log('ENTRO A AGREGAR MENU');

  if(/*this.selectedOption === 'Menú Padre'*/this.typeViewMenu){
    this.myForm.patchValue({
      int_menu_padre: 1
    });
    console.log('Menu Padre debe ser 1: ', this.myForm.value.int_menu_padre);
  } else if (/*this.selectedOption === 'SubMenú'*/ !this.typeViewMenu){
    this.myForm.patchValue({
      str_menu_icono: 'subdirectory_arrow_right',
      int_menu_padre: this._idMenu
    });
  }
    const data = this.myForm.value;

    Swal.fire({
      title: '¿Está seguro que desea agregar este Menú?',
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
        this.srvMenu.postMenu(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            Swal.close();
            if (res.status){
              this.getMenus();
              this.myForm.reset();
              Swal.fire({
                title: res.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
              });
              this.srvModal.closeModal();
            }else{
              Swal.fire({
                title: res.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
              });
            }
            setTimeout(() => {
              this.myForm.reset();
              this.getMenus();
            }, 2500);
          },error: (error) => {
            this.myForm.reset();
            console.log('err', error);
          },
          complete:()=>{
            location.reload()
          }
        });
      }
    });

  }

  getMenus(){
    console.log('carga hasta aqui???')
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
          if(!this.typeViewMenu){
            this.getSubMenus();
            }
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

  getSubMenus(){
    console.log(' o carga hasat aqui')
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // console.log(" DATOS MENU: ", this.srvMenu.datosMenu)
    this.srvMenu.datosSubMenu = []; // Reinicializa el arreglo datosSubMenu
    this.srvMenu.datosSubMenu = this.srvMenu.datosMenu.filter( item => item.int_menu_id === this._idMenu);

    this.srvMenu.getSubMenu(this._idMenu)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
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
