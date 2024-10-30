import { HttpClient, HttpParams } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs'
import { Injectable } from '@angular/core';

import config from 'config/config';
import {
  dataPersonas,
  personasModel,
  dataNuevaPersona,
  personaNuevaModel,
  personaEditModel,
  dataEditPersona,
  perRolesModel,
  usuarioModel,
  dataUser,
  perfilesModel,
  dataPerfiles,
  addPerRolesModel,
  dataNewPorfile,
  dataEditPorfile,
  editPorfileModel,
  porfileModel,
  miCuentaModel,
  dataMiCuenta,
  pagUsuarios
} from '../models/personas';
import GetFinalFiltersQuery from 'src/app/utils/filter/GetFinalFiterQuery';

const intUser: perRolesModel = {
   id: 0,
   status: true
}

const intPorfile: porfileModel = {
  id: 0,
  status: true
}

const nameRol: string = '';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private urlApi_personas: string = config.URL_API_BASE + 'personas';
  private urlApi_personascsv: string = config.URL_API_BASE + 'personas/csv';
  private urlApi_per_usuario: string = config.URL_API_BASE + 'personas/usuario';
  private urlApi_per_perfil: string = config.URL_API_BASE + 'personas/perfiles';
  private urlApi_perfil: string = config.URL_API_BASE + 'personas/perfiles/datos';
  private urlApi_usuarios: string = config.URL_API_BASE + 'usuarios';
  private urlApi_me: string = config.URL_API_BASE + 'usuarios/me';
  private urlApi_usuariosFilter: string = config.URL_API_BASE + 'usuarios/filtrado';

//lo recibido, es por eso que solo se declara y no se incializa
  datosPersonas!: dataPersonas[] ;

  datosUser: dataUser = {
  str_per_nombres: "",
  str_per_apellidos: "",
  str_per_email: "",
  str_per_cedula: "",
  str_per_cargo: "",
  str_per_tipo: "",
  dt_fecha_actualizacion: "",
  dt_fecha_creacion: "",
  };            //Datos para mostrar-per-rol - Datos del usuario
  datosPerfiles!: dataPerfiles[];  //Datos para mostrar-per-rol - Tabla Perfiles

// lo que se envia, por eso se inicializa en vacio
  dataEditPersona: dataEditPersona = {
    int_per_id: 0,
    str_per_nombres: "",
    str_per_apellidos: "",
    str_per_cedula: "",
    str_per_cargo: "",
    str_per_telefono: "",
    str_per_email: "",
    str_per_estado: "",
    // str_perfil_dependencia: ""

  }

  dataNuevaPersona: dataNuevaPersona = {

  per_cargo :"",
  per_telefono :"",
  per_dependencia :""

}

  dataNewPorfile: dataNewPorfile = {
    int_per_id: 0,
    str_rol_nombre: "",
    str_rol_dependencia: ""
  }

  dataEditPorfile: dataEditPorfile = {
    str_rol_nombre: "",
    str_rol_descripcion: "",
    str_perfil_dependencia: "",

  }

  dataMe: dataMiCuenta = {
    int_per_id: 0,
    int_per_idcas: 0,
    str_per_apellidos: "",
    str_per_cargo: "",
    str_per_cedula: "",
    str_per_email: "",
    str_per_estado: "",
    str_per_nombres: "",
    str_per_telefono: "",
  }

  nameRol: string = '@d$';
  constructor( private http: HttpClient) {
    this.nameRol = localStorage.getItem('userRole') || '@d$';
    this.data_nameRol$.next(this.nameRol);
  }

  private data_rol$ = new BehaviorSubject<perRolesModel>(intUser);
  private data_porfile$ = new BehaviorSubject<porfileModel>(intPorfile);
  private data_nameRol$ = new BehaviorSubject<string>(nameRol);

  private permiso_rol$ = new Subject<string>();

   // Funciones para pasar los valores del forn de Rol persna-rol
  get selectData_rol$(): Observable<perRolesModel>{
    return this.data_rol$.asObservable();
  }

  setData_rol(data: perRolesModel) {
    // console.log('SET DATA enviando del boton ->', data);
    this.data_rol$.next(data);
  }

  //Funciones para pasar los valores del form de Perfiles
  get selectData_porfile$(): Observable<porfileModel>{
    return this.data_porfile$.asObservable();
  }

  setData_porfile(data: porfileModel) {
    // console.log('SET DATA enviando del boton ->', data);
    this.data_porfile$.next(data);
  }

  //BehaviorSubject para pasar el nombre del rol de la persona logueada
  get selectData_nameRol$(): Observable<string>{
    return this.data_nameRol$.asObservable();
  }

  //guarda el rol para el localstorage
  setData_nameRol(data: string) {
    localStorage.setItem('userRole', data);
    this.data_nameRol$.next(data);
  }

  //limpia el localstorage
  clearLocalStorage(): void {
    localStorage.removeItem('userRole');
    this.data_nameRol$.next('');
  }

  setPermisoRol(data: string){
    this.permiso_rol$.next(data);
  }

  get selectPermisoRol$(): Observable<string>{
    return this.permiso_rol$.asObservable();
  }


  //metodo para obtener todas las personas
  // getPersonas() {
  //   return this.http.get<personasModel>(this.urlApi_usuarios, {
  //     withCredentials: true,
  //   });
  // } 

  //metodo para obtener todas las personas con paginacion y filtros
  getPersonasP(pagination: any) {
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

      return this.http.get<pagUsuarios>(this.urlApi_usuarios + '?' +params,
        {
          withCredentials: true,
        }
        );
    }

  //metodo para agregar una nueva persona
  postUsuarios(data: dataNuevaPersona){
    // console.log("data dentro post",data);
    return this.http.post<personaNuevaModel>( `${this.urlApi_personas}`, data, {
      withCredentials: true,
    });
  }

//metodo para cambiar el estado de la persona: Activo o Inactivo
  putUsuarios(_id: number){
    // console.log("id de la persona dentro de putUsuarios",_id);
    return this.http.put<personaNuevaModel>( `${this.urlApi_personas}/${_id}`, {
      withCredentials: true,
    });
  }

 //Metodo para buscar una persona por su id
  getPersona(_id: number){
    // console.log("id de la persona dentro de getPersona",_id);
    return this.http.get<personaEditModel>(`${this.urlApi_usuarios}/${_id}`,{
      withCredentials: true,
    })
  }

//metodo para actualizar los datos de la persona-perfil
  UpdateUsuarios(data: dataNuevaPersona, id: number){
    // console.log("data dentro de UpdateUsuarios",data);
    return this.http.put<personaNuevaModel>( `${this.urlApi_usuarios}/${id}`,data, {
      withCredentials: true,
    });
  }

  //Eliminado logico
  deleteUsuarios(_id: number){
    // console.log("id de la persona dentro de deleteUsuarios",_id);
    return this.http.delete<personaNuevaModel>( `${this.urlApi_usuarios}/${_id}`, {
      withCredentials: true,
    });
  }


  //---------------------------------------- USUARIOS - PERFILES ----------------------------------------

  //metodo para obtener la información superior de datos de la persona-perfil
  getPerUsuario(_id: number){
    return this.http.get<usuarioModel>(`${this.urlApi_per_usuario}/${_id}`,{
      withCredentials: true,
    })
  }

  //metodo para obtener los datos de todos los perfiles que tiene una persona
  getPerfiles(_id: number){
    return this.http.get<perfilesModel>(`${this.urlApi_per_perfil}/${_id}`,{
      withCredentials: true,
    })
  }

  //método para agregar un nuevo rol a una persona
  postPerUsuario(data: dataNewPorfile){
    return this.http.post<addPerRolesModel>( `${this.urlApi_per_perfil}`, data, {
      withCredentials: true,
    });
  }

  //método para eliminar (eliminado lógico) un rol de una persona
  deletePorfile(_id: number){
    return this.http.delete<addPerRolesModel>( `${this.urlApi_per_perfil}/${_id}`, {
      withCredentials: true,
    });
  }

  //Método para obtener un perfil específico de una persona
  getPorfile(_id: number){
    return this.http.get<editPorfileModel>(`${this.urlApi_perfil}/${_id}`,{
      withCredentials: true,
    })
  }

  //Método para actualizar los datos de un perfil específico de una persona
  UpdatePorfile(data: dataEditPorfile, id: number){
    return this.http.put<editPorfileModel>( `${this.urlApi_per_perfil}/${id}`,data, {
      withCredentials: true,
    });
  }
//  Apartado para realizar el pintado de datos de la vista 'Mi cuenta'
  getMe(){
    return this.http.get<miCuentaModel>(this.urlApi_me,{
      withCredentials: true,
    })
  }

  // Para la carga de datos importados desde un archivo csv
  postFile(file: any){
    return this.http.post<any>(this.urlApi_personascsv,file,
    {
      withCredentials: true
    }
    )
  }

  // Funcion para filtrar los datos de Personas
  getPersonasFiltro(filter: any){
    const personaFilter = GetFinalFiltersQuery(filter);
    return this.http.get<personasModel>(this.urlApi_usuariosFilter + personaFilter, {
      withCredentials: true,
    })
  }

}
