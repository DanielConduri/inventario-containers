export interface dataSoporte{
    message: string,
    status: string,
    body: datosSoporte[]
}

export interface datosSoporte{
    dt_fecha_creacion: string, 
    int_soporte_id: number, 
    str_soporte_descripcion: string, 
    str_soporte_nombre: string,
    str_soporte_estado: string
}

export interface pagSoporte{
    status: string,
    body: datosSoporte[],
    total: any;
}