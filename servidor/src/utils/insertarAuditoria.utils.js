import { Auditoria } from "../models/auditoria/auditoria.models.js";
import moment from "moment-timezone";
import jwt from "jsonwebtoken";
import { jwtVariables } from "../config/variables.config.js";


export async function insertarAuditoria(
    valorAntiguo,
    nombreTabla,
    accion,
    valorNuevo,
    ipCliente,
    nombreHost,
    req,
    mensaje
    ) {
    console.log("Ingreso a insertarAuditoria");
    const date = moment().tz("America/Guayaquil");
    console.log(date.format());
    const fecha = date.format("YYYY-MM-DD");
    const hora = date.format("HH:mm:ss");
    //const descripcion = idUsuario+ " elimino a "+valor.int_per_idcas;

    //Personas
    // await Auditoria.create({
    //     int_id_usuario: idUsuario,
    //     dt_fecha: fecha,
    //     str_hora: hora,
    //     str_ip_host: ipCliente,
    //     str_nombre_host: nombreHost,
    //     str_nombre_tabla: nombreTabla,
    //     str_accion: accion,
    //     str_descripcion: descripcion,
    //     str_valor_antiguo: valor.str_per_estado,
    //     str_valor_nuevo: valorNuevo.str_per_estado,
    // });

    
    const usuario = obtenerInformacionUsuario(req)
    const descripcion = usuario.idCas + '' + mensaje;
    
    
    //Bienes
    await Auditoria.create({
        int_id_usuario: usuario.idCas,
        dt_fecha: fecha,
        str_hora: hora,
        str_ip_host: ipCliente,
        str_nombre_host: nombreHost,
        str_nombre_tabla: nombreTabla,
        str_accion: accion,
        str_descripcion: descripcion,
        str_valor_antiguo: valorAntiguo,
        str_valor_nuevo: valorNuevo,
    });


};

function obtenerInformacionUsuario(req) {
    const { token } = req.cookies;
    const usuario = jwt.verify(token, jwtVariables.jwtSecret);
    return usuario
}

export default { insertarAuditoria };