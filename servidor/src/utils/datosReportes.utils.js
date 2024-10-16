//funcion para obtener datos para los reportes de la BD con los modelos
import { Op, Sequelize } from "sequelize";
import { Bienes } from "../models/inventario/bienes.models.js";
import { sequelize } from "../database/database.js";
import { Marcas } from "../models/inventario/marcas.models.js";

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
        console.log(datos);
        return datos;

  } catch (error) {
    console.log(error.message);
  }
}

async function obtenerTipoIngreso(){
    try {
        const datos = await Bienes.findAll({
            attributes: [
                "str_bien_tipo_ingreso",
                [Sequelize.fn("COUNT", Sequelize.col("str_bien_tipo_ingreso")), "Cantidad"],
                ],
                group: ["str_bien_tipo_ingreso"],
                raw: true,
            });
            console.log(datos);
            return datos;
  
      } catch (error) {
        console.log(error.message);
      }
}

async function obtenerBienesPorFechaCompraAnual() {
    try{
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
        console.log(datos3);
        //quiero ordenar los datos por año desde el mas antiguo
        const datos4 = Object.keys(datos3).map((anio) => {
            return { anio, Cantidad: datos3[anio] };
        }
        );
        const datos5 = datos4.sort((a, b) => {
            return a.anio - b.anio;
        }
        );
        console.log(datos5);

        return datos5;

    }catch(error){
        console.log(error.message);
    }
}
//la misma funcion pero ordenando por año desde el mas antiguo
async function obtenerBienesPorFechaCompraAnual2() {
    try{
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


    }catch(error){
        console.log(error.message);
    }
}

//funcion que obtiene los bienes por fecha de compra
async function obtenerBienesPorFechaCompra(){
    try{
        const datos = await Bienes.findAll({
            attributes: [
                "dt_bien_fecha_compra",
                [Sequelize.fn("COUNT", Sequelize.col("dt_bien_fecha_compra")), "Cantidad"],
                ],
                group: ["dt_bien_fecha_compra"],
                raw: true,
        });

        //ORDENAR LOS DATOS desde la fecha mas antigua
        const datos2 = datos.sort((a,b) => {
            const fecha = a.dt_bien_fecha_compra.split("/");
            const fecha2 = b.dt_bien_fecha_compra.split("/");
            const fecha3 = new Date(fecha[2], fecha[1] - 1, fecha[0]);
            const fecha4 = new Date(fecha2[2], fecha2[1] - 1, fecha2[0]);
            return fecha3 - fecha4;
        });
        console.log(datos2);
        return datos2;


    }catch(error){
        console.log(error.message);
    }
}

async function obtenerBienesConGarantia (){
    try{
        //de la columna str_bien_garantia obtener los bienes que tienen garantia ejemplo tiene S y los años de garantia int_bien_anios_garantia

        const datos = await Bienes.findAll({
            where: {
                str_bien_garantia: 'S',
            },
            attributes:[
                "str_codigo_bien",
                "str_bien_nombre",
                "int_bien_anios_garantia",
                "dt_bien_fecha_compra"
            ],
            raw: true,
        });
        console.log(datos);
        return datos;
    }catch(error){
        console.log(error.message);
    }

}

//funcion para obtener los bienes en un rango de fechas
async function obtenerBienesPorFechaCompraRango(parametro) {
    try{
        const datos = await Bienes.findAll({
            where: {
                dt_bien_fecha_compra: {
                    [Op.between]: [parametro.fechaInicio, parametro.fechaFin],
                },
            },
            raw: true,
        });
        return datos;

    }catch(error){
        console.log(error.message);
    }
}

//bienes con garantia por fecha de compra / mes y año
async function obtenerBienesConGarantiaPorFechaCompra(inicio,fin){
    try{
        console.log("entro a la funcion");
        console.log(inicio);    
        console.log(fin);
        if(inicio === undefined || fin === undefined){
            return 0;
        }
        //primero obtengo los bienes que tienen garantia
        const datos = await Bienes.findAll({
            where: {
                str_bien_garantia: "S",
            },
            attributes:[
                "str_codigo_bien",
                "str_bien_nombre",
                "int_bien_anios_garantia",
                "dt_bien_fecha_compra",
            ],
            raw: true,
        });

        const partesFecha = inicio.split("/"); // Divide la cadena en partes: [17, 10, 2006]
        const partesFecha2 = fin.split("/"); // Divide la cadena en partes: [27, 03, 2008]
        
        const fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]); // Date(2006, 9, 17)
        const fecha2 = new Date(partesFecha2[2], partesFecha2[1] - 1, partesFecha2[0]); // Date(2008, 2, 27)
        //ahora obtengo los bienes que tienen garantia y estan en el rango de fechas
        const datos2 = datos.filter((dato) => {
            const fecha3 = new Date(dato.dt_bien_fecha_compra);
            return fecha3 >= fecha && fecha3 <= fecha2;
        });
        //Ordenar los datos por fecha de compra
        const datos3 = datos2.sort((a,b) => {
            const fecha4 = new Date(a.dt_bien_fecha_compra);
            const fecha5 = new Date(b.dt_bien_fecha_compra);
            return fecha4 - fecha5;
        });
        return datos3;
  
    }catch(error){
        console.log(error.message)
    }
}


//funcion para obtener los datos de todos los bienes dado el id del catalogo

async function obtenerBienesPorCatalogo(id){
    try{
        const datos = await Bienes.findAll({
            where:{
                int_catalogo_bien_id: id,
            },
            raw: true,
        });
        return datos;
    }catch(error){
        console.log(error.message);
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

async function obtenerBienesPorUbicacion(id){
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
            { raw : true }
        );
        return datos;
    } catch (error) {
        console.log(error.message);
    }
}

async function obtenerBienesPorMarca(id){
    try{
        const datos = await Bienes.findAll({
            where:{
                int_marca_id: id,
            },
            raw: true,
        });
        return datos;
    }catch(error){
        console.log(error.message);
    }
}
async function obtenerMarca(id){
    try{
        const nombreMarca = await Marcas.findOne({
            where:{
                int_marca_id: id,
            },
            raw: true,
        });
        return nombreMarca;

    }catch(error){
        console.log(error.message);
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
            { raw : true }
        );
        return bienHistorial;
    } catch (error) {
        console.log(error.message);
    }
}

export default { 
    obtenerDatosReporte, 
    obtenerMarcas,
    obtenerOrigenIngreso,
    obtenerTipoIngreso,
    obtenerBienesPorFechaCompraAnual,
    obtenerBienesPorFechaCompraAnual2,
    obtenerBienesConGarantia,
    obtenerBienesConGarantiaPorFechaCompra,
    obtenerBienesPorCatalogo,
    obtenerBienesPorUbicacion,
    obtenerBienesPorMarca,
    obtenerMarca,
    obtenerBienesPorFechaCompra,
    obtenerBienPorHistorial
 };
