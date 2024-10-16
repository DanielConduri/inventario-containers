// ---------------------- Mostrando Proveedores ----------------------
export interface ProveedorShowModel{
  status: boolean;
  message: string;
  body: ProveedorData[];
}

export interface ModelPagProveedor{
  status: boolean;
  body: ProveedorData[];
  total: any;
}

export interface ProveedorData{
  int_proveedor_id: number;
  str_proveedor_nombre: string;
  str_proveedor_ruc: string;
  str_proveedor_estado: string;
  dt_fecha_creacion: string;
}

// --------------------- Agregar Proveedores ---------------------

export interface addProveedorModel{
  status: boolean;
  message: string;
  body: addProveedorData
}

export interface addProveedorData{
  str_proveedor_nombre: string;
  str_proveedor_ruc: string;
  str_proveedor_estado: string;
}

// --------------------- Modificar Proveedores ---------------------

export interface modProveedorModel{
  status: boolean;
  message: string;
  body: modProveedorData
}

export interface modProveedorData{
  int_proveedor_id: number;
  str_proveedor_nombre: string;
  str_proveedor_ruc: string;
  str_proveedor_estado: string;
}

export interface addProveedorDataByID{
  str_proveedor_nombre: string;
  str_proveedor_ruc: string;
  str_proveedor_estado: string;
}
