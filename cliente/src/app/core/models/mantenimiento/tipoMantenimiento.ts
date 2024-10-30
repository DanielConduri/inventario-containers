export interface dataMantenimiento{
    message: string;
    status: string;
    body: datosMantenimiento[];
}

export interface datosMantenimiento{
    dt_fecha_creacion: string;
    int_soporte_id: number;
    int_tipo_mantenimiento_id: number;
    str_tipo_mantenimiento_descripcion: string;
    str_tipo_mantenimiento_estado: string;
    str_tipo_mantenimiento_nombre: string
    str_soporte_descripcion: string
}

export interface pagTipoMantenimiento{
    status: string;
    body: datosMantenimiento[];
    total: any;
}