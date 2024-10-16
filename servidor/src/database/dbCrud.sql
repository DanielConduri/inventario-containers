--TABLA tb_roles
INSERT INTO seguridad.tb_roles(
	  str_rol_nombre, str_rol_descripcion)
	VALUES 
    ( 'PÚBLICO2', 'ROL PÚBLICO'),
    ( 'TÉCNICO2', 'ROL TÉCNICO');


   --tabla tb_personas
INSERT INTO seguridad.tb_personas(
	int_per_idcas ,
	str_per_nombres,
	str_per_apellidos,
	str_per_email ,
	str_per_cedula ,
	str_per_cargo,
	str_per_telefono 
)
VALUES 
(54931, 'JONATHAN DANIEL', 'TENE CONDURI', 'jonathand.tene@espoch.edu.ec', '1725142705', 'ADMINISTRADOR 1', '0968857043'),
(46972, 'PABLO ISRAEL', 'BOLAÑOS PARRAGA', 'pablo.bolanios@espoch.edu.ec', '1719176727', 'ADMINISTRADOR 2', '0999778684'),
(47073, 'HOMERO ABELARDO', 'OJEDA CULTID', 'homero.ojeda@espoch.edu.ec', '1550168494', 'ADMINISTRADOR 3', '7777777991'),
(54917, 'NAYELI MELANY', 'SECAIRA ZAMBRANO', 'nayeli.secaira@espoch.edu.ec', '2300677362', 'SUPERVISOR', '0981654855'),
(54908, 'KEVIN ANGELO', 'ESPINOZA ARIAS', 'angelo.espinoza@espoch.edu.ec', '2300543143', 'SUPERVISOR', '0981654000'),
(52255, 'RUBEN DARIO', 'VALENCIA NAVARRETE', 'rvalencia@espoch.edu.ec', '0803051150', 'SUPERVISOR', '0988587489');






/****************************************************************************************************************************/
INSERT INTO inventario.tb_centros(
	str_centro_cod,
	str_centro_nombre,
	str_centro_ubicacion,
	str_centro_dependencia
)
VALUES ('FIE132', 'CENTRO DE IDIOMAS', 'CENTRO DE PREGRADO', 'ESPOCH'),
		('MEC12', 'CENTRO DE MECÁNICA', 'CENTRO DE PREGRADO', 'ESPOCH');

/****************************************************************************************************************************/
INSERT INTO seguridad.tb_perfiles(
 int_per_id, int_rol_id, str_perfil_dependencia)
	VALUES ( 5, 1, 'dep');
	
/****************************************************************************************************************************/
//Insertar en la tabla permisos
INSERT INTO seguridad.tb_permisos(
 int_perfil_id, int_menu_id, bln_ver, bln_crear, bln_editar, bln_eliminar)
	VALUES ( 5, 6, true, true, true, true),
	( 5, 7, true, true, true, true),
	( 5, 8, true, true, true, true),
	( 5, 9, true, true, true, true),
	( 5, 10, true, true, true, true);

/****************************************************************************************************************************/
--insertar datos en la tabla menu
INSERT INTO seguridad.tb_menus
	 (int_menu_padre, str_menu_nombre, str_menu_descripcion, str_menu_icono, str_menu_path)
	VALUES (null, 'Principal', 'Menu general', 'menu','welcome'),
	(1, 'Inicio', 'Bienvenida', 'home','welcome'),
	(1, 'Bienes', 'Menu de inventario', 'assignment','bienes'),
	(3, 'Traspaso de bienes', 'Cambiar custodios', 'subdirectory_arrow_right','traspaso'),
	(1, 'Centros', 'Menu de centros', 'add_location','centros'),
	(1, 'Ajustes', 'Seguridad', 'settings','ajustes'),
	(6, 'Roles', 'Roles del usuario', 'subdirectory_arrow_right','ajustes/roles'),
	(6, 'Mi cuenta', 'información del usuario', 'subdirectory_arrow_right','ajustes/cuenta'),
	(6, 'Menus', 'Todos los menus del sistema', 'subdirectory_arrow_right','ajustes/menus'),
	(6, 'Usuarios', 'Todos los usuarios del sistema', 'subdirectory_arrow_right','ajustes/usuarios'),
	(1, 'Reportes', 'Menu de reportes', 'assignment_turned_in','reportes');




