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
  private URL_API_TOTAL_BIENES: string = config.URL_API_BASE + 'reportes/totalBienes'
  private URL_API_BIENES_POR_DESCRIPCION: string = config.URL_API_BASE + 'reportes/bienesPorDescripcion'

  private URL_API_MANTENIMIENTO_C_FECHA: string = config.URL_API_BASE + 'reportes/bienesMantenimientoCorrectivoPorFechas'
  private URL_API_MANTENIMIENTO_C_CODIGO_BIEN: string = config.URL_API_BASE + 'reportes/mantenimientosCorrectivosPorCodigoBien'
  private URL_API_MANTENIMIENTO_C_TECNICO_FECHA: string = config.URL_API_BASE + 'reportes/mantenimientosCorrectivosPorTecnicoFechas'
  private URL_API_MANTENIMIENTO_P_PLANIFICACION: string = config.URL_API_BASE + 'reportes/bienesMantenimientoPreventivoPorPlanificacion'
  private URL_API_MANTENIMIENTO_P_CENTRO: string = config.URL_API_BASE + 'reportes/mantenimientoPreventivoPorCentro'

  // router.get("/bienesMantenimientoCorrectivoPorFechas", routeReportesMantenimiento.reporteBienesMantenimientoCorrectivoPorFechas);
  // router.get("/mantenimientosCorrectivosPorCodigoBien", routeReportesMantenimiento.reporteMantenimientosCorrectivosPorCodigoBien);
  // router.get("/mantenimientosCorrectivosPorTecnicoFechas", routeReportesMantenimiento.reporteMantenimientosCorrectivosPorTecnicoFechas);
  // router.get("/bienesMantenimientoPreventivoPorPlanificacion/:int_planificacion_id", routeReportesMantenimiento.reporteBienesMantenimientoPreventivoPorPlanificacion);


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
    return this.http.get<any>(`${this.URL_API_ORIGEN_INGRESO}/${0}`, {
      withCredentials: true
    });
  }


  getIngresoOrigenExcel(ingreso: boolean): Observable<Blob>  {
    return this.http.get(`${this.URL_API_ORIGEN_INGRESO}/${ingreso}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }



  getBienesTotal(){
    return this.http.get<any>(this.URL_API_TOTAL_BIENES + '/' + `${0}`, {
      withCredentials: true,
    });
  }

  getBienesTotalExcel(estado : boolean): Observable<Blob> {
    return this.http.get(this.URL_API_TOTAL_BIENES + '/' + `${estado}`, {
      responseType: 'blob', //Establece el tipo de respuesta de un archivo
      withCredentials: true,
    });
  }


  getTipoIngreso(estado: boolean) {
    return this.http.get<any>(this.URL_API_TIPO_INGRESO + '/' + `${0}`, {
      withCredentials: true
    });
  }

  getTipoIngresoExcel(estado: boolean): Observable<Blob> {
    return this.http.get(this.URL_API_TIPO_INGRESO + '/' + `${estado}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }


  getBienesFechaCompra() {
    return this.http.get<any>(this.URL_API_BIENES_FECHA_COMPRA + '/' + `${0}`, {
      withCredentials: true
    });
  }

  getBienesFechaCompraExcel(estado: boolean): Observable<Blob> {
    return this.http.get(this.URL_API_BIENES_FECHA_COMPRA + '/' + `${estado}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }


  getBienesFechaCompra2() {
    return this.http.get<any>(this.URL_API_BIENES_FECHA_COMPRA2 + '/' + `${0}`, {
      withCredentials: true
    });
  }

  getBienesFechaCompraDosExcel(estado: boolean): Observable<Blob> {
    return this.http.get(this.URL_API_BIENES_FECHA_COMPRA2 + '/' + `${estado}`, {
      responseType: 'blob',
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

    // console.log('en el servicio ->', fecha)
    return this.http.get<any>(this.URL_API_BIENES_CON_GARANTIA_FECHA + '?' + params, {
      withCredentials: true
    });



  }

  getBienesPorCatalogo(catalogo: number, estado: boolean) {
    console.log('catalogo', catalogo)
    console.log('estado', estado)
    return this.http.get<any>(this.URL_API_BIENES_POR_CATALOGO + '/' + catalogo + '/' + `${false}`, {
      withCredentials: true
    });
  }

  getBienesPorCatalogoExcel(catalogo: number, estado: boolean): Observable<Blob> {
    return this.http.get(this.URL_API_BIENES_POR_CATALOGO + '/' + catalogo + '/' + `${estado}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  getBienesPorMarca(marca: number, estado: boolean) {
    return this.http.get<any>(this.URL_API_BIENES_POR_MARCA + '/' + marca + '/' + `${0}`, {
      withCredentials: true
    });
  }

  getBienesPorMarcaExcel(marca: number, estado: boolean): Observable<Blob>  {
    return this.http.get(this.URL_API_BIENES_POR_MARCA + '/' + marca + '/' + `${estado}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  getBienesPorDescripcion(descripcion: string, estado: boolean) {
    console.log(descripcion)
    return this.http.get<any>(this.URL_API_BIENES_POR_DESCRIPCION + '/' + descripcion + '/' + `${0}`, {
      withCredentials: true
    });
  }

  getBienesPorDescripcionExcel(descripcion: string, estado: boolean): Observable<Blob>  {
    return this.http.get(this.URL_API_BIENES_POR_DESCRIPCION + '/' + descripcion + '/' + `${estado}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }
  


  getBienesPorUbicacion(ubicacion: number, responsable:any ,estado: boolean) {
    return this.http.get<any>(this.URL_API_BIENES_POR_UBICACION + '/' + ubicacion + '/' + responsable + '/' + `${0}`, {
      withCredentials: true
    });
  }

  getBienesPorUbicacionExcel(ubicacion: number, estado: boolean): Observable<Blob>  {
    return this.http.get(this.URL_API_BIENES_POR_UBICACION + '/' + ubicacion + '/' + `${estado}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  getBienesPorHistorial(historial: number, estado: boolean) {
    return this.http.get<any>(this.URL_API_BIENES_POR_HISTORIAL + '/' + historial +'/'+ `${0}`, {
      withCredentials: true
    });
  }

  getBienesPorHistorialExcel(historial: number, estado: boolean):  Observable<Blob>   {
    return this.http.get(this.URL_API_BIENES_POR_HISTORIAL + '/' + historial +'/'+ `${estado}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }


  // es un filtro por lo que se necesita parametros 
  getBienesUbicacion(pagination: any) {

    const params = new HttpParams()
      .set('page', pagination.page)
      .set('size', pagination.size)
      .set('parameter', pagination.parameter)
      .set('data', pagination.data)
    // console.log('lo que va en el servicio', pagination)
    // console.log('lo que lleva params', params)
    return this.http.get<any>(this.URL_API_UBICACIONES + '?' + params, {
      withCredentials: true
    })
  }

  ///////////////////////////////////////////////////////////////////////
  getMantenimientoCorrectivoPorFechas(fecha: any) {
    const params = new HttpParams()
      .set('fechaInicio', fecha.fechaI)
      .set('fechaFinal', fecha.fechaF)

    // console.log('en el servicio ->', fecha)
    return this.http.get<any>(this.URL_API_MANTENIMIENTO_C_FECHA + '?' + params, {
      withCredentials: true
    });
  }

  getmantenimientosCorrectivosPorCodigoBien(codigo: any){
    //console.log('lo que llega aqui ---->', codigo)
    const params = new HttpParams()
    .set('str_codigo_bien', codigo)
    return this.http.get<any>(this.URL_API_MANTENIMIENTO_C_CODIGO_BIEN + '?'+ params, {
      withCredentials: true
    })
  }

  getmantenimientosCorrectivosPorTecnicoFechas(tecnico:string ,fecha:any){
    const params = new HttpParams()
      .set('fechaInicio', fecha.fechaI)
      .set('fechaFinal', fecha.fechaF)
      .set('str_mantenimiento_correctivo_tecnico_responsable', tecnico.toString())

    return this.http.get<any>(this.URL_API_MANTENIMIENTO_C_TECNICO_FECHA + '?' + params,{
      withCredentials: true
    })
  }

  getBienesMantenimientoPreventivoPorPlanificacion(id: number){
    // const params = new HttpParams()
    // .set('int_planificacion_id',id)

    return this.http.get<any>(this.URL_API_MANTENIMIENTO_P_PLANIFICACION + '/' + id,{
      withCredentials: true
    })
  }

  getBienesMantenimientoPreventivoPorCentro(id: number){
    const params = new HttpParams()
    .set('int_planificacion_id',id.toString())
    return this.http.get<any>(this.URL_API_MANTENIMIENTO_P_CENTRO + '?' + params,{
      withCredentials: true
    })
  }

}
