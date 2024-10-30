import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs'
import config from 'config/config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { addBienDataById, addOtrosData, addOtrosModel, BienDataModel, BienDataCustodioModel, bienInfoModel, dataBien, historicoBienData, modBienesModel, OtrosOtros, OtrosShowModelPag, dataBienCustodio} from 'src/app/core/models/Bienes/Inventario/otros';
import GetFinalFiltersQuery from 'src/app/utils/filter/GetFinalFiterQuery';




@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  getMarcaById(int_marcas_id: number) {
    throw new Error('Method not implemented.');
  }

  //ruta para mostrar los bienes de cada custodio
  private urlApi_BienesCustodio: string = config.URL_API_BASE + 'bienes/custodio';

  //ruta para mostrar los bienes de cada custodio por cédula
  private urlApi_BienesCedula: string = config.URL_API_BASE + 'bienes/cedula';

  //ruta para mostrar los bienes
  private urlApi_Bienes: string = config.URL_API_BASE + 'bienes';
  // ruta para mostrar los detalles de un bien
  private urlApi_BienDetalle: string = config.URL_API_BASE + 'bienes/detalles';
  // ruta para agregar un bien por medio de importar
  private urlApi_bienesImport: string = config.URL_API_BASE + 'bienes/csv';
  // ruta para agregar la informacion de cada bien en sus respectivas tablas
  private urlApi_bienProceso: string = config.URL_API_BASE + 'bienes/insertar';

  //Ruta para obtener informacion del historial de un bien
  private urlApi_bienHistorial: string = config.URL_API_BASE + 'bienes/actualizar';

  //ruta para actualizar garantia de los bienes
  private urlApi_bienGarantia: string = config.URL_API_BASE + 'bienes/garantia';
  private urlApi_bienFiltro: string = config.URL_API_BASE + 'bienes/filtrado'

  //ruta historial de archivos cargados
  private urlApi_bienArchivos: string = config.URL_API_BASE + 'bienes/historial/archivos'

  //Ruta para eliminar una informacion adicional
  private urlApi_deleteInfo: string = config.URL_API_BASE + 'bienes/informacionAdicional'

  datosOtros!: OtrosOtros[];
  historicoBien!: historicoBienData[];
  // historicoBien:historicoBienData[] = [
  //   dt_bien_fecha_compra:"",
  //   dt_bien_fecha_compra_interno:"",
  //   int_bien_anios_garantia:0,
  //   int_bien_estado_historial:0,
  //   int_bien_id:0,
  //   int_bien_numero_acta:0,
  //   int_bodega_cod:0,
  //   int_ubicacion_cod:0,
  //   str_bien_bld_bca:"",
  //   str_bien_color:"",
  //   str_bien_contabilizado_acta:"",
  //   str_bien_contabilizado_bien:"",
  //   str_bien_critico:"",
  //   str_bien_descripcion:"",
  //   str_bien_dimensiones:"",
  //   str_bien_estado:"",
  //   str_bien_estado_acta:"",
  //   str_bien_estado_logico:"",
  //   str_bien_garantia:"",
  //   str_bien_habilitado:"",
  //   str_bien_info_adicional:{},
  //   str_bien_material:"",
  //   str_bien_modelo:"",
  //   str_bien_numero_compromiso:"",
  //   str_bien_origen_ingreso:"",
  //   str_bien_recompra:"",
  //   str_bien_serie:"",
  //   str_bien_tipo_ingreso:"",
  //   str_bien_valor_compra:"",
  //   str_bodega_nombre:"",
  //   str_catalogo_bien_descripcion:"",
  //   str_catalogo_bien_id_bien:"",
  //   str_codigo_bien_cod:"",
  //   str_condicion_bien_nombre:"",
  //   str_custodio_activo:"",
  //   str_custodio_cedula:"",
  //   str_custodio_nombre:"",
  //   str_custodio_nombre_interno:"",
  //   str_marca_nombre:"",
  //   str_ubicacion_nombre: "",
  //   str_ubicacion_nombre_interno:""
  // ]


  // fil!: File;

  file: {
    _file: any;
    // _cant:  number;
  } = {
    _file : {},
    // _cant : 0

  }

  arrayFile:any =[]

  archivos: any[] = [];

  detalleCarga: any [] = [];
  

  dataBienCustodiosInfo!:  dataBienCustodio[];

  dataBienCedulaInfo:  dataBienCustodio  = {
    str_codigo_bien: "",
    str_catalogo_bien_descripcion: "",
  }

  arrayCustodios: any = [];

  dataBienInfo: dataBien = {

    dt_bien_fecha_compra: "",
    int_bien_anios_garantia: 0,
    int_bien_id: 0,
    int_bien_numero_acta: 0,
    int_bodega_cod: 0,
    int_campo_bien_item_reglon: 0,
    int_campo_bien_vida_util: 0,
    int_marca_id: 0,
    int_ubicacion_cod: 0,
    int_custodio_id: 0,


    str_bien_bld_bca: "",
    str_bien_color: "",
    str_bien_contabilizado_acta: "",
    str_bien_contabilizado_bien: "",
    str_bien_critico: "",
    str_bien_dimensiones: "",
    str_bien_estado: "",
    str_bien_estado_acta: "",
    str_bien_estado_logico: "",
    str_bien_garantia: "",
    str_bien_habilitado: "",
    str_bien_info_adicional: "",
    str_bien_material: "",
    str_bien_modelo: "",
    str_bien_numero_compromiso: "",
    str_bien_origen_ingreso: "",
    str_bien_recompra: "",
    str_bien_serie: "",
    str_bien_tipo_ingreso: "",
    str_bien_valor_compra: "",
    str_bodega_nombre: "",
    str_campo_bien_comodato: "",
    str_campo_bien_cuenta_contable: "",
    str_campo_bien_depreciable: "",
    str_campo_bien_fecha_termino_depreciacion: "",
    str_campo_bien_valor_contable: "",
    str_campo_bien_valor_depreciacion_acumulada: "",
    str_campo_bien_valor_libros: "",
    str_campo_bien_valor_residual: "",
    str_catalogo_bien_descripcion: "",
    str_catalogo_bien_id_bien: "",
    str_codigo_bien_cod: "",
    str_condicion_bien_nombre: "",
    str_custodio_activo: "",
    str_custodio_cedula: "",
    str_custodio_nombre: "",
    str_custodio_interno_nombre: "",
    str_fecha_ultima_depreciacion: "",
    str_marca_nombre: "",
    str_ubicacion_nombre: "",

      // Informacion interna
      str_custodio_nombre_interno: "",

    dt_bien_fecha_compra_interno: "",
    str_ubicacion_nombre_interno: "",
  };

  constructor(private http: HttpClient) {}

  // ----------------- Behavior Subject para Boton de regresar ----------------- //

  private data_Bool$ = new BehaviorSubject<boolean>(false);

  get dataBoolAction$(): Observable<boolean> {
    return this.data_Bool$.asObservable();
  }

  setData_Bool$(dataBool: boolean) {
    // console.log('SET DATA BOOL enviado del boto -> ', dataBool);
    this.data_Bool$.next(dataBool);
  }

  // ----------------- Funciones para Mostrar Bienes ----------------- //

  // getBienes(){
  //   return this.http.get<OtrosShowModel>(`${this.urlApi_Bienes}`, {
  //     withCredentials: true,
  //   });
  // }

  getBienes(pagination: any, cedulaLogin: any) {
    // const queryPagination = pagination
    //   ? `?pagination={"page":${pagination.page}, "size":${pagination.saze}}`
    //   : '';
    // // console.log('datos rutas: ->', pagination.page, pagination.size);
    // // const queryFilter = filter ? `&filter=${JSON.stringify(filter)}` : '';
    // return this.http.get<OtrosShowModelPag>(
    //   this.urlApi_Bienes + queryPagination,
    //   {
    //     withCredentials: true,
    //   }
    // );

    const cedulaLongitud = JSON.stringify({cedulaLogin})
    // console.log('cedula', cedulaLongitud)
    // console.log('tamaño cedula', cedulaLongitud.length)

    //   console.log('datos rutas roles paginacion: ->', pagination);
       const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);

      return this.http.get<OtrosShowModelPag>(this.urlApi_Bienes + '?' +params,
        {
          withCredentials: true,
        }
        );
  }

  getBienesPorCustodio(pagination: any, cedulaLogin: any) {
    // let params = null;
    // const cedulaLongitud = JSON.stringify({cedulaLogin})
    // console.log('cedula', cedulaLongitud)
    // console.log('tamaño cedula', cedulaLongitud.length)

      // console.log('datos rutas roles paginacion: ->', pagination);
      const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data)
        .set('cedulaLogeada', cedulaLogin)
        .set('cedulaPorCustodio', 1);


      return this.http.get<OtrosShowModelPag>(this.urlApi_BienesCustodio + '?' +params,
        {
          withCredentials: true,
        }
        );
  }

  // ----------------- Funciones para Actualizar la Garantia de los Bienes ----------------- //
  getBienesGarantia(){
    return this.http.get<OtrosShowModelPag>(`${this.urlApi_bienGarantia}`, {
      withCredentials: true,
    });
  }


  // ----------------- Funciones para Importar Bienes ----------------- //

  // postFileBienes(file: any, cant: number) {
  //   // this.file._file = file
  //   // this.arrayFile[0] = this.file
  //   // this.arrayFile[1] = cant
  //   console.log('el file', file + cant)
  //   // console.log('lo que envio en el file ->', this.fileCant )
  //   return this.http.post<any>(this.urlApi_bienesImport, file , {
  //     withCredentials: true,
  //   });
  // }

  postFileBienes(file: any, cant: number, reso: any, columns: number) {
    // console.log('lo que envio en el file ->', file + cant + reso)
    // this.file._file = file
    //console.log('# columnas', columns)

    return this.http.post<any>(`${this.urlApi_bienesImport}/${cant}/${reso}/${columns}`,  file,{
      withCredentials: true,
    });
  }

  // ----------------- Funciones para Procesar Bienes ----------------- //
  postProcesoBienes() {
    return this.http.get(this.urlApi_bienProceso, {
      withCredentials: true,
    });
  }

  // ----------------- Funciones para el CRUD de Bienes ----------------- //

  // Funcion para obtener un Bien por el Id
  getBienById(id_bien: number) {
    // console.log('Id del Birn dentro del getBienById: ', id_bien);
    return this.http.get<BienDataModel>(
      `${this.urlApi_BienDetalle}/${id_bien}`,
      {
        withCredentials: true,
      }
    );
  }

  getBienesCustodioById(strCedula: string){
    // console.log('Cedula del custodio', strCedula)
    return this.http.get<BienDataCustodioModel>(
      `${this.urlApi_BienesCedula}/${strCedula}`,
      {
        withCredentials: true
      }
    )
  }

  EliminarInfoAdicional(idBien: number, dataBien: any) {
    return this.http.delete<any>(
      `${this.urlApi_deleteInfo}/${idBien}/${dataBien}`,
      {
        withCredentials: true,
      }
    );
  }


  // Funcion para agregar un Bien
  postBienes(dataBien: addOtrosData) {
    return this.http.post<OtrosShowModelPag>(
      `${this.urlApi_Bienes}`,
      dataBien,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para editar un Bien
  putEditBien(idBien: number, dataBien: addBienDataById) {
    return this.http.put<modBienesModel>(
      `${this.urlApi_Bienes}/${idBien}`,
      dataBien,
      {
        withCredentials: true,
      }
    );
  }

  //funcion para enviar la info adicion de un bien por id
  // putBienInfoAdd(idBien: number, dataBien: addBienDataById){
  //   return this.http.put<modBienesModel>(
  //     `${this.urlApi_Bienes}/${idBien}`,
  //     dataBien,
  //     {
  //       withCredentials: true,
  //     }
  //   );
  // }

  //Funcion para eliminar un infoAdicional


  // Funcion para eliminar un Bien
  deleteOtrosById(idBien: number) {
    return this.http.delete<addOtrosModel>(`${this.urlApi_Bienes}/${idBien}`, {
      withCredentials: true,
    });
  }

  getfiltro(filter: any){
    const bienesFilter = GetFinalFiltersQuery(filter)
    return this.http.get<any>(this.urlApi_bienFiltro + bienesFilter, {
      withCredentials: true,
    })
  }


  //funcion para obtener la informacion del historial del bien por id
  getHistorico(idBien:any){
    return this.http.get<any>(`${this.urlApi_bienHistorial}/${idBien}`, {
      withCredentials: true,
    })
  }

  //funcion para obtener el historial de archivos
  getArchivos(pagination: any){
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);
        
    return this.http.get<any>(this.urlApi_bienArchivos + '?'+params, {
      withCredentials: true,
    })
  }

  getArchivoById(idArchivo: any) {
    return this.http.get<any>(`${this.urlApi_bienArchivos}/${idArchivo}`, {
      withCredentials: true,
    })
  }

}
