import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { BehaviorSubject, Observable } from 'rxjs';
import { informeAgg } from '../models/informes';


const intInfor: informeAgg = {
  id: 0,
  status: true
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private URL_API_INFORMES: string = config.URL_API_BASE + 'reportes/generarPdf';
  private URL_API_ORIGEN_INGRESO: string = config.URL_API_BASE + 'reportes/origenIngreso';
  private URL_API_TIPO_INGRESO: string = config.URL_API_BASE + 'reportes/tipoIngreso';
  private URL_API_BIENES_FECHA_COMPRA: string = config.URL_API_BASE + 'reportes/bienesFechaCompra';
  private URL_API_BIENES_FECHA_COMPRA2: string = config.URL_API_BASE + 'reportes/bienesFechaCompra2';
  private URL_API_BIENES_CON_GARANTIA: string = config.URL_API_BASE + 'reportes/bienesConGarantia';
  private URL_API_BIENES_CON_GARANTIA_FECHA: string = config.URL_API_BASE + 'reportes/bienesConGarantiaPorFecha';
  private URL_API_BIENES_POR_CATALOGO: string = config.URL_API_BASE + 'reportes/bienesPorCatalogo'
  private URL_API_BIENES_POR_MARCA: string = config.URL_API_BASE + 'reportes/bienesPorMarca'
  private URL_API_BIENES_POR_UBICACION: string = config.URL_API_BASE + 'reportes/bienesPorUbicacion'
  private URL_API_BIENES_POR_HISTORIAL: string = config.URL_API_BASE + 'reportes/bienesPorHistorial'


  private URL_API_UBICACIONES: string = config.URL_API_BASE + 'centros/filtradoUbicaciones'

  // router.get("/bienesConGarantiaPorFecha",routeReportes.reporteBienesConGarantiaPorFecha);

  constructor(private http: HttpClient) { }

  private buttonName$ = new BehaviorSubject<informeAgg>(intInfor);

  get SelectButtonName$(): Observable<informeAgg> {
    return this.buttonName$.asObservable();
  }

  setButtonName(data: informeAgg) {
    this.buttonName$.next(data);
  }

  //////////////////////////////////////////////

  getPDF(file: any) {

    const params = new HttpParams()
      .set('marca', file.marca)
      .set('origen', file.origen)
      .set('material', file.material)
      .set('color', file.color)
      .set('estado', file.estado)
      .set('condicion', file.condicion)
      .set('bodega', file.bodega)
      .set('custodio', file.custodio)
      .set('fechaI', file.fechaI)


    return this.http.get<any>(this.URL_API_INFORMES + '?' + params, {
      withCredentials: true
    });
  }

  /////////////////////////////////////////////////

getOrigenIngreso() {
  return this.http.get<any>(this.URL_API_ORIGEN_INGRESO, {
    withCredentials: true
  });
}

getTipoIngreso() {
  return this.http.get<any>(this.URL_API_TIPO_INGRESO, {
    withCredentials: true
  });

}

getBienesFechaCompra() {

  return this.http.get<any>(this.URL_API_BIENES_FECHA_COMPRA, {
    withCredentials: true
  });

}

getBienesFechaCompra2() {
  return this.http.get<any>(this.URL_API_BIENES_FECHA_COMPRA2, {
    withCredentials: true
  });

}

getBienesConGarantia() {
  return this.http.get<any>(this.URL_API_BIENES_CON_GARANTIA, {
    withCredentials: true
  });


}

getBienesConGarantiaPorFecha(fecha: any) {
  const params = new HttpParams()
  .set('fechaInicio', fecha.fechaI)
  .set('fechaFinal', fecha.fechaF)

  console.log('en el servicio ->', fecha)
  return this.http.get<any>(this.URL_API_BIENES_CON_GARANTIA_FECHA + '?' + params, {
    withCredentials: true
  });



}

getBienesPorCatalogo(catalogo: number) {
  return this.http.get<any>(this.URL_API_BIENES_POR_CATALOGO + '/' + catalogo, {
    withCredentials: true
  });
}

getBienesPorMarca(marca: number) {
  return this.http.get<any>(this.URL_API_BIENES_POR_MARCA + '/' + marca, {
    withCredentials: true
  });
}

getBienesPorUbicacion(ubicacion: number) {
  return this.http.get<any>(this.URL_API_BIENES_POR_UBICACION + '/' + ubicacion  , {
    withCredentials: true
  });
}

getBienesPorHistorial(historial: number) {
  return this.http.get<any>(this.URL_API_BIENES_POR_HISTORIAL + '/' + historial, {
    withCredentials: true
  });
}


// es un filtro por lo que se necesita parametros 
getBienesUbicacion(pagination: any){

  const params = new HttpParams()
  .set('page', pagination.page)
  .set('size', pagination.size)
  .set('parameter', pagination.parameter)
  .set('data', pagination.data)
  console.log('lo que va en el servicio', pagination)
  console.log('lo que lleva params', params)
  return this.http.get<any>(this.URL_API_UBICACIONES + '?'+ params, {
    withCredentials: true
  })
}

  
}
