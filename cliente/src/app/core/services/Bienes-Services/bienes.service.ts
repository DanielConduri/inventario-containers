import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class BienesService {

  constructor() { }

  // BehaviorSubject para Cambiar nombre de Botones
  private buttonName$ = new BehaviorSubject<number>(0);

  get SelectButtonName$(): Observable<number>{
    return this.buttonName$.asObservable();
  }

  setButtonName(data: number){
    this.buttonName$.next(data);
  }

}
