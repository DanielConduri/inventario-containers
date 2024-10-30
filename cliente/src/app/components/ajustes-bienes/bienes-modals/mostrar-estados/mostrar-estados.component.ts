import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EstadosShowModel } from 'src/app/core/models/Bienes/Caracteristicas/estados';
import { CaracteristcasService } from 'src/app/core/services/Bienes-Services/caracteristicas-service/caracteristicas.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  providers: [DatePipe],
  selector: 'app-mostrar-estados',
  templateUrl: './mostrar-estados.component.html',
  styleUrls: ['./mostrar-estados.component.css']
})
export class MostrarEstadosComponent implements OnInit {

  elementForm:{
    form: string,
    title: string,
    special: boolean
  } = {
    form: '',
    title: '',
    special: true
  }

isData: boolean = false;
isLoading: boolean = true;

  private destroy$ = new Subject<any>();

  constructor(
    public srvCaracteristicas: CaracteristcasService,
    public srvModal: ModalService,
    public srvMenu: MenuService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      Swal.close();
    }, 1500);
    this.getEstados();
  }

  // Funcion para obtener los estados
  getEstados(){
    Swal.fire({
      title: 'Cargando Estados...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.srvCaracteristicas.getEstado()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: EstadosShowModel) => {
        if(data.body){
          this.isData = true;
          // console.log("Obteniendo Estados de la base de Datos", data.body);
          this.srvCaracteristicas.datosEstados = data.body;
        }
      },
      error: (err) => {
        console.log("Error al obtener los estados", err);
      },
      complete: () => {
        Swal.close();
      }
    });
  }

  // Funcion para obtener ID de un estado
  ModifyEstadoById(idEstado: number, _title: string, _form:string){
    this.elementForm.form = _form;
    this.elementForm.title = _title;
    this.srvModal.setForm(this.elementForm);
    this.srvModal.setSelectID_Estado(idEstado);
    this.srvModal.openModal();
  }

  // Funcion para eliminar un estado
  deleteEstadoById(idEstado: number){
    Swal.fire({
      title: '¿Estas seguro de desactivar este estado?',
      text: "Al deshabilitar un Estado, este no podra ser seleccionada a la hora de agregar un Bien. Este cambio puede ser revertido en cualquier momento",
      showDenyButton: true,
      confirmButtonText: `Si, cambiar estado`,
      denyButtonText: `No, cancelar`,
    }).then((result) => {
      if(result.isConfirmed){
        this.srvCaracteristicas.deleteEstadoById(idEstado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data)=>{
            // console.log("Estado Eliminado", data);
            if(data.status){
              Swal.fire({
                title: data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
            }else{
              Swal.fire({
                title: data.message,
                icon: 'warning',
                showConfirmButton: false,
                confirmButtonText: 'Aceptar',
              });
            }
            setTimeout(()=>{
              this.getEstados();
            }, 1500);
          },
          error: (err)=>{
            console.log("Error al eliminar el estado", err);
          },
          complete: ()=>{
            // console.log("Estado eliminado");
          }
        });
      }
    });
  }

        //funcion para permisos de editar
        permisoEditar(path: string){
          return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_editar ?? false;
        }
      
        //funcion para permisos de eliminar
        permisoEliminar(path: string){
          return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_eliminar ?? false;
        }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
