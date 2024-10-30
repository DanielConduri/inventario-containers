import { Injectable } from '@angular/core';
import { OtrosOtros } from '../../models/Bienes/Inventario/otros';
import { BehaviorSubject, Observable } from 'rxjs';
import { informeAgg } from '../../models/informes';
import config from 'config/config';
import { HttpClient } from '@angular/common/http';

const intInfor: informeAgg = {
  id: 0,
  status: true
}

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  private URL_API_TRASPASO: string = config.URL_API_BASE + 'traspaso'
  

  typeviw!: boolean
  typeview!: boolean
  especial!:boolean
  preventivo!: boolean
  datosSearch!: OtrosOtros[]
  
  edidMantenimientoCorrectivo!: boolean

  constructor(private http: HttpClient) { }

  private buttonName$ = new BehaviorSubject<informeAgg>(intInfor);
  private idTraspaso$ = new BehaviorSubject<number>(0)

  get SelectButtonName$(): Observable<informeAgg> {
    return this.buttonName$.asObservable();
  }

  setButtonName(data: informeAgg) {
    this.buttonName$.next(data);
  }

  get SelectTraspaso$(): Observable<number>{
    return this.idTraspaso$.asObservable()
  }

  setTraspaso(data: number){
    this.idTraspaso$.next(data)
  }

  // private _nameButton$ = new BehaviorSubject<number>(0);

  // get SelectNameButton$(): Observable<number> {
  //   return this._nameButton$.asObservable();
  // }

  // setNameButton(data: number) {
  //   this._nameButton$.next(data);
  // }

  postTraspaso(file:any){
    return this.http.post<any>(this.URL_API_TRASPASO, file, {
      withCredentials: true
    })
  }

}