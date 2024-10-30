import { Component, OnInit } from '@angular/core';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { BienesService } from 'src/app/core/services/Bienes-Services/bienes.service';
import { CustodioService } from 'src/app/core/services/Bienes-Services/custodio-service/custodio.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-bienes',
  templateUrl: './bienes.component.html',
  styleUrls: ['./bienes.component.css']
})
export class BienesComponent implements OnInit {

  baseUrl = config.URL_BASE_PATH;
  menuTabSelected: number = 0;

  typeView: boolean = true;
  valorView: number = 0;
  isValue: number = 0;
  id!: any;

private destroy$ = new Subject<any>();


  constructor(
    public srvBienes: BienesService,
    public srvCustodio: CustodioService,
    public srvMenu: MenuService,
  ) { }

  menuTabInventory: number = 0;
  listaViews: any = {
    INVENTARIO: 0,
    CUSTODIOS: 1,
    CARACTERISTICAS: 2,
  }

  elementForm: {
    form: string,
    title: string,
    special: true
  } = {
    form: '',
    title: '',
    special: true
  }

  dataValue: any = {
    typeView: true,
    valorView: 0
  }

  ngOnInit(): void {
    const path: string = window.location.pathname.split('/').pop() || '';
    this.menuTabSelected = this.listaViews[path.toUpperCase()] || 0;
    // console.log('Aqui estoy agarrando  path =>', this.menuTabSelected);

    this.srvBienes.SelectButtonName$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) =>{
        this.menuTabInventory = data;
        // console.log("Recibien el menuTabInventory en Bienes =>", data)
      }
    });

    this.id = "nav-inventory"
    this.isValue = 1
    this.menuTabInventory = 0;
  }

  //funcion para permisos de ver
  permisoVer(path: string){
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_ver ?? false;
  }

  //funcion para permisos de crear
  permisoCrear(path: string){
    return this.srvMenu.permisos.find(p => p.str_menu_path === path)?.bln_crear ?? false;
  }

  // ingresarSoftware(){
  //   this.typeView = false;
  //   this.valorView = 1;
  // }

  importarSoftware(){
    this.typeView = false;
  }

  ingresarHardware(){
    this.typeView = false;
  }

  importarHardware(){
    this.typeView = false;
  }

  ingresarEstado(){
    this.typeView = false;
  }

  ingresarProveedor(){
      this.typeView = false;
 }

  ingresarMarca(){
      this.typeView = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
