import { MantenimientoCorrectivo } from "../models/mantenimiento/mantenimientoCorrectivo.models.js"
import { Op, Sequelize } from "sequelize";
import { Bienes } from "../models/inventario/bienes.models.js"
import { CustodiosBien } from "../models/inventario/custodios_bienes.models.js";
import { Custodios } from "../models/inventario/custodios.models.js";
import { MantenimientoPreventivo } from "../models/mantenimiento/mantenimientoPreventivo.models.js"
import { Planificacion } from "../models/mantenimiento/planificacion.models.js";
import { nivelMantenimiento } from "../models/mantenimiento/nivelMantenimiento.models.js";
import { PlanificacionBien } from "../models/mantenimiento/planificacionBien.models.js";


//mantenimiento

async function obtenerBienesMantenimientoCorrectivoPorFechas(inicio, fin) {


    try {



        // Establecer la zona horaria a Ecuador (Guayaquil)
        moment.tz.setDefault('America/Guayaquil');

        //debo obtener los bienes que estan en mantenimiento correctivo
        const bienesMantenimientoCorrectivo = await MantenimientoCorrectivo.findAll({ raw: true, });
        console.log(bienesMantenimientoCorrectivo)
        //ahora debo obtener los bienes que estan en el rango de fechas
        const { fecha, fecha2 } = fechas(inicio, fin);
        console.log(fecha, fecha2)
        const datos = bienesMantenimientoCorrectivo.filter((dato) => {

            const fecha3 = dato.dt_fecha_creacion;
            // const fechaCorta = fechaCompleta.toISOString();
            // console.log(fechaCompleta.toISOString())
            // const fechaAux = fechaCorta.slice(0, 8);
            // console.log(fechaAux)
            // const dia = fechaCorta.slice(8, 10);
            // console.log(dia)
            // const valor = parseInt(dia) - 1;
            // console.log(valor)

            // const fechak = fechaAux + valor.toString();
            // const fecha3 = fechak.toDate
            // console.log(fecha3)
            return fecha3 >= fecha && fecha3 <= fecha2;
        });

        //console.log('datos antes del for', datos)

        //ahora debo extraer los datos de los bienes código,nombre, fecha creacion, str_bien_modelo dado el str_codigo_bien de datos en un for

        for (let i = 0; i < datos.length; i++) {
            const bien = await Bienes.findOne({ raw: true, where: { str_codigo_bien: datos[i].str_codigo_bien, int_bien_estado_historial: 1 }, attributes: ["str_codigo_bien", "str_bien_nombre", "int_bien_anios_garantia", "dt_bien_fecha_compra", "int_bien_id"] });
            if (bien) {
                datos[i].str_codigo_bien = bien.str_codigo_bien;
                datos[i].str_bien_nombre = bien.str_bien_nombre;
                datos[i].int_bien_anios_garantia = bien.int_bien_anios_garantia;
                datos[i].int_bien_id = bien.int_bien_id;
                datos[i].dt_bien_fecha_compra = bien.dt_bien_fecha_compra;
            } else {
                datos[i].str_codigo_bien = "";
                datos[i].str_bien_nombre = "";
                datos[i].int_bien_anios_garantia = 0;
                datos[i].int_bien_id = 0;
                datos[i].dt_bien_fecha_compra = "";
            }

        }

        //con el int_bien_id  busco en CustodiosBien el int_custodio_id con str_persona_bien_activo = true y luego busco el str_custodio_nombre en Custodios

        for (let i = 0; i < datos.length; i++) {
            let custodioBien = await CustodiosBien.findOne({ raw: true, where: { int_bien_id: datos[i].int_bien_id, str_persona_bien_activo: true }, attributes: ["int_custodio_id"] });
            if (custodioBien) {
                let custodio = await Custodios.findOne({ raw: true, where: { int_custodio_id: custodioBien.int_custodio_id }, attributes: ["str_custodio_nombre"] });
                datos[i].str_custodio_nombre = custodio.str_custodio_nombre;
            } else {
                datos[i].str_custodio_nombre = "";
            }
        }
        console.log('datos', datos);

        return datos;
    } catch (error) {

        console.log(error.message);
    }
}
//funcion para extraer las fechas 
function fechas(inicio, fin) {
    //console.log(inicio, fin);
    const partesFecha = inicio.split("/"); // Divide la cadena en partes: [17, 10, 2006]
    const partesFecha2 = fin.split("/"); // Divide la cadena en partes: [27, 03, 2008]

    const fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]); // Date(2006, 9, 17)
    const fecha2 = new Date(partesFecha2[2], partesFecha2[1] - 1, partesFecha2[0]); // Date(2008, 2, 27)
    return { fecha, fecha2 };
}



//funcion para extraer todos los mantenimientos dado el str_codigo_bien


async function obtenerMantenimientosCorrectivosPorCodigoBien(str_codigo_bien) {
    try {
        const mantenimientos = await MantenimientoCorrectivo.findAll({
            raw: true,
            where: { str_codigo_bien: str_codigo_bien }
        });
        const nombreBien = await Bienes.findOne({
            raw: true,
            where: { str_codigo_bien: str_codigo_bien },
            attributes: ["str_bien_nombre"]
        });

        if (nombreBien)
            mantenimientos.str_bien_nombre = nombreBien.str_bien_nombre;
        else
            mantenimientos.str_bien_nombre = "";

        return mantenimientos
    } catch (error) {
        console.log(error.message);
    }
}


async function obtenerMantenimientosCorrectivosPorTecnicoFechas(fechaInicio, fechaFinal, str_mantenimiento_correctivo_tecnico_responsable){
    // console.log('si llega a la funcion --->', fechaFinal, fechaInicio, str_mantenimiento_correctivo_tecnico_responsable)
    try{
        const {fecha, fecha2} = fechas(fechaInicio, fechaFinal);
        const mantenimientos = await MantenimientoCorrectivo.findAll(
            {raw: true, 
                where: 
                {
                    str_mantenimiento_correctivo_tecnico_responsable: str_mantenimiento_correctivo_tecnico_responsable, 
                    dt_fecha_creacion: {[Op.between]: [fecha, fecha2]}}});
        console.log('lo que sale al final ->', mantenimientos)
        // console.log('en las fechas ->', )
        return mantenimientos;
    }catch(error){
        console.log(error.message);
    }
}

async function obtenerMantenimientoPreventivoPorCentro(int_planificacion_id) {
    try {

        //hallo el registro findOne para hallar el int_nivel_mantenimiento_id

        const mantenimientoPreventivo = await MantenimientoPreventivo.findOne({
            where: {
                int_planificacion_id
            },
            raw: true
        })

        //hallo la descripcion del nivel

        const nivelM = await nivelMantenimiento.findOne({
            where: {
                int_nivel_mantenimiento_id: mantenimientoPreventivo.int_nivel_mantenimiento_id
            },
            raw: true
        })
        console.log("nivel", nivelM)

        //agrego la descripcion al objeto

        mantenimientoPreventivo.str_nivel_mantenimiento_descripcion = nivelM.str_nivel_mantenimiento_descripcion

        //hallo los bienes que estan el PlanifiacionBien

        const planificacionBien = await MantenimientoPreventivo.findAll({
            where: { int_planificacion_id },
            raw: true
        })

        console.log('entra??? lalalalal --->', planificacionBien)

        //hallo los datos de los bienes

        for (let i = 0; i < planificacionBien.length; i++) {

            let bien = await Bienes.findOne({
                where: {
                    str_codigo_bien: planificacionBien[i].str_codigo_bien,
                    int_bien_estado_historial: 1
                },
                raw: true
            })

            //agrego los datos de los bienes al objeto

            planificacionBien[i].str_bien_nombre = bien.str_bien_nombre

            let custodioBien = await CustodiosBien.findOne({ raw: true, where: { int_bien_id: bien.int_bien_id, str_persona_bien_activo: true }, attributes: ["int_custodio_id"] });
            console.log("custodioBien", custodioBien)
            let custodio = await Custodios.findOne({ raw: true, where: { int_custodio_id: custodioBien.int_custodio_id }, attributes: ["str_custodio_nombre"] });

            //agrego el custodio al objeto

            planificacionBien[i].str_custodio_nombre = custodio.str_custodio_nombre

        }

        //agrego los bienes al objeto


        mantenimientoPreventivo.planificacionBien = planificacionBien

        //hallo  la informacion de Planificacion 

        const dataPlanificacion = await Planificacion.findOne({
            where: { int_planificacion_id },
            raw: true
        })

        //agrego la informacion de Planificacion al objeto

        mantenimientoPreventivo.str_planificacion_codigo = dataPlanificacion.str_planificacion_codigo
        mantenimientoPreventivo.dt_fecha_inicio = dataPlanificacion.dt_fecha_inicio
        mantenimientoPreventivo.dt_fecha_fin = dataPlanificacion.dt_fecha_fin
        mantenimientoPreventivo.str_planificacion_centro = dataPlanificacion.str_planificacion_centro



        //transformar las fechas de 2024-01-05T00:00:00.000Z -hu Jan 04 2024 19:00:00 GMT-0500 (hora de Ecuador) a 05/01/2024

        // Fecha en formato ISO 8601
        const fechaISO = mantenimientoPreventivo.dt_fecha_inicio;
        const fechaISO2 = mantenimientoPreventivo.dt_fecha_fin;
        // Fecha en formato UTC
        const fechaUTC = new Date(fechaISO);
        const fechaUTC2 = new Date(fechaISO2);

        //doy formato dia/mes/año

        const dia = fechaUTC.getDate();
        const mes = fechaUTC.getMonth() + 1;
        const anio = fechaUTC.getFullYear();
        const dia2 = fechaUTC2.getDate();
        const mes2 = fechaUTC2.getMonth() + 1;
        const anio2 = fechaUTC2.getFullYear();

        const fechaFormato = dia + "/" + mes + "/" + anio;
        const fechaFormato2 = dia2 + "/" + mes2 + "/" + anio2;


        //agrego las fechas en formato dia/mes/año al objeto

        mantenimientoPreventivo.dt_fecha_inicio = fechaFormato
        mantenimientoPreventivo.dt_fecha_fin = fechaFormato2

        return mantenimientoPreventivo;
    } catch (error) {
        console.log(error.message);
    }
}

async function obtenerBienesMantenimientoPreventivoPorPlanificacion(int_planificacion_id) {
    try {
        //hallo el registro findOne para hallar el int_nivel_mantenimiento_id

        const mantenimientoPreventivo = await MantenimientoPreventivo.findOne({
            where: {
                int_planificacion_id
            },
            raw: true
        })

        //hallo la descripcion del nivel

        const nivelM = await nivelMantenimiento.findOne({
            where: {
                int_nivel_mantenimiento_id: mantenimientoPreventivo.int_nivel_mantenimiento_id
            },
            raw: true
        })
        console.log("nivel", nivelM)

        //agrego la descripcion al objeto

        mantenimientoPreventivo.str_nivel_mantenimiento_descripcion = nivelM.str_nivel_mantenimiento_descripcion

        //hallo los bienes que estan el PlanifiacionBien

        const planificacionBien = await MantenimientoPreventivo.findAll({
            where: { int_planificacion_id },
            raw: true
        })

        console.log('entra??? lalalalal --->', planificacionBien)

        //hallo los datos de los bienes

        for (let i = 0; i < planificacionBien.length; i++) {

            let bien = await Bienes.findOne({
                where: {
                    str_codigo_bien: planificacionBien[i].str_codigo_bien,
                    int_bien_estado_historial: 1
                },
                raw: true
            })

            //agrego los datos de los bienes al objeto

            planificacionBien[i].str_bien_nombre = bien.str_bien_nombre

            let custodioBien = await CustodiosBien.findOne({ raw: true, where: { int_bien_id: bien.int_bien_id, str_persona_bien_activo: true }, attributes: ["int_custodio_id"] });
            console.log("custodioBien", custodioBien)
            let custodio = await Custodios.findOne({ raw: true, where: { int_custodio_id: custodioBien.int_custodio_id }, attributes: ["str_custodio_nombre"] });

            //agrego el custodio al objeto

            planificacionBien[i].str_custodio_nombre = custodio.str_custodio_nombre

        }

        //agrego los bienes al objeto


        mantenimientoPreventivo.planificacionBien = planificacionBien

        //hallo  la informacion de Planificacion 

        const dataPlanificacion = await Planificacion.findOne({
            where: { int_planificacion_id },
            raw: true
        })

        //agrego la informacion de Planificacion al objeto

        mantenimientoPreventivo.str_planificacion_codigo = dataPlanificacion.str_planificacion_codigo
        mantenimientoPreventivo.dt_fecha_inicio = dataPlanificacion.dt_fecha_inicio
        mantenimientoPreventivo.dt_fecha_fin = dataPlanificacion.dt_fecha_fin
        mantenimientoPreventivo.str_planificacion_centro = dataPlanificacion.str_planificacion_centro



        //transformar las fechas de 2024-01-05T00:00:00.000Z -hu Jan 04 2024 19:00:00 GMT-0500 (hora de Ecuador) a 05/01/2024

        // Fecha en formato ISO 8601
        const fechaISO = mantenimientoPreventivo.dt_fecha_inicio;
        const fechaISO2 = mantenimientoPreventivo.dt_fecha_fin;
        // Fecha en formato UTC
        const fechaUTC = new Date(fechaISO);
        const fechaUTC2 = new Date(fechaISO2);

        //doy formato dia/mes/año

        const dia = fechaUTC.getDate();
        const mes = fechaUTC.getMonth() + 1;
        const anio = fechaUTC.getFullYear();
        const dia2 = fechaUTC2.getDate();
        const mes2 = fechaUTC2.getMonth() + 1;
        const anio2 = fechaUTC2.getFullYear();

        const fechaFormato = dia + "/" + mes + "/" + anio;
        const fechaFormato2 = dia2 + "/" + mes2 + "/" + anio2;


        //agrego las fechas en formato dia/mes/año al objeto

        mantenimientoPreventivo.dt_fecha_inicio = fechaFormato
        mantenimientoPreventivo.dt_fecha_fin = fechaFormato2

        return mantenimientoPreventivo;
    } catch (error) {
        console.log(error.message);
    }

}






export default {
    obtenerBienesMantenimientoCorrectivoPorFechas,
    obtenerMantenimientosCorrectivosPorCodigoBien,
    obtenerMantenimientosCorrectivosPorTecnicoFechas,
    obtenerBienesMantenimientoPreventivoPorPlanificacion,
    obtenerMantenimientoPreventivoPorCentro
}

