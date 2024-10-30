export interface dataEstado{
    message: string;
    status: string;
    body: datosEstado[];
}

export interface datosEstado{
    // dt_fecha_creacion: string;
    // int_estadoMantenimiento_id: number
    // str_estadoMantenimiento_descripcion: string;
    // str_estadoMantenimiento_estado: string

    dt_fecha_actualizacion: string
    dt_fecha_creacion: string
    int_estado_mantenimiento_id: number
    str_estado_mantenimiento_descripcion: string
    str_estado_mantenimiento_estado: string
    str_estado_mantenimiento_nombre: string
}

export interface pagEstadoMantenimiento{
    status: string;
    body: datosEstado[];
    total: any;
}