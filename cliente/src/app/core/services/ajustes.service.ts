import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { BehaviorSubject } from 'rxjs';
import { rolesModel, dataRoles, addRolesData, modRolesModel, pagRoles } from '../models/roles';

import {
  CentralizadaModel,
  DataCentralizada,
} from '../models/ajustes';

@Injectable({
  providedIn: 'root',
})
export class AjustesService {
  private URL_API_USER: string = config.URL_API_BASE + 'centralizadas';
  private URL_API_ROLES: string = config.URL_API_BASE + 'roles';

  centralizada: DataCentralizada = {
    per_id: 0,
    nombre: '',
    apellidos: '',
    correo: '',
  };

  datosRoles!: dataRoles[];
  menuTab: number =0;
  private menuTabSource = new BehaviorSubject<number>(this.menuTab);

  constructor(private http: HttpClient) {
    this.menuTab = localStorage.getItem('menuTab') ? parseInt(localStorage.getItem('menuTab')!) : 0;
    this.menuTabSource.next(this.menuTab);
  }

  //crud de usuarios

  getCentralizada(_cedula: string) {
    // console.log("Get_centralizada ",_cedula);
    return this.http.get<CentralizadaModel>(`${this.URL_API_USER}/${_cedula}`, {
      withCredentials: true,
    });
  }

  //funcion para obtener los roles sin paginacion 

  getRoles() {
    return this.http.get<rolesModel>(this.URL_API_ROLES, {
      withCredentials: true,
    });
  }

  //funcion para agregar roles 

  postRoles(data: addRolesData) {
    // console.log('Estas dentro de PostRoles', data);
    return this.http.post<rolesModel>(`${this.URL_API_ROLES}`, data, {
      withCredentials: true,
    });
  }

  //funcion para obtener un rol segun el id de este 

  getRolId(idData:number){
    // console.log("Realizando idData...", idData)
    return this.http.get<modRolesModel>(`${this.URL_API_ROLES}/${idData}`,
    {
      withCredentials: true,
    },
    )
  }

  //Funcion para editar un rol 

  putRol(idRol: number,form: addRolesData){
    // console.log('los dats que se envian son=>',idRol,form);
    return this.http.put<modRolesModel>(`${this.URL_API_ROLES}/${idRol}`,form,
    {
      withCredentials: true
    })
  }

  //funcion para eliminar un rol 

  deleteRol(idRol: number){
    return this.http.delete<rolesModel>(`${this.URL_API_ROLES}/${idRol}`,
      {
        withCredentials: true,
      },
    )
  }

  funcion(fuc: void){
    return fuc
  }

  //funcion para obtener los roles con paginacion 

  getRolesP(pagination: any){
    // const queryPagination = pagination
    //   ? `?pagination={"page":${pagination.page}, "size":${pagination.saze}, "parameter":${pagination.parameter}, "data":${pagination.data}}`
    //   : '';
    //   // console.log('datos rutas: ->', pagination.page, pagination.size);

    //   // const queryFilter = filter ? `&filter=${JSON.stringify(filter)}` : '';
    //   return this.http.get<pagRoles>(
    //     this.URL_API_ROLES + queryPagination,
    //     {
    //       withCredentials: true,
    //     }
    //   );
    // console.log('datos rutas roles paginacion: ->', pagination);
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);
    
      return this.http.get<pagRoles>(this.URL_API_ROLES + '?' +params,
        {
          withCredentials: true,
        }
        );
  }

  // Guarfar el localstorage de la vista de configuracion
  setDataVistaConfiguracion(data: number) {
    localStorage.setItem('vistaConfiguracion', JSON.stringify(data));
    this.menuTabSource.next(data);
  }

  // Obtener el localstorage de la vista de configuracion
  clearDataVistaConfiguracion(): void {
    localStorage.removeItem('vistaConfiguracion');
    this.menuTabSource.next(0);
  }




}

