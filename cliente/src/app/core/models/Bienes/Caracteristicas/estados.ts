// --------------------- Mostrar Estados ---------------------
export interface EstadosShowModel{
  status: boolean;
  message: string;
  body: EstadosData[];
}

export interface EstadosData{
  int_estado_bien_id: number;
  str_estado_bien_nombre: string;
  str_estado_bien_estado: string;
  dt_fecha_creacion: string;
}

// --------------------- Agregar Estados ---------------------

export interface addEstadoModel{
  status: boolean;
  message: string;
  body: addEstadosData
}

export interface addEstadosData{
  str_estado_bien_nombre: string;
  str_estado_bien_estado: string;
}

// --------------------- Modificar Estados ---------------------

export interface modEstadoModel{
  status: boolean;
  message: string;
  body: modEstadosData
}

export interface modEstadosData{
  int_estado_bien_id: number;
  str_estado_bien_nombre: string;
  str_estado_bien_estado: string;
}

export interface addEstadoDataByID{
  str_estado_bien_nombre: string;
  str_estado_bien_estado: string;
}

