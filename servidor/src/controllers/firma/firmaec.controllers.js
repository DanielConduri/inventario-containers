import fetch from "node-fetch"
import { secondDB } from "../../database/database.js"

const nomenclatura = {
    urldocumentosfirmaEc: "https://apifirmaec.espoch.edu.ec/servicio/documentos/",
    tokenfirmaEc:
        "f397bb11f68fa242581b2c86ce5ed659904e7408660bb5f97e79490a33f3966a",
}

async function firmarDocumento(req, res) {
    const { cedula, listado } = req.body
    console.log("cedula", cedula)
    console.log("listado", listado)
    try {
        const token = await cargardocumentosFirmaEcgeneral(cedula, listado)
        res.json({
            status: "success",
            message: "Se ha enviado la solicitud de firma",
            token,
        })
    } catch (error) {
        return res.status(500).send({
            status: "ERROR",
            message: "No se ha podido enviar la solicitud de firma",
        })
    }
}

export async function cargardocumentosFirmaEcgeneral(cedula, listado) {
    const documentos = []
    let firmaec = {}
    for (const obj of listado) {
        const objfirmaec = {
            nombre: obj.nombre,
            documento: obj.archivo,
        }
        documentos.push(objfirmaec)
    }

    firmaec = {
        cedula,
        sistema: nomenclatura.tokenfirmaEc,
        documentos,
    }
    const token = await fetch(nomenclatura.urldocumentosfirmaEc, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "*/*",
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "X-API-KEY": nomenclatura.tokenfirmaEc,
        },
        body: JSON.stringify(firmaec),
    })
        .then((res) => res.text())
        .catch((e) => {
            console.log("error firma", e)
            return null
        })
    return token
}

async function obtenerSolicitudFirmada(req, res) {
    try {
        const { nombreArchivo } = req.params
        const resultados = await secondDB.query(
            "SELECT arch_codi, nombre, fecha_creacion, tamanio, arch_md5, indi_codi, estado FROM public.archivo where nombre = '" +
            nombreArchivo +
            ".pdf'",
            {
                type: secondDB.QueryTypes.SELECT,
            }
        )
        if (resultados.length === 0) {
            return res.status(404).json({
                status: "failed",
                message:
                    "No se encontró la solicitud seleccionada, o ya expiró el tiempo de firma",
            })
        }

        const codigo = resultados[0].arch_codi
        const archivoFirmado = await secondDB.query(
            "SELECT public.func_recuperar_archivo(" + codigo + ")",
            {
                type: secondDB.QueryTypes.SELECT,
            }
        )

        await secondDB.query(
            "DELETE FROM archivo_0001 where arch_codi = '" + codigo + "'",
            {
                type: secondDB.QueryTypes.SELECT,
            }
        )

        return res.json({
            status: "success",
            body: archivoFirmado,
        })
    } catch (err) {
        // Maneja el error adecuadamente
        console.error(err)
        return res.status(500).json({
            status: "failed",
            message: err.message,
        })
    }
}

export default {
    firmarDocumento,
    obtenerSolicitudFirmada,
}
