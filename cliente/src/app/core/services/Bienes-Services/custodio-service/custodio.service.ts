import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import config from 'config/config';
import { custodiosData, custodiosIDModel, pagCustodios } from 'src/app/core/models/Bienes/Custodios/custodios';

@Injectable({
  providedIn: 'root'
})
export class CustodioService {


  //Rutas para consultar
  private urlApi_Custodio: string = config.URL_API_BASE + 'custodios';


  datosCustodios!: custodiosData[];

  dataCustodioID: custodiosData = {
    int_custodio_id: 0,
    str_custodio_nombre: '',
    str_custodio_cedula: '',
    str_custodio_estado: '',
    str_custodio_activo: '',
    dt_fecha_creacion: '',
    str_persona_bien_activo: false
  }


  constructor(
    private http: HttpClient
  ) { }


  // Funcion para obtener los custodios
  getCustodios(pagination: any){

    // console.log("Get_custodios ",pagination);
    const params = new HttpParams()
    .set('page', pagination.page)
    .set('size', pagination.size)
    .set('parameter', pagination.parameter)
    .set('data', pagination.data)

    return this.http.get<pagCustodios>(
      this.urlApi_Custodio + '?'+params,
      { withCredentials: true }
    )
  }

  getCustodioID(id: number){
    return this.http.get<custodiosIDModel>(
      `${this.urlApi_Custodio}/${id}`,
      { withCredentials: true }
    )
  }


}
