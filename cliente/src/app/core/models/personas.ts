//------------------------------- MOSTRAR PERSONAS - CRUD DE USUARIOS -------------------------------
export interface personasModel{
    status: boolean;
    message: string;
    body: dataPersonas[];
}

export interface dataPersonas{

    int_per_id: number,
    int_per_idcas: number,
    str_per_nombres: string,
    str_per_apellidos: string,
    str_per_email: string,
    str_per_cedula: string,
    str_per_cargo: string,
    str_per_telefono: string,
    str_per_estado: string,

}
//------------------------------- AGREGAR - CRUD DE USUARIOS -------------------------------

export interface personaNuevaModel{
    status: boolean;
    message: string;
    body: dataNuevaPersona;
}

export interface dataNuevaPersona {

  per_cargo : string,
  per_telefono : string,
  per_dependencia : string
}




//------------------------------- MODIFICAR - CRUD DE USUARIOS -------------------------------

export interface personaEditModel{
  status: boolean;
  message: string;
  body: dataEditPersona;
}

export interface dataEditPersona {

  str_per_estado: string,
  str_per_cedula: string,
  int_per_id: number,
  str_per_apellidos: string,
  str_per_cargo: string,
  str_per_telefono: string,
  str_per_email: string,
  str_per_nombres: string,
  // str_perfil_dependencia: string,

}

//------------------------------- Mnueva vista - CRUD DE PERSONAS  - ROLES -------------------------------

export interface perRolesModel{
  id: number;
  status: boolean;
 // data: dataPerRoles;
}
export interface porfileModel{
  id: number;
  status: boolean;
}

//------------------------------- Mnueva vista - CRUD DE PERSONAS  - ROLES -------------------------------

export interface usuarioModel{
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
}

// para llenar la tabla de personas roles

export interface perfilesModel{
  status: boolean;
  message: string;
  body: dataPerfiles[];
}

export interface dataPerfiles{
  int_perfil_id: number;
  str_rol_nombre: string;
  str_rol_descripcion: string;
  str_perfil_dependencia: string;
  str_perfil_estado: string;
}

//------------------------------- Mnueva vista - CRUD DE PERSONAS  - ROLES -------------------------------

export interface addPerRolesModel{
  status: boolean;
  message: string;
  body: dataNewPorfile;
}

export interface dataNewPorfile{
  int_per_id: number;
  str_rol_nombre: string;
  str_rol_dependencia: string;
}

// tipado de datos para traer los datos del perfil para llenar el form a editar
export interface editPorfileModel{
  status: boolean;
  message: string;
  body: dataEditPorfile;
}

export interface dataEditPorfile{
  str_rol_nombre: string;
  str_rol_descripcion: string;
  str_perfil_dependencia: string;
}

//  ------------------------------- Nueva vista - CRUD DE ME -------------------------------

export interface miCuentaModel{
  status: boolean;
  message: string;
  body: dataMiCuenta;
}

export interface dataMiCuenta{
int_per_id: number;
int_per_idcas: number;
str_per_apellidos: string;
str_per_cargo: string;
str_per_cedula: string;
str_per_email: string;
str_per_estado: string;
str_per_nombres: string;
str_per_telefono: string
}
// -------

export interface pagUsuarios{
  status: string;
  body: dataPersonas[];
  total: any;
}

export interface Pagination {
  page: number;
  size: number;
  parameter: string;
  data: number;
}