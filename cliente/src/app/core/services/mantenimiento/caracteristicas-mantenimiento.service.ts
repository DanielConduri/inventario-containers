import { Injectable } from '@angular/core';
import config from 'config/config';
import { dataMantenimiento, datosMantenimiento, pagTipoMantenimiento } from '../../models/mantenimiento/tipoMantenimiento';
import { HttpClient, HttpParams } from '@angular/common/http';
import { dataSoporte, datosSoporte, pagSoporte } from '../../models/mantenimiento/soporte';
import { dataNivel, datosNivel, pagNivelMantenimiento } from '../../models/mantenimiento/nivelMantenimiento';
import { dataEstado, datosEstado, pagEstadoMantenimiento } from '../../models/mantenimiento/estadoMantenimiento';
import { datosRegistro, pagRegistroMantenimiento } from '../../models/mantenimiento/registro';
import { datosPlanificacion, pagPlanificacion } from '../../models/mantenimiento/planificacion';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { detalleCent } from '../../models/centros';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicasMantenimientoService {
  private destroy$ = new Subject<any>();


  private URL_API_SOPORTE: string = config.URL_API_BASE + 'soporte'
  private URL_API_TMANTENIMIENTO: string = config.URL_API_BASE + 'tipo_mantenimiento'
  private URL_API_NIVELM: string = config.URL_API_BASE + 'nivel_mantenimiento'
  private URL_API_ESTADOM: string = config.URL_API_BASE + 'estado_mantenimiento'
  private URL_API_PLANIFICACION: string = config.URL_API_BASE + 'planificacion' 
  private URL_API_REGISTRO: string = config.URL_API_BASE + 'registro'

  // private URL_API_MANTENIMIENTOP: string = config.URL_API_BASE + 'mantenimiento'


  datosSoporte!: datosSoporte[]
  datosTipoMantenimiento!: datosMantenimiento[] 
  datosNivelMantenimiento!: datosNivel[]
  datosEstadoMantenimiento!: datosEstado[]
  datosRegistro!: datosRegistro[]
  datosPlanificacion!: datosPlanificacion[]
  detallesCentro!: detalleCent[]

  auxNivel!: any[]
  auxTipoM!: any[]

  idTipoSModify!: number
  idTipoMModify!: number
  idNivelMModify!: number
  idEstadoMModify!: number
  

  constructor(private http: HttpClient) { }


  private ubicacionC$ = new BehaviorSubject<number>(0);
  private planificacion$ = new BehaviorSubject<number>(0);
  private ubicaPlan$ = new BehaviorSubject<number>(0);
  private planiEditar$ = new BehaviorSubject<number>(0)

  get SelectUbicacionC$(): Observable<number>{
    return this.ubicacionC$.asObservable();
  }

  setUbicacionC(data: number){
    this.ubicacionC$.next(data);
  }

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
    // console.log('lo que se envia en el servicio ->', file)
    return this.http.post<dataSoporte>(this.URL_API_SOPORTE, file, {
      withCredentials: true,
    }); 
  
  }

  deleteSoporte(id: number){
    return this.http.delete<dataSoporte>(this.URL_API_SOPORTE + '/' + id, {
      withCredentials: true,
    }); 
  
  }

  putSoporte(id: number, file: any){
    return this.http.put<any>(`${this.URL_API_SOPORTE}/${id}`, file,{
      withCredentials: true
    })
  }

  getById(id: number){
    return this.http.get<number>(this.URL_API_SOPORTE + '/' + id, {
      withCredentials: true
    })
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
    // console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_TMANTENIMIENTO, file, {
      withCredentials: true,
    }); 
  
  }

  deleteTipoMantenimiento(id: number){
    return this.http.delete<dataMantenimiento>(this.URL_API_TMANTENIMIENTO + '/' + id, {
      withCredentials: true,
    }); 
  }

  putTipoMantenimiento(id: number, file: any){
    // console.log('en el servisio ->', id, file)
    return this.http.put<any>(`${this.URL_API_TMANTENIMIENTO}/${id}`, file,{
      withCredentials: true
    })
  }

  getByIdTipoM(id: number){
    return this.http.get<number>(this.URL_API_TMANTENIMIENTO + '/' + id, {
      withCredentials: true
    })
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
    // console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_NIVELM, file, {
      withCredentials: true,
    }); 
  
  }

  deleteNivelMantenimiento(id: number){
    return this.http.delete<dataNivel>(this.URL_API_NIVELM + '/' + id, {
      withCredentials: true,
    }); 
  }

  putNivelMantenimiento(id: number, file: any){
    // console.log('lo que se envia ->', file)
    return this.http.put<any>(`${this.URL_API_NIVELM}/${id}`, file,{
      withCredentials: true
    })
  
  }

  getByIdNivelM(id: number){
    return this.http.get<number>(this.URL_API_NIVELM + '/' + id, {
      withCredentials: true
    })
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
    // console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_ESTADOM, file, {
      withCredentials: true,
    }); 
  }

  deleteEstadoMantenimiento(id: number){
    return this.http.delete<dataEstado>(this.URL_API_ESTADOM + '/' + id, {
      withCredentials: true,
    }); 
  }

  putEstadoMantenimiento(id: number, file: any){
    // console.log('lo que se envia ->', id, file)
    return this.http.put<any>(`${this.URL_API_ESTADOM}/${id}`, file,{
      withCredentials: true
    })
  }

  getByIdEstadoM(id: number){
    return this.http.get<number>(this.URL_API_ESTADOM + '/' + id, {
      withCredentials: true
    })
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
    // console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_REGISTRO, file, {
      withCredentials: true,
    }); 
  
  }

  //Planificacion 

  get SelectIdP$(): Observable<number>{
    return this.planificacion$.asObservable()
  }

  setPlanificacionId(data: number){
    this.planificacion$.next(data)
  }

  get SelectUbiP$(): Observable<number>{
    return this.ubicaPlan$.asObservable()
  }

  setUbicaPlan(data: number){
    this.ubicaPlan$.next(data)
  }

  get SelectPlanEdid(): Observable<number>{
    return this.planiEditar$.asObservable()
  }

  setPlanEditar(data: number){
    this.planiEditar$.next(data)
  }

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
    // console.log('lo que sale servicio', file)
    return this.http.post<any>(this.URL_API_PLANIFICACION, file, {
      withCredentials: true,
    }); 
  
  }

  getByIdPlanificacion(id: number){
    console.log('lo que yo envio ->', id)
    return this.http.get<number>(this.URL_API_PLANIFICACION + '/' + id, {
      withCredentials: true
    })
  }

  putPlanificacion(id: number, file: any){
    // console.log('lo que se envia ->', id, file)
    return this.http.put<any>(`${this.URL_API_PLANIFICACION}/${id}`, file,{
      withCredentials: true
    })
  }

  dormirHoy(id: number){
    this.getByIdPlanificacion(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        console.log('en el mostrar ----->', data)
        console.log('el para es???? ------------>, ',data.body.int_planificacion_cantidad_bienes)
        
      },
      error: (error) => { console.log(error) }
    })
  }

}
