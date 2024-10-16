/*==============================================================*/
/* schema: INVENTARIO                                           */
/*==============================================================*/
/*==============================================================*/
/* Table: TB_CENTROS                                            */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_centros;
CREATE TABLE IF NOT EXISTS inventario.tb_centros(
	int_centro_id SERIAl NOT NULL PRIMARY KEY,
	int_centro_tipo INTEGER NOT NULL,
    str_centro_tipo_nombre VARCHAR(100) NOT NULL,
	int_centro_nivel INTEGER NOT NULL,
	int_centro_sede_id INTEGER NOT NULL,
	str_centro_nombre_sede VARCHAR(255) NOT NULL,
	str_centro_cod_facultad VARCHAR(255) NULL,
	str_centro_nombre_facultad VARCHAR(255) NULL,
    str_centro_cod_carrera VARCHAR(255) NULL,
	str_centro_nombre_carrera VARCHAR(255) NULL,
    str_centro_nombre VARCHAR(255) NOT NULL,
    int_centro_id_dependencia INTEGER NULL,
    str_centro_nombre_dependencia VARCHAR(255) NULL,
    int_centro_id_proceso INTEGER NULL,
    str_centro_nombre_proceso VARCHAR(255) NULL,
    str_centro_estado VARCHAR(50) DEFAULT 'ACTIVO',
	dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_centros OWNER TO postgres;
ALTER TABLE inventario.tb_centros ADD CONSTRAINT ck_centro_estado CHECK (str_centro_estado = 'ACTIVO' OR str_centro_estado = 'INACTIVO');


/*==============================================================*/
/* Table: TB_TIPO_BIEN                                          */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_tipo_bien; 
CREATE TABLE IF NOT EXISTS inventario.tb_tipo_bien(
	int_tipo_bien_id SERIAl NOT NULL PRIMARY KEY,
	str_tipo_bien_nombre VARCHAR(255) NOT NULL,
	str_tipo_bien_estado VARCHAR(50) DEFAULT 'ACTIVO',
	dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_tipo_bien OWNER TO postgres;
ALTER TABLE inventario.tb_tipo_bien ADD CONSTRAINT ck_tipo_bien_estado CHECK (str_tipo_bien_estado = 'ACTIVO' OR str_tipo_bien_estado = 'INACTIVO');

/*==============================================================*/
/* Table: TB_ESTADO_BIEN                                        */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_estado_bien;
CREATE TABLE IF NOT EXISTS inventario.tb_estados_bien(
  	int_estado_bien_id SERIAl NOT NULL PRIMARY KEY,
  	str_estado_bien_nombre VARCHAR(100) NOT NULL UNIQUE,
  	str_estado_bien_estado VARCHAR(50) DEFAULT 'ACTIVO',
  	dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_estado_bien OWNER TO postgres;
ALTER TABLE inventario.tb_estado_bien ADD CONSTRAINT ck_estado_bien_estado CHECK (str_estado_bien_estado = 'ACTIVO' OR str_estado_bien_estado = 'INACTIVO');

/*==============================================================*/
/* Table: TB_PROVEEDOR                                          */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_proveedores; 
CREATE TABLE IF NOT EXISTS inventario.tb_proveedores(
	int_proveedor_id SERIAl NOT NULL PRIMARY KEY,
    str_proveedor_ruc VARCHAR(15) NOT NULL UNIQUE,    
    str_proveedor_nombre VARCHAR(255) NOT NULL,
    str_proveedor_estado VARCHAR(50) DEFAULT 'ACTIVO',
  	dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_proveedores OWNER TO postgres;
ALTER TABLE inventario.tb_proveedores ADD CONSTRAINT ck_proveedor_estado CHECK (str_proveedor_estado = 'ACTIVO' OR str_proveedor_estado = 'INACTIVO');

/*==============================================================*/
/* Table: TB_MARCA                                             */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_marca;
CREATE TABLE IF NOT EXISTS inventario.tb_marca(
    int_marca_id SERIAl NOT NULL PRIMARY KEY,
    str_marca_nombre VARCHAR(255) NOT NULL,
    str_marca_descripcion VARCHAR(255) NULL,
    str_marca_estado VARCHAR(50) DEFAULT 'ACTIVO',
    dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_marca OWNER TO postgres;
ALTER TABLE inventario.tb_marca ADD CONSTRAINT ck_marca_estado CHECK (str_marca_estado = 'ACTIVO' OR str_marca_estado = 'INACTIVO');

/*==============================================================*/
/* Table: TB_GARANTIA                                           */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_garantia; 
CREATE TABLE IF NOT EXISTS inventario.tb_garantia(
	int_garantia_id SERIAl NOT NULL PRIMARY KEY,
    int_bien_id INTEGER NOT NULL,
    dt_garantia_fecha_final VARCHAR(10) NOT NULL, 
    int_garantia_anios INTEGER NOT NULL,
    str_garantia_estado VARCHAR(50) DEFAULT 'ACTIVO',
    dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_garantia OWNER TO postgres;
ALTER TABLE inventario.tb_garantia ADD CONSTRAINT ck_garantia_estado CHECK (str_garantia_estado= 'ACTIVO' OR str_garantia_estado = 'INACTIVO');

/*==============================================================*/
/* Table: TB_PERSONAS                                           */
/*==============================================================*/
DROP TABLE IF EXISTS seguridad.tb_personas;
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
    dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE seguridad.tb_personas OWNER TO postgres;
ALTER TABLE seguridad.tb_personas
ADD CONSTRAINT ck_per_estado check (str_per_estado='ACTIVO' OR str_per_estado='INACTIVO'),
ADD CONSTRAINT ck_per_tipo check (str_per_tipo='PÚBLICO' OR str_per_tipo='TÉCNICO');

/*==============================================================*/
/* Table: TB_ACCION                                             */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_accion;
CREATE TABLE IF NOT EXISTS inventario.tb_accion(
    int_tipo_accion_id SERIAl NOT NULL PRIMARY KEY,
    str_tipo_accion_tipo VARCHAR(50) NOT NULL,
    str_tipo_accion_estado VARCHAR(50) DEFAULT 'ACTIVO',
    dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_accion OWNER TO postgres;
ALTER TABLE inventario.tb_accion ADD CONSTRAINT ck_accion_estado CHECK (str_tipo_accion_estado = 'ACTIVO' OR str_tipo_accion_estado = 'INACTIVO');

/*==============================================================*/
/* Table: TB_PERSONA_BIEN                                       */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_persona_bien;
CREATE TABLE IF NOT EXISTS inventario.tb_persona_bien(
	int_per_id INT NOT NULL,
    int_bien_id INT NOT NULL,
    int_tipo_accion_id INT NOT NULL,
    str_pesona_bien_estado VARCHAR(50) DEFAULT 'ACTIVO',
    str_persona_bien_activo BOOLEAN,
    dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);

ALTER TABLE inventario.tb_persona_bien OWNER TO postgres;
ALTER TABLE inventario.tb_persona_bien ADD CONSTRAINT ck_persona_bien_estado CHECK (str_pesona_bien_estado = 'ACTIVO' OR  str_pesona_bien_estado = 'INACTIVO');

/*==============================================================*/
/* Table: TB_BIENES                                             */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_bienes;
CREATE TABLE IF NOT EXISTS inventario.tb_bienes(
	int_bien_id SERIAl NOT NULL PRIMARY KEY,
    int_centro_id INTEGER  NOT NULL,
    int_proveedor_id INTEGER  NOT NULL,
    int_estado_bien_id INTEGER  NOT NULL,
    int_tipo_bien_id INTEGER  NOT NULL,
    int_codigo_bien_id INTEGER NOT NULL,
    int_marca_id INT NOT NULL,
	str_bien_nombre VARCHAR(255) NOT NULL,
	str_bien_modelo VARCHAR(255) NOT NULL,
	str_bien_serie VARCHAR(255) NOT NULL,
	int_bien_precio NUMERIC NULL,
	str_bien_color VARCHAR(50) NOT NULL,
    str_bien_version VARCHAR(50) NULL,
    int_bien_licencias INTEGER NULL,
    bln_bien_vigencia BOOLEAN NULL,
    str_bien_estado VARCHAR(50) DEFAULT 'ACTIVO',
    dt_bien_fecha_compra VARCHAR(10) NULL,
    str_bien_info_adicional JSONB NULL,
    dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
 ALTER TABLE inventario.tb_bienes OWNER TO postgres;
 ALTER TABLE inventario.tb_bienes ADD CONSTRAINT ck_bien_estado CHECK (str_bien_estado = 'ACTIVO' OR  str_bien_estado = 'INACTIVO');


 /*
 SELECT bn.int_bien_id, bn.str_bien_nombre, ct.int_centro_tipo, ct.str_centro_tipo_nombre, eb.str_estado_bien_nombre, bn.str_bien_modelo, bn.str_bien_serie, mc.int_marca_id, mc.str_marca_nombre
FROM inventario.tb_bienes bn 
INNER JOIN inventario.tb_marcas mc ON bn.int_marca_id = mc.int_marca_id
INNER JOIN inventario.tb_estados eb ON eb.int_estado_bien_id = bn.int_estado_bien_id
INNER JOIN inventario.tb_centros ct ON ct.int_centro_id = bn.int_centro_id

--NOMBRE DE LA SEDE Y DEPENDENCIA, ESTADO(ACTIVO O INACTIVO)
 */
 
/*==============================================================*/
/* Table: TB_CODIGO_BIEN                                        */
/*==============================================================*/
DROP TABLE IF EXISTS inventario.tb_codigo_bien;
CREATE TABLE IF NOT EXISTS inventario.tb_codigo_bien(
	int_codigo_bien_id INT NOT NULL,
    str_codigo_bien_cod VARCHAR(20) NOT NULL,
    str_codigo_bien_estado VARCHAR(50) DEFAULT 'ACTIVO',
    bln_codigo_biena_activo BOOLEAN DEFAULT TRUE,
    dt_fecha_creacion TIMESTAMP DEFAULT NOW()
);
ALTER TABLE inventario.tb_codigo_bien OWNER TO postgres;
ALTER TABLE inventario.tb_codigo_bien ADD CONSTRAINT ck_codigo_bien_estado CHECK (str_codigo_bien_estado = 'ACTIVO' OR str_codigo_bien_estado = 'INACTIVO');



