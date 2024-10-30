import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { datosResponsable, formatoDoc } from '../models/informes';
import { OtrosOtros, OtrosShowModelPag } from '../models/Bienes/Inventario/otros';

@Injectable({
  providedIn: 'root'
})
export class InformesService {

  private URL_API_INFORMES: string = config.URL_API_BASE + 'documentos';
  private URL_API_EDID_INFOR : string = config.URL_API_BASE + 'documentos/editar';


  //rutas para tipo de informes

  private URL_API_TIPO: string = config.URL_API_BASE + 'tipo_documento';


  idModifyT!: number 
  datosInformes!: any[]

  datosCompletos: datosResponsable={
  int_per_id: 0
  }

  datosTipos!: any[]
  datosTipos2!: any[]
  datosSearch!: OtrosOtros[]
  usuarioSearch!: any[]

  datosBien!: any[]
  datosArr!: any[]
  datosIdUse!: any[]
  datosUser!: any[]

  pdf!: number
  idInf!: number

  typeviw!: boolean
  typeview!: boolean

  permisosInforme!: boolean

  constructor(private http: HttpClient) { }


  getInform(pagination: any){

    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<any>(this.URL_API_INFORMES + '?' +params,{
      withCredentials: true
    });
  }

  getInf(id: number){
    return this.http.get<number>(this.URL_API_INFORMES + '/' + id, {
      withCredentials: true
    })
  }


  getInfed(id: number){
    return this.http.get<number>(this.URL_API_EDID_INFOR + '/' + id, {
      withCredentials: true
    })
  }

  postInfoEd(file: any, id:number){
    // console.log('enviado al servidor ->', file);
    return this.http.put<any>(this.URL_API_INFORMES + '/' + id, file, {
      withCredentials: true
    })
  }

  postInfo(file: any){
    // console.log('enviado al servidor ->', file);
    return this.http.post<formatoDoc>(this.URL_API_INFORMES, file, {
      withCredentials: true
    })
  }


  //funciones para tipo de documentos 

  getTipos(pagination: any){

    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<any>(this.URL_API_TIPO + '?' +params,{
      withCredentials: true
    });
  }

  getTiposId(id: number){
    return this.http.get<number>(this.URL_API_TIPO + '/' + id, {
      withCredentials: true
    })
  }

  postTipos(file: any){
    return this.http.post<formatoDoc>(this.URL_API_TIPO, file,{
      withCredentials: true
    })
  }

  putTipos(file: any, id: number){
    return this.http.put<formatoDoc>(`${this.URL_API_TIPO}/${id}`, file,{
      withCredentials: true
    })
  }

  deleteTipos(id: number){
    return this.http.delete<formatoDoc>(`${this.URL_API_TIPO}/${id}`, {
      withCredentials: true
    })
  }


}
