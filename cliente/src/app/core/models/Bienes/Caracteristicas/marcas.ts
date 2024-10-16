// ------------------- Mostrar Marcas -------------------

export interface MarcasShowModel {
  status: boolean;
  message: string;
  body: MarcasData[];
}

export interface pagMarcas {
  status: boolean;
  message: string;
  body: MarcasData[];
  total: number
}

export interface MarcasData {
  int_marca_id: number;
  str_marca_nombre: string;
  str_marca_estado: string;
  dt_fecha_creacion: string;
}

// ------------------- Agregar Marcas -------------------

export interface addMarcaModel{
  status: boolean;
  message: string;
  body: addMarcasData
}

export interface addMarcasData{
  str_marca_nombre: string;
  str_marca_estado: string;
}

// ------------------- Modificar Marcas -------------------
export interface modMarcaModel{
  status: boolean;
  message: string;
  body: modMarcasData
}

export interface modMarcasData{
  int_marca_id: number;
  str_marca_nombre: string;
  str_marca_estado: string;
}

export interface addMarcaDataByID{
  int_marca_id: number;
  str_marca_nombre: string;
  str_marca_estado: string;
}

export interface DataFormMarca {
  form: string,
  title:string,
  special: boolean
}
