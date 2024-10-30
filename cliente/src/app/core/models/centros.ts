export interface centrosModel {
    status: boolean,
    message: string,
    body: dataCentros[]
}

export interface dataCentros {
    int_centro_id: number,
    str_centro_cod: string,
    str_centro_dependencia: string,
    str_centro_nombre: string,
    str_centro_ubicacion: string,
    str_centro_estado: string
    int_centro_id_dependencia: string,
    int_centro_id_proceso: string,
    int_centro_nivel: number,
    int_centro_sede_id: number,
    int_centro_tipo: string,
    str_centro_cod_carrera: string,
    str_centro_cod_facultad: string, 
    str_centro_nombre_carrera: string,
    str_centro_nombre_dependencia: string,
    str_centro_nombre_facultad: string, 
    str_centro_nombre_proceso: string, 
    str_centro_nombre_sede: string,
    str_centro_tipo_nombre: string
}

export interface modCentrosModel {
    status: boolean,
    message: string,
    body: modDataCentros
}

export interface modDataCentros {
    int_centro_id: number,
    str_centro_dependencia: string,
    str_centro_nombre: string,
    str_centro_ubicacion: string,
}

export interface addCentrosData {
    str_centro_dependencia: string,
    str_centro_nombre: string,
    str_centro_ubicacion: string,
}

export interface cargaLoading {
    isLoading: boolean,
    isData: boolean,
}

export interface pagCenter {
    status: string;
    body: dataCentros[];
    total: any;
}

// export interface addCent{
//     status: boolean;
//     message: string;
//     body: addCenter[]
// }

export interface addCenter {
    type: string;
    sede: string;
    codfacultad: string,
    codcarrera: string,
}

export interface addCent {
    type: string;
    sede: string;
    dependenciaId: number,
    ubicacion: string,
}

export interface detalleCent{
    int_centro_id: number,
    int_centro_id_dependencia: number, 
    int_centro_id_proceso: number,
    int_centro_nivel: number,
    int_centro_sede_id: number,
    int_centro_tipo: string,
    str_centro_cod_carrera: string,
    str_centro_cod_facultad: string,
    str_centro_estado: string,
    str_centro_nombre: string,
    str_centro_nombre_carrera: string,
    str_centro_nombre_dependencia: string,
    str_centro_nombre_facultad: string,
    str_centro_nombre_proceso: string,
    str_centro_nombre_sede: string,
    str_centro_tipo_nombre: string
}

export interface CentroAcademico{
    name: string;
    type: string;
    sede: string;
    codfacultad: string;
    codcarrera: string;
}

export interface CentroAdministrativo{
    name: string;
    type: string;
    sede: string;
    dependenciaId: number;
    ubicacion: string;
}

export interface CentroGeneral{
    name: string;
    type: string;
    sede: string;
}

export interface Facultad{
    facult: string[];
    cod: string[];
}

export interface Carrera{
    carrera: string[];
    cod: string[];
}

export interface Dependencia{
    depen: string[];
    cod: string[];
}

export interface Ubicacion{
    ubica: string[];
    cod: string[];
}