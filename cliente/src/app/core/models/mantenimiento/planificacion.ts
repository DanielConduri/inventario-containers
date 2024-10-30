export interface dataPlanificacion{
    message: string;
    status: string;
    body: datosPlanificacion[];
}

export interface datosPlanificacion{
    dt_fecha_creacion: string;
    dt_fecha_fin: string;
    dt_fecha_inicio: string; 
    int_planificacion_id: number;
    int_ubicacion_id: number;
    str_planificacion_estado: string;
    str_planificacion_centro: string
    str_planificacion_codigo: string
}

export interface pagPlanificacion{
    status: string;
    body: datosPlanificacion[];
    total: any;
}