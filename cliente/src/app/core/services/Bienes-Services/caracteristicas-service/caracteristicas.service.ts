import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'config/config';
import { addEstadoDataByID, addEstadoModel, addEstadosData, EstadosData, EstadosShowModel, modEstadoModel } from 'src/app/core/models/Bienes/Caracteristicas/estados';
import { addMarcaModel, addMarcasData, MarcasData, MarcasShowModel, modMarcaModel, modMarcasData } from 'src/app/core/models/Bienes/Caracteristicas/marcas';
import { addProveedorData, modProveedorModel, ProveedorData, ProveedorShowModel } from 'src/app/core/models/Bienes/Caracteristicas/proveedores';
import GetFinalFiltersQuery from 'src/app/utils/filter/GetFinalFiterQuery';
import { addMarcaDataByID, pagMarcas } from '../../../models/Bienes/Caracteristicas/marcas';
import { addProveedorModel, addProveedorDataByID, ModelPagProveedor } from '../../../models/Bienes/Caracteristicas/proveedores';
import { CatalogoData, CatalogoShowModel, CatalogoShowModel1, addCatalogoData, addCatalogoModel, modCatalogoDataByID, modCatalogoModel } from 'src/app/core/models/Bienes/Caracteristicas/catalogo';

@Injectable({
  providedIn: 'root',
})
export class CaracteristcasService {
  // Rutas a Consumir
  private urlApi_Marcas: string = config.URL_API_BASE + 'marcas';
  private urlApi_MarcaDetalle: string = config.URL_API_BASE + 'marcas/detalle';
  private urlApi_MarcaActivos: string = config.URL_API_BASE + 'marcas/activo';
  private urlApi_MarcaFilter: string = config.URL_API_BASE + 'marcas/filtrado';

  private urlApi_Estados: string = config.URL_API_BASE + 'estados';
  private urlApi_EstadoDetalle: string =config.URL_API_BASE + 'estados/detalle';
  private urlApi_EstadoActivos: string = config.URL_API_BASE + 'estados/activo';

  private urlApi_Proveedores: string = config.URL_API_BASE + 'proveedores';
  private urlApi_ProveedorDetalle: string =config.URL_API_BASE + 'proveedores/detalle';
  private urlApi_ProveedoresActivos: string =config.URL_API_BASE + 'proveedores/activo';
  private urlApi_ProveedorFilter: string = config.URL_API_BASE + 'proveedores/filtrado';

  private urlApi_Catalogo: string = config.URL_API_BASE + 'catalogo_bienes';
  private urlApi_CatalogoCSV: string = config.URL_API_BASE + 'catalogo_bienes/csv';
  private urlApi_CatalogoFilter: string = config.URL_API_BASE + 'catalogo_bienes/filtrado';

  datosMarcas!: MarcasData[];
  datosEstados!: EstadosData[];
  datosProveedor!: ProveedorData[];
  datosCatalogo!: CatalogoData[];


  dataMarca: modMarcasData = {
    str_marca_nombre: '',
    str_marca_estado: '',
    int_marca_id: 0
  }


  constructor(private http: HttpClient) {}

  // APARTADO DE MARCAS

  // Funcion para obtener las marcas
  getMarcas() {
    return this.http.get<MarcasShowModel>(this.urlApi_Marcas, {
      withCredentials: true,
    });
  }

  getMarcasP(pagination: any) {
    // return this.http.get<MarcasShowModel>(this.urlApi_Marcas, {
    //   withCredentials: true,
    // });
    // console.log('datos rutas: ->', pagination);
    const params = new HttpParams()
    .set('page', pagination.page)
    .set('size', pagination.size)
    .set('parameter', pagination.parameter)
    .set('data', pagination.data)
    // console.log('marcas params', params)
    return this.http.get<pagMarcas>(
      this.urlApi_Marcas + '?'+params,
      { withCredentials: true }
    )
  }

  getMarcasActivas(){
    return this.http.get<MarcasShowModel>(this.urlApi_Marcas, {
      withCredentials: true,
    });
  }

  // Funcion para agregar una marca
  postMarcas(dataMarca: addMarcasData) {
    return this.http.post<MarcasShowModel>(`${this.urlApi_Marcas}`, dataMarca, {
      withCredentials: true,
    });
  }

  // Funcion para obtener el ID de una marca
  getMarcaId(idMarca: number) {
    // console.log('id de la Marca dentro de getMarcaID', idMarca);
    return this.http.get<modMarcaModel>(
      `${this.urlApi_MarcaDetalle}/${idMarca}`,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para modificar una marca
  //
  //
  putMarcaById(idMarca: number, dataMarca: addMarcaDataByID) {
    return this.http.put<modMarcaModel>(
      `${this.urlApi_Marcas}/${idMarca}`,
      dataMarca,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para eliminar una marca
  deleteMarcaById(idMarca: number) {
    return this.http.delete<addMarcaModel>(`${this.urlApi_Marcas}/${idMarca}`, {
      withCredentials: true,
    });
  }

  // Funcion para filtrar las marcas
  getFilterMarca(dato:any) {
    // console.log("Valor que llega a getFilterMarca =>", dato);
    const marcaFilter = GetFinalFiltersQuery(dato);
    return this.http.get<MarcasShowModel>(this.urlApi_MarcaFilter + marcaFilter, {
      withCredentials: true,
    });
  }



  // APARTADO DE ESTADOS

  // Funcion para obtener los estados
  getEstado() {
    return this.http.get<EstadosShowModel>(this.urlApi_Estados, {
      withCredentials: true,
    });
  }

  getEstadoActivos(){
    return this.http.get<EstadosShowModel>(this.urlApi_EstadoActivos, {
      withCredentials: true,
    });
  }

  // Funcion para agregar un estado
  postEstados(dataEstado: addEstadosData) {
    return this.http.post<EstadosShowModel>(
      `${this.urlApi_Estados}`,
      dataEstado,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para obtener el ID de un estado
  getEstadoId(idEstado: number) {
    return this.http.get<modEstadoModel>(
      `${this.urlApi_EstadoDetalle}/${idEstado}`,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para modificar un estado
  putEstadoById(idEstado: number, dataEstado: addEstadoDataByID) {
    return this.http.put<modEstadoModel>(
      `${this.urlApi_Estados}/${idEstado}`,
      dataEstado,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para eliminar un estado
  deleteEstadoById(idEstado: number) {
    return this.http.delete<addEstadoModel>(
      `${this.urlApi_Estados}/${idEstado}`,
      {
        withCredentials: true,
      }
    );
  }

  // APARTADO DE PROVEEDORES

  // Funcion para obtener los proveedores
  getProveedor() {
    return this.http.get<ProveedorShowModel>(this.urlApi_Proveedores, {
      withCredentials: true,
    });
  }

  getProveedorP(pagination:any) {
    // return this.http.get<ProveedorShowModel>(this.urlApi_Proveedores, {
    //   withCredentials: true,
    // });
    const params = new HttpParams()
        .set('page', pagination.page)
        .set('size', pagination.size)
        .set('parameter', pagination.parameter)
        .set('data', pagination.data);
    
      return this.http.get<ModelPagProveedor>(this.urlApi_Proveedores + '?' +params,
        {
          withCredentials: true,
        }
        );
  }


  // Funcion para agregar un proveedor
  postProveedor(dataProveedor: addProveedorData) {
    return this.http.post<ProveedorShowModel>(
      `${this.urlApi_Proveedores}`,
      dataProveedor,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para obtener el ID de un proveedor
  getProveedorId(idProveedor: number) {
    return this.http.get<modProveedorModel>(
      `${this.urlApi_ProveedorDetalle}/${idProveedor}`,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para modificar un proveedor
  putProveedorById(idProveedor: number, dataProveedor: addProveedorDataByID) {
    return this.http.put<modProveedorModel>(
      `${this.urlApi_Proveedores}/${idProveedor}`,
      dataProveedor,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para eliminar un proveedor
  deleteProveedorById(idProveedor: number) {
    return this.http.delete<addProveedorModel>(
      `${this.urlApi_Proveedores}/${idProveedor}`,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para obtener los datos de los proveedores
  getFilterProveedor(dato:any) {
    // console.log("Valor que llega a getFilterProveedor =>", dato);
    const proveedorFilter = GetFinalFiltersQuery(dato);
    return this.http.get<ProveedorShowModel>(this.urlApi_ProveedorFilter + proveedorFilter, {
      withCredentials: true,
    });
  }



  // APARTADO DE CATALOGO

  getCatalogo(pagination: any){
    // const queryPagination = pagination
    // ? `?pagination={"page":${pagination.page}, "size":${pagination.saze}}`
    // : '';
    // // console.log('datos rutas: ->', pagination.page, pagination.size);
    // // const queryFilter = filter ? `&filter=${JSON.stringify(filter)}` : '';
    // return this.http.get<CatalogoShowModel1>(
    //   this.urlApi_Catalogo + queryPagination,
    //   {
    //     withCredentials: true,
    //   }
    // );
    const params = new HttpParams()
    .set('page', pagination.page)
    .set('size', pagination.size)
    .set('parameter', pagination.parameter)
    .set('data', pagination.data)

    return this.http.get<CatalogoShowModel1>(
      this.urlApi_Catalogo + '?'+params,
      { withCredentials: true }
    )
  }

  // Funcion para agregar un catalogo
  postCatalogo(dataCatalogo: addCatalogoData) {
    return this.http.post<ProveedorShowModel>(
      `${this.urlApi_Catalogo}`,
      dataCatalogo,
      {
        withCredentials: true,
      }
    );
  }

  // Funcion para obtener el ID de un catalogo
  getCatalogoId(idCatalogo: number){
    return this.http.get<modCatalogoModel>(`${this.urlApi_Catalogo}/${idCatalogo}`,
    {
      withCredentials: true,
    })
  }

  //Funcion para modificar un catalogo
  putCatalogoById(idCatalogo: number, dataCatalogo: modCatalogoDataByID ){
    return this.http.put<modCatalogoModel>(`${this.urlApi_Catalogo}/${idCatalogo}`, dataCatalogo,
    {
      withCredentials: true,
    })
  }

  // Funcion para eliminar un catalogo
  deleteCatalogo(idCatalogo: number){
    return this.http.delete<addCatalogoModel>(
      `${this.urlApi_Catalogo}/${idCatalogo}`,
      {
        withCredentials: true,
      }
    )
  }

  // Funcion para importar Catalogo
  postFileCatalogo(file: any){
    return  this.http.post<any>(this.urlApi_CatalogoCSV, file,
      {
        withCredentials: true,
      })
  }

  getFilterCatalogo(dato:any) {
    // console.log("Valor que llega a getFilterCatalogo =>", dato);
    const catalogoFilter = GetFinalFiltersQuery(dato);
    return this.http.get<CatalogoShowModel>(this.urlApi_CatalogoFilter + catalogoFilter, {
      withCredentials: true,
    });
  }

}
