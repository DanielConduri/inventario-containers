CREATE TABLE IF NOT EXISTS seguridad.tb_perfiles(
    int_perfil_id SERIAL NOT NULL PRIMARY KEY,
    int_per_id INTEGER NOT NULL,
    int_rol_id INTEGER NOT NULL,
    str_perfil_estado VARCHAR(50) DEFAULT 'ACTIVO',
    str_perfil_dependencia VARCHAR(255),
    dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE seguridad.tb_perfiles OWNER TO postgres;

alter table seguridad.tb_perfiles 
add constraint ck_perfil_estado check (str_perfil_estado='ACTIVO' OR str_perfil_estado='INACTIVO');
/*************************************************************************************************/
CREATE TABLE IF NOT EXISTS seguridad.tb_roles(
    int_rol_id SERIAL NOT NULL PRIMARY KEY,
    str_rol_nombre VARCHAR(255) NOT NULL UNIQUE,
    str_rol_descripcion VARCHAR(255),
    str_rol_estado VARCHAR(50) DEFAULT 'ACTIVO',
    dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE seguridad.tb_roles OWNER TO postgres;

ALTER TABLE seguridad.tb_roles 
add constraint ck_rol_estado check (str_rol_estado='ACTIVO' OR str_rol_estado='INACTIVO');

/******************************************************/
CREATE TABLE IF NOT EXISTS seguridad.tb_personas(
    int_per_id SERIAL NOT NULL PRIMARY KEY,
    int_per_idCas INTEGER,
    str_per_nombres VARCHAR(255) NOT NULL,
    str_per_apellidos VARCHAR(255) NOT NULL,
    str_per_email VARCHAR(255) NOT NULL,
    str_per_cedula VARCHAR(11) NOT NULL,
    str_per_cargo VARCHAR(255) NOT NULL,
    str_per_tipo VARCHAR(50) DEFAULT 'PÚBLICO',
    str_per_telefono VARCHAR(10) NOT NULL,
    str_per_estado VARCHAR(50) DEFAULT 'ACTIVO',
    dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE seguridad.tb_personas OWNER TO postgres;
/*reglas para tipo y estado en las columnas respectivas*/
Alter table seguridad.tb_personas
add constraint ck_per_estado check (str_per_estado='ACTIVO' OR str_per_estado='INACTIVO'),
add constraint ck_per_tipo check (str_per_tipo='PÚBLICO' OR str_per_tipo='TÉCNICO');

/*==============================================================*/
/* tabla permisos*/
CREATE TABLE IF NOT EXISTS seguridad.tb_permisos(
    int_permiso_id SERIAL NOT NULL PRIMARY KEY,
    int_perfil_id INTEGER NOT NULL,
    int_menu_id INTEGER NOT NULL,
    bln_ver BOOLEAN NOT NULL DEFAULT FALSE,
    bln_crear BOOLEAN NOT NULL DEFAULT FALSE,
    bln_editar BOOLEAN NOT NULL DEFAULT FALSE,
    bln_eliminar BOOLEAN NOT NULL DEFAULT FALSE,
    str_permiso_estado VARCHAR(50) DEFAULT 'ACTIVO',
    dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE seguridad.tb_permisos OWNER TO postgres;

alter table seguridad.tb_permisos
add constraint ck_permiso_estado check (str_permiso_estado='ACTIVO' OR str_permiso_estado='INACTIVO');

/* tabla menu*/
DROP TABLE IF EXISTS seguridad.tb_menu;
CREATE TABLE IF NOT EXISTS seguridad.tb_menus
(
    int_menu_id SERIAL,
    int_menu_padre integer,
    str_menu_nombre character varying(255) COLLATE pg_catalog."default",
    str_menu_descripcion character varying(255) COLLATE pg_catalog."default",
    str_menu_path character varying(255) COLLATE pg_catalog."default",
    str_menu_estado character varying(255) COLLATE pg_catalog."default" DEFAULT 'ACTIVO'::character varying,
    str_menu_icono character varying(255) COLLATE pg_catalog."default",
    dt_fecha_creacion timestamp with time zone DEFAULT now(),
    dt_fecha_actualizacion timestamp with time zone DEFAULT now(),
    CONSTRAINT tb_menus_pkey PRIMARY KEY (int_menu_id),
    CONSTRAINT tb_menus_str_menu_nombre_key UNIQUE (str_menu_nombre),
    CONSTRAINT ck_estado_menu CHECK (str_menu_estado::text = 'ACTIVO'::text OR str_menu_estado::text = 'INACTIVO'::text)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS seguridad.tb_menus
    OWNER to postgres;
/*==============================================================*/
/* Table: TB_REGLAMENTO                                         */
/*==============================================================*/
CREATE IF NOT EXISTS seguridad.tb_reglamento(
	int_reg_id SERIAL NOT NULL PRIMARY KEY,
	str_reg_nombre VARCHAR(255) NOT NULL,
	dt_reg_fecha TIMESTAMP,
	str_reg_archivo VARCHAR(255),
	dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
	
);
ALTER TABLE seguridad.tb_opciones OWNER postgres;

/*==============================================================*/
/* Table: TB_PADRE_OPCION                                       */
/*==============================================================*/
CREATE IF NOT EXISTS seguridad.padre_opcion(
	int_pad_opc_id SERIAL NOT NULL PRIMARY KEY,
	str_pad_opc_nombre VARCHAR(255) NOT NULL,
	str_opc_estado VARCHAR(50) DEFAULT 'ACTIVO',
	str_pad_opc_icono VARCHAR(255),
	dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

ALTER TABLE seguridad.padre_opcion OWNER postgres;

ALTER TABLE seguridad.padre_opcion
ADD CONSTRAINT ck_pad_opc_estado CHECK (str_opc_estado='ACTIVO' OR str_opc_estado='INACTIVO');
/*==============================================================*/
/* Table: TB_OPCIONES                                            */
/*==============================================================*/

CREATE IF NOT EXISTS seguridad.tb_opciones(
	int_opc_id SERIAl NOT NULL PRIMARY KEY,
	str_opc_nombre VARCHAR(255) NOT NULL,
	str_opc_descripcion VARCHAR(255),
	str_opc_url VARCHAR(255),
	str_opc_estado VARCHAR(50) DEFAULT 'ACTIVO',
	str_opc_icono VARCHAR(255),
	dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()	
);
ALTER TABLE seguridad.tb_opciones OWNER TO postgres;
Alter table seguridad.tb_opciones
add constraint ck_opc_estado check (str_opc_estado='ACTIVO' OR str_opc_estado='INACTIVO');

/*==============================================================*/
/* Table: TB_REGLAMENTO_OPCION                                       */
/*==============================================================*/
CREATE IF NOT EXISTS seguridad.tb_reglamento_opcion(
	int_reg_opc_id SERIAl NOT NULL PRIMARY KEY,
	int_opc_id INTEGER NOT NULL,
	int_reg_id INTEGER NOT NULL,
	str_reg_opc_estado VARCHAR(50) DEFAULT 'ACTIVO',
	dt_reg_opc_fecha_creacion TIMESTAMP DEFAULT NOW(),
	dt_reg_opc_fecha_inicio TIMESTAMP NULL,
	dt_reg_opc_fecha_fin TIMESTAMP NULL,
	dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE seguridad.tb_reglamento_opcion OWNER postgres;

alter table seguridad.tb_reglamento_opcion
add constraint ck_reg_opc_estado check (str_reg_opc_estado='ACTIVO' OR str_reg_opc_estado='INACTIVO');

/*==============================================================*/
/* Table: TB_ROL_OPCION                                            */
/*==============================================================*/
CREATE IF NOT EXISTS seguridad.tb_rol_opcion(
	int_rol_id INTEGER NOT NULL,
	int_pad_opc_id INTEGER NOT NULL,
	int_opc_id INTEGER NOT NULL,
	bln_ver	BOOLEAN NOT NULL DEFAULT FALSE,
	bln_crear BOOLEAN NOT NULL DEFAULT FALSE,
	bln_editar BOOLEAN NOT NULL DEFAULT FALSE,
	bln_eliminar BOOLEAN NOT NULL DEFAULT FALSE,
	str_rol_opc_estado VARCHAR(50) DEFAULT 'ACTIVO',
	dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE seguridad.tb_rol_opcion OWNER postgres;

ALTER TABLE seguridad.tb_roles ADD CONSTRAINT unq_rol_nombre UNIQUE (str_rol_nombre)
ALTER TABLE seguridad.tb_personas ADD CONSTRAINT unq_per_cedula UNIQUE (str_per_cedula)
ALTER TABLE seguridad.tb_personas ADD CONSTRAINT unq_per_email UNIQUE (str_per_email)

alter table seguridad.tb_rol_opcion 
add constraint ck_rol_opcion_estado check (str_rol_opc_estado='ACTIVO' OR str_rol_opc_estado='INACTIVO');



/*==============================================================*/
-- funciones del esquema seguridad
/*==============================================================*/
CREATE OR REPLACE FUNCTION seguridad.f_actualizar_usuario(
	id_perfil integer,
	cargo character varying,
	dependencia character varying,
	telefono character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
id_persona INTEGER;

BEGIN
	SELECT int_per_id FROM seguridad.tb_perfiles WHERE int_perfil_id = id_perfil
	INTO id_persona;
	
	UPDATE seguridad.tb_personas
	SET str_per_cargo = cargo, str_per_telefono = telefono WHERE int_per_id = id_persona;
	
	UPDATE seguridad.tb_perfiles
	SET str_perfil_dependencia = dependencia WHERE int_perfil_id = id_perfil;
	
RETURN 1;
COMMIT;
ROLLBACK;
END;	
$BODY$;

ALTER FUNCTION seguridad.f_actualizar_usuario(integer, character varying, character varying, character varying)
    OWNER TO postgres;
-------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION seguridad.f_insertar_perfil(
	id_persona integer,
	rol_nombre character varying,
	dependencia character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE 
	int_rol_idCreado INTEGER;
BEGIN
	IF EXISTS (SELECT int_rol_id FROM seguridad.tb_roles WHERE str_rol_nombre = rol_nombre ) THEN 
		SELECT int_rol_id FROM seguridad.tb_roles WHERE str_rol_nombre = rol_nombre INTO int_rol_idCreado;
		INSERT INTO seguridad.tb_perfiles(
			int_per_id,
			int_rol_id,
			str_perfil_dependencia
		)
		VALUES (
			id_persona,
			int_rol_idCreado,
			dependencia
		);
	RETURN 1;
	ELSE 
		RETURN 0;
		END IF;
COMMIT;
ROLLBACK;
END;
$BODY$;

ALTER FUNCTION seguridad.f_insertar_perfil(integer, character varying, character varying)
    OWNER TO postgres;
--------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION seguridad.f_insertar_usuario(
	int_idcas integer,
	str_nombres character varying,
	str_apellidos character varying,
	str_email character varying,
	str_cedula character varying,
	str_cargo character varying,
	str_telefono character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	int_per_idCreado INTEGER;
	int_rol_idCreado INTEGER;
BEGIN
	IF EXISTS(SELECT str_per_nombres FROM seguridad.tb_personas WHERE int_per_idcas=int_idcas)THEN
		RETURN 1;
	ELSE
		INSERT INTO seguridad.tb_personas(
			int_per_idcas,
			str_per_nombres, 
			str_per_apellidos,
			str_per_email,
			str_per_cedula,
			str_per_cargo,
			str_per_telefono
		)
		VALUES(
			int_idcas,
			str_nombres, 
			str_apellidos,
			str_email,
			str_cedula,
			str_cargo,
			str_telefono) returning int_per_id INTO int_per_idCreado;
			
		IF EXISTS(SELECT str_rol_nombre FROM seguridad.tb_roles WHERE str_rol_nombre='PÚBLICO')THEN
			SELECT int_rol_id FROM seguridad.tb_roles WHERE str_rol_nombre='PÚBLICO' INTO int_rol_idCreado;
			
			INSERT INTO seguridad.tb_perfiles(
				int_per_id,
				int_rol_id,
				str_perfil_dependencia
			)VALUES(
				int_per_idCreado,
				int_rol_idCreado,
				''
			);
			
		ELSE 
			INSERT INTO seguridad.tb_roles(
				str_rol_nombre, 
				str_rol_descripcion)
			VALUES ('PÚBLICO', 'ROL PREDETERMINADO') returning int_rol_id INTO int_rol_idCreado;
			
			
			INSERT INTO seguridad.tb_perfiles(
				int_per_id,
				int_rol_id,
				str_perfil_dependencia
			)VALUES(
				int_per_idCreado,
				int_rol_idCreado,
				''
			);
		END IF;
		RETURN 2;
	END IF;
END;
$BODY$;

ALTER FUNCTION seguridad.f_insertar_usuario(integer, character varying, character varying, character varying, character varying, character varying, character varying)
    OWNER TO postgres;
	
/**************************************************************************************************/	
CREATE TABLE IF NOT EXISTS inventario.tb_centros
(
    int_centro_id integer NOT NULL DEFAULT nextval('inventario.tb_centros_int_centro_id_seq'::regclass),
    str_centro_nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    str_centro_ubicacion character varying(255) COLLATE pg_catalog."default" NOT NULL,
    str_centro_dependencia character varying(255) COLLATE pg_catalog."default",
    str_centro_estado character varying(50) COLLATE pg_catalog."default" DEFAULT 'ACTIVO'::character varying,
    dt_fecha_creacion timestamp without time zone DEFAULT now(),
    dt_fecha_actualizacion timestamp without time zone DEFAULT now(),
    CONSTRAINT tb_centros_pkey PRIMARY KEY (int_centro_id),
    CONSTRAINT tb_centros_str_centro_nombre_key UNIQUE (str_centro_nombre),
    CONSTRAINT ck_estado_centro CHECK (str_centro_estado::text = 'ACTIVO'::text OR str_centro_estado::text = 'INACTIVO'::text)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS inventario.tb_centros
    OWNER to postgres;

/*==============================================================*/
--Funcion para buscar y retornar los perfiles que tiene un usuario en especifico
--DROP FUNCTION IF EXISTS seguridad.fn_listar_perfil_usuario(_per_id INTEGER);


CREATE OR REPLACE FUNCTION seguridad.f_listar_perfiles_usuario(per_idcas INTEGER) 
RETURNS TABLE (
    rol_id INTEGER, 
    perfil_id INTEGER,
    rol_nombre VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
	SELECT 
	roles.int_rol_id,
	perfiles.int_perfil_id,
	roles.str_rol_nombre
	FROM seguridad.tb_roles AS roles 
	JOIN seguridad.tb_perfiles as perfiles on roles.int_rol_id= perfiles.int_rol_id  
	JOIN seguridad.tb_personas as personas on personas.int_per_id = perfiles.int_per_id
	WHERE personas.int_per_idcas = per_idcas limit 1;
END;
$$;





/**********************************************FUNCIONES PARA INSERTAR EN LAS TABLAS DE INVENTARIO****************************************************/	
CREATE OR REPLACE FUNCTION inventario.f_insertar_bienes(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
fila RECORD;
contador INTEGER:= 0;
BEGIN 
	FOR fila IN SELECT codigo_bien, bien, modelo_caracteristicas,
	serie_identificacion, valor_compra, color, material, dimensiones, descripcion FROM inventario.tb_datos
	LOOP
		BEGIN
			INSERT INTO inventario.tb_bienes(
				int_codigo_bien,
				str_bien_nombre,
				str_bien_modelo,
				str_bien_serie,
				int_bien_precio,
				str_bien_color,
				str_bien_material,
				str_bien_dimensiones,
				str_bien_descripcion
			)
			VALUES
			(
				fila.codigo_bien,
				fila.bien,
				fila.modelo_caracteristicas,
				fila.serie_identificacion,
				fila.valor_compra,
				fila.color,
				fila.material,
				fila.dimensiones,
				fila.descripcion
			);
			contador:= contador + 1;
			EXCEPTION
      			WHEN unique_violation THEN
        	RAISE NOTICE 'El valor ya existe: %', fila.codigo_bien;
		END;
	END LOOP;
	RETURN contador;
END;
$BODY$;

--------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION inventario.f_insertar_catalogo_bienes(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
fila RECORD;
contador INTEGER:= 0;
BEGIN 
	FOR fila IN SELECT DISTINCT codigo_bien, bien FROM inventario.tb_datos 
		LOOP
			BEGIN
				INSERT INTO inventario.tb_catalogo_bienes(
					int_codigo_bien,
    				str_nombre_bien
				)
				VALUES
				(
					fila.codigo_bien,
					fila.bien
				);
				contador:= contador + 1;
				EXCEPTION
					WHEN unique_violation THEN
				RAISE NOTICE 'El valor ya existe: %', fila.codigo_bien;
			END;
	END LOOP;
	RETURN contador;
END;
$BODY$;

--------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION inventario.f_insertar_catalogo_custodios(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
fila RECORD;
contador INTEGER:= 0;
BEGIN 
	FOR fila IN SELECT DISTINCT cedula_ruc, custodio_actual, custodio_activo FROM inventario.tb_datos 
		LOOP
			BEGIN
				INSERT INTO inventario.tb_catalogo_custodios(
					int_cedula,
					str_nombre,
					str_activo
				)
				VALUES
				(
					fila.cedula_ruc,
					fila.custodio_actual,
					fila.custodio_activo
				);
				contador:= contador + 1;
				EXCEPTION
					WHEN unique_violation THEN
				RAISE NOTICE 'El valor ya existe: %', fila.cedula_ruc;
			END;
	END LOOP;
	RETURN contador;
END;
$BODY$;
--------------------------------------------------------------------------------------------------------------------------


CREATE OR REPLACE FUNCTION inventario.f_insertar_codigos(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
contador INTEGER := 1;
contador2 INTEGER := 0;
codigo VARCHAR;
fila RECORD;
cont INTEGER:= 0;
BEGIN 
	FOR fila IN SELECT codigo_bien, codigo_anterior_bien FROM inventario.tb_datos
	LOOP
		BEGIN
		--IF(fila.codigo_anterior_bien /*<> '' AND fila.codigo_anterior_bien <> 'SIN CODIGO ANTERIOR' AND fila.codigo_anterior_bien <> 'SIN CODIGO'*/) THEN
			codigo = CAST(fila.codigo_bien AS VARCHAR);
				INSERT INTO inventario.tb_codigo_bien(
					int_codigo_bien_id,
					str_codigo_bien_cod,
					bln_codigo_biena_activo
				)
				VALUES
				(contador,  fila.codigo_anterior_bien, false),
				(contador, codigo, true);
				contador = contador + 1;
		--END IF;
			cont := cont + 1;
				EXCEPTION
      				WHEN unique_violation THEN
        		RAISE NOTICE 'El valor ya existe: %', fila.condicion_bien;
		END;
	END LOOP;
	RETURN cont;
END;
$BODY$;

--------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION inventario.f_insertar_estados(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
fila RECORD;
contador INTEGER:= 0;
BEGIN
	--LLENAR TABLA ESTADOS--
	FOR fila IN SELECT DISTINCT condicion_bien FROM inventario.tb_datos
	LOOP
		BEGIN
			INSERT INTO inventario.tb_estados(
				str_estado_bien_nombre
			)
			VALUES
			(
				fila.condicion_bien
			);
			contador := contador + 1; 
			
			EXCEPTION
      			WHEN unique_violation THEN
        	RAISE NOTICE 'El valor ya existe: %', fila.condicion_bien;
    	END;
	END LOOP;
	RETURN contador;
END;
$BODY$;

--------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION inventario.f_insertar_marcas(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
fila RECORD;
contador INTEGER:= 0;
BEGIN
	--LLENAR TABLA MARCAS--
	FOR fila IN SELECT DISTINCT marca_raza_otros FROM inventario.tb_datos
	LOOP
		BEGIN
			INSERT INTO inventario.tb_marcas(
				str_marca_nombre
			)
			VALUES
			(
				fila.marca_raza_otros
			);
			contador := contador + 1;
			EXCEPTION
      			WHEN unique_violation THEN
        	RAISE NOTICE 'El valor ya existe: %', fila.marca_raza_otros;
		END;
	END LOOP;
	RETURN contador;
END;
$BODY$;
--------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION inventario.f_insertar_ubicaciones(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
fila RECORD;
contador INTEGER:= 0;
BEGIN 
	FOR fila IN SELECT DISTINCT id_ubicacion, ubicacion_bodega FROM inventario.tb_datos 
		LOOP
			BEGIN
				INSERT INTO inventario.tb_ubicaciones(
					int_id_ubicacion,
					str_ubicacion 
				)
				VALUES
				(
					fila.id_ubicacion,
					fila.ubicacion_bodega
				);
				contador := contador + 1;
				EXCEPTION
					WHEN unique_violation THEN
				RAISE NOTICE 'El valor ya existe: %', fila.id_ubicacion;
			END;
	END LOOP;
	RETURN contador;
END;
$BODY$;

--------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION inventario.f_insertar_datos(
	)
    RETURNS TABLE(estados integer, marcas integer, codigos integer, bienes integer, ubicaciones integer, cat_custodios integer, cat_bienes integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
marcas INTEGER;
estados INTEGER;
codigos INTEGER;
bienes INTEGER;
ubicaciones INTEGER;
cat_custodios INTEGER;
cat_bienes INTEGER;
BEGIN
	SELECT INTO estados inventario.f_insertar_estados();
	SELECT INTO marcas inventario.f_insertar_marcas();
	SELECT INTO codigos inventario.f_insertar_codigos();
	SELECT INTO bienes inventario.f_insertar_bienes();
	SELECT INTO ubicaciones inventario.f_insertar_ubicaciones();
	SELECT INTO cat_custodios inventario.f_insertar_catalogo_custodios();
	SELECT INTO cat_bienes inventario.f_insertar_catalogo_bienes();
	RETURN QUERY SELECT  estados, marcas, codigos, bienes, ubicaciones, cat_custodios, cat_bienes;
END;
$BODY$;

/**********************************************FUNCIONES PARA INSERTAR CENTROS****************************************************/	

CREATE OR REPLACE FUNCTION inventario.f_insertar_centro(
	str_tipo_centro character varying,
	str_nombre_sede character varying,
	str_cod_facultad character varying,
	str_nombre_facultad character varying,
	str_cod_carrera character varying,
	str_nombre_carrera character varying,
	str_centro_nombre character varying,
	int_dependencia integer,
	str_dependencia character varying,
	int_proceso integer,
	str_proceso character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	int_tipo_centro INTEGER;
	int_sede INTEGER;
	int_nivel INTEGER;
	str_sede VARCHAR;
	str_carrera VARCHAR;
	ubicacion VARCHAR;
	dependencia VARCHAR;
	int_valor INTEGER;
	int_valor_dos INTEGER;
	fila RECORD;
	
BEGIN
	--Obtener id de la sede
	IF(str_nombre_sede = 'MATRIZ RIOBAMBA') THEN
		int_sede = 1;
	ELSIF(str_nombre_sede = 'ESPOCH - SEDE MORONA SANTIAGO') THEN
			int_sede = 2;
	ELSE
		int_sede = 3;
	END IF;
	
	--Obtener id del tipo de centro
	IF(str_tipo_centro = 'ACADÉMICO') THEN
		int_tipo_centro = 1;
	ELSE
			int_tipo_centro = 2;
	END IF;
	
	--Obtener nivel de centro
	IF(str_nombre_carrera = '') THEN
		int_nivel = 2;
	ELSE
			int_nivel = 3;
	END IF;
	--Obtener la sede y la carrera ya existentes
	
	
	FOR fila IN SELECT str_centro_nombre_sede,  str_centro_nombre_carrera, str_centro_nombre_proceso, str_centro_nombre_dependencia FROM inventario.tb_centros
	LOOP 
		IF(int_tipo_centro = 1) THEN
			SELECT fila.str_centro_nombre_sede INTO str_sede FROM inventario.tb_centros WHERE fila.str_centro_nombre_sede = str_nombre_sede;
			SELECT fila.str_centro_nombre_carrera INTO str_carrera FROM inventario.tb_centros WHERE fila.str_centro_nombre_carrera = str_nombre_carrera;
			IF( str_sede != '' AND  str_carrera != '') THEN 
				int_valor = 0;
				--EXIT; --Romper ciclo
			END IF;
		ELSE
		
			SELECT fila.str_centro_nombre_proceso INTO ubicacion FROM inventario.tb_centros WHERE fila.str_centro_nombre_proceso = str_proceso;
			SELECT fila.str_centro_nombre_dependencia INTO dependencia FROM inventario.tb_centros WHERE fila.str_centro_nombre_dependencia = str_dependencia;
			IF(ubicacion != '' AND dependencia != '') THEN
				int_valor_dos = 0;
			END IF;
		END IF;
	END LOOP;
	
	IF(int_valor = 0 OR int_valor_dos = 0) THEN	
		RETURN 0;
	ELSE
		INSERT INTO inventario.tb_centros(
				int_centro_tipo,
				str_centro_tipo_nombre,
				int_centro_nivel,
				int_centro_sede_id,
				str_centro_nombre_sede,
				str_centro_cod_facultad,
				str_centro_nombre_facultad,
				str_centro_cod_carrera,
				str_centro_nombre_carrera,
				str_centro_nombre,
				int_centro_id_dependencia,
				str_centro_nombre_dependencia,
				int_centro_id_proceso,
				str_centro_nombre_proceso 
			)
			VALUES(
				int_tipo_centro,
				str_tipo_centro,
				int_nivel,
				int_sede,
				str_nombre_sede,
				str_cod_facultad ,
				str_nombre_facultad,
				str_cod_carrera,
				str_nombre_carrera,
				str_centro_nombre,
				int_dependencia,
				str_dependencia,
				int_proceso,
				str_proceso 
			);
	END IF;
	RETURN 1;
END;
$BODY$;

ALTER FUNCTION inventario.f_insertar_centro(character varying, character varying, character varying, character varying, character varying, character varying, character varying, integer, character varying, integer, character varying)
    OWNER TO postgres;

*************************************************************FUNCION INSERTAR CODIGOS BIENES***************************************************************************
-- FUNCTION: inventario.f_insertar_codigos()

-- DROP FUNCTION IF EXISTS inventario.f_insertar_codigos();

CREATE OR REPLACE FUNCTION inventario.f_insertar_codigos(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
contador INTEGER := 1;
contador2 INTEGER := 0;
codigo VARCHAR;
fila RECORD;
cont INTEGER:= 0;
BEGIN 
		FOR fila IN SELECT codigo_bien, codigo_anterior_bien FROM inventario.tb_datos
		LOOP
			codigo = CAST(fila.codigo_bien AS VARCHAR);
			IF(fila.codigo_anterior_bien <> '' AND fila.codigo_anterior_bien <> 'SIN CODIGO ANTERIOR' AND fila.codigo_anterior_bien <> 'SIN CODIGO') THEN
					BEGIN
						INSERT INTO inventario.tb_codigo_bien(
							int_codigo_bien_id,
							str_codigo_bien_cod,
							bln_codigo_bien_activo
						)
						VALUES
						(contador,  fila.codigo_anterior_bien, false),
						(contador, codigo, true);
						contador = contador + 1;
						cont := cont + 2;
						EXCEPTION
							WHEN unique_violation THEN
						RAISE NOTICE 'El valor ya existe: %', fila.codigo_bien;
					END;
			ELSE
					BEGIN
						INSERT INTO inventario.tb_codigo_bien(
							int_codigo_bien_id,
							str_codigo_bien_cod,
							bln_codigo_bien_activo
						)
						VALUES
						(contador, codigo, true);
						contador = contador + 1;
						cont := cont + 1;
						EXCEPTION
							WHEN unique_violation THEN
						RAISE NOTICE 'El valor ya existe: %', fila.codigo_bien;
					END;
			END IF;	
		END LOOP;
	RETURN cont;
END;
$BODY$;


/*==============================================================*/
/* Schema: INVENTARIOS                                          */
/*==============================================================*/
/*==============================================================*/
/* Table: TB_CATALOGOS_BIENES                                   */
/*==============================================================*/
CREATE TABLE IF NOT EXISTS inventario.tb_catalogo_bienes
(
    int_catalogo_bien_id SERIAL NOT NULL PRIMARY KEY,
    int_catalogo_bien_id_bien integer,
    str_catalogo_bien_descripcion character varying(255) COLLATE pg_catalog."default",
    str_catalogo_bien_estado character varying(255) DEFAULT 'ACTIVO',
    int_catalogo_bien_item_presupuestario integer,
    str_catalogo_bien_cuenta_contable character varying(255) COLLATE pg_catalog."default",
    dt_fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    CONSTRAINT ck_catalogo_bien_estado CHECK (str_catalogo_bien_estado::text = 'ACTIVO'::text OR str_catalogo_bien_estado::text = 'INACTIVO'::text)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS inventario.tb_catalogo_bienes
    OWNER to postgres;

/*==============================================================*/
/* Table: TB_DATOS			                                    */
/*==============================================================*/
CREATE TABLE IF NOT EXISTS inventario.tb_datos
(
    codigo_bien character varying NOT NULL,
    codigo_anterior_bien character varying NULL,
    identificador bigint,
    num_acta_matriz integer,
    bdl_cda character varying COLLATE pg_catalog."default",
    bien character varying COLLATE pg_catalog."default",
    serie_identificacion character varying COLLATE pg_catalog."default",
    modelo_caracteristicas character varying COLLATE pg_catalog."default",
    marca_raza_otros character varying COLLATE pg_catalog."default",
    critico character varying COLLATE pg_catalog."default",
    moneda character varying COLLATE pg_catalog."default",
    valor_compra numeric,
    recompra character varying COLLATE pg_catalog."default",
    color character varying COLLATE pg_catalog."default",
    material character varying COLLATE pg_catalog."default",
    dimensiones character varying COLLATE pg_catalog."default",
    condicion_bien character varying COLLATE pg_catalog."default",
    habilitado character varying COLLATE pg_catalog."default",
    estado_bien character varying COLLATE pg_catalog."default",
    id_bodega integer,
    bodega character varying COLLATE pg_catalog."default",
    id_ubicacion integer,
    ubicacion_bodega character varying COLLATE pg_catalog."default",
    cedula_ruc bigint,
    custodio_actual character varying COLLATE pg_catalog."default",
    custodio_activo character varying COLLATE pg_catalog."default",
    origen_ingreso character varying COLLATE pg_catalog."default",
    tipo_ingreso character varying COLLATE pg_catalog."default",
    num_compromiso integer,
    estado_acta character varying COLLATE pg_catalog."default",
    contabilidad_acta character varying COLLATE pg_catalog."default",
    contabilidad_bien character varying COLLATE pg_catalog."default",
    descripcion character varying COLLATE pg_catalog."default",
    item_reglon integer,
    cuenta_contable character varying COLLATE pg_catalog."default",
    depreciable character varying COLLATE pg_catalog."default",
    fecha_ingreso character varying COLLATE pg_catalog."default",
    fecha_ultima_depreciacion character varying COLLATE pg_catalog."default",
    vida_util integer,
    fecha_termino_depreciacion character varying COLLATE pg_catalog."default",
    valor_contable character varying COLLATE pg_catalog."default",
    valor_residual character varying COLLATE pg_catalog."default",
    vida_libros character varying COLLATE pg_catalog."default",
    valor_depreciacion_acumulada character varying COLLATE pg_catalog."default",
    comodato character varying COLLATE pg_catalog."default",
    ruc VARCHAR NULL,
	proveedor VARCHAR NULL,
	garantia VARCHAR NULL,
	anios_garantia INTEGER,
	CONSTRAINT tb_datos_pkey PRIMARY KEY (codigo_bien)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS inventario.tb_datos
    OWNER to postgres;


/*==============================================================*/
/* Table: TB_PROVEEDORES                                        */
/*==============================================================*/
CREATE TABLE IF NOT EXISTS inventario.tb_proveedores
(
    int_proveedor_id integer NOT NULL DEFAULT nextval('inventario.tb_proveedores_int_proveedor_id_seq'::regclass),
    str_proveedor_ruc character varying(15) COLLATE pg_catalog."default" NOT NULL,
    str_proveedor_nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    str_proveedor_estado character varying(50) COLLATE pg_catalog."default" DEFAULT 'ACTIVO'::character varying,
    dt_fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT tb_proveedores_pkey PRIMARY KEY (int_proveedor_id),
    CONSTRAINT tb_proveedores_str_proveedor_ruc_key UNIQUE (str_proveedor_ruc),
    CONSTRAINT ck_proveedor_estado CHECK (str_proveedor_estado::text = 'ACTIVO'::text OR str_proveedor_estado::text = 'INACTIVO'::text)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS inventario.tb_proveedores
    OWNER to postgres;
	
/*=========================FUNCIÓN INSERTAR PROVEEDORES=====================================*/
CREATE OR REPLACE FUNCTION inventario.f_insertar_proveedores(
	)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
fila RECORD;
contador INTEGER:= 0;
condicion_id INTEGER;
ubicacion_id INTEGER;
codigo_id INTEGER;
codigo_str VARCHAR;
marca_id INTEGER;
BEGIN 
	FOR fila IN SELECT DISTINCT ruc, proveedor FROM inventario.tb_datos
	LOOP
		BEGIN
			INSERT INTO inventario.tb_proveedores(
				str_proveedor_ruc,
				str_proveedor_nombre
			)
			VALUES
			(
				fila.ruc,
				fila.proveedor 
			);
			contador:= contador + 1;
			EXCEPTION
      			WHEN unique_violation THEN
        	RAISE NOTICE 'El valor ya existe: %', fila.ruc;
		END;
	END LOOP;
	RETURN contador;
END;
$BODY$;

/*=========================CONSULTA PARA MOSTRAR BIENES V1=====================================*/
SELECT bn.int_bien_id, 
        bn.int_codigo_bien, 
        bn.str_bien_nombre, 
        cd.str_condicion_bien_nombre, 
        bn.dt_bien_fecha_compra, 
        bn.str_bien_estado_logico,
        ub.str_ubicacion_nombre
        FROM inventario.tb_bienes bn 
        INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
        INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id WHERE bn.int_bien_id = 1;

/*=========================CONSULTA PARA MOSTRAR BIENES v2=====================================*/
SELECT bn.int_bien_id, 
	  cb.str_codigo_bien_cod,
      bn.str_bien_nombre, 
      cd.str_condicion_bien_nombre, 
      bn.dt_bien_fecha_compra, 
      bn.str_bien_estado_logico,
      ub.str_ubicacion_nombre
      FROM inventario.tb_bienes bn 
      INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
      INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
	  INNER JOIN inventario.tb_codigo_bien cb ON cb.int_codigo_bien = bn.int_codigo_bien_id
	  WHERE bn.int_bien_id = 1

/*=========================CONSULTA PARA MOSTRAR TODOS LOS BIENES =====================================*/
SELECT bn.int_bien_id, 
	  codb.str_codigo_bien_cod,
	  catb.int_catalogo_bien_id_bien,
	  catb.str_catalogo_bien_descripcion,
	  bn.int_bien_numero_acta,
	  bn.str_bien_bld_bca,
	  bn.str_bien_serie,
	  bn.str_bien_modelo,
	  mar.str_marca_nombre,
	  bn.str_bien_critico,
	  bn.str_bien_valor_compra,
	  bn.str_bien_recompra,
	  bn.str_bien_color,
	  bn.str_bien_material,
	  bn.str_bien_dimensiones,
	  bn.str_bien_habilitado,
	  bn.str_bien_estado,
	  cd.str_condicion_bien_nombre, 
	  bod.int_bodega_cod,
	  bod.str_bodega_nombre,
	  ub.int_ubicacion_cod,
	  ub.str_ubicacion_nombre,
	  cust.str_custodio_cedula,
	  cust.str_custodio_nombre,
	  cust.str_custodio_activo,
	  bn.str_bien_origen_ingreso,
	  bn.str_bien_tipo_ingreso,
	  bn.str_bien_numero_compromiso,
	  bn.str_bien_estado_acta,
	  bn.str_bien_contabilizado_acta,
	  bn.str_bien_contabilizado_bien,
	  bn.str_bien_descripcion,
	  camb.int_campo_bien_item_reglon,
	  camb.str_campo_bien_cuenta_contable,
      bn.dt_bien_fecha_compra, 
      bn.str_bien_estado_logico,
	  camb.str_campo_bien_depreciable,
	  camb.str_fecha_ultima_depreciacion,
	  camb.int_campo_bien_vida_util,
	  camb.str_campo_bien_fecha_termino_depreciacion,
	  camb.str_campo_bien_valor_contable,
	  camb.str_campo_bien_valor_residual,
	  camb.str_campo_bien_valor_libros,
	  camb.str_campo_bien_valor_depreciacion_acumulada,
	  camb.str_campo_bien_comodato,
	  bn.str_bien_garantia,
	  bn.int_bien_anios_garantia,
	  bn.str_bien_info_adicional
      FROM inventario.tb_bienes bn 
      INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
      INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
	  INNER JOIN inventario.tb_codigo_bien codb ON codb.int_codigo_bien = bn.int_codigo_bien_id
	  INNER JOIN inventario.tb_campos_bienes camb ON camb.int_bien_id = bn.int_bien_id
	  INNER JOIN inventario.tb_catalogo_bienes catb ON catb.int_catalogo_bien_id = bn.int_catalogo_bien_id
	  INNER JOIN inventario.tb_marcas mar ON mar.int_marca_id = bn.int_marca_id
	  INNER JOIN inventario.tb_bodegas bod ON bod.int_bodega_id = bn.int_bodega_id
	  INNER JOIN inventario.tb_custodios cust ON cust.int_custodio_id = bn.int_cusdotio_id
	  WHERE bn.int_bien_id = 1



	  //Documento
	  CREATE TABLE IF NOT EXISTS inventario.tb_tipo_documento(
	int_tipo_documento_id SERIAL NOT NULL,
	str_tipo_documento_nombre VARCHAR,
	str_tipo_documento_estado VARCHAR DEFAULT 'ACTIVO',
	dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
	CONSTRAINT ck_tipo_documento_estado check (str_tipo_documento_estado = 'ACTIVO' OR str_tipo_documento_estado = 'INACTIVO')
);
ALTER TABLE inventario.tb_tipo_documento OWNER TO postgres;

CREATE TABLE IF NOT EXISTS inventario.tb_custodio_responsable(
	int_custodio_responsable_id SERIAL NOT NULL,
	int_documento_id INTEGER,
	int_custodio_id INTEGER,
	str_custodio_responsable_estado VARCHAR DEFAULT 'ACTIVO',
	dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventario.tb_bienes_documentos(
	str_documento_id VARCHAR,
	int_bien_id INTEGER
);
ALTER TABLE inventario.tb_bienes_documentos OWNER TO postgres;

CREATE TABLE IF NOT EXISTS inventario.tb_documentos
(
    int_documento_id integer NOT NULL DEFAULT nextval('inventario.tb_documentos_int_documento_id_seq'::regclass),
    str_documento_id character varying(255) COLLATE pg_catalog."default",
    int_tipo_documento_id integer,
    str_documento_fecha text COLLATE pg_catalog."default",
    str_documento_titulo text COLLATE pg_catalog."default",
    str_documento_peticion character varying(255) COLLATE pg_catalog."default",
    str_documento_recibe character varying(255) COLLATE pg_catalog."default",
    str_documento_introduccion text COLLATE pg_catalog."default",
    str_documento_conclusiones text COLLATE pg_catalog."default",
    str_documento_recomendaciones text COLLATE pg_catalog."default",
    str_documento_estado character varying COLLATE pg_catalog."default" DEFAULT 'ACTIVO'::character varying,
    dt_fecha_impresion timestamp with time zone,
    dt_fecha_creacion timestamp without time zone DEFAULT now(),
    CONSTRAINT tb_documentos_pkey PRIMARY KEY (int_documento_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS inventario.tb_documentos
    OWNER to postgres;


----------------------------------------HISTORIAL DE ARCHIVOS CSV----------------------------------------
CREATE TABLE IF NOT EXISTS inventario.tb_registro_archivos(
	int_registro_id SERIAL NOT NULL PRIMARY KEY,
	str_registro_nombre VARCHAR,
	str_registro_resolucion VARCHAR,
	int_registro_num_filas_total INTEGER,
	int_registro_num_filas_insertadas INTEGER,
	int_registro_num_filas_no_insertadas INTEGER,
	dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);


----------------------------------------TABLA DE CUSTODIOS----------------------------------------
CREATE TABLE IF NOT EXISTS inventario.tb_custodios
(
    int_custodio_id integer NOT NULL DEFAULT nextval('inventario.tb_custodios_int_custodio_id_seq'::regclass),
    str_custodio_cedula character varying COLLATE pg_catalog."default" NOT NULL,
    str_custodio_nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    str_custodio_estado character varying(255) COLLATE pg_catalog."default" DEFAULT 'ACTIVO'::character varying,
    str_custodio_activo character varying(1) COLLATE pg_catalog."default" NOT NULL,
    dt_fecha_creacion timestamp without time zone DEFAULT now(),
    str_custodio_nombre_interno character varying COLLATE pg_catalog."default",
    CONSTRAINT tb_catalogo_custodios_pkey PRIMARY KEY (int_custodio_id),
    CONSTRAINT tb_catalogo_custodios_int_cedula_key UNIQUE (str_custodio_cedula),
    CONSTRAINT ck_catalogo_custodios_estado CHECK (str_custodio_estado::text = 'ACTIVO'::text OR str_custodio_estado::text = 'INACTIVO'::text)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS inventario.tb_custodios
    OWNER to postgres;




******************************************MÓDULO DE MANTENIMIENTO**********************************************
CREATE TABLE IF NOT EXISTS inventario.tb_bien_mantenimiento(
	int_mantenimiento_id SERIAL NOT NULL PRIMARY KEY,
	str_mantenimiento_codigo_bien INTEGER NOT NULL,
	str_mantenimiento_descripcion_problema VARCHAR,
	str_mantenimiento_descripcion_solucion VARCHAR,
	str_mantenimiento_telefono VARCHAR,
	str_mantenimiento_nivel_mantenimiento VARCHAR,
	str_mantenimiento_tecnico_responsable VARCHAR,
	str_mantenimiento_cedula_custodio VARCHAR,
	str_mantenimiento_nombre_custodio VARCHAR,
	str_mantenimiento_dependencia VARCHAR,
	str_mantenimiento_ubicacion VARCHAR,
	str_mantenimiento_estado VARCHAR DEFAULT 'ACTIVO',
	dt_fecha_ingreso TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_bien_mantenimiento OWNER TO postgres;
ALTER TABLE inventario.tb_bien_mantenimiento
ADD CONSTRAINT ck_mantenimiento_estado CHECK (str_mantenimiento_estado = 'ACTIVO' OR str_mantenimiento_estado = 'INACTIVO');


----------------------------------------TABLA DE CUSTODIO BIEN----------------------------------------
CREATE TABLE IF NOT EXISTS inventario.tb_custodio_bien
(
    int_custodio_bien_id integer NOT NULL PRIMARY KEY,
    int_custodio_id integer NOT NULL,
    int_bien_id integer NOT NULL,
    str_persona_bien_estado character varying(50) DEFAULT 'ACTIVO',
    str_persona_bien_activo boolean DEFAULT true,
    dt_fecha_creacion TIMESTAMP DEFAULT NOW(),
    str_custodio_bien_tipo character varying,
    CONSTRAINT ck_custodio_bien_estado CHECK (str_persona_bien_estado::text = 'ACTIVO'::text OR str_persona_bien_estado::text = 'INACTIVO'::text)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS inventario.tb_custodio_bien
    OWNER to postgres;