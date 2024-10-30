import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import config from 'config/config';
import {
  permisosModel, 
  menuItemsModel, 
  dataMenuItems,
  permisosPerfilModel, 
  dataPermisosPerfil, 
  menuItemsAllModel,
  behaviorsubject,
  newMenuModel,
  dataNewMenu,
  dataSubMenu,
  permisosMenuModel, dataPermisoMenu, dataPermisos
} from '../models/permisos-menu';

const intMenu: behaviorsubject = {
  id: 0,
  status: true
}

const intSubmenu: behaviorsubject = {
  id: 0,
  status: true
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private url_api_menu_permisos: string = config.URL_API_BASE + 'permisos';
  private url_api_menu: string = config.URL_API_BASE + 'menus';
  private url_api_menu_all: string = config.URL_API_BASE + 'menus/all';
  private url_api_submenus: string = config.URL_API_BASE + 'menus/submenus';
  private url_api_permisos_login: string = config.URL_API_BASE + 'permisos/rol';

 // datosMenu!: dataMenuItemsAll[] ;
  ajustesMenu: dataPermisoMenu = {
    bln_crear: true,
    bln_editar: true,
    bln_eliminar: true,
    bln_ver: true,
    int_menu_id : 0,
    int_menu_padre : 0,
    str_menu_icono : '',
    str_menu_nombre : '',
    str_menu_path : 'ajustes',
   submenus: []
  } ;
  menuItems: dataPermisoMenu[]= [{
    bln_crear: true,
    bln_editar: true,
    bln_eliminar: true,
    bln_ver: true,
    int_menu_id : 0,
    int_menu_padre : 0,
    str_menu_icono : '',
    str_menu_nombre : '',
    str_menu_path : 'ajustes',
   submenus: []
  }];  //corresponde a los permisos del menu al momento de loguearse
  permisos!: dataPermisos[]        //corresponde a los permisos del perfil al momento de loguearse
  datosMenu!: dataMenuItems[] ;
  datosSubMenu!: dataSubMenu[] ;
  dataSubMenu: any = [];
  icons: string[] = [
    '3d_rotation', 'ac_unit','access_alarm','access_time','accessibility','accessible','account_balance',
    'account_balance_wallet','account_box','account_circle','account_circle','adb', 'assignment',
    'home','subdirectory_arrow_right','add_location','settings','assignment_turned_in','person', 'dvr', 'location_on', 'people'
  ]

  constructor(private http: HttpClient) { }

private intMenu$ = new BehaviorSubject<behaviorsubject>(intMenu);
private intSubmenu$ = new BehaviorSubject<behaviorsubject>(intSubmenu);

//obtiene el id del menu
get selectData_menu$(): Observable<behaviorsubject>{
  return this.intMenu$.asObservable();
}

//envia el id del menu
setData_menu(_id: number, _status: boolean){
  this.intMenu$.next({
    id: _id,
    status: _status
  })
}

//obtiene el id del submenu
get selectData_subMenu$(): Observable<behaviorsubject>{
  return this.intSubmenu$.asObservable();
}

//envia el id del submenu
setData_subMenu(_id: number, _status: boolean){
  this.intSubmenu$.next({
    id: _id,
    status: _status
  })
}

  //obtiene los permisos del menu de un perfil
  getPermisos(_id:  number){
    // console.log('Que id de perfil le mando a homero: ', _id)
    return this.http.get<permisosModel>(`${this.url_api_menu_permisos}/${_id}`, {
      withCredentials: true
    })
  }

  getMenu(){
    return this.http.get<menuItemsModel>(`${this.url_api_menu}`, {
      withCredentials: true
    })
  }

  //envia los permisos del menu de un perfil
  UpdatePermisos(_id: number, _data: dataPermisosPerfil[]){
    // console.log('Que le mando a homero postPermisos: ', _id, _data)
    return this.http.put<permisosPerfilModel>(`${this.url_api_menu_permisos}/${_id}`, _data, {
      withCredentials: true
    })
  }

  //obtiene todas las opciones del menu
  getMenuAll(){
    return this.http.get<menuItemsAllModel>(`${this.url_api_menu_all}`, {
      withCredentials: true
    })
  }

  //crea un nuevo menu
  postMenu(_data: dataNewMenu){
    // console.log('Que le mando a homero postMenu: ', _data)
    return this.http.post<newMenuModel>(`${this.url_api_menu}`, _data, {
      withCredentials: true
    })
  }

  //obtener menu por id
  getMenuId(_id: number){
    return this.http.get<newMenuModel>(`${this.url_api_menu}/${_id}`, {
      withCredentials: true
    })
  }

  //actualizar menu por id
  putMenuId(_id: number, _data: dataNewMenu){
    return this.http.put<newMenuModel>(`${this.url_api_menu}/${_id}`, _data, {
      withCredentials: true
    })
  }

  //eliminar menu por id
  deleteMenuId(_id: number){
    return this.http.delete<newMenuModel>(`${this.url_api_menu}/${_id}`, {
      withCredentials: true
    })
  }

  getSubMenu(_id: number){
    return this.http.get<newMenuModel>(`${this.url_api_submenus}/${_id}`, {
      withCredentials: true
    })
  }

  getPermisosLogin(_rol: string){
    // console.log('Que id de perfil le mando a homero: ', _rol)
    return this.http.get<permisosMenuModel>(`${this.url_api_permisos_login}/${_rol}`, {
      withCredentials: true
    })
  }

}


