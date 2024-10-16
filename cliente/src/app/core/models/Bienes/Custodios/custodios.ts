//Mostrar custodios

export interface custodiosShowModel{
  status: string;
  message: string;
  body: custodiosData[];
  // total: number;
}

// Obtener un custodio por ID
export interface custodiosIDModel{
  status: string;
  message: string;
  body: custodiosData[];
}

export interface custodiosData{
  int_custodio_id: number;
  str_custodio_nombre: string;
  str_custodio_cedula: string;
  str_custodio_estado: string;
  str_custodio_activo: string;
  str_persona_bien_activo: boolean;
  dt_fecha_creacion: string;
  //dt_fecha_creacion: string;
}

export interface pagCustodios{
  status: string;
  body: custodiosData[];
  total: any;
}
