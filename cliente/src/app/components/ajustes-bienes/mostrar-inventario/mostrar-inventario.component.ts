import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BienesService } from 'src/app/core/services/Bienes-Services/bienes.service';
import { InventarioService } from 'src/app/core/services/Bienes-Services/inventario-service/inventario.service';
import Swal from 'sweetalert2';
import { MenuService } from 'src/app/core/services/menu.service';
import { HistorialArchivosComponent } from 'src/app/components/ajustes-bienes/bienes-modals/historial-archivos/historial-archivos.component';
@Component({
  selector: 'app-mostrar-inventario',
  templateUrl: './mostrar-inventario.component.html',
  styleUrls: ['./mostrar-inventario.component.css']
})
export class MostrarInventarioComponent implements OnInit {
  @ViewChild('miElemento') miElementoRef!: ElementRef;

  isLoading: boolean = false
  isData: boolean = false;
  estadoProceso : boolean = false;
  
  menuTabSelected: number = 0;
  typeView: boolean = false;
  isValue: number = 3;
  condiciones: number = 0;

  typeViewMenu: boolean = true;
  typeViewBien: boolean = false;

  listaViews: any = {
    SOFTWARE: 0,
    HARDWARE: 1,
    OTROS: 2
  }

  miBody = document.getElementById('miBody');
  disabledButtons: boolean = false;

  buttonName!: number;
  private destroy$ = new Subject<any>();


  constructor(
    public srvBienes: BienesService,
    public srvInventario: InventarioService,
    public srvMenu: MenuService,
  ) { }

  ngOnInit(): void {
    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabSelected = this.listaViews[path.toUpperCase()] || 0;
    this.isValue = 5;

  // Llamado al behaviorSubject
  this.srvBienes.SelectButtonName$
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (data) =>{
      this.buttonName = data;
    }
  });

  //Behavior Subject para regresar a ventana inicio
  this.srvInventario.dataBoolAction$
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (data) =>{
      // console.log("Valor de Data al seleccionar un bien: ", data)
      // this.typeViewMenu = data;
      if(data){
        this.typeViewMenu = true;
        this.disabledButtons = false;
        this.menuTabSelected = 0;
        this.miElementoRef.nativeElement.style.display = 'flex';
      }
    }
  })

  }


  mostrarOtros(){
    this.menuTabSelected = 3;
    this.miElementoRef.nativeElement.style.display = 'grid';
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 5;
  }

  mostrarHistorial(){
    this.menuTabSelected = 6;
    // this.miElementoRef.nativeElement.style.display = 'grid';
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 6;

    
  }

  importarBien(){
    this.disabledButtons = true;
    this.menuTabSelected = 4;
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 5;

    this.getArchivos();
  }

  getArchivos(){
    this.srvInventario.getArchivos({})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        Swal.close()
        if(data.estadoCarga === 1)
          this.estadoProceso = true //Existe un proceso en ejecución
      },
      error: (error) => {
        console.log('Error ->', error)
      }
    })
  }

  insertarBien(){
    this.disabledButtons = true;
    this.menuTabSelected = 5;
    this.srvBienes.setButtonName(this.menuTabSelected);
    this.isValue = 5;
  }

  editarBien(){

  }

  cancelarButton(){

    if(this.disabledButtons == true){
      Swal.fire({
        title: '¿Está seguro de cancelar?',
        text: "Se perderán los datos ingresados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',

        confirmButtonText: 'Si, cancelar',
        cancelButtonText: 'No, regresar'

      }).then((result) => {
        if (result.isConfirmed) {
          this.disabledButtons = false;
          this.menuTabSelected = 0;
          this.srvBienes.setButtonName(this.menuTabSelected);
          this.isValue = 3;
        }
      })
    }
  }

  permisoVer(path: string){
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_ver ?? false;
  }

  //funcion para permisos de crear
  permisoCrear(path: string){
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_crear ?? false;
  }


  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
