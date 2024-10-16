import { Injectable } from '@angular/core';
import config from 'config/config';
import { dataMantenimiento, datosMantenimiento, pagTipoMantenimiento } from '../../models/mantenimiento/tipoMantenimiento';
import { HttpClient, HttpParams } from '@angular/common/http';
import { dataSoporte, datosSoporte, pagSoporte } from '../../models/mantenimiento/soporte';
import { datosNivel, pagNivelMantenimiento } from '../../models/mantenimiento/nivelMantenimiento';
import { datosEstado, pagEstadoMantenimiento } from '../../models/mantenimiento/estadoMantenimiento';
import { datosRegistro, pagRegistroMantenimiento } from '../../models/mantenimiento/registro';
import { datosPlanificacion, pagPlanificacion } from '../../models/mantenimiento/planificacion';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicasMantenimientoService {

  private URL_API_SOPORTE: string = config.URL_API_BASE + 'soporte'
  private URL_API_TMANTENIMIENTO: string = config.URL_API_BASE + 'tipo_mantenimiento'
  private URL_API_NIVELM: string = config.URL_API_BASE + 'nivel_mantenimiento'
  private URL_API_ESTADOM: string = config.URL_API_BASE + 'estado_mantenimiento'
  private URL_API_PLANIFICACION: string = config.URL_API_BASE + 'planificacion'
  private URL_API_REGISTRO: string = config.URL_API_BASE + 'registro'


  datosSoporte!: datosSoporte[]
  datosTipoMantenimiento!: datosMantenimiento[] 
  datosNivelMantenimiento!: datosNivel[]
  datosEstadoMantenimiento!: datosEstado[]
  datosRegistro!: datosRegistro[]
  datosPlanificacion!: datosPlanificacion[]
  

  constructor(private http: HttpClient) { }

  //Soporte

  getSoporte( pagination: any) {

    
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagSoporte>(this.URL_API_SOPORTE+ '?' + params, {
      withCredentials: true,
    });
  }

  postSoporte(file: any){
    console.log('lo que se envia en el servicio ->', file)
    return this.http.post<dataSoporte>(this.URL_API_SOPORTE, file, {
      withCredentials: true,
    }); 
  
  }

  deleteSoporte(id: number){
    return this.http.delete<dataSoporte>(this.URL_API_SOPORTE + '/' + id, {
      withCredentials: true,
    }); 
  
  }

  //Tipo Mantenimineto

  getTipoMantenimiento( pagination: any) {

    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagTipoMantenimiento>(this.URL_API_TMANTENIMIENTO + '?' + params, {
      withCredentials: true,
    });
  }

  postTipoMantenimiento(file: any){
    console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_TMANTENIMIENTO, file, {
      withCredentials: true,
    }); 
  
  }

  deleteTipoMantenimiento(id: number){
    return this.http.delete<dataMantenimiento>(this.URL_API_TMANTENIMIENTO + '/' + id, {
      withCredentials: true,
    }); 
  
  
  }

  //Nivel de mantenimiento 

  getNivelMantenimiento( pagination: any) {
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagNivelMantenimiento>(this.URL_API_NIVELM + '?' + params, {
      withCredentials: true,
    });
  
  }

  postNivelMantenimiento(file: any){
    console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_NIVELM, file, {
      withCredentials: true,
    }); 
  
  }


  //Estado de mantenimiento

  getEstadoMantenimiento( pagination: any) {
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagEstadoMantenimiento>(this.URL_API_ESTADOM + '?' + params, {
      withCredentials: true,
    });

  }

  postEstadoMantenimiento(file: any){
    console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_ESTADOM, file, {
      withCredentials: true,
    }); 
  }

  //Registro 

  getRegistro( pagination: any) {
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagRegistroMantenimiento>(this.URL_API_REGISTRO + '?' + params, {
      withCredentials: true,
    });

  }

  postRegistro(file: any){
    console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_REGISTRO, file, {
      withCredentials: true,
    }); 
  
  }

  //Planificacion 

  getPlanificacion( pagination: any) {
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagPlanificacion>(this.URL_API_PLANIFICACION + '?' + params, {
      withCredentials: true,
    });
  }

  postPlanificacion(file: any){
    console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_PLANIFICACION, file, {
      withCredentials: true,
    }); 
  
  }


}
