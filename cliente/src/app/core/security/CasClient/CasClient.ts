import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../CasClient/ConfigUrl';
// import { Observable, Subject, throwError } from 'rxjs';
import { User } from './CasClientUser';
import { HttpService } from './http.service';
import { CasService } from 'src/app/core/services/cas.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { Router, RoutesRecognized } from '@angular/router';

const CONFIG2 = CONFIG.Settings;
declare var URL: any;
var redirect = '';

@Injectable()
export class CasClient {
  cadena!: string[];

  constructor(
    private http: HttpService,
    private caservice: CasService,
    private router: Router ) {}

    public Redirect() {
      redirect =
        CONFIG2.CASLOGIN + 'service=' + encodeURIComponent(CONFIG2.REDIRECT_URI);
      window.open(redirect, '_self');
    }

    public Logout() {
      var Autenticacion = sessionStorage.getItem('clientName');
      var logout = '';
      this.remove();
      if (Autenticacion == 'Institucional') {
        logout =
          CONFIG2.LOGOUT_CORREO +
          '?post_logout_redirect_uri=' +
          encodeURIComponent(CONFIG2.CASLOGOUT) +
        'service=' +
          encodeURIComponent(CONFIG2.LOGOUT_REDIRECT);
        window.location.href = logout;
      } else {
        this.remove();
        logout =
          CONFIG2.CASLOGOUT +
          'service=' +
          encodeURIComponent(CONFIG2.LOGOUT_REDIRECT);
        window.location.href = logout;
      }
    }

    public casError() {
      this.remove();
      this.router.navigate(['/casError']);

    }

    public verificaLogin(): Promise<any> {
      if (!this.isAuthenticated()) {
        this.Redirect();
      }
      return this.validateLogin();
    }
    async validateLogin() {
      var service = encodeURIComponent(CONFIG2.REDIRECT_URI);
      var ticket = sessionStorage.getItem('ticketUser');
      var urlvalidate =
        CONFIG2.VALIDATEJAVA + 'service=' + service + '&ticket=' + ticket;
      var datosCasTiket = await new Promise<any>((resolve) =>
        this.http.doGetUrlXML(urlvalidate).subscribe((translated) => {
          resolve(translated);
        })
      );
      let success =
        datosCasTiket
          .split('<cas:authenticationSuccess>')[1]
          ?.split('</cas:authenticationSuccess>')[0] ?? undefined;
      if (success != undefined) {
        var atributos: any =
          datosCasTiket
            .split('<cas:attributes>')[1]
            ?.split('</cas:attributes>')[0] ?? undefined;
        var perid: any =
          atributos.split('<cas:perid>')[1]?.split('</cas:perid>')[0] ??
          undefined;
        var clientName: any =
          atributos.split('<cas:clientName>')[1]?.split('</cas:clientName>')[0] ??
          undefined;
        var UserCedula: any =
          atributos.split('<cas:cedula>')[1]?.split('</cas:cedula>')[0] ??
          undefined;

        sessionStorage.setItem('perid', perid);
        sessionStorage.setItem('clientName', clientName);
        sessionStorage.setItem('UserCedula', UserCedula);
        sessionStorage.setItem('ticketUser', ticket!);


        var valido = await new Promise<any>((resolve) =>
          this.caservice.validaringreso(datosCasTiket).subscribe((translated) => {
            resolve(translated);
          })
        );
        // console.log('valido', valido);
        if (valido.status == 'success') {
          let user = valido.datosCas.casUser;
          sessionStorage.setItem('loginUser', user);
          return true;
        }
        return false;
      }
      return false;
    }

    public validacionUsuarioCas(resolve: any, reject: any, res: string) {
      this.caservice.validaringreso(res).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            let user = response.datosCas.casUser;
            let clientName = response.datosCas.clienteName;
            sessionStorage.setItem('clientName', clientName || 'Centralizada');
            sessionStorage.setItem('loginUser', user);
          } else {
            // alert('No se pudo validar el usuario');
            this.caservice.setMessageCasError(
              'No se pudo validar el usuario' + response.status
            );
            // this.Logout();
            this.casError();
          }
          resolve();
        },
        error: (err: any) => {
          // alert('No se pudo validar el usuario por un error' + err.message);
          this.caservice.setMessageCasError(err.message);
          this.casError();
          reject();
        },
      });
    }

    public urlWithoutTicket(url: string): string {
      return url.replace(/(^|[&?])ticket(=[^&]*)?/, '');
    }

    public uniqueUrl(url: string) {
      var unique_url = url;
      unique_url += url.indexOf('?') === -1 ? '?' : '&';
      unique_url += '_=' + new Date().getTime();
      return unique_url;
    }

    public remove() {
      window.sessionStorage.removeItem('ticketUser');
      window.sessionStorage.removeItem('loginUser');
      window.sessionStorage.removeItem('clientName');
      window.sessionStorage.removeItem('UserCedula');
      window.sessionStorage.removeItem('perid');
      localStorage.removeItem('userRole');
      //eliminar cookie llamada token
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=localhost; Secure; SameSite=None;';
    }

    public isNotEmpty(obj: any): boolean {
      return !this.isEmpty(obj);
    }

    public isEmpty(obj: any): boolean {
      return obj == undefined || obj == null || obj == '' || obj == ' ';
    }

    public saveTicket() {
      let ticket = window.location.search.replace('?ticket=', '');
      if (ticket) {
        sessionStorage.setItem('ticketUser', ticket);
      }
      // console.log('ticket en sabe', ticket);

    }

    public getLogin() {
      return sessionStorage.getItem('loginUser');
    }

    public getTicket() {
      return sessionStorage.getItem('ticketUser');
    }

    public isAuthenticated(): boolean {
      var rawIdToken = sessionStorage.getItem('ticketUser');
      if(this.isNotEmpty(rawIdToken)){
        // console.log("esta autenticado" + rawIdToken);
      }
      return this.isNotEmpty(rawIdToken);
    }
    public isAuth(): boolean {
      var ticket = sessionStorage.getItem('ticketUser');
      var user = sessionStorage.getItem('loginUser');
      return Boolean(ticket) && Boolean(user);
    }

    public ReadTicket(url: string): String {
      let intIndex: boolean = url.includes('ticket');
      let rawClientInfo: string = '';
      if (intIndex) {
        this.cadena = url.split('=');
        rawClientInfo = this.cadena[1];
        sessionStorage.setItem('ticketUser', this.cadena[1]);
        return rawClientInfo;
      } else {
        return rawClientInfo;
      }
    }
}
