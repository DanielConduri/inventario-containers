export interface datosResponsable {
    int_per_id: number;

}

export interface formatoDoc{
    message: string;
    status: string;
    body: datossearchBienes[]
}

export interface datossearchBienes {
    //   str_tipo_documento_nombre: string,
      int_tipo_documento_id: number,
      str_documento_titulo: string,
      str_documento_peticion: string,
      str_documento_dirigido: string,
      str_documento_introduccion: string,
      str_documento_desarrollo: string,
      str_documento_conclusiones:string,
      str_documento_recomendaciones:string,
      str_documento_fecha:string,
      int_per_id: number,
      str_codigo_bien: string[]
//     dt_bien_fecha_compra: string;
//     dt_fecha_creacion: string;
//     int_bien_anios_garantia: number;    
//     int_bien_id: number;
//     int_bien_numero_acta: number;
//     int_bodega_id: number;
//     int_catalogo_bien_id: number;
//     int_codigo_bien_id: number;
//     int_condicion_bien_id: number;
//     int_custodio_id: number;
//     int_marca_id: number;
//     int_proveedor_id: number;
//     int_ubicacion_id: number;
//     str_bien_bld_bca
// : 
// "BLD"
//     str_bien_color
// : 
// "SIN COLOR"
//     str_bien_contabilizado_acta
// : 
// "No Aplica"
//     str_bien_descripcion
// : 
// "FLAUTA"
//     str_bien_dimensiones
// : 
// ""
//     str_bien_estado
// : 
// "APROBADO"
//     str_bien_estado_acta
// : 
// "No Aplica"
//     str_bien_estado_logico
// : 
// "ACTIVO"
//     str_bien_garantia
// : 
// "N"
//     str_bien_habilitado
// : 
// "S"
//     str_bien_info_adicional
// : 
// null
// str_bien_material
// : 
// ""
// str_bien_modelo
// : 
// "SIN MODELO40809"
// str_bien_nombre
// : 
// "EQUIPOS E INSTRUMENTOS MUSICALES/FLAUTA"
// str_bien_numero_compromiso
// : 
// "No Aplica"
// str_bien_origen_ingreso
// : 
// "COMPRA"
// str_bien_recompra
// : 
// "N"
// str_bien_serie
// : 
// "SIN SERIE40809"
// str_bien_tipo_ingreso
// : 
// "MATRIZ"
// str_bien_valor_compra
// : 
// "150.00"
// str_bien_version
// : 
// null
// str_codigo_bien
// : 
// "3352285"
}

export interface informeAgg{
    id: number;
    status: boolean;
   // data: dataPerRoles;
  }

  export interface dataDate{
    fechas_inicio: string;
    fechas_fin: string;
  }

  export interface dataUbicacionReporte{
    dt_fecha_actualizacion: string;
    int_ubicacion_cod: number;
    int_ubicacion_id: number;
    str_ubicacion_nombre: string
  }