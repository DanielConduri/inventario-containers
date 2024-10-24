import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { BehaviorSubject, Observable } from 'rxjs';
import GetFinalFiltersQuery from 'src/app/utils/filter/GetFinalFiterQuery';
import { addCent, addCenter, cargaLoading, centrosModel, dataCentros, detalleCent, pagCenter, } from '../models/centros';

const isCarga: {
  isLoading: boolean;
  isData: boolean;
} = {
  isLoading: false,
  isData: false
}

@Injectable({
  providedIn: 'root'
})
export class CentrosService {

  private URL_API_CENTROS: string = config.URL_API_BASE + 'centros';
  private URL_API_PAG: string = config.URL_API_BASE + 'centros/paginacion';
  private URL_API_TYPE: string = config.URL_API_BASE + 'centros/tipo';
  private URL_API_CARRERA: string = config.URL_API_BASE + 'centros/carreras';
  private URL_API_UBICACION: string = config.URL_API_BASE + 'centros/procesos'
  private URL_API_DETALLES: string = config.URL_API_BASE + 'centros/detalles'
  private URL_API_DEPENDENCIA: string = config.URL_API_BASE + 'centros/dependencias'
  private URL_API_CENTROSFILTRADOS: string = config.URL_API_BASE + 'centros/filtrado'


  datosFacultad!: string[]
  datosCarrera!: string[]

  datosUbicacion!: []
  datosDependencia:[] = []

  datosCentros!: dataCentros[]

  datosDetalles!: detalleCent[]

  idModify!: number

  constructor(private http: HttpClient) {
   }

  // private data_detalle$ = new BehaviorSubject<detalleCent>(detalleC);
  private isCarga$ = new BehaviorSubject<cargaLoading>(isCarga);

  get SelectIsCarga$(): Observable<cargaLoading> {
    return this.isCarga$.asObservable()
  }

  setIsCarga(data: cargaLoading) {
    this.isCarga$.next(data);
  }



  //funcion para eliminar centros (eliminado logico)

  deleteCenter(idCent: number) {
    return this.http.delete<centrosModel>(`${this.URL_API_CENTROS}/${idCent}`,
      {
        withCredentials: true,
      },
    )
  }

  //funcion para agregar centros 

  postFile(file: any) {
    return this.http.post<any>(this.URL_API_CENTROS, file,
      {
        withCredentials: true
      }
    )
  }

  //funcion para editar los centros con el id del centro y el contenido 

  editCentros(id: number, file: any){
    return this.http.put<any>(`${this.URL_API_CENTROS}/${id}`, file,{
      withCredentials: true
    })
  }

  //funcion para la paginacion y mostrar los centros 

  getCenter( pagination: any) {
    // const queryPagination = pagination
    //   ? `?pagination={"page":${pagination.page}, "size":${pagination.saze}, "parameter":${pagination.parameter}, "data":${pagination.data}}`
    //   : '';
    //   // console.log('datos rutas: ->', pagination.page, pagination.size);
    //   // const queryFilter = filter ? `&filter=${JSON.stringify(filter)}` : '';
    //   return this.http.get<pagCenter>(
    //     this.URL_API_PAG + queryPagination,
    //     {
    //       withCredentials: true,
    //     }
    //   );
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);
    
      return this.http.get<pagCenter>(this.URL_API_PAG + '?' +params,
        {
          //withCredentials: true,
        }
        );
  }

  //funcion para obtener las ubicaciones segun el tipo y la cede para academico

  getTypeAc(type: addCenter){
    const queryType = type
    ? `?center={"type": "${type.type}", "sede":"${type.sede}"}`
    : ``
    return this.http.get<addCenter>(this.URL_API_TYPE + queryType,{
      withCredentials: true
    })
  }

  //funcion para obtener las ubicaciones segun el tipo y la cede para administrativo

  getTypeAd(type: addCent){
    const queryType = type
    ? `?center={"type": "${type.type}", "sede":"${type.sede}"}`
    : ``
    return this.http.get<addCenter>(this.URL_API_TYPE + queryType,{
      withCredentials: true
    })
  }


  //funcion para obtemer las carreras segun la facultad 

  getCarrera(type: addCenter){
    const queryType = type
    ? `?center={"sede": "${type.sede}", "facultad":"${type.codfacultad}"}`
    : ``
    return this.http.get<addCenter>(this.URL_API_CARRERA + queryType,{
      withCredentials: true
    })
  }

  //funcion para obtener la ubicacion (proceso) segun la dependencia 

 getDependencia(type: addCent){
  const queryType = type
    ? `?center={"sede": "${type.sede}", "dependenciaId":"${type.dependenciaId}"}`
    : ``
    return this.http.get<addCenter>(this.URL_API_UBICACION + queryType,{
      withCredentials: true
    })
 }

 //funcion para obtener las informacion completa segun el id del centro 

 getDetalles(detalleId: number){
  return this.http.get<number>(this.URL_API_DETALLES + '/' + detalleId, {
    withCredentials: true
  })
 }


//  Funcion para obtener los datos de los centros filtrados
  getCentrosFiltrados(filter: any){
    const centrosFilter = GetFinalFiltersQuery(filter);
    return this.http.get<centrosModel>(this.URL_API_CENTROSFILTRADOS + centrosFilter, {
      withCredentials: true
    });
  }

}
