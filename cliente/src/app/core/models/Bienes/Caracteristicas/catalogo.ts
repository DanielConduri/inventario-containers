// Mostrar Catalogo
export interface CatalogoShowModel{
  status: boolean;
  message: string;
  body: CatalogoData[];
}

export interface CatalogoShowModel1{
  status: boolean;
  message: string;
  body: CatalogoData[];
  total: number
}

export interface CatalogoData{
  int_catalogo_bien_id: number;
  str_catalogo_bien_id_bien: number;
  str_catalogo_bien_descripcion: string;
  str_catalogo_bien_estado: string;
  int_catalogo_bien_item_presupuestario: number;
  str_catalogo_bien_cuenta_contable: string;
  dt_fecha_actualizacion: string;
}

// Agregar Catalogo

export interface addCatalogoModel{
  status: boolean;
  message: string;
  body: addCatalogoData
}

export interface addCatalogoData{
  int_catalogo_bien_id: number; //No enviar
  str_catalogo_bien_id_bien: number;
  str_catalogo_bien_descripcion: string;
  str_catalogo_bien_estado: string;//no enviar
  int_catalogo_bien_item_presupuestario: number;
  str_catalogo_bien_cuenta_contable: string;
  dt_fecha_actualizacion: string;//no enviar
}

// Modificar Catalogo
export interface modCatalogoModel{
  status: boolean;
  message: string;
  body: modCatalogoData;
}

export interface modCatalogoData{
  int_catalogo_bien_id: number; //No enviar
  str_catalogo_bien_id_bien: number;
  str_catalogo_bien_descripcion: string;
  str_catalogo_bien_estado: string;//no enviar
  int_catalogo_bien_item_presupuestario: number;
  str_catalogo_bien_cuenta_contable: string;
  dt_fecha_actualizacion: string;//no enviar
}

export interface modCatalogoDataByID{
  str_catalogo_bien_id_bien: number;
  str_catalogo_bien_descripcion: string;
  int_catalogo_bien_item_presupuestario: number;
  str_catalogo_bien_cuenta_contable: string;
}
