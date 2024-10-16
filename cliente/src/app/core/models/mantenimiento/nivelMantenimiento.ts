export interface dataNivel{
    message: string;
    status: string;
    data: datosNivel[];
}

export interface datosNivel{
    dt_fecha_creacion: string;
    int_nivelMantenimiento_id: number;
    int_tipoMantenimiento_id: number;
    str_nivelMantenimiento_descripcion: string;
    str_nivelMantenimiento_estado: string
}

export interface pagNivelMantenimiento{
    status: string;
    body: datosNivel[];
    total: any;
}