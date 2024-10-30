//funcion para obtener datos para los reportes de la BD con los modelos
import { Op, Sequelize } from "sequelize";
import { Bienes } from "../models/inventario/bienes.models.js";
import { sequelize } from "../database/database.js";
import { Marcas } from "../models/inventario/marcas.models.js";
// import { configVariables } from "../../config/variables.config.js";
import { configVariables } from "../config/variables.config.js";
import fetch from "node-fetch"; //para consumir una API
import https from "https";
import crypto from "crypto";
// const agent = new https.Agent({ rejectUnauthorized: false }); //Validar credenciales
// Configurar el agente HTTPS
const httpsAgentOptions = {
    secureOptions: crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
};

httpsAgentOptions.rejectUnauthorized = false;
const httpsAgent = new https.Agent(httpsAgentOptions);

async function obtenerDatosReporte(modelo, columna, parametro) {
    let filtro = {}; // inicializa el filtro vacío

    // Si se proporcionan fechas de inicio y fin, agrega un filtro para las fechas de creación en el rango especificado
    if (parametro.fechaInicio && parametro.fechaFin) {
        filtro[columna] = {
            [Op.gte]: parametro.fechaInicio,
            [Op.lte]: parametro.fechaFin,
        };
    }
    //ver estado
    if (parametro.estado) {
        filtro[columna] = parametro.estado;
    }

    const datos = await modelo.findAll({ where: filtro, raw: true }); // busca los registros que coinciden con el filtro

    return datos;
}

async function obtenerMarcas(modelo) {
    try {
        //obtener las diferentes marcas y su cantidad del modelo y ordenarlas por cantidad
        const datos = await modelo.findAll({
            attributes: [
                "int_marca_id",
                [Sequelize.fn("COUNT", Sequelize.col("int_marca_id")), "Cantidad"],
            ],
            group: ["int_marca_id"],
            raw: true,
        });
        return datos;
    } catch (error) {
        console.log(error.message);
    }
}
async function obtenerOrigenIngreso() {
    try {
        const datos = await Bienes.findAll({
            attributes: [
                "str_bien_origen_ingreso",
                [Sequelize.fn("COUNT", Sequelize.col("str_bien_origen_ingreso")), "Cantidad"],
            ],
            group: ["str_bien_origen_ingreso"],
            raw: true,
        });
        //console.log(datos);
        return datos;

    } catch (error) {
        console.log(error.message);
    }
}


async function obtenerFilasOrigenIngreso(origenIngreso) {
    let filas = [];
    let objeto = {}
    try {
        origenIngreso.forEach(i => {

            objeto = {
                origen: i.str_bien_origen_ingreso,
                cantidad: i.Cantidad
            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }
}

async function obtenerTipoIngreso() {
    try {
        const datos = await Bienes.findAll({
            attributes: [
                "str_bien_tipo_ingreso",
                [Sequelize.fn("COUNT", Sequelize.col("str_bien_tipo_ingreso")), "Cantidad"],
            ],
            group: ["str_bien_tipo_ingreso"],
            raw: true,
        });
        //console.log(datos);
        return datos;

    } catch (error) {
        console.log(error.message);
    }
}

function obtenerFilasTipoIngreso(bienes) {
    let filas = [];
    let objeto = {}
    try {
        bienes.forEach(i => {

            objeto = {
                tipo_ingreso: i.str_bien_tipo_ingreso,
                cantidad: i.Cantidad
            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }
}

async function obtenerBienesPorFechaCompraAnual() {
    try {
        //el campo de fecha de compra es dt_bien_fecha_compra ejemplo: 10/03/2008 y es tipo string
        const datos = await Bienes.findAll({
            attributes: [
                "dt_bien_fecha_compra",
                [Sequelize.fn("COUNT", Sequelize.col("dt_bien_fecha_compra")), "Cantidad"],
            ],
            group: ["dt_bien_fecha_compra"],
            order: [[Sequelize.fn("COUNT", Sequelize.col("dt_bien_fecha_compra")), "DESC"]],
            raw: true,
        });

        //de los datos obtenidos se debe obtener el año de la fecha de compra
        //y la cantidad de bienes comprados en ese año
        //ejemplo: 10/03/2008 -> 2008
        //          10/03/2009 -> 2009
        const datos2 = datos.map((dato) => {
            const fecha = dato.dt_bien_fecha_compra.split("/");
            const anio = fecha[2];
            return { anio, Cantidad: dato.Cantidad };
        });
        //Ahora sumo la cantidad de bienes comprados por cada año
        const datos3 = datos2.reduce((acumulador, dato) => {
            const anio = parseInt(dato.anio);
            const cantidad = parseInt(dato.Cantidad);
            if (!acumulador[anio]) {
                acumulador[anio] = 0;
            }
            acumulador[anio] += cantidad;
            return acumulador;
        }, {});
        //console.log(datos3);
        //quiero ordenar los datos por año desde el mas antiguo
        const datos4 = Object.keys(datos3).map((anio) => {
            return { anio, Cantidad: datos3[anio] };
        }
        );
        const datos5 = datos4.sort((a, b) => {
            return a.anio - b.anio;
        }
        );
        //console.log(datos5);

        return datos5;

    } catch (error) {
        console.log(error.message);
    }
}
//la misma funcion pero ordenando por año desde el mas antiguo
async function obtenerBienesPorFechaCompraAnual2() {
    try {
        //el campo de fecha de compra es dt_bien_fecha_compra ejemplo: 10/03/2008 y es tipo string
        const datos = await Bienes.findAll({
            attributes: [
                "dt_bien_fecha_compra",
                [Sequelize.fn("COUNT", Sequelize.col("dt_bien_fecha_compra")), "Cantidad"],
            ],
            group: ["dt_bien_fecha_compra"],
            order: [[Sequelize.fn("COUNT", Sequelize.col("dt_bien_fecha_compra")), "ASC"]],
            raw: true,
        });

        //de los datos obtenidos se debe obtener el año de la fecha de compra
        //y la cantidad de bienes comprados en ese año
        //ejemplo: 10/03/2008 -> 2008
        //          10/03/2009 -> 2009
        const datos2 = datos.map((dato) => {
            const fecha = dato.dt_bien_fecha_compra.split("/");
            const anio = fecha[2];
            return { anio, Cantidad: dato.Cantidad };
        }
        );

        //quiero ordenar los datos por año desde el mas antiguo
        const datos3 = datos2.sort((a, b) => {
            return a.anio - b.anio;
        });
        obtenerBienesConGarantia();
        return datos3;


    } catch (error) {
        console.log(error.message);
    }
}

function obtenerFilasBienesPorFechaCompraAnual(bienes) {
    let filas = [];
    let objeto = {}
    try {
        origenIngreso.forEach(i => {

            objeto = {
                cantidad: i.Cantidad,
                anio: i.anio
            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }
}

//funcion que obtiene los bienes por fecha de compra
async function obtenerBienesPorFechaCompra() {
    try {
        const datos = await Bienes.findAll({
            attributes: [
                "dt_bien_fecha_compra",
                [Sequelize.fn("COUNT", Sequelize.col("dt_bien_fecha_compra")), "Cantidad"],
            ],
            group: ["dt_bien_fecha_compra"],
            raw: true,
        });

        //ORDENAR LOS DATOS desde la fecha mas antigua
        const datos2 = datos.sort((a, b) => {
            const fecha = a.dt_bien_fecha_compra.split("/");
            const fecha2 = b.dt_bien_fecha_compra.split("/");
            const fecha3 = new Date(fecha[2], fecha[1] - 1, fecha[0]);
            const fecha4 = new Date(fecha2[2], fecha2[1] - 1, fecha2[0]);
            return fecha3 - fecha4;
        });
        //console.log(datos2);
        return datos2;


    } catch (error) {
        console.log(error.message);
    }
}

function obtenerFilasBienesPorFechaCompra(bienes) {
    let filas = [];
    let objeto = {}
    try {
        bienes.forEach(i => {
            objeto = {
                cantidad: i.Cantidad,
                fecha_compra: i.dt_bien_fecha_compra
            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }
}

async function obtenerBienesConGarantia() {
    try {
        //de la columna str_bien_garantia obtener los bienes que tienen garantia ejemplo tiene S y los años de garantia int_bien_anios_garantia

        const datos = await Bienes.findAll({
            where: {
                str_bien_garantia: 'S',
            },
            attributes: [
                "str_codigo_bien",
                "str_bien_nombre",
                "int_bien_anios_garantia",
                "dt_bien_fecha_compra"
            ],
            raw: true,
        });
        //console.log(datos);
        return datos;
    } catch (error) {
        console.log(error.message);
    }

}

//funcion para obtener los bienes en un rango de fechas
async function obtenerBienesPorFechaCompraRango(parametro) {
    try {
        const datos = await Bienes.findAll({
            where: {
                dt_bien_fecha_compra: {
                    [Op.between]: [parametro.fechaInicio, parametro.fechaFin],
                },
            },
            raw: true,
        });
        return datos;

    } catch (error) {
        console.log(error.message);
    }
}

//bienes con garantia por fecha de compra / mes y año
async function obtenerBienesConGarantiaPorFechaCompra(inicio, fin) {
    try {
        //console.log("entro a la funcion");

        await sequelize.query('UPDATE inventario.tb_bienes SET int_bien_anios_garantia = 0 WHERE str_bien_garantia IS NULL');
        //console.log(inicio);    
        //console.log(fin);
        if (inicio === undefined || fin === undefined) {
            return 0;
        }
        //primero obtengo los bienes que tienen garantia
        const datos = await Bienes.findAll({
            where: {
                str_bien_garantia: {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.eq]: '' },
                        { [Op.eq]: 'S' },
                        { [Op.eq]: 'N' }
                    ]
                }
            },
            attributes: [
                "str_codigo_bien",
                "str_bien_nombre",
                "int_bien_anios_garantia",
                "dt_bien_fecha_compra",
            ],
            raw: true,
        });

        //console.log('datos', datos)
        const partesFecha = inicio.split("/"); // Divide la cadena en partes: [17, 10, 2006]
        const partesFecha2 = fin.split("/"); // Divide la cadena en partes: [27, 03, 2008]

        const fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]); // Date(2006, 9, 17)
        const fecha2 = new Date(partesFecha2[2], partesFecha2[1] - 1, partesFecha2[0]); // Date(2008, 2, 27)

        //console.log(fecha);
        //ahora obtengo los bienes que tienen garantia y estan en el rango de fechas
        const datos2 = datos.filter((dato) => {
            const fecha3 = new Date(dato.dt_bien_fecha_compra);
            return fecha3 >= fecha && fecha3 <= fecha2;
        });
        //Ordenar los datos por fecha de compra
        const datos3 = datos2.sort((a, b) => {
            const fecha4 = new Date(a.dt_bien_fecha_compra);
            const fecha5 = new Date(b.dt_bien_fecha_compra);
            return fecha4 - fecha5;
        });
        return datos3;
    } catch (error) {
        console.log(error.message)
    }
}


//funcion para obtener los datos de todos los bienes dado el id del catalogo

async function obtenerBienesPorCatalogo(id) {
    try {
        const datos = await Bienes.findAll({
            where: {
                int_catalogo_bien_id: id,
            },
            raw: true,
        });
        return datos;
    } catch (error) {
        console.log(error.message);
    }
}

async function obtenerFilasBienesPorCatalogo(bienes) {
    let filas = [];
    let objeto = {};

    try {
        bienes.forEach(i => {

            objeto = {
                codigo: i.str_codigo_bien,
                modelo: i.str_bien_modelo,
                color: i.str_bien_color,
                serie: i.str_bien_serie,
                fecha_compra: i.dt_bien_fecha_compra

            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }
}


/*async function obtenerBienesConGarantia() {
    try {
        const datos = Bienes.findAll({
            where: {
                str_bien_garantia: 'N'
            },
            raw: true
        })
    } catch (error) {
        console.log(error.message);
    }
}*/

async function obtenerBienesPorUbicacion(id) {
    //console.log('id', id)
    try {
        const datos = await sequelize.query(
            `SELECT 
            bn.int_bien_id,
            bn.str_codigo_bien,
            bn.str_bien_nombre,
            ubi.str_ubicacion_nombre
            FROM 
            inventario.tb_ubicaciones ubi 
            INNER JOIN
            inventario.tb_bienes bn ON ubi.int_ubicacion_id = bn.int_ubicacion_id
            WHERE ubi.int_ubicacion_id = ${id}
            `,
            { raw: true }
        );
        return datos;
    } catch (error) {
        console.log(error);
    }
}

async function obtenerResponsable(cedula) {
    try {

        console.log(cedula)
        // const { cedula } = cedula;

        const url = configVariables.urlServicioCentralizado + cedula;
        const response = await fetch(url, { agent: httpsAgent });
        const body = await response.json();


        if (body.success == false) {
            return res.json({
                status: false,
                message: "Verifique que la cédula sea correcta",
                body: body,
            });
        }

        const apellidos =
            body.listado[0].per_primerApellido + " " + body.listado[0].per_segundoApellido;
        const datosUsuario = {
            per_id: body.listado[0].per_id,
            nombre: body.listado[0].per_nombres,
            apellidos: apellidos,
            correo: body.listado[0].per_email,
        };
        // res.json({
        //     status: true,
        //     message: "Usuario obtenido",
        //     body: datosUsuario,
        // });
        return datosUsuario;
    } catch (error) {

        // return res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}

function obtenerFilasBienesPorUbicacion(bienes) {
    let filas = [];
    let objeto = {};

    try {
        bienes[0].forEach(i => {

            objeto = {
                codigo: i.str_codigo_bien,
                nombre: i.str_bien_nombre,
                ubicacion: i.str_ubicacion_nombre

            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }
}

async function obtenerBienesPorMarca(id) {
    try {
        const datos = await Bienes.findAll({
            where: {
                int_marca_id: id,
            },
            raw: true,
        });
        return datos;
    } catch (error) {
        console.log(error.message);
    }
}
async function obtenerMarca(id) {
    try {
        const nombreMarca = await Marcas.findOne({
            where: {
                int_marca_id: id,
            },
            raw: true,
        });
        return nombreMarca;

    } catch (error) {
        console.log(error.message);
    }
}

async function obtenerFilasBienesPorMarca(bienes, marca) {
    let filas = []
    let objeto = {}

    try {
        bienes.forEach(i => {
            objeto = {
                codigo: i.str_codigo_bien,
                modelo: i.str_bien_modelo,
                color: i.str_bien_color,
                fecha_compra: i.dt_bien_fecha_compra,
                nombre: i.str_bien_nombre
            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }

}

async function obtenerBienesPorDescripcion(data) {
    //console.log(data)


    try {
        const datos = sequelize.query(
            `SELECT 
            bn.int_bien_id,
            bn.str_codigo_bien,
			bn.str_codigo_bien_anterior,
			catb.str_catalogo_bien_id_bien,
            bn.str_bien_nombre,
			bn.str_bien_serie,
			bn.str_bien_modelo,
			mar.str_marca_nombre,
			bod.str_bodega_nombre,
            ubi.str_ubicacion_nombre,		
			cb.str_custodio_cedula,
			cb.str_custodio_nombre,
			cb.str_custodio_activo,
			bn.str_bien_descripcion
            FROM 
			inventario.tb_bienes bn
            INNER JOIN
            inventario.tb_ubicaciones ubi ON bn.int_ubicacion_id = ubi.int_ubicacion_id
			INNER JOIN 
			inventario.tb_condiciones cd ON  bn.int_condicion_bien_id = cd.int_condicion_bien_id
			INNER JOIN 
			inventario.tb_custodios cb ON bn.int_custodio_id = cb.int_custodio_id
			INNER JOIN 
			inventario.tb_catalogo_bienes catb ON bn.int_catalogo_bien_id = catb.int_catalogo_bien_id
			INNER JOIN 
			inventario.tb_bodegas bod ON bn.int_bodega_id = bod.int_bodega_id
			INNER JOIN 
			inventario.tb_marcas mar ON bn.int_marca_id = mar.int_marca_id
			WHERE bn.str_bien_descripcion LIKE '%${data}%'`
        );
        // const datos = await Bienes.findAll({
        //     where:{
        //         str_bien_descripcion : {
        //             [Op.like]: `%${data}%`
        //         }
        //     },
        //     raw: true,
        // })
        return datos;
    } catch (error) {
        console.log(error.message);
    }
}

async function obtenerFilasBienesPorDescripcion(bienes) {
    let filas = []
    let objeto = {}

    try {
        bienes.forEach(i => {
            objeto = {
                codigo: i.str_codigo_bien,
                codigo_anterior: i.str_codigo_bien_anterior,
                identificador: i.str_catalogo_bien_id_bien,
                bien: i.str_bien_nombre,
                serie: i.str_bien_serie,
                modelo: i.str_bien_modelo,
                marca: i.str_marca_nombre,
                bodega: i.str_bodega_nombre,
                ubicacion: i.str_ubicacion_nombre,
                cedula: i.str_custodio_cedula,
                custodio: i.str_custodio_nombre,
                activo: i.str_custodio_activo,
                descripcion: i.str_bien_descripcion
            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }

}
async function obtenerBienPorHistorial(id) {
    try {
        const bienHistorial = await sequelize.query(
            `SELECT 
            bn.int_bien_id,
            bn.str_codigo_bien,
            bn.str_bien_nombre,
            ubi.str_ubicacion_nombre,
			cd.str_condicion_bien_nombre,
			cb.str_custodio_nombre,
            (SELECT TO_CHAR(bn.dt_fecha_creacion::timestamp, 'YYYY/MM/DD')) AS dt_fecha_creacion
            FROM 
			inventario.tb_bienes bn
            INNER JOIN
            inventario.tb_ubicaciones ubi ON bn.int_ubicacion_id = ubi.int_ubicacion_id
			INNER JOIN 
			inventario.tb_condiciones cd ON  bn.int_condicion_bien_id = cd.int_condicion_bien_id
			INNER JOIN 
			inventario.tb_custodios cb ON bn.int_custodio_id = cb.int_custodio_id
			WHERE bn.str_codigo_bien = '${id}'
            ORDER BY bn.int_bien_id DESC`,
            { raw: true }
        );
        return bienHistorial;
    } catch (error) {
        console.log(error.message);
    }
}

function obtenerFilasBienPorHistorial(bienes) {
    let filas = [];
    let objeto = {}
    try {
        bienes.forEach(i => {

            objeto = {
                codigo: i.str_codigo_bien,
                nombre: i.str_bien_nombre,
                ubicacion: i.str_ubicacion_nombre,
                condicion: i.str_condicion_bien_nombre,
                custodio: i.str_custodio_nombre,
                fecha_creacion: i.dt_fecha_creacion
            }
            filas.push(objeto)
        })
        return filas;
    } catch (error) {
        console.log(error)
        return error
    }
}


async function obtenerBienesTotal() {
    try {
        const bienes = await sequelize.query(
            `SELECT bn.int_bien_id, 
            codb.str_codigo_bien_cod,
            bn.int_marca_id,
            bn.int_custodio_id,
            catb.str_catalogo_bien_id_bien,
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
            --camb.int_campo_bien_item_reglon,
            --camb.str_campo_bien_cuenta_contable,
            bn.dt_bien_fecha_compra, 
            bn.str_bien_estado_logico,
            /*camb.str_campo_bien_depreciable,
            camb.str_fecha_ultima_depreciacion,
            camb.int_campo_bien_vida_util,
            camb.str_campo_bien_fecha_termino_depreciacion,
            camb.str_campo_bien_valor_contable,
            camb.str_campo_bien_valor_residual,
            camb.str_campo_bien_valor_libros,
            camb.str_campo_bien_valor_depreciacion_acumulada,
            camb.str_campo_bien_comodato,*/
            bn.str_bien_garantia,
            bn.int_bien_anios_garantia,
            bn.str_bien_info_adicional,
            mar.str_marca_nombre,
            --prov.str_proveedor_nombre,
            cusint.str_custodio_interno_nombre,
            ub.str_ubicacion_nombre_interno,
            bn.dt_bien_fecha_compra_interno
            FROM inventario.tb_bienes bn 
            INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
            INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
            INNER JOIN inventario.tb_codigo_bien codb ON codb.int_codigo_bien = bn.int_codigo_bien_id
            --INNER JOIN inventario.tb_campos_bienes camb ON camb.int_bien_id = bn.int_bien_id
            INNER JOIN inventario.tb_catalogo_bienes catb ON catb.int_catalogo_bien_id = bn.int_catalogo_bien_id
            INNER JOIN inventario.tb_marcas mar ON mar.int_marca_id = bn.int_marca_id
            INNER JOIN inventario.tb_bodegas bod ON bod.int_bodega_id = bn.int_bodega_id
            INNER JOIN inventario.tb_custodios cust ON cust.int_custodio_id = bn.int_custodio_id
            --INNER JOIN inventario.tb_proveedores prov ON prov.int_proveedor_id = bn.int_proveedor_id
            INNER JOIN inventario.tb_custodios_internos cusint ON cusint.int_custodio_interno_id = bn.int_custodio_interno_id
            --WHERE bn.int_bien_id < 3`
        );

        return bienes;
    } catch (error) {
        //console.log(error.message);
        return error;
    }
}

async function obtenerFilasBienes(bienes) {
    try {
        let filas = [];
        let objeto = {}
        bienes[0].forEach(i => {

            objeto = {
                codigo: i.str_codigo_bien_cod,
                marca_id: i.int_marca_id,
                custodio_id: i.int_custodio_id,
                identificador: i.str_catalogo_bien_id_bien,
                catalogo: i.str_catalogo_bien_descripcion,
                num_acta: i.int_bien_numero_acta,
                bld_bca: i.str_bien_bld_bca,
                serie: i.str_bien_serie,
                modelo: i.str_bien_modelo,
                marca: i.str_marca_nombre,
                critico: i.str_bien_critico,
                valor_compra: i.str_bien_valor_compra,
                recompra: i.str_bien_recompra,
                color: i.str_bien_color,
                material: i.str_bien_material,
                dimensiones: i.str_bien_dimensiones,
                habilitado: i.str_bien_habilitado,
                estado: i.str_bien_estado,
                condicion: i.str_condicion_bien_nombre,
                cod_bodega: i.int_bodega_cod,
                bodega: i.str_bodega_nombre,
                ubicacion_cod: i.int_ubicacion_cod,
                ubicacion_nombre: i.str_ubicacion_nombre,
                custodio_cedula: i.str_custodio_cedula,
                custodio_nombre: i.str_custodio_nombre,
                custodio_activo: i.str_custodio_activo,
                origen_ingreso: i.str_bien_origen_ingreso,
                tipo_ingreso: i.str_bien_tipo_ingreso,
                numero_compromiso: i.str_bien_numero_compromiso,
                estado_acta: i.str_bien_estado_acta,
                contabilizado_acta: i.str_bien_contabilizado_acta,
                contabilizado_bien: i.str_bien_contabilizado_bien,
                descripcion: i.str_bien_descripcion,
                fecha_compra: i.dt_bien_fecha_compra,
                estado_logico: i.str_bien_estado_logico,
                garantia: i.str_bien_garantia,
                anios_garantia: i.int_bien_anios_garantia,
                info_adicional: i.str_bien_info_adicional,
                proveedor: i.str_proveedor_nombre,
                custodio_interno: i.str_custodio_interno_nombre,
                ubicacion_interna: i.str_ubicacion_nombre_interno,
                fecha_compra_interno: i.dt_bien_fecha_compra_interno

            }

            filas.push(objeto)
        })

        return filas;

    } catch (error) {
        console.log(error)
        return error
    }
}


export default {
    obtenerDatosReporte,
    obtenerMarcas,
    obtenerOrigenIngreso,
    obtenerFilasOrigenIngreso,
    obtenerTipoIngreso,
    obtenerFilasTipoIngreso,
    obtenerBienesPorFechaCompraAnual,
    obtenerFilasBienesPorFechaCompraAnual,
    obtenerBienesPorFechaCompraAnual2,
    obtenerBienesConGarantia,
    obtenerBienesConGarantiaPorFechaCompra,
    obtenerBienesPorCatalogo,
    obtenerFilasBienesPorCatalogo,
    obtenerBienesPorUbicacion,
    obtenerFilasBienesPorUbicacion,
    obtenerBienesPorMarca,
    obtenerFilasBienesPorMarca,
    obtenerMarca,
    obtenerBienesPorFechaCompra,
    obtenerFilasBienesPorFechaCompra,
    obtenerBienPorHistorial,
    obtenerFilasBienPorHistorial,
    obtenerBienesPorFechaCompraRango,
    obtenerBienesTotal,
    obtenerFilasBienes,
    obtenerBienesPorDescripcion,
    obtenerFilasBienesPorDescripcion,
    obtenerResponsable
};
