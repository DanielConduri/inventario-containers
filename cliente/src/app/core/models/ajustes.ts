// export interface DataUsuarios {
//   int_per_id: number;
//   str_per_nombres: string;
//   str_per_apellidos: string;
//   str_per_email: string;
//   str_per_cedula: string;
//   str_per_cargo: string;
//   enum_per_estado: string;
// }

//datos usados para obtener posterior a la busqueda a la
export interface DataCentralizada {
  per_id: number;
  nombre: string;
  apellidos: string;
  correo: string;
}

// export interface DataFormUsuarios {
//   vistaConfiguracion: boolean;
//   data: DataUsuarios;
// } 

//modelod de la respuesta de la api con status y body
export interface CentralizadaModel {
  status: boolean;
  body: DataCentralizada;
}
