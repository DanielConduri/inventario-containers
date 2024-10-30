import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import config from 'config/config';
import Swal from "sweetalert2";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  horarioPrestamo!: any[]

  private URL_API_HORARIO: string = config.URL_API_BASE + 'horario/centro';
  private destroy$ = new Subject<any>();
  constructor(private http: HttpClient) { }

  private horarioCentro$ = new BehaviorSubject<any>({})

  setHorarioCentro(data: any) {
    this.horarioCentro$.next(data)
  }
  get SelectHorarioCentro$() {
    return this.horarioCentro$.asObservable()
  }


  postHorario(data: any) {
    return this.http.post<any>(this.URL_API_HORARIO, data, {
      withCredentials: true
    })
  }


  getHorario(id_centro: number) {
    return this.http.get<any>(`${this.URL_API_HORARIO}/${id_centro}`, {
      withCredentials: true
    })
  }

  //funcion general para crear horarios

  crearHorario(data: any) {
    this.postHorario(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Horario creado',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error al crear horario',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      },
      complete: () => {},
    });
  }

  //funcion general para obtener horarios de un centro

  getHorarios(id_centro: number) {
    this.getHorario(id_centro)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.setHorarioCentro(data)
      },
      error: (error) => {
        Swal.fire({
          title: 'Error al obtener horarios',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      },
      complete: () => {},
    });

  }


}
