import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { BehaviorSubject, Observable } from 'rxjs';

const messageCasError: string = '';

@Injectable({
  providedIn: 'root',
})


export class CasService {
  private URL_API: string = config.URL_API_BASE + 'login';


  constructor(private http: HttpClient) {}


  private messageCasError$ = new BehaviorSubject<any>(messageCasError);

  get SelectIsMessageCasError$(): Observable<string>{
    return this.messageCasError$.asObservable();
  }

  setMessageCasError(data: string){
    this.messageCasError$.next(data);
  }

  validaringreso(cas: string) {
    // console.log('cas', cas);
    return this.http.post<any>(
      this.URL_API,
      { xmlDatosCas: cas, },

      {
        withCredentials: true,
      }
      //console.log('return', xmlDatsCas)

    );
  }
}
