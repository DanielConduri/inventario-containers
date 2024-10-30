import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { paginacion } from '../models/paginacion';



const pagi: paginacion = {
  dataLength: 0,
  metaData: 0,
  currentPage: 0
}

let eve: any

@Injectable({
  providedIn: 'root'
})
export class PaginacionService {

  constructor(private http: HttpClient) { }

  private pagina$ = new BehaviorSubject<paginacion>(pagi)
  private event$ = new BehaviorSubject<any>(eve)

  //funcion para atrapar la pagina 

  get Pagination$(): Observable<paginacion> {
    return this.pagina$.asObservable()
  }

  setPagination(data: paginacion) {
    // console.log('revicio de paginacion setPaginacion',data);
    this.pagina$.next(data)
  }

  //funcion para atrapar el evento de cambiar la pagina 

  get Evento$(): Observable<any> {
    return this.event$.asObservable()
  }

  setEvento(data: any ){
    this.event$.next(data)
  }

}
