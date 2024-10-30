import { Prestamo } from "../../models/prestamos/prestamo.models.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
import { BienesPrestamo } from "../../models/prestamos/bienesPrestamo.models.js";
import { FechaPrestamo } from "../../models/prestamos/fechaPrestamo.models.js";
import { EstadoPrestamo } from "../../models/prestamos/estados.models.js";
import { EstadosPrestamo } from "../../models/prestamos/estadoPrestamo.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { Bienes } from "../../models/inventario/bienes.models.js";
import { Marcas } from "../../models/inventario/marcas.models.js";
import { configVariables } from "../../config/variables.config.js";
import generarPDFInformePrestamo from "../../utils/informes/prestamo.utils.js";
import generarPDFInformePrestamo2 from "../../utils/informes/prestamoExterno.utils.js";
import { Horario } from "../../models/horario/horario.model.js";
import { Centros } from "../../models/departamentos/centros.models.js";

import fetch from "node-fetch";
import https from "https";
import crypto from "crypto";
import { sequelize } from "../../database/database.js";
const httpsAgentOptions = {
    secureOptions: crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
};

httpsAgentOptions.rejectUnauthorized = false;
const httpsAgent = new https.Agent(httpsAgentOptions);

const crearPrestamo = async (req, res) => {
    try {
        const { codigoBien, personaId, personaNombre, objetoInvestigacion, horarioId, fechaPrestamo, estadoId, custodioId, custodioNombre, induccion, fdevolucion, estadoTecnico } = req.body;
        // console.log('ESTADO TECNICO -->', estadoTecnico)
        const fecha = new Date();
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate();
        const prestamoCodigo = `PRESTAMO-${anio}-${mes}-${dia}`;
        const newPrestamo = await Prestamo.create({
            int_prestamo_persona_id: personaId,
            str_prestamo_objeto_investigacion: objetoInvestigacion,
            int_horario_id: horarioId,
            // str_prestamo_observacion: "",
            dt_fecha_creacion: new Date(),
            dt_fecha_actualizacion: new Date(),
            // int_estado_id: estadoId,
            str_prestamo_persona_nombre: personaNombre,
            int_prestamo_custodio_id: custodioId,
            str_prestamo_custodio_nombre: custodioNombre,
            str_prestamo_codigo: prestamoCodigo,
            str_prestamo_induccion: induccion,
            // dt_fecha_salida: fsalida,
            // dt_fecha_devolucion: fdevolucion
        });
        codigoBien.forEach(async (codigo) => {
            const newBienesPrestamo = await BienesPrestamo.create({
                int_prestamo_id: newPrestamo.int_prestamo_id,
                str_codigo_bien: codigo,
                str_estado_tecnico: null
            });
        });



        // estadoTecnico.forEach(async (estado) => {
        //     const estadoTecnicoBien = await BienesPrestamo.create({
        //         int_prestamo_id: newPrestamo.int_prestamo_id,
        //         str_codigo_bien: estado.id,
        //         str_estado_tecnico: estado.estado
        //     });
        // });

        // console.log('lo que tengo que envias aqui --->', fechaPrestamo, fdevolucion)

        const disponiblePrestamo = await FechaPrestamo.create({
            int_prestamo_id: newPrestamo.int_prestamo_id,
            int_horario_id: newPrestamo.int_horario_id,
            dt_fecha_prestamo: fechaPrestamo,
            dt_fecha_devolucion: fdevolucion,
            dt_fecha_creacion_prestamo: new Date(),
            str_estado_fecha_prestamo: "ACTIVO"
        })

        // console.log('DISPONIBLE PRESTAMO -->', disponiblePrestamo)

        // const nombreEstado = await EstadoPrestamo.findOne({
        //     where: {
        //         int_estado_prestamo_id: estadoId
        //     }
        // })

        const newEstadoPrestamo = await EstadosPrestamo.create({
            int_estado_id: estadoId,
            int_prestamo_id: newPrestamo.int_prestamo_id,
            str_prestamo_observacion: "",
            dt_fecha_creacion: new Date(),
            dt_fecha_actualizacion: new Date(),
            str_estados_prestamo_nombre: true,
            int_prestamo_estado: 0
            // str_estados_prestamo_nombre: nombreEstado.str_estado_prestamo_nombre,
        });

        // console.log('ESTADO PRESTAMO -->', newEstadoPrestamo)


        if (newPrestamo, disponiblePrestamo) {
            insertarAuditoria(
                "null",
                "tb_prestamo",
                "INSERT",
                newPrestamo,
                req.ip,
                req.headers.host,
                req,
                "Se ha insertado un prestamo nuevo"
            );
            return res.json({
                status: true,
                message: "Prestamo creado correctamente",
                body: newPrestamo
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al crear el prestamo ${error}`,
            data: {}
        });
    }
}

const obtenerPrestamos = async (req, res) => {
    try {
        const prestamos = await Prestamo.findAll();
        // console.log('entra aqui')
        const prestamosConBienes = await Promise.all(prestamos.map(async (prestamo) => {
            const bienes = await BienesPrestamo.findAll({
                where: {
                    int_prestamo_id: prestamo.int_prestamo_id
                }
            });
            const pretamob = {
                int_prestamo_id: prestamo.int_prestamo_id,
                str_bienes: bienes.map(bien => bien.str_codigo_bien)
            }
            return pretamob;
        }));
        // console.log('si llega aqui ')

        const prestamosConFechas = await Promise.all(prestamos.map(async (prestamo) => {
            const fechas = await FechaPrestamo.findAll({
                where: {
                    int_prestamo_id: prestamo.int_prestamo_id
                }
            });
            const pretamof = {
                int_prestamo_id: prestamo.int_prestamo_id,
                int_horario_id: prestamo.int_horario_id,
                str_fechas: fechas.map(fecha => fecha.dt_fecha_prestamo),
                str_estado_fecha_prestamo: fechas.map(fecha => fecha.str_estado_fecha_prestamo)
            }
            return pretamof;
        }));
        // console.log('PRESTAMOS CON FECHAS -->', pretamof)
        // console.log('que sale aqui -->', prestamosConFechas)

        return res.json({
            status: true,
            message: "Prestamos encontrados",
            prestamos: prestamos,
            prestamosConBienes: prestamosConBienes,
            prestamosConFechas: prestamosConFechas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Error al obtener los prestamos ${error}`,
            data: {}
        });
    }
}

const obtenerPrestamoEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamo = await Prestamo.findOne({
            where: {
                int_prestamo_id: id
            }
        });
        const estadoPrestamo = await EstadoPrestamo.findAll({
            where: {
                int_prestamo_id: id
            }
        });
        const bienesPrestamo = await BienesPrestamo.findAll({
            where: {
                int_prestamo_id: id
            }
        });
        const fechasPrestamo = await FechaPrestamo.findAll({
            where: {
                int_prestamo_id: id
            }
        });
        return res.json({
            status: true,
            message: "Prestamo encontrado",
            prestamo: prestamo,
            estadoPrestamo: estadoPrestamo,
            bienesPrestamo: bienesPrestamo,
            fechasPrestamo: fechasPrestamo
        });
    } catch {
        return res.status(500).json({
            message: `Error al obtener el prestamo ${error}`,
            data: {}
        });

    }
}

const obtenerPrestamosEstado = async (req, res) => {

    try {
        const paginationData = req.query;
        if (paginationData.page === "undefined") {

            let { datos, total } = await paginarDatos(1, 10, Prestamo, "", "");
            // console.log('datos -->', datos)
            let idEstado

            for (let i = 0; i < datos.length; i++) {

                const fechaPrestamo = await FechaPrestamo.findOne({
                    where: {
                        int_prestamo_id: datos[i].int_prestamo_id
                    }
                });
                // console.log('fecha prestamo -->', fechaPrestamo)
                datos[i].dataValues.dt_fecha_prestamo = fechaPrestamo.dt_fecha_prestamo;

                const estadosPrestamo = await EstadosPrestamo.findOne({
                    where: {
                        int_prestamo_id: datos[i].int_prestamo_id,
                        str_estados_prestamo_nombre: true
                    }
                });

                datos[i].dataValues.int_estados_prestamo_id = estadosPrestamo.int_estados_prestamo_id;
                idEstado = estadosPrestamo.dataValues.int_estado_id

                const estadoPrestamo = await EstadoPrestamo.findOne({
                    where: {
                        int_estado_prestamo_id: idEstado
                    }
                });
                console.log('ESTADO PRESTAMO -->', estadoPrestamo)
                datos[i].dataValues.str_estado_prestamo_nombre = estadoPrestamo.str_estado_prestamo_nombre;
            }
            return res.json({
                status: true,
                message: "Prestamos encontrados",
                body: datos,
                total: total
            });
        } else {
            const estadosPrestamos = await Prestamo.findAll({ limit: 10 });
            if (estadosPrestamos.lenght === 0 || !estadosPrestamos) {
                return res.json({
                    status: false,
                    message: "Prestamos no encontrados"
                });
            } else {
                let { datos, total } = await paginarDatos(
                    paginationData.page,
                    paginationData.size,
                    Prestamo,
                    paginationData.parameter,
                    paginationData.data
                );
                let idEstado
                for (let i = 0; i < datos.length; i++) {
                    666

                    const fechaPrestamo = await FechaPrestamo.findOne({
                        where: {
                            int_prestamo_id: datos[i].int_prestamo_id
                        }
                    });
                    // console.log('fecha prestamo -->', fechaPrestamo)
                    datos[i].dataValues.dt_fecha_prestamo = fechaPrestamo.dt_fecha_prestamo;
                    // console.log('antes de la peticion posiblemente mal')
                    // console.log('datos -->', datos[i])
                    // console.log('datos -->', datos[i].int_prestamo_id)
                    const estadosPrestamo = await EstadosPrestamo.findOne({
                        where: {
                            int_prestamo_id: datos[i].int_prestamo_id,
                            str_estados_prestamo_nombre: true
                        }
                    });
                    console.log('ESTADOS PRESTAMO -->', estadosPrestamo)
                    datos[i].dataValues.bl_prestamo_observacion = estadosPrestamo.bl_prestamo_observacion;
                    datos[i].dataValues.int_estados_prestamo_id = estadosPrestamo.int_estados_prestamo_id;
                    idEstado = estadosPrestamo.dataValues.int_estado_id
                    // console.log('ID ESTADO -->', idEstado)

                    const estadoPrestamo = await EstadoPrestamo.findOne({
                        where: {
                            int_estado_prestamo_id: idEstado
                        }
                    });
                    // console.log('ESTADO PRESTAMO -->', estadoPrestamo)
                    datos[i].dataValues.str_estado_prestamo_nombre = estadoPrestamo.str_estado_prestamo_nombre;

                    // datos[i].dataValues.str_estado_prestamo_nombre = estadosPrestamo.str_estado_prestamo_nombre;

                }
                // console.log('datos -->', datos)
                return res.json({
                    status: true,
                    message: "Estados de prestamos encontrados",
                    body: datos,
                    total: total
                });
            }
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const obtenerPrestamoId = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamo = await Prestamo.findOne({
            where: {
                int_prestamo_id: id
            }
        });

        if (!prestamo) {
            return res.json({
                status: false,
                message: "Prestamo no encontrado",
                body: {}
            });
        }

        const bienesPrestamo = await BienesPrestamo.findAll({
            where: {
                int_prestamo_id: id
            }
        });

        const fechasPrestamo = await FechaPrestamo.findAll({
            where: {
                int_prestamo_id: id
            }
        });

        // prestamo.dataValues.bienes = bienesPrestamo;
        prestamo.dataValues.fechas = fechasPrestamo;
        console.log('PRESTAMO -->', prestamo)

        let bienesData = [];
        for (const bien of bienesPrestamo) {
            const bieneData = await Bienes.findOne({
                where: {
                    str_codigo_bien: bien.str_codigo_bien
                }
            });
            bienesData.push(bieneData);
        }
        prestamo.dataValues.bienes = bienesData;

        let idEstado = []
        let Aobservacion = []
        const estadoPrestamo = await EstadosPrestamo.findAll({
            where: {
                int_prestamo_id: id
            }
        });
        // console.log('ESTADO PRESTAMO -->', estadoPrestamo)
        idEstado = estadoPrestamo.map(estado => estado.int_estado_id);
        prestamo.dataValues.int_estado_id = idEstado;
        prestamo.dataValues.estados = estadoPrestamo.map(estado => estado.int_estados_prestamo_id);
        prestamo.dataValues.observacion = estadoPrestamo.map(estado => estado.str_estados_observacion);
        // prestamo.dataValues.paso=estadoPrestamo.map(estado => estado.bl_prestamo_observacion);
        Aobservacion = estadoPrestamo.map(estado => estado.bl_prestamo_observacion);
        // console.log('PRESTAMO -->', prestamo)
        // prestamo.dataValues.proceso = estadoPrestamo.map(estado => estado.int_prestamo_estado);
        prestamo.dataValues.fechaActualizacion
        // console.log('ID ESTADO -->', idEstado)

        const estadoPrestamoActivo = await EstadosPrestamo.findOne({
            where: {
                int_prestamo_id: id,
                str_estados_prestamo_nombre: true
            }
        });
        prestamo.dataValues.proceso = estadoPrestamoActivo.int_prestamo_estado;
        prestamo.dataValues.estado_activo = estadoPrestamoActivo.int_estado_id;
        // console.log('ESTADO PRESTAMO ACTIVO -->', estadoPrestamoActivo)

        for (const activoObservacion of Aobservacion) {
            if(activoObservacion){
                // console.log('observacion activo -->', activoObservacion)
                prestamo.dataValues.paso = activoObservacion;
            } else if(prestamo.dataValues.paso == null) {
                // console.log('observacion activo -->', activoObservacion)
                prestamo.dataValues.paso = null;
            }
        }

        for (const nombre of idEstado) {
            const estadoPrestamoNombre = await EstadoPrestamo.findOne({
                where: {
                    int_estado_prestamo_id: nombre
                }
            });
            // console.log('ESTADO PRESTAMO NOMBRE -->', estadoPrestamoNombre)
            prestamo.dataValues.str_prestamos_estado_nombre = estadoPrestamoNombre.str_estado_prestamo_nombre;

        }

        return res.json({
            status: true,
            message: "Prestamo encontrado",
            body: prestamo
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const actualizarPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const prestamo = await EstadosPrestamo.findOne({
            where: {
                int_prestamo_id: id
            }
        });
        if (prestamo) {
            await EstadosPrestamo.update(body, {
                where: {
                    int_prestamo_id: id
                }
            });
            return res.json({
                status: true,
                message: "Prestamo actualizado correctamente"
            });
        }
        return res.json({
            status: false,
            message: "No se encontro el prestamo"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const desactivarEstadoPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        const nuevoRegistro = await EstadosPrestamo.create({
            str_estados_prestamo_nombre: true,
            int_estado_id: body.int_estado_id,
            str_estados_observacion: body.str_prestamo_observacion,
            dt_fecha_actualizacion: new Date(),
            int_prestamo_id: id,
            int_prestamo_estado: body.int_prestamo_estado,
            bl_prestamo_observacion: body.bl_prestamo_observacion,
            str_estado_fecha_prestamo: "ACTIVO"

        });

        if(body.str_prestamo_revision_custodio){

            const registrarObservaciones = await Prestamo.update({
                str_prestamo_revision_custodio: body.str_prestamo_revision_custodio
            }, {
                where: {
                    int_prestamo_id: id
                }
            });
        }
        if(body.str_prestamo_revision_persona){

            const registrarObservaciones = await Prestamo.update({
                str_prestamo_revision_persona: body.str_prestamo_revision_persona
            }, {
                where: {
                    int_prestamo_id: id
                }
            });
        }
        // antiguo registro

        const antiguo_Registro = await EstadosPrestamo.findOne({
            where: {
                int_prestamo_id: id,
                //str_estados_prestamo_nombre: true
            }
        });

        await EstadosPrestamo.update({
            str_estados_prestamo_nombre: false
        }, {
            where: {
                int_estados_prestamo_id: body.int_estados_prestamo_id
            }
        });

        if (body.int_prestamo_estado == 2) {
            console.log('entra aqui al INACTIVO')
            await FechaPrestamo.update({
                str_estado_fecha_prestamo: "INACTIVO"
            }, {
                where: {
                    int_prestamo_id: id
                }
            });
        }

        await Prestamo.update({
            dt_fecha_actualizacion: new Date()
        }, {
            where: {
                int_prestamo_id: id
            }
        });
        return res.json({
            status: true,
            message: "Estado de prestamo desactivado correctamente"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const bienesPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        let data
        const bienes = await BienesPrestamo.findAll({
            where: {
                str_codigo_bien: id
            }
        });
        console.log('BIENES -->', bienes)

        if (!bienes) {
            return res.json({
                status: false,
                message: "Bienes no encontrados"
            });
        }

        for (const bien of bienes) {

            const fechas = await FechaPrestamo.findAll({
                where: {
                    int_prestamo_id: bien.int_prestamo_id,
                    str_estado_fecha_prestamo: "ACTIVO"
                }
            });
            console.log('FECHAS 1 -->', fechas)
            if(fechas.length > 0){
                data = fechas;
            }
            console.log('FECHAS -->', fechas)
        }
        console.log('DATA -->', data)
        // data.bienes = bienes;
        return res.json({
            status: true,
            message: "Bienes encontrados",
            body: data
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

// const fechasPrestamo = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const fechas = await FechaPrestamo.findAll({
//             where: {
//                 int_prestamo_id: id,
//                 str_estado_fecha_prestamo: "ACTIVO"
//             }
//         });
//         return res.json({
//             status: true,
//             message: "Fechas encontradas",
//             body: fechas
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }


// }

const agregarPDF = async (req, res) => {
    try {
        // console.log('BODY -->', req.body, req.query, req.params)
        const { id } = req.params;
        const { data } = req.body;
        // console.log('ID -->', id)
        // console.log('PDF -->', data)
        const prestamo = await Prestamo.findOne({
            where: {
                int_prestamo_id: id
            }
        });
        if (!prestamo) {
            return res.json({
                status: false,
                message: "Prestamo no encontrado"
            });
        }
        await Prestamo.update({
            str_documento_base64: data
        }, {
            where: {
                int_prestamo_id: id
            }
        });
        return res.json({
            status: true,
            message: "PDF agregado correctamente"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const obtenerDocumentoFirmado = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamo = await Prestamo.findOne({
            where: {
                int_prestamo_id: id
            }
        });
        if (!prestamo) {
            return res.json({
                status: false,
                message: "Prestamo no encontrado"
            });
        }
        return res.json({
            status: true,
            message: "PDF encontrado",
            body: prestamo.str_documento_base64
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const agregarPDFnube = async (req, res) => {
    try {
        const { id } = req.params;
        const { data } = req.body;
        const prestamo = await Prestamo.findOne({
            where: {
                int_prestamo_id: id
            }
        });
        if (!prestamo) {
            return res.json({
                status: false,
                message: "Prestamo no encontrado"
            });
        }
        await Prestamo.update({
            str_direcion_onedrive: data
        }, {
            where: {
                int_prestamo_id: id
            }
        });
        return res.json({
            status: true,
            message: "PDF agregado correctamente"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }


}

const generarPdfPrestamo = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.json({
                status: false,
                message: "No se ha enviado el id del prestamo"
            });
        }

        let data = {}
        const prestamo = await Prestamo.findOne({
            where: {
                int_prestamo_id: id

            },
            raw: true
        });
        if (!prestamo) {
            return res.json({
                status: false,
                message: "Prestamo no encontrado"
            });
        }

        //obtengo el horario
        const horario = await Horario.findOne({
            where: {
                int_horario_id: prestamo.int_horario_id
            },
            raw: true
        });
        //    console.log('HORARIO -->', horario)

        const bienesPrestamo = await BienesPrestamo.findAll({
            where: {
                int_prestamo_id: id
            },
            raw: true
        });

        // const estadoTecnico = await BienesPrestamo.findAll({
        //     where: {
        //         int_prestamo_id: id
        //     },
        //     raw: true
        // });

        // console.log('BIENES PRESTAMO -->', bienesPrestamo)

        let infoBienes = [];

        for (const bien of bienesPrestamo) {
            const bienData = await Bienes.findOne({
                where: {
                    str_codigo_bien: bien.str_codigo_bien
                },
                raw: true
            });
            let marca = await Marcas.findOne({
                where: {
                    int_marca_id: bienData.int_marca_id
                },
                raw: true
            });
            let infoBien = {
                modelo: bienData.str_bien_modelo,
                nombre: bienData.str_bien_nombre,
                serie: bienData.str_bien_serie,
                marca: marca.str_marca_nombre,
                codigoBien: bienData.str_codigo_bien
            }
            infoBienes.push(infoBien);
        }
        const fechaPrestamo = await FechaPrestamo.findOne({
            where: {
                int_prestamo_id: id
            },
            raw: true
        });

        // console.log('infor bienes -->', infoBienes)

        data = {
            prestamo: prestamo,
            bienes: infoBienes,
            fecha: fechaPrestamo,
            horario: horario,
            estadoTecnico: bienesPrestamo
        }
        //obtener informacion del cliente
        // console.log('DATA -->', data)
        const vecPersona = {
            usuSerId: 26,
            usuPassword: '0604508390',
        };

        const url = configVariables.RUTA_TOKEN_TTHH;
        const urlD = configVariables.RUTA_TOKEN_DCF;

        const response = await fetch(url, { agent: httpsAgent, method: 'POST', body: JSON.stringify(vecPersona), headers: { 'Content-Type': 'application/json; charset=utf-8' } }); // genera token y pide info persona
        const body = await response.json();
        const claveServicio = body.token;

        //ahora con este token puedo obtener la informacion del empleado dada la perCedula

        const vecPersona2 = {
            perCedula: prestamo.int_prestamo_persona_id
        };

        // console.log('VEC PERSONA 2 -->', vecPersona2)

        const url2 = configVariables.CARGO_DEPENCENCIA;
        const urlD2 = configVariables.DECANATO;

        const response2 = await fetch(url2, {
            agent: httpsAgent, method: 'POST', body: JSON.stringify(vecPersona2), headers: // se genera informacion de la persona
            {
                'Authorization': 'Bearer ' + claveServicio,
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        const body2 = await response2.json();
        const dataEmpleado = body2;

        // console.log('DATA EMPLEADO -->', dataEmpleado)
        let cargo, dependenciaGeneral, dependenciaEspefica;

        if (dataEmpleado.success == false) {
            cargo = 'Sin cargo';
            dependenciaGeneral = 'Sin dependencia general';
            dependenciaEspefica = 'Sin dependencia especifica';
        }
        else {
            cargo = dataEmpleado.data.contrato.conCargo;
            dependenciaGeneral = dataEmpleado.data.contrato.conDependenciaGeneral;
            dependenciaEspefica = dataEmpleado.data.contrato.conDependenciaEspecifica;
        }

        data.infoCliente = {
            cargo: cargo,
            dependenciaGeneral: dependenciaGeneral,
            dependenciaEspecifica: dependenciaEspefica
        }

        if (prestamo.str_prestamo_tipo == "externo") {

            const periodo = {
                "perid": 1111
            }

            const responToken = await fetch(urlD, { agent: httpsAgent, method: 'POST', body: JSON.stringify(periodo), headers: { 'Content-Type': 'application/json; charset=utf-8' } }); // genera token y pide info persona
            const bodyToken = await responToken.json();
            const claveServicioD = bodyToken.token;

            const centroPrestamo = await Centros.findOne({
                where: {
                    int_centro_id: horario.int_centro_id
                },
                raw: true
            });

            // console.log('CENTRO PRESTAMO -->', centroPrestamo)
            if (!centroPrestamo.str_centro_nombre_facultad) {
                return res.json({
                    status: false,
                    message: "No se encontro la facultad",
                    body: centroPrestamo.str_centro_nombre
                });
            }

            let claveURL = '';
            if (centroPrestamo.str_centro_nombre_facultad == 'INFORMÁTICA Y ELECTRÓNICA') {
                claveURL = 'INFORMÁTICA';
                // peticionDecano('INFORMÁTICA');
            }
            if (centroPrestamo.str_centro_nombre_facultad == 'CIENCIAS') {
                claveURL = 'CIENCIAS';
            }
            const responseD = await fetch(urlD2 + claveURL, {
                agent: httpsAgent, method: 'GET', headers: // se genera informacion de la persona
                {
                    'Authorization': 'Bearer ' + claveServicioD,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })

            const bodyD = await responseD.json();
            const dataDecanato = bodyD;
            // console.log('DATA DECANATO -->', dataDecanato)
            data.infoDecano = dataDecanato.listado[0].strDecano;
            // console.log('INFO -->', data)
        }

        // if (prestamo.str_prestamo_tipo == "interno") {
        //     const pdfBase64String = await generarPDFInformePrestamo(data);
        //     return res.json({
        //         status: true,
        //         message: "PDF generado correctamente",
        //         body: pdfBase64String
        //     });
        // } else {
        //     const pdfBase64String = await generarPDFInformePrestamo2(data);
        //     return res.json({
        //         status: true,
        //         message: "PDF generado correctamente",
        //         body: pdfBase64String
        //     });
        // }

        const pdfBase64String = await generarPDFInformePrestamo(data);

        return res.json({
            status: true,
            message: "PDF generado correctamente",
            body: pdfBase64String
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const peticionDecano = async (req, res) => {

    try {
        const { id } = req.params;

        const centroPrestamo = await Horario.findOne({
            where: {
                int_horario_id: id
            },
            raw: true
        });

        const facultadCentro = await Centros.findOne({
            where: {
                int_centro_id: centroPrestamo.int_centro_id
            },
            raw: true
        });

        // console.log('FACULTAD CENTRO -->', facultadCentro)

        let facultad = '';

        if (facultadCentro.str_centro_nombre_facultad == 'INFORMÁTICA Y ELECTRÓNICA') {
            facultad = 'INFORMÁTICA';
        }
        if (facultadCentro.str_centro_nombre_facultad == 'CIENCIAS') {
            facultad = 'CIENCIAS';
        }

        const urlD = configVariables.RUTA_TOKEN_DCF;
        const urlD2 = configVariables.DECANATO;
        const periodo = {
            "perid": 1111
        }

        const responToken = await fetch(urlD, { agent: httpsAgent, method: 'POST', body: JSON.stringify(periodo), headers: { 'Content-Type': 'application/json; charset=utf-8' } }); // genera token y pide info persona
        const bodyToken = await responToken.json();
        const claveServicioD = bodyToken.token;

        let claveURL = facultad;


        const responseD = await fetch(urlD2 + claveURL, {
            agent: httpsAgent, method: 'GET', headers: // se genera informacion de la persona
            {
                'Authorization': 'Bearer ' + claveServicioD,
                'Content-Type': 'application/json; charset=utf-8'
            }
        })

        const bodyD = await responseD.json();
        const dataDecanato = bodyD;
        // console.log('DATA DECANATO -->', dataDecanato)

        return res.json({
            status: true,
            message: "Informacion recolectada con éxito",
            body: dataDecanato
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }



}

const reporteBienesOcupados = async (req, res) => {
    try {
        const prestamosSinTerminar = await EstadosPrestamo.findAll({
            where: {
                int_estado_id: 1
            }
        });

        for (const prestamo of prestamosSinTerminar) {

            const prestamos = await Prestamo.findOne({
                where: {
                    int_prestamo_id: prestamo.int_prestamo_id
                }
            });


            // const bienesPrestamo = await BienesPrestamo.findAll({
            //     where: {
            //         int_prestamo_id: prestamo.int_prestamo_id
            //     }
            // });
            // console.log('BIENES PRESTAMO -->', bienesPrestamo)
        }

        return res.json({
            status: true,
            message: "Bienes encontrados",
            body: bienes
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const filtrarBienes = async (req, res) => {
    try {
        const { filter } = req.query;
        ('Datos del filtro bienes 2023', filter);
        const filtro = JSON.parse(filter);
        const dato = filtro.like.data.toUpperCase();
        const estado = filtro.status.data;

        const bienes = await sequelize.query(
            `
            SELECT bn.int_bien_id,
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
      bn.str_bien_nombre,
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
      bn.dt_bien_fecha_compra, 
      bn.str_bien_estado_logico,
      bn.str_bien_garantia,
      bn.int_bien_anios_garantia,
      bn.str_bien_info_adicional,
      bn.int_bien_estado_historial,
      mar.str_marca_nombre,
      cusint.str_custodio_interno_nombre,
      ub.str_ubicacion_nombre_interno,
      bn.dt_bien_fecha_compra_interno
      FROM inventario.tb_bienes bn 
      INNER JOIN inventario.tb_condiciones cd ON cd.int_condicion_bien_id = bn.int_condicion_bien_id
      INNER JOIN inventario.tb_ubicaciones ub ON ub.int_ubicacion_id = bn.int_ubicacion_id
      INNER JOIN inventario.tb_codigo_bien codb ON codb.int_codigo_bien = bn.int_codigo_bien_id
      INNER JOIN inventario.tb_catalogo_bienes catb ON catb.int_catalogo_bien_id = bn.int_catalogo_bien_id
      INNER JOIN inventario.tb_marcas mar ON mar.int_marca_id = bn.int_marca_id
      INNER JOIN inventario.tb_bodegas bod ON bod.int_bodega_id = bn.int_bodega_id
      INNER JOIN inventario.tb_custodios cust ON cust.int_custodio_id = bn.int_custodio_id
      INNER JOIN inventario.tb_custodios_internos cusint ON cusint.int_custodio_interno_id = bn.int_custodio_interno_id
       WHERE codb.str_codigo_bien_cod LIKE :dato
          OR bn.str_bien_nombre LIKE :dato
          OR ub.str_ubicacion_nombre LIKE :dato
          OR cust.str_custodio_nombre LIKE :dato
          OR cusint.str_custodio_interno_nombre LIKE :dato
        `,
            {
                replacements: { dato: `%${dato}%` }
            }
        )



        if (bienes.length === 0 || !bienes) {
            return res.json({
                status: false,
                message: "No se encontraron bienes",
            });
        }

        return res.json({
            status: true,
            message: "Datos obtenidos correctamente",
            body: bienes[0]
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ message: error.message });
    }
}

const obtenerHorarioId = async (req, res) => {
    try {
        const { id } = req.params;
        const horario = await Horario.findOne({
            where: {
                int_horario_id: id
            }
        });
        if (!horario) {
            return res.json({
                status: false,
                message: "Horario no encontrado"
            });
        }
        return res.json({
            status: true,
            message: "Horario encontrado",
            body: horario
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default {
    crearPrestamo,
    obtenerPrestamos,
    obtenerPrestamoEstado,
    obtenerPrestamosEstado,
    obtenerPrestamoId,
    actualizarPrestamo,
    desactivarEstadoPrestamo,
    generarPdfPrestamo,
    agregarPDF,
    obtenerDocumentoFirmado,
    agregarPDFnube,
    bienesPrestamo,
    peticionDecano,
    reporteBienesOcupados,
    filtrarBienes,
    obtenerHorarioId
}