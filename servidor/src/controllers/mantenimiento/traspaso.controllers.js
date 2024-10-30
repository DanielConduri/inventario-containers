import { Traspaso } from "../../models/mantenimiento/traspaso.models.js";
import { MantenimientoCorrectivo } from "../../models/mantenimiento/mantenimientoCorrectivo.models.js";
import { Personas } from "../../models/seguridad/personas.models.js";
import { personaRol } from "../../models/seguridad/personaRol.models.js";
import { Roles } from "../../models/seguridad/roles.models.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";

const crearTranspaso = async (req, res) => {
    console.log('lo que llega', req.body)
    try {
        const { idMantenimiento, cedulaTecnico } = req.body;

        //comprobar si existe el traspaso
        const traspasoDB = await Traspaso.findOne({
            where: { int_mantenimiento_id: idMantenimiento },
        });

        //busco en la tabla personas el int_per_id dado el nombre del tecnico

        const tecnicoDB = await Personas.findOne({
            where: { str_per_cedula: cedulaTecnico},
        });

        if (!tecnicoDB) {
            return res.json({
                status: false,
                message: "El tecnico no existe",
                body: {},
            });
        }
        const tecnicoRol = await personaRol.findAll({
            where: { int_per_id: tecnicoDB.int_per_id,  },
        });

        const idRolTecnico = await Roles.findOne({
            where: { str_rol_nombre: "TÉCNICO" },
        });

        //recorro tecnicoRol para ir viendo si tiene el idRolTecnico
        let tieneRolTecnico = false;
        for (let i = 0; i < tecnicoRol.length; i++) {
            
            if (tecnicoRol[i].int_rol_id === idRolTecnico.int_rol_id) {
                tieneRolTecnico = true;
                
            }
        }

        if (!tieneRolTecnico) {
            return res.json({
                status: false,
                message: "No tiene el rol de técnico",
                body: {},
            });
        }
        //si encuentra un traspaso con el id de mantenimiento, pongo en estado inactivo al str_traspaso_estado_tecnico ya que se esta creando un nuevo traspaso
        if (traspasoDB) {
            const traspasoUpdate = await Traspaso.update(
                {
                    str_traspaso_estado_tecnico: "INACTIVO",
                },
                {
                    where: { int_mantenimiento_id: idMantenimiento },
                }
            );
        }
        //crear el traspaso
        const traspaso = await Traspaso.create({
        int_mantenimiento_id: idMantenimiento,
        str_traspaso_tecnico: tecnicoDB.str_per_nombres + " " + tecnicoDB.str_per_apellidos,
        });
        //actualizo la tabla MantenimientoCorrectivo
        const mantenimientoUpdate = await MantenimientoCorrectivo.update(
            {
                str_mantenimiento_correctivo_tecnico_responsable: tecnicoDB.str_per_nombres + " "+ tecnicoDB.str_per_apellidos ,
                dt_fecha_actualizacion: new Date(),
            },
            {
                where: { int_mantenimiento_id: idMantenimiento },
            }
        );
        if (traspaso) {
            insertarAuditoria(
                traspasoDB,
                "tb_traspaso",
                "CREATE",
                traspaso,
                req.ip,
                req.headers.host,
                req,
                "Se ha creado un traspaso"
            );
        return res.json({
            status: true,
            message: "Traspaso creado correctamente",
            body: traspaso,
        });
        }
    } catch (error) {
        return res.status(500).json({
        message: `Error al crear el traspaso ${error}`,
        data: {},
        });
    }
}

const historialTraspasoById = async (req, res) => {
    try {
        const { id } = req.params;
        const traspaso = await Traspaso.findAll({
            where: { int_mantenimiento_id: id },
        });
        if (traspaso) {
            return res.json({
                status: true,
                message: "Historial de traspasos",
                body: traspaso,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: `Error al obtener el historial de traspasos ${error}`,
            data: {},
        });
    }
};

export default {
    crearTranspaso,
    historialTraspasoById,
};
