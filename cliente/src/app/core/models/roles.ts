export interface rolesModel{
  status:         boolean,
  message:        string,
  body:           dataRoles[]
}

export interface modRolesModel{
  status:         boolean,
  message:        string,
  body:           modDataRoles
}

export interface dataRoles{
str_rol_descripcion:  string,
str_rol_cod:          string,
str_rol_icono:        string,
int_rol_id:           number,
str_rol_nombre:       string,
str_rol_estado:      string
}

export interface modDataRoles{
  int_rol_id: number,
  str_rol_descripcion:  string,
  str_rol_cod:       string,
  str_rol_nombre:       string
}

export interface addRolesData{
  str_rol_descripcion:  string,
  str_rol_cod:       string,
  str_rol_nombre:       string
}

export interface DataFormRol {
  form: string,
  title:string,
  special: boolean
}


export interface deleteRol {
  status: string,
  message: string
}

export interface pagRoles{
  status: string;
  body: dataRoles[];
  total: any;
}