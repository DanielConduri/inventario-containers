import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuService } from 'src/app/core/services/menu.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { permisosModel, dataPermisosPerfil} from 'src/app/core/models/permisos-menu';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import config from 'config/config';



@Component({
  selector: 'app-editar-permisos',
  templateUrl: './editar-permisos.component.html',
  styleUrls: ['./editar-permisos.component.css']
})


export class EditarPermisosComponent implements OnInit {

  private destroy$ = new Subject<any>();
  isChecked = false;
  idPorfile: number = 0;


nuevosPermisos: { int_menu_id: number, int_menu_padre: number, bln_crear: string, bln_editar:string, bln_eliminar: string, bln_ver: string, str_menu_icono: string, str_menu_nombre: string}[]
  = [
    {int_menu_id:0, int_menu_padre:0, bln_crear: '', bln_editar:'', bln_eliminar: '', bln_ver: '', str_menu_icono: '', str_menu_nombre: ''},
  ];

  constructor(
    public srvMenu: MenuService,
    public srvModal: ModalService,
    ) {
    }

  ngOnInit(): void {
    this.getIdPorfile()
    this.completeTable();
    // console.log("COMPONENTE EDITAR PERMISOS")

  }

  onChange(event: any, parentIndex: number, op: number){
   const checked = (event.target as HTMLInputElement)?.checked
  //  console.log("checked: ", checked)
   let indexPadre = this.nuevosPermisos[parentIndex].int_menu_padre;
    if(this.nuevosPermisos[parentIndex].int_menu_padre !== 1 ){
      // console.log("tiene padre, id padre es: ", indexPadre)
      for(let i=0; i<this.nuevosPermisos.length; i++){
        if(this.nuevosPermisos[i].int_menu_id === indexPadre && this.nuevosPermisos[i].bln_ver === 'unchecked'){
          this.nuevosPermisos[i].bln_ver = (checked ? 'checked' : 'unchecked');
          // console.log("Cambia el padre?: ",this.nuevosPermisos[i]);
        }
      }
    }

    switch (op) {
      case 1: //opcion para ver (que incluye crear, editar, eliminar)
      // if(indexPadre === 1){
      //   indexPadre = this.nuevosPermisos[parentIndex].int_menu_id;
      //   this.nuevosPermisos[parentIndex].bln_ver = (checked ? 'checked' : 'unchecked');
      //   this.nuevosPermisos.forEach((permiso) => {
      //     if (permiso.int_menu_padre === indexPadre) {
      //       permiso.bln_ver = checked ? 'checked' : 'unchecked';
      //     }
      //   });
      // }else{
      this.nuevosPermisos[parentIndex].bln_crear = (checked ? 'checked' : 'unchecked');
      this.nuevosPermisos[parentIndex].bln_editar = (checked ? 'checked' : 'unchecked');
      this.nuevosPermisos[parentIndex].bln_eliminar = (checked ? 'checked' : 'unchecked');
      this.nuevosPermisos[parentIndex].bln_ver = (checked ? 'checked' : 'unchecked');
     // }
      break;
    case 2 : //opcion para crear
      this.nuevosPermisos[parentIndex].bln_crear = (checked ? 'checked' : 'unchecked');
      // if(indexPadre === 1){
      //   indexPadre = this.nuevosPermisos[parentIndex].int_menu_id;
      //   this.nuevosPermisos.forEach((permiso) => {
      //     if (permiso.int_menu_padre === indexPadre) {
      //       permiso.bln_crear = checked ? 'checked' : 'unchecked';
      //     }
      //   });
      // }
      break;
    case 3 : //opcion para editar
      this.nuevosPermisos[parentIndex].bln_editar = (checked ? 'checked' : 'unchecked');
      // if(indexPadre === 1){
      //   indexPadre = this.nuevosPermisos[parentIndex].int_menu_id;
      //   this.nuevosPermisos.forEach((permiso) => {
      //     if (permiso.int_menu_padre === indexPadre) {
      //       permiso.bln_editar = checked ? 'checked' : 'unchecked';
      //     }
      //   });
      // }
      break;
    case 4 : //opcion para eliminar
      this.nuevosPermisos[parentIndex].bln_eliminar = (checked ? 'checked' : 'unchecked');
      // if(indexPadre === 1){
      //   indexPadre = this.nuevosPermisos[parentIndex].int_menu_id;
      //   this.nuevosPermisos.forEach((permiso) => {
      //     if (permiso.int_menu_padre === indexPadre) {
      //       permiso.bln_eliminar = checked ? 'checked' : 'unchecked';
      //     }
      //   });
      // }
      break;
    }

    if (checked){
      this.nuevosPermisos[parentIndex].bln_ver = (checked ? 'checked' : 'unchecked');
    }
    // console.log(this.nuevosPermisos[parentIndex]);
  }

  getIdPorfile(){
    this.srvModal.selectIdPorfile$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (getId: number) => {
        // console.log("Dentro de CompleteForme, el id es: ", getId)
        this.idPorfile = getId
      },
      error: (err) => {
        console.log("error =>",err);
      },
    })
  }


  completeTable(){
    Swal.fire({
      title: 'Cargando datos',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.srvMenu.getPermisos(this.idPorfile)
  .pipe(
    takeUntil(this.destroy$),
    map((dataPermisos: permisosModel) => {
      // console.log("PERMISOS, Homero llega: ", dataPermisos);

      if (dataPermisos.status) {
        return dataPermisos.body.map(permiso => ({
          ...permiso,
          bln_crear: permiso.bln_crear ? 'checked' : 'unchecked',
          bln_editar: permiso.bln_editar ? 'checked' : 'unchecked',
          bln_eliminar: permiso.bln_eliminar ? 'checked' : 'unchecked',
          bln_ver: permiso.bln_ver ? 'checked' : 'unchecked'
        }));
      } else {
        // console.log("No hay PERMISOS para mostrar");
        return null;
      }
    })
  )
  .subscribe({
    next: (nuevosPermisos) => {
      if (nuevosPermisos) {
        this.nuevosPermisos = nuevosPermisos;
        Swal.close();
      }
    }
  });
  }

  addPermiso(){
    Swal.fire({
      title: '¿Está seguro que desea agregar estos Permisos?',
      showDenyButton: true,
      confirmButtonText: 'Agregar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        Swal.fire({
          title: 'Cargando...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const data: dataPermisosPerfil[] = this.nuevosPermisos.map(p => ({
          int_menu_id: p.int_menu_id,
          bln_crear: p.bln_crear === 'checked'? true :false,
          bln_editar: p.bln_editar === 'checked'? true :false,
          bln_eliminar: p.bln_eliminar === 'checked'? true :false,
          bln_ver: p.bln_ver === 'checked'? true :false,
        }));
        Swal.close();
        this.srvMenu.UpdatePermisos(this.idPorfile, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (rest) => {
            if(rest.status){
              Swal.close();
              Swal.fire({
              title: rest.message,
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
              })
              this.srvModal.closeModal();
            }else{
              Swal.fire({
                title: rest.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 3000,
              })
            }
            setTimeout(() => {
              //procese a desplegar los permisos
            }, 3000);
          },
          error: (error) => {
            console.log('err', error);
          },
          complete:()=>{
            location.reload()
            window.location.href = config.URL_BASE_PATH + '/welcome';

          }
        })
      }
    })
  }

  ngAfterViewInit(): void {
    const modalDialog = document.querySelector('.modal-dialog');
    const modal = document.querySelector('.modal-content');

    modalDialog?.classList.toggle('modal-permisos');
    modal?.classList.toggle('modal-permi');

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    const modalDialog = document.querySelector('.modal-dialog');
    const modal = document.querySelector('.modal-content');

    modalDialog?.classList.remove('modal-permisos');
    modal?.classList.remove('modal-permi');
  }

}
