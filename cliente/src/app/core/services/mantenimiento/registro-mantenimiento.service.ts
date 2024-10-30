import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { datosRegistroCorrectivo, datosRegistroPreventivo, pagRegistroCorrectivo, pagRegistroPreventivo } from '../../models/mantenimiento/registro';

@Injectable({
  providedIn: 'root'
})
export class RegistroMantenimientoService {

  private destroy$ = new Subject<any>();


  private URL_API_REGISTRO_CORRECTIVO: string = config.URL_API_BASE + 'registro_correctivo'
  private URL_API_REGISTRO_PREVENTIVO: string = config.URL_API_BASE + 'registro_preventivo'

  private URL_API_PLANIFICACION: string = config.URL_API_BASE + 'registro_preventivo/planificacion'

  datosRegistroCorrectivo!: datosRegistroCorrectivo[]
  datosRegistroPreventivo!: datosRegistroPreventivo[]

  idRegistroCorrectivoModify!: number
  idRegistroPreventivoModify!: number

  cantidadBienes!: number

  ubicacionPreventivo!: number

  constructor(private http: HttpClient) { 
    // this.obtenetRegitroCorrectivo({})
  }

  private cantidadB$ = new BehaviorSubject<number>(0)

  getRegistroCorrectivo(pagination: any) {

    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagRegistroCorrectivo>(this.URL_API_REGISTRO_CORRECTIVO + '?' + params , {
      withCredentials: true,
    })
  }

  postRegistroCorrectivo(file: any) {
    // console.log('lo que va en el servicio', file)
    return this.http.post<any>(this.URL_API_REGISTRO_CORRECTIVO, file, {
      withCredentials: true,
    })
  }

  getCorrectivoById(id: number) {
    return this.http.get<any>(this.URL_API_REGISTRO_CORRECTIVO + '/' + id, {
      withCredentials: true,
    })
  }

  putRegistroCorrectivo(id: number, file: any){
    return this.http.put<any>(`${this.URL_API_REGISTRO_CORRECTIVO}/${id}`, file, {
      withCredentials: true,
    }) 
  }

  deleteRegistroCorrectivo(id: number) {
    return this.http.delete<any>(this.URL_API_REGISTRO_CORRECTIVO + '/' + id, {
      withCredentials: true,
    }) 
  }

 
  //planificacion 

  get SelectCantidadBienes$(): Observable<number>{
    return this.cantidadB$.asObservable()
  }

  setCantidadBienes(data: number){
    this.cantidadB$.next(data)
  }

  getRegistroPreventivo(pagination: any) {
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

    return this.http.get<pagRegistroPreventivo>(this.URL_API_REGISTRO_PREVENTIVO + '?' + params , {
      withCredentials: true,
    })
  }

  postRegistroPreventivo(file: any) {
    // console.log('lo que va en el servicio', file)
    return this.http.post<any>(this.URL_API_REGISTRO_PREVENTIVO, file, {
      withCredentials: true,
    })
  }

  getPreventivoById(id: number) {
    return this.http.get<any>(this.URL_API_REGISTRO_PREVENTIVO + '/' + id, {
      withCredentials: true,
    })
  }

  putRegistroPreventivo(id: number, file: any){
    return this.http.put<any>(`${this.URL_API_REGISTRO_PREVENTIVO}/${id}`, file, {
      withCredentials: true,
    }) 
  }

  deleteRegistroPreventivo(id: number) {
    return this.http.delete<any>(this.URL_API_REGISTRO_PREVENTIVO + '/' + id, {
      withCredentials: true,
    }) 
  }

  putMantenimientoP(form: any){
    return this.http.put<any>(this.URL_API_PLANIFICACION, form, {
      withCredentials: true,
    })
  }

  obetnerMantenimientoP(id: number){
    return this.http.get(this.URL_API_PLANIFICACION + '/' + id, {
      withCredentials: true,
    })
  }

  
  // getPlanificacionM(){
  //   return this.http.get
  // }

}
