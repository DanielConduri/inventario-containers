import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from 'src/app/core/services/personas.service';
import { perRolesModel, dataUser, usuarioModel, perfilesModel, porfileModel } from 'src/app/core/models/personas';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { MenuService } from 'src/app/core/services/menu.service';
import config from 'config/config';

@Component({
  selector: 'app-mostrar-per-rol',
  templateUrl: './mostrar-per-rol.component.html',
  styleUrls: ['./mostrar-per-rol.component.css']
})
export class MostrarPerRolComponent implements OnInit {

  _Form: porfileModel = {
    status: true,
    id: 0,
  }

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

  dataForm: perRolesModel = {
    status: true,
    id: 0,
   };

   permiso: {
    bln_crear: boolean,
    bln_editar: boolean,
    bln_eliminar: boolean
  } = {
    bln_crear: false,
    bln_editar: false,
    bln_eliminar: false
  }

  private destroy$ = new Subject<any>();
  typeView: boolean = false;
  id_perf: number = 0;
  status!: boolean;

  constructor(
    public srvPersonas: PersonasService,
    public srvModal: ModalService,
    public srvMenu: MenuService,
  ) { }

  ngOnInit(): void {
    this.srvPersonas.selectData_rol$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:( data )=>{
        this.id_perf = data.id;
        // console.log(" RECIBIDO EN MOSTRAR PER-ROL el id es: ", this.id_perf)
        this.getInfUser();
        this. getPerfiles();
      },
      complete:()=>{
        this.dataForm.status = true;
        this.srvPersonas.setData_rol(this.dataForm)
      }
    })
    this.permisos();
  }

  returnView(_status: boolean){
    this.dataForm.status = _status;
    this.srvPersonas.setData_rol(this.dataForm)
  }

  getInfUser(){
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.srvPersonas.getPerUsuario(this.id_perf)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: usuarioModel) => {
        Swal.close();
        this.srvPersonas.datosUser = data.body
        this.srvPersonas.datosUser.dt_fecha_creacion = data.body.dt_fecha_creacion.substring(0,10)
        this.srvPersonas.datosUser.dt_fecha_actualizacion = data.body.dt_fecha_actualizacion.substring(0,10)
        // console.log("Los datos recibidos después de buscar",data)
      },
      error: (err) => {
        console.log(err);
      },
      complete: () =>{
      }
    })
  }

  getPerfiles(){
    // console.log("entro a obtener perfiles")
    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.srvPersonas.getPerfiles(this.id_perf)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: perfilesModel) => {
        Swal.close();
        this.srvPersonas.datosPerfiles = data.body
        // console.log("para la tabla, datos reci después de buscar",data)
      },error: (err) => {
        console.log(err);
      },
      complete: () =>{
      }
    })
  }

  addRol( _tittle: string, _form: string){

    this.addForm.title = _tittle
    this.addForm.form = _form
    this.srvModal.setForm(this.addForm)
    this.srvModal.setIdUser(this.id_perf);
    this.srvModal.openModal();
    // this.getPerfiles();
  }

  changeStatus(_id: number){
    Swal.fire({
      title: "¿Está seguro que desea desactivar este Perfil?",
      text: 'Este cambio puede ser revertido en cualquier momento',
      showDenyButton: true,
      confirmButtonText: `Si, cambiar`,
      denyButtonText: `No, cancelar`,
    }).then((result)=>{
      if(result.isConfirmed){
        this.srvPersonas
        .deletePorfile(_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            // console.log("respuesta de eliminar",res);
            this.status = res.status;
            if (this.status) {
              Swal.fire({
                title: 'Estado modificado correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
          window.location.href = config.URL_BASE_PATH + '/welcome';
            this.getPerfiles();
          }
        })
      }
    })
  }

  editPorfile( _id: number, _tittle: string, _from: string){
    // console.log("el id del perfil a editar es: ", _id)
    this.addForm.title = _tittle
    this.addForm.form = _from
    this.srvModal.setForm(this.addForm)
    this._Form.id = _id;
    this.srvPersonas.setData_porfile(this._Form);
     this.srvModal.setIdPorfile(_id);
    //  console.log( "srvModal.selectIdUser$ ", this.srvModal.selectIdUser$)
    this.srvModal.openModal();
    // this.getPerfiles();
  }

  editPermissions( _id: number, _tittle: string, _form: string){
    this.addForm.title = _tittle
    this.addForm.form = _form
    // console.log("el formulario en editPermissions a abrir es: ", this.addForm)
    // console.log("el id del usuario a agregar rol es: ", this.id_perf)
    this.srvModal.setForm(this.addForm)
    this.srvModal.setIdUser(this.id_perf);
    this.srvModal.setIdPorfile(_id);

    this.srvModal.openModal();
    this.getPerfiles();
  }

  permisos(){
    this.permiso = {
      bln_crear: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/usuarios')?.bln_crear ?? false,
      bln_editar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/usuarios')?.bln_editar ?? false,
      bln_eliminar: this.srvMenu.permisos.find(p => p.str_menu_path === 'ajustes/usuarios')?.bln_eliminar ?? false
    };
    // console.log("los permisos son: ", this.permiso)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
