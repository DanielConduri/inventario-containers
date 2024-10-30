import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';

@Injectable({
  providedIn: 'root',
})
export class FirmaService {
  private URL_API_FIRMA: string = config.URL_API_BASE + 'solicitudes/firmar';
  private URL_API_OBTENER_FIRMA: string =
    config.URL_API_BASE + 'solicitudes/obtenerdoc/firma';
  URL_ONEDRIVE = config.URL_MAIL_SERVICE;

  constructor(private http: HttpClient) {}

  getDocFirmado(nombre: string) {
    return this.http.get<any>(this.URL_API_OBTENER_FIRMA + '/' + nombre, {
      withCredentials: true,
    });
  }

  postFirmaSolicitud(_solicitud: any) {
    console.log('Lo que llega al servicio', _solicitud, this.URL_API_FIRMA);
    return this.http.post<any>(this.URL_API_FIRMA, _solicitud, {
      withCredentials: true,
    });
  }

  obtenerTokenOneDrive() {
    return this.http.post(this.URL_ONEDRIVE, {
      strCodigoSistema: config.CODIGO_SISTEMA_ONEDRIVE,
    });
  }
}
