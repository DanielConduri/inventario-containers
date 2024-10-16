// Tipado de datos para obtener los permisos de un perfil
export interface permisosModel{
    status: boolean;
    message: string;
    body: dataPermisos[]
}

export interface dataPermisos{
    int_menu_id: number,
    int_menu_padre: number,
    bln_crear: boolean,
    bln_editar: boolean,
    bln_eliminar: boolean,
    bln_ver: boolean,
    str_menu_icono: string,
    str_menu_nombre: string,
    str_menu_path: string
}
//----------------------------------------------------------------------------------------
// Tipado de datos para obtener las opciones del menu con children
// export interface menuItemsModel{
//     status: boolean;
//     message: string;
//     body: dataMenuItems[]
// }

// export interface dataMenuItems{ //corresponde al menú principal
//     icon: string,
//     label: string,
//     link: string,
//     status: boolean,
//     children: dataSubMenu[]

// }

// export interface dataSubMenu{ //corresponde al submenú
//     icon: string,
//     label: string,
//     link: string,
//     status: boolean
// }

//----------------------------------------------------------------------------------------
// Tipado de datos para enviar los permisos de un perfil
export interface permisosPerfilModel{
    status: boolean;
    message: string;
    body: dataPermisosPerfil[]
}

export interface dataPermisosPerfil{
    int_menu_id: number, 
    bln_ver: boolean,
    bln_editar: boolean, 
    bln_crear: boolean, 
    bln_eliminar: boolean
}

//----------------------------------------------------------------------------------------
// Tipado de datos para obtener todas las opciones del menu
export interface menuItemsAllModel{
    status: boolean;
    message: string;
    body: dataMenuItemsAll[]
}

export interface dataMenuItemsAll{ //corresponde al menú principal
    dt_fecha_actualizacion: string,   
    dt_fecha_creacion: string,
    int_menu_id: number,
    int_menu_padre: number,
    str_menu_descripcion: string,
    str_menu_estado: string,
    str_menu_icono: string,
    str_menu_nombre: string,
    str_menu_path: string,
}


//----------------------------------------------------------------------------------------
// Tipado de datos para utilizar behaviorsubject

    export interface behaviorsubject{
        id: number;
        status: boolean;
    }


//----------------------------------------------------------------------------------------
// Tipado de datos para crear un nuevo menú

export interface newMenuModel{
    status: boolean;
    message: string;
    body: dataNewMenu;
}

export interface dataNewMenu{
    int_menu_padre: number;
    str_menu_descripcion: string;
    str_menu_icono: string;
    str_menu_nombre: string;
    str_menu_path: string;
}

//----------------------------------------------------------------------------------------
//tipado para trabajar con childen en el menu
export interface menuItemsModel{
    status: boolean;
    message: string;
    body: dataMenuItems[]
}

export interface dataMenuItems{ //corresponde al menú principal
    int_menu_id: number,
    int_menu_padre: number,
    str_menu_descripcion: string,
    str_menu_estado: string,
    str_menu_icono: string,
    str_menu_nombre: string,
    str_menu_path: string,
    dt_fecha_actualizacion: string,
    dt_fecha_creacion: string,
    submenus: dataSubMenu[]
}

export interface dataSubMenu{ //corresponde al submenú
    int_menu_id: number,
    int_menu_padre: number,
    str_menu_descripcion: string,
    str_menu_estado: string,
    str_menu_icono: string,
    str_menu_nombre: string,
    str_menu_path: string,
    dt_fecha_actualizacion: string,
    dt_fecha_creacion: string,
    submenus: dataMenuItems[]
 }

 //----------------------------------------------------------------------------------------
 export interface permisosMenuModel{
    status: boolean;
    message: string;
    menus: dataPermisoMenu[];
    permisos: dataPermisos[];
}


 export interface dataPermisoMenu{
    bln_crear: boolean,
    bln_editar: boolean,
    bln_eliminar: boolean,
    bln_ver: boolean,
    int_menu_id : number,
    int_menu_padre : number,
    str_menu_icono : string,
    str_menu_nombre : string,
    str_menu_path : string,
   submenus: dataPermisoMenu[]
//   submenus: {
//     bln_crear: boolean,
//     bln_editar: boolean,
//     bln_eliminar: boolean,
//     bln_ver: boolean,
//     int_menu_id : number,
//     int_menu_padre : number,
//     str_menu_icono : string,
//     str_menu_nombre : string,
//     str_menu_path : string,
//     submenus: []
//   }[]
 }