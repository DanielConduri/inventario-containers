import { Injectable } from '@angular/core';
import { OtrosOtros } from '../../models/Bienes/Inventario/otros';
import { BehaviorSubject, Observable } from 'rxjs';
import { informeAgg } from '../../models/informes';

const intInfor: informeAgg = {
  id: 0,
  status: true
}

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  
  

  typeviw!: boolean
  typeview!: boolean
  especial!:boolean
  datosSearch!: OtrosOtros[]
  

  constructor() { }

  private buttonName$ = new BehaviorSubject<informeAgg>(intInfor);

  get SelectButtonName$(): Observable<informeAgg> {
    return this.buttonName$.asObservable();
  }

  setButtonName(data: informeAgg) {
    this.buttonName$.next(data);
  }

  // private _nameButton$ = new BehaviorSubject<number>(0);

  // get SelectNameButton$(): Observable<number> {
  //   return this._nameButton$.asObservable();
  // }

  // setNameButton(data: number) {
  //   this._nameButton$.next(data);
  // }

}