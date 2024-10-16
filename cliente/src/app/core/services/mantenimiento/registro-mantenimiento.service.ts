import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { datosRegistroCorrectivo, datosRegistroPreventivo, pagRegistroCorrectivo, pagRegistroPreventivo } from '../../models/mantenimiento/registro';

@Injectable({
  providedIn: 'root'
})
export class RegistroMantenimientoService {

  private destroy$ = new Subject<any>();


  private URL_API_REGISTRO_CORRECTIVO: string = config.URL_API_BASE + 'registro_correctivo'
  private URL_API_REGISTRO_PREVENTIVO: string = config.URL_API_BASE + 'registro_preventivo'

  datosRegistroCorrectivo!: datosRegistroCorrectivo[]
  datosRegistroPreventivo!: datosRegistroPreventivo[]

  constructor(private http: HttpClient) { 
    // this.obtenetRegitroCorrectivo({})
  }



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
    console.log('lo que va en el servicio', file)
    return this.http.post<any>(this.URL_API_REGISTRO_CORRECTIVO, file, {
      withCredentials: true,
    })
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

}
