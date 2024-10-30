export interface EstadosPrestamoModal{
    message: string;
    status: boolean;
    total: number;
    body: DataEstadosPrestamo[]
}

export interface DataEstadosPrestamo{
    dt_fecha_actualizacion: string;
    dt_fecha_creacion: string;
    int_estado_prestamo_id: number;
    str_estado_prestamo_descripcion: string;
    str_estado_prestamo_nombre: string;
    str_estado_prestamo_estado: string;
}

export interface NuevoEstadoPrestamoModal{
    descripcion: string;
    nombre: string;
}