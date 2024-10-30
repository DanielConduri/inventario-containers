export interface dataNivel{
    message: string;
    status: string;
    data: datosNivel[];
}

export interface datosNivel{
    dt_fecha_creacion: string;
    int_nivel_mantenimiento_id: number;
    int_tipoMantenimiento_id: number;
    str_tipo_mantenimiento_descripcion: string;
    str_nivel_mantenimiento_estado: string;
    str_nivel_mantenimiento_descripcion: string
    str_soporte_descripcion: string
    str_soporte_nombre:string
}

export interface pagNivelMantenimiento{
    status: string;
    body: datosNivel[];
    total: any;
}