export interface dataEstado{
    message: string;
    status: string;
    body: datosEstado[];
}

export interface datosEstado{
    dt_fecha_creacion: string;
    int_estadoMantenimiento_id: number
    str_estadoMantenimiento_descripcion: string;
    str_estadoMantenimiento_estado: string
}

export interface pagEstadoMantenimiento{
    status: string;
    body: datosEstado[];
    total: any;
}