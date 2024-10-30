// ------------------ Mostrar Bienes------------------

// export interface OtrosShowModel{
//   status: boolean;
//   message: string;
//   body: BienData[];
// }
export interface OtrosShowModelPag{
  status: string;
    body: OtrosOtros[];
    total: any;
}

export interface OtrosOtros{
  int_bien_id: number,
  str_codigo_bien: number,
  int_estado_bien_id: number,
  int_tipo_bien_id: number,
  int_codigo_bien_id: number,
  int_marca_id: number,
  int_bodega_ida: number,
  int_ubicacion_id: number,
  int_condicion_bien_id: number,
  int_catalogo_bien_id: number,
  int_proveedor_id: number,
  int_bien_numero_acta: number,
  int_bien_anios_garantia: number,

  str_bien_bld_bca: string,
  str_bien_numero_compromiso: string,
  str_bien_estado_acta: string,
  str_bien_contabilizado_acta: string,
  str_bien_contabilizado_bien: string,
  str_bien_critico: string,
  str_bien_valor_compra: string,
  str_bien_recompra: string,
  str_bien_estado: string,
  str_bien_origen_ingreso: string,
  str_bien_tipo_ingreso: string,
  str_bien_garantia: string,

  str_bien_nombre: string,
  str_bien_modelo: string,
  str_bien_serie: string,
  int_bien_precio: number,
  str_bien_color: string,
  str_bien_material: string,
  str_bien_dimensiones: string,
  str_bien_condicion: string,
  str_bien_habilitado: string,
  str_bien_version: string,
  str_bien_estado_logico: string,
  dt_bien_fecha_compra: any,
  str_bien_descripcion: string,
  dt_fecha_creacion: any,
  str_condicion_bien_nombre: string,
  str_ubicacion_nombre: string
  str_bien_info_adicional: {};

  // Informacion interna
  str_custodio_interno: string,
  dt_bien_fecha_compra_interno: any,
  str_ubicacion_nombre_interno: string,
}



// Mostrar informacion del Bien
export interface BienDataModel{
  status: boolean;
  message: string;
  body: dataBien;
  custodioInterno: []
}


export interface BienDataCustodioModel{
  status: boolean;
  message: string;
  body: dataBienCustodio[]
}


// export interface dataBien{
//   int_bien_id: number,
//   int_codigo_bien: number,
//   int_estado_bien_id: number,
//   int_tipo_bien_id: number,
//   int_codigo_bien_id: number,
//   int_marca_id: number,
//   int_bodega_ida: number,
//   int_ubicacion_id: number,
//   int_condicion_bien_id: number,
//   int_catalogo_bien_id: number,
//   int_proveedor_id: number,
//   int_bien_numero_acta: number,
//   int_bien_anios_garantia: number,
//   int_custodio_id: number,

//   str_bien_bld_bca: string,
//   str_bien_numero_compromiso: string,
//   str_bien_estado_acta: string,
//   str_bien_contabilizado_acta: string,
//   str_bien_contabilizado_bien: string,
//   str_bien_critico: string,
//   str_bien_valor_compra: string,
//   str_bien_recompra: string,
//   str_bien_estado: string,
//   str_bien_origen_ingreso: string,
//   str_bien_tipo_ingreso: string,
//   str_bien_garantia: string,

//   str_bien_nombre: string,
//   str_bien_modelo: string,
//   str_bien_serie: string,
//   int_bien_precio: number,
//   str_bien_color: string,
//   str_bien_material: string,
//   str_bien_dimensiones: string,
//   str_bien_condicion: string,
//   str_bien_habilitado: string,
//   str_bien_version: string,
//   str_bien_estado_logico: string,
//   dt_bien_fecha_compra: any,
//   str_bien_descripcion: string,
//   dt_fecha_creacion: any,
//   str_condicion_bien_nombre: string,
//   str_ubicacion_nombre: string
// }

export interface dataBien{
  dt_bien_fecha_compra: string,
  int_bien_anios_garantia:number,
  int_bien_id: number,
  int_bien_numero_acta:number,
  int_bodega_cod: number,
  int_campo_bien_item_reglon: number,
  int_campo_bien_vida_util: number,
  int_marca_id:number,
  int_ubicacion_cod:number,
  int_custodio_id: 0,

  str_bien_bld_bca:string,
  str_bien_color:string,
  str_bien_contabilizado_acta:string,
  str_bien_contabilizado_bien:string,
  str_bien_critico:string,
  str_bien_dimensiones:string,
  str_bien_estado:string,
  str_bien_estado_acta:string,
  str_bien_estado_logico:string,
  str_bien_garantia:string,
  str_bien_habilitado:string,
  str_bien_info_adicional:string,
  str_bien_material:string,
  str_bien_modelo:string,
  str_bien_numero_compromiso:string,
  str_bien_origen_ingreso:string,
  str_bien_recompra:string,
  str_bien_serie:string,
  str_bien_tipo_ingreso:string,
  str_bien_valor_compra:string,
  str_bodega_nombre:string,
  str_campo_bien_comodato:string,
  str_campo_bien_cuenta_contable:string,
  str_campo_bien_depreciable:string,
  str_campo_bien_fecha_termino_depreciacion:string,
  str_campo_bien_valor_contable:string,
  str_campo_bien_valor_depreciacion_acumulada:string,
  str_campo_bien_valor_libros:string,
  str_campo_bien_valor_residual:string,
  str_catalogo_bien_descripcion:string,
  str_catalogo_bien_id_bien:string,
  str_codigo_bien_cod:string,
  str_condicion_bien_nombre:string,
  str_custodio_activo:string,
  str_custodio_cedula:string,
  str_custodio_nombre:string,
  str_custodio_interno_nombre: string,
  str_fecha_ultima_depreciacion:string,
  str_marca_nombre:string,
  str_ubicacion_nombre:string

    // Informacion interna
    str_custodio_nombre_interno: string,
    dt_bien_fecha_compra_interno: any,
    str_ubicacion_nombre_interno: string,
}


export interface dataBienCustodio{
  str_codigo_bien: string,
  str_catalogo_bien_descripcion: string
}


//Anadir nuevo bien
export interface addBienesModel{
  status: boolean;
  message: string;
  body: addBienesData;
}

export interface addBienesData{

  int_bien_id: number,
  int_catalgo_bien_id_bien: number,
  int_bien_numero_acta: number,
  int_bodega_cod: number,
  int_ubicacion_cod: number,
  int_campo_bien_item_reglon: number,
  int_campo_bien_vida_util: number,
  int_bien_anios_garantia: number,

  str_codigo_biend_cod: string,
  str_catalogo_bien_descripcion: string,
  str_bien_bld_bca: string,
  str_bien_serie: string,
  str_bien_modelo: string,
  str_marca_nombre: string,
  str_bien_critico: string,
  str_bien_valor_compra: string,
  str_bien_recompra: string,
  str_bien_color: string,
  str_bien_material: string,
  str_bien_dimensiones: string,
  str_bien_habilitado: string,
  str_bien_estado: string,
  str_condicion_bien_nombre: string,
  str_bodega_nombre: string,
  str_ubicacion_nombre: string,
  str_custodio_cedula: string,
  str_custodio_nombre: string,
  str_custodio_activo: string,
  str_bien_origen_ingreso: string,
  str_bien_tipo_ingreso: string,
  str_bien_numero_compromiso: string,
  str_bien_estado_acta: string,
  str_bien_contabilizado_acta: string,
  str_bien_contabilizado_bien: string,
  str_bien_descripcion: string,
  str_campo_bien_cuenta_contable: string,
  dt_bien_fecha_compra: Date,
  str_bien_estado_logico: string,
  str_campo_bien_depreciable: string,
  str_fecha_ultima_depreciacion: string,
  str_campo_bien_fecha_termino_depreciacion: string,
  str_campo_bien_valor_contable: string,
  str_campo_bien_valor_residual: string,
  str_campo_bien_valor_libros: string,
  str_campo_bien_valor_depreciacion_acumulada: string,
  str_campo_bien_comodato: string,
  str_bien_garantia: string,
  str_bien_info_adicional: {};

    // Informacion interna
    str_custodio_interno: string,
    dt_bien_fecha_compra_interno: any,
    str_ubicacion_nombre_interno: string,
}


// Modificar informacion del bien

export interface modBienesModel{
  status: boolean;
  message: string;
  body: modBienesData;
}

export interface modBienesData{
  int_bien_id: number,
  int_codigo_bien: number,
  int_estado_bien_id: number,
  int_tipo_bien_id: number,
  int_codigo_bien_id: number,
  int_marca_id: number,
  int_bodega_ida: number,
  int_ubicacion_id: number,
  int_condicion_bien_id: number,
  int_catalogo_bien_id: number,
  int_proveedor_id: number,
  int_bien_numero_acta: number,
  int_bien_anios_garantia: number,
  int_custodio_id: number,

  str_bien_bld_bca: string,
  str_bien_numero_compromiso: string,
  str_bien_estado_acta: string,
  str_bien_contabilizado_acta: string,
  str_bien_contabilizado_bien: string,
  str_bien_critico: string,
  str_bien_valor_compra: string,
  str_bien_recompra: string,
  str_bien_estado: string,
  str_bien_origen_ingreso: string,
  str_bien_tipo_ingreso: string,
  str_bien_garantia: string,

  str_bien_nombre: string,
  str_bien_modelo: string,
  str_bien_serie: string,
  int_bien_precio: number,
  str_bien_color: string,
  str_bien_material: string,
  str_bien_dimensiones: string,
  str_bien_condicion: string,
  str_bien_habilitado: string,
  str_bien_version: string,
  str_bien_estado_logico: string,
  dt_bien_fecha_compra: any,
  str_bien_descripcion: string,
  dt_fecha_creacion: any,
  str_condicion_bien_nombre: string,
  str_ubicacion_nombre: string
  str_bien_info_adicional: {};

    // Informacion interna
    str_custodio_interno: string,
    dt_bien_fecha_compra_interno: any,
    str_ubicacion_nombre_interno: string,
}

export interface addBienDataById{
  str_bien_info_adicional: {};
}



export interface OtrosData{
  // Informacion Institucional
  int_centro_id: number;
  int_centro_tipo: number;
  str_centro_tipo_nombre: string;
  str_centro_nombre_sede: string;
  str_centro_nombre_dependencia: string;


  // Informacion general del Bien
  int_bien_id: number;
  str_tipo_bien: string; //[Otros, Software, Hardware]
  str_codigo_bien_cod: string;
  str_bien_serie: string;
  str_bien_nombre: string;
  int_marca_id: number;
  str_marca_nombre: string;
  int_bien_precio: number;
  str_bien_modelo: string;
  int_estado_bien_id: number;
  str_estado_bien_nombre: string;
  str_bien_color: string;
  dt_bien_fecha_compra: string;
  str_bien_estado: string;

  // Informacion de garantia del bien
  dt_garantia_fecha_final: string;

  // Informacion del Proveedor del Bien
  int_proveedor_id: number;
  str_proveedor_nombre: string;
  str_proveedor_ruc: string;

  // Informacion del Custodio del bien
  int_per_id:number;
  str_per_nombres: string;
  str_per_apellidos: string;
  str_per_cedula: string;
  str_per_cargo: string;

  // Informacion Adicional del Bien
  str_bien_info_adicional: {};

    // Informacion interna
    str_custodio_interno: string,
    dt_bien_fecha_compra_interno: any,
    str_ubicacion_nombre_interno: string,
}



// ------------------ Agregar Bien ------------------
export interface addOtrosModel{
  status: boolean;
  message: string;
  body: addOtrosData
}

export interface addOtrosData{

  str_centro_nombre: string;
  str_centro_tipo_nombre: string;
  str_centro_nombre_sede: string;
  str_centro_nombre_facultad: string;
  str_centro_nombre_dependencia: string;
  str_centro_nombre_carrera: string;
  str_centro_nombre_proceso: string;

  str_codigo_bien_cod: string;
  str_bien_serie: string;
  str_bien_nombre: string;
  str_marca_nombre: string;
  int_bien_precio: number;
  str_bien_modelo: string;
  str_estado_bien_nombre: string;
  str_bien_color: string;
  dt_bien_fecha_compra: string;
  str_bien_estado: string;


  dt_garantia_fecha_final: string;


  str_proveedor_nombre: string;
  str_proveedor_ruc: string;


  str_per_nombre: string;
  str_per_apellido: string;
  str_per_cedula: string;
  str_per_cargo: string;

    // Informacion interna
    str_custodio_interno: string,
    dt_bien_fecha_compra_interno: any,
    str_ubicacion_nombre_interno: string,
}



// ------------------ Mostrar Bien por ID ------------------

export interface bienModel{
  status: boolean;
  message: string;
  body: dataUser;
}

export interface dataUser{
  str_per_nombres: string;
  str_per_apellidos: string;
  str_per_email: string;
  str_per_cedula: string;
  str_per_cargo: string;
  str_per_tipo: string;
  dt_fecha_actualizacion: string;
  dt_fecha_creacion: string;
    // Informacion interna
    str_custodio_interno: string,
    dt_bien_fecha_compra_interno: any,
    str_ubicacion_nombre_interno: string,
}



export interface bienInfoModel{
  id: number;
  status: boolean;
}

export interface bienShowModel{
  id: number;
  status: boolean;
}


// ------------------ Historico Bien ------------------
export interface historicoBienModel{
  status: boolean;
  message: string;
  body: historicoBienData[];
}

export interface historicoBienData{
  dt_bien_fecha_compra:string,
  dt_bien_fecha_compra_interno:string,
  int_bien_anios_garantia:number,
  int_bien_estado_historial:number,
  int_bien_id:number,
  int_bien_numero_acta:number,
  int_bodega_cod:number,
  int_ubicacion_cod:number,
  str_bien_bld_bca:string,
  str_bien_color:string,
  str_bien_contabilizado_acta:string,
  str_bien_contabilizado_bien:string,
  str_bien_critico:string,
  str_bien_descripcion:string,
  str_bien_dimensiones:string,
  str_bien_estado:string,
  str_bien_estado_acta:string,
  str_bien_estado_logico:string,
  str_bien_garantia:string,
  str_bien_habilitado:string,
  str_bien_info_adicional:{},
  str_bien_material:string,
  str_bien_modelo:string,
  str_bien_numero_compromiso:string,
  str_bien_origen_ingreso:string,
  str_bien_recompra:string,
  str_bien_serie:string,
  str_bien_tipo_ingreso:string,
  str_bien_valor_compra:string,
  str_bodega_nombre:string,
  str_catalogo_bien_descripcion:string,
  str_catalogo_bien_id_bien:string,
  str_codigo_bien_cod:string,
  str_condicion_bien_nombre:string,
  str_custodio_activo:string,
  str_custodio_cedula:string,
  str_custodio_nombre:string,
  str_custodio_nombre_interno:string,
  str_marca_nombre:string,
  str_ubicacion_nombre: string,
  str_ubicacion_nombre_interno:string
}
