export interface PrestamosModal {
    message: string;
    status: boolean;
    total: number;
    body: DataPrestamos[]
}

export interface DataPrestamos {
    bl_prestamo_observacion: boolean;
    dt_fecha_actualizacion: string;
    dt_fecha_creacion: string;
    dt_fecha_prestamo: string;
    int_estado_id: number;
    int_horario_id: number;
    int_prestamo_custodio_id: string;
    int_prestamo_id: number;
    int_prestamo_persona_id: string;
    int_estados_prestamo_id: number;
    str_estado_prestamo_nombre: string;
    str_prestamo_custodio_nombre: string;
    str_prestamo_objeto_investigacion: string;
    str_prestamo_observacion: string;
    str_prestamo_persona_nombre: string;
    str_prestamo_codigo: string;
    str_documento_base64: string;
    str_prestamo_tipo: string;
    str_direcion_onedrive: string;
}