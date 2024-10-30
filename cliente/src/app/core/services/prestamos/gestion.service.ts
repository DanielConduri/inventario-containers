import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DataEstadosPrestamo, EstadosPrestamoModal, NuevoEstadoPrestamoModal } from '../../models/prestamos/gestion';

@Injectable({
  providedIn: 'root'
})
export class GestionService {
  private destroy$ = new Subject<any>();

  estadosPrestamo!: DataEstadosPrestamo[];
  idEstados!: number;

  private URL_API_ESTADOS: string  = config.URL_API_BASE + 'estado_prestamo'


  private dataEstadoPrestamo$ = new Subject<DataEstadosPrestamo[]>(); 
  private metadataEstadoPrestamo$ = new Subject<EstadosPrestamoModal>();
  private idEstadoPrestamo$ = new Subject<number>();

  get SelectDataEstadoPrestamo$(): Observable<DataEstadosPrestamo[]> {
    return this.dataEstadoPrestamo$.asObservable()
  }

  setSelectDataEstadoPrestamo(data: DataEstadosPrestamo[]) {
    this.dataEstadoPrestamo$.next(data)
  }

  get SelectMetadataEstadoPrestamo$(): Observable<EstadosPrestamoModal> {
    return this.metadataEstadoPrestamo$.asObservable()
  }

  setSelectMetadataEstadoPrestamo(data: EstadosPrestamoModal) {
    this.metadataEstadoPrestamo$.next(data)
  }

  get SelectIdEstadoPrestamo$(): Observable<number> {
    return this.idEstadoPrestamo$.asObservable()
  }

  setSelectIdEstadoPrestamo(data: number) {
    this.idEstadoPrestamo$.next(data)
  }


  constructor(private http: HttpClient) { }



  getEstadosPrestamo(pagination: any){
    const params = new HttpParams()
    .set('page', pagination.page)
    .set('size', pagination.size)
    .set('parameter', pagination.parameter)
    .set('data', pagination.data);

    return this.http.get<EstadosPrestamoModal>(this.URL_API_ESTADOS + '?' + params,
      {
        withCredentials: true,
      }
    );
  }

  getEstadoPrestamoId(id: number){
    return this.http.get<EstadosPrestamoModal>(this.URL_API_ESTADOS + '/' + id,
      {
        withCredentials: true
      }
    )
  }

  postEstadoMantenimiento(data: NuevoEstadoPrestamoModal){
    return this.http.post(this.URL_API_ESTADOS, data,
      {
        withCredentials: true
      }
    )
  }

  putEstadoPrestamo(id: number, data: NuevoEstadoPrestamoModal){
    return this.http.put(this.URL_API_ESTADOS + '/' + id, data,
      {
        withCredentials: true
      }
    )
  }

  deleteEstadoPrestamo(id: number){
    return this.http.delete(this.URL_API_ESTADOS + '/' + id,
      {
        withCredentials: true
      }
    )
  }


  obtenerEstadosPrestamo(pagination: any){
    this.getEstadosPrestamo(pagination)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (rest: EstadosPrestamoModal) =>{
        this.estadosPrestamo = rest.body
        this.setSelectDataEstadoPrestamo(this.estadosPrestamo)
        this.setSelectMetadataEstadoPrestamo(rest)
      }, 
      error(err) {
        console.log('Error: ', err)
      },
    })
  }

  


}
