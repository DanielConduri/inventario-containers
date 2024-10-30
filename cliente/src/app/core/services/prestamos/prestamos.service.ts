import { Injectable } from '@angular/core';
import { OtrosOtros } from '../../models/Bienes/Inventario/otros';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { informeAgg } from '../../models/informes';
import config from 'config/config';
import Swal from 'sweetalert2';
import { DataPrestamos, PrestamosModal } from '../../models/prestamos/prestamos';
import GetFinalFiltersQuery from 'src/app/utils/filter/GetFinalFiterQuery';


const intInfor: informeAgg = {
  id: 0,
  status: true
}
@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private destroy$ = new Subject<any>();

  typeview: boolean = false

  datosSearch!: any[]

  datos!: PrestamosModal

  datosPrestamo!: DataPrestamos[]

  idPrestamo!: number

  especial!: boolean

  idEstados!: number

  pdf!: number

  base64!:boolean
  cedulaCustodio!: string
  cedulaPrestamo!: string
  cedulaDecano!: string
  estadoPrestamo!: string
  proceso!: number

  reporte!: boolean

  horarioId!: number

  linkOneDrive!: string

  solicitanteNombre!: string

  finalizado!: boolean

  observacion!: number


  private URL_API_PRESTAMO: string = config.URL_API_BASE + 'prestamos';
  private URL_API_PRESTAMOS: string = config.URL_API_BASE + 'prestamos/prestamosConEstado';
  private URL_API_PDF: string = config.URL_API_BASE + 'prestamos/pdf';
  private URL_API_FIRMADO: string = config.URL_API_BASE + 'prestamos/firma';
  private URL_API_NUBE: string = config.URL_API_BASE + 'prestamos/nube';
  private URL_API_VALIDACION: string = config.URL_API_BASE + 'prestamos/validacion';
  private URL_API_DECANO: string = config.URL_API_BASE + 'prestamos/decano';
  private URL_API_REPORTE: string = config.URL_API_BASE + 'prestamos/reporte';
  private URL_API_FILTRADO: string = config.URL_API_BASE + 'prestamos/filtrado';

  private URL_API_HORARIO: string = config.URL_API_BASE + 'prestamos/horario';

  constructor(private http: HttpClient) { }

  private buttonName$ = new BehaviorSubject<informeAgg>(intInfor);
  private dataPrestamo$ = new BehaviorSubject<PrestamosModal>(this.datos);

  get SelectButtonName$(): Observable<informeAgg> {
    return this.buttonName$.asObservable();
  }

  setButtonName(data: informeAgg) {
    this.buttonName$.next(data);
  }

  get SelectDataPrestamo$(): Observable<any> {
    return this.dataPrestamo$.asObservable();
  }

  setDataPrestamo(data: any) {
    this.dataPrestamo$.next(data);
  }

  postPrestamo(data: any) {
    console.log('data', data)
    return this.http.post(this.URL_API_PRESTAMO, data, {
      withCredentials: true
    })
  }

  getPrestamo(){
    return this.http.get<any>(this.URL_API_PRESTAMO, {
      withCredentials: true
    })
  }

  crearPrestamo(data: any) {
    console.log('lo que llega --->', data)
    this.postPrestamo(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'Prestamo creado',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al crear prestamo',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    })
  }

  obtenerPrestamo() {
    this.getPrestamo()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //////////////////////////////////////////////////////

  getPrestamosConEstado(pagination:any ){
    const params = new HttpParams()
    .set('page', pagination.page)
    .set('size', pagination.size)
    .set('parameter', pagination.parameter)
    .set('data', pagination.data);

    return this.http.get<any>(this.URL_API_PRESTAMOS + '?' + params, {
      withCredentials: true,
    });
  }

  obtenerPrestamosConEstado(pagination:any){
    this.getPrestamosConEstado(pagination)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.datosPrestamo = data.body

        this.setDataPrestamo(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ///////////////////////////////////////////////////////

  getPrestamoId(id: number){
    return this.http.get<any>(`${this.URL_API_PRESTAMO}/${id}`, {
      withCredentials: true
    })
  }

  /////////////////////////////////////////////////////

  putPrestamo(data: any, id: number){
    return this.http.put(`${this.URL_API_PRESTAMO}/${id}`, data, {
      withCredentials: true
    })
  }

  createHistorial(data: any, id: number){
    console.log('lo que viaja -->', id, data)
    return this.http.post(`${this.URL_API_PRESTAMO}/${id}`, data, {
      withCredentials: true
    })

  }

  actualizarPrestamo( id: number, data: any){
    this.createHistorial(data, id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        console.log('actualizado --->', data);
        Swal.fire({
          title: 'Prestamo actualizado',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al actualizar prestamo',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      },
      complete: () => {
        this.obtenerPrestamosConEstado({})
      }
    })
  }

  ////////////////////////////////////////////////////

  getPdf(id: number){
    return this.http.get(`${this.URL_API_PDF}/${id}`, {
      withCredentials: true
    })
  }

  ////////////////////////////////////////////////////

  putPDF(id: number, data: any){
    console.log('lo que viaja -->', id, data)
    const body = { data: data };
    return this.http.put(this.URL_API_PDF + '/' + id, body, {
      withCredentials: true
    })
  }

  getFirma(id: number){
    return this.http.get(`${this.URL_API_FIRMADO}/${id}`, {
      withCredentials: true
    })
  }

  //////////////////////////////////////////////

  putOneDrive(id: number, data: any){
    console.log('lo que viaja -->', id, data)
    const body = { data: data };
    return this.http.put(this.URL_API_NUBE + '/' + id, body, {
      withCredentials: true
    })
  }

  //////////////////////////////////////////////////

  getValidacion(id: string){
    return this.http.get(`${this.URL_API_VALIDACION}/${id}`, {
      withCredentials: true
    })
  }

  //////////////////////////////////////////////////

  getDecano(id: number){
    return this.http.get(`${this.URL_API_DECANO}/${id}`, {
      withCredentials: true
    })
  }

  ////////////////////////////////////////////////

  getReporte(){
    return this.http.get(this.URL_API_REPORTE, {
      withCredentials: true
    })
  }


  ///////////////////////////////////////////////

  getFiltroBien(filter: any){
    console.log('filter', filter);
    const bienesFilter = GetFinalFiltersQuery(filter);
    return this.http.get<any>(this.URL_API_FILTRADO + bienesFilter, {
      withCredentials: true
    });

  }


  ///////////////////////////////////////////////

  getHorario(id: number){
    return this.http.get<any>(`${this.URL_API_HORARIO}/${id}`, {
      withCredentials: true
    })
  }

}
