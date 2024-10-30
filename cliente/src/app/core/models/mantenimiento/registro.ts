export interface dataRegistro{
    message: string;
    status: string;
    body: datosRegistro[];
}

export interface datosRegistro{
    dt_fecha_creacion: string;
    dt_fecha_entrega: string;
    dt_fecha_ingreso: string;
    int_bien_id: number;
    int_correctivo_id: number;
    int_correctivo_nivel_mantenimiento: number;
    str_correctivo_cedula_custodio: string;
    str_correctivo_dependencia: string;
    str_correctivo_nombre_custodio: string;
    str_correctivo_problema: string;
    str_correctivo_solucion: string;
    str_correctivo_tecnico_responsable: string;
    str_correctivo_telefono: string;
}

// dt_fecha_creacion
// : 
// "2023-11-30T10:40:38.255Z"
// dt_fecha_entrega
// : 
// "2024-02-25T05:00:00.000Z"
// dt_fecha_ingreso
// : 
// "2024-02-20T05:00:00.000Z"
// int_bien_id
// : 
// 1
// int_correctivo_id
// : 
// 1
// int_correctivo_nivel_mantenimiento
// : 
// 1
// str_correctivo_cedula_custodio
// : 
// "1725142705"
// str_correctivo_dependencia
// : 
// "FIE"
// str_correctivo_nombre_custodio
// : 
// "DANIEL TENE"
// str_correctivo_problema
// : 
// "NO ENCIENDE"
// str_correctivo_solucion
// : 
// "REVISIÓN TÉCNICA"
// str_correctivo_tecnico_responsable
// : 
// "RAUL CUZCO"
// str_correctivo_telefono
// : 
// "0987849583"

export interface pagRegistroMantenimiento{
    status: string;
    body: datosRegistro[];
    total: any;
}
///////////////////////////////////////////////////////
export interface dataRegistroCorrectivo{
    message: string;
    status: string;
    body: datosRegistroCorrectivo[];
}

export interface datosRegistroCorrectivo{
    // dt_fecha_creacion: string;
    // int_correctivo_id: number;
    // str_correctivo_descripcion: string;
    // str_correctivo_estado: string;

    // dt_fecha_creacion: string;
    // dt_fecha_entrega: string;
    // dt_fecha_ingreso: string;
    // int_bien_id: number;
    // int_correctivo_id: number;
    // int_correctivo_nivel_mantenimiento: number;
    // str_correctivo_nombre_mantenimiento: string;
    // str_correctivo_nombre_nivel_mantenimiento: string;
    // str_correctivo_cedula_custodio: string;
    // str_correctivo_dependencia: string;
    // str_correctivo_nombre_custodio: string;
    // str_correctivo_problema: string;
    // str_correctivo_solucion: string;
    // str_correctivo_tecnico_responsable: string;
    // str_correctivo_telefono: string;
    // custodio: string;
    str_mantenimiento_correctivo_custodio: string;
    dt_fecha_actualizacion: string;
    dt_fecha_creacion: string;
    dt_mantenimiento_correctivo_fecha_entrega: string;
    dt_mantenimiento_correctivo_fecha_revision: string;
    int_estado_mantenimiento_id: number;
    int_mantenimiento_diagnostico: number;
    int_mantenimiento_id: number;
    int_nivel_mantenimiento_id: number;
    str_codigo_bien: string;
    str_mantenimiento_correctivo_dependencia: string
    str_mantenimiento_correctivo_descripcion_solucion: string
    str_mantenimiento_correctivo_estado: string;
    str_mantenimiento_correctivo_motivo: string;
    str_mantenimiento_correctivo_tecnico_responsable: string;
    str_mantenimiento_correctivo_telefono: string
}

export interface pagRegistroCorrectivo{
    status: string;
    body: datosRegistroCorrectivo[];
    total: any;
}
///////////////////////////////////////////////////////////

export interface dataRegistroPreventivo{
    message: string;
    status: string;
    body: datosRegistroPreventivo[];
}

export interface datosRegistroPreventivo{
    // dt_fecha_creacion: string;
    // int_preventivo_id: number;
    // str_preventivo_descripcion: string;
    // str_preventivo_estado: string;
    dt_fecha_creacion: string;
    dt_fecha_mantenimiento: string;
    int_bien_id: number;
    int_preventivo_id: number;
    str_correctivo_tecnico_responsable: string;
    str_preventivo_centro: string;
    str_preventivo_descripcion: string;
    str_preventivo_tipo:string;
}

export interface pagRegistroPreventivo{
    status: string;
    body: datosRegistroPreventivo[];
    total: any;
}