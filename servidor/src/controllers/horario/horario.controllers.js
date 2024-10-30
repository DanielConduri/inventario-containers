import { sequelize } from "../../database/database.js";
import { Horario } from "../../models/horario/horario.model.js";
import { Dias } from "../../models/horario/dias.models.js";

export const createHorario = async (req, res) => {
  try {
    const data = req.body;

    // Obtengo los id de los días del modelo Dias
    const dias = await Dias.findAll({ raw: true });

    // Obtener los horarios existentes para el centro
    const existingHorarios = await Horario.findAll({ where: { int_centro_id: data.id_centro }, raw: true });

    // Crear un mapa de horarios existentes para un acceso rápido
    const existingHorarioMap = new Map();
    existingHorarios.forEach(horario => {
      const key = `${horario.int_dia_id}-${horario.tm_horario_hora_inicio}-${horario.tm_horario_hora_fin}`;
      existingHorarioMap.set(key, horario);
    });

    let horariosToCreate = [];
    let horariosToUpdate = [];
    let horariosToInactivate = new Set(existingHorarios.map(horario => horario.int_horario_id));

    for (let i = 0; i < data.horario.length; i++) {
      const dia = data.horario[i];
      const dia_id = dias.find((d) => d.str_dia_nombre === dia.dia).int_dia_id;
      for (let j = 0; j < dia.intervalos.length; j++) {
        const intervalo = dia.intervalos[j];
        
        if (intervalo.id) {
          // Si el intervalo tiene id, agregar al array de actualización
          horariosToUpdate.push({
            int_horario_id: intervalo.id,
            int_centro_id: data.id_centro,
            int_dia_id: dia_id,
            tm_horario_hora_inicio: intervalo.inicio,
            tm_horario_hora_fin: intervalo.fin,
            dt_fecha_actualizacion: new Date(),
            str_horario_estado: 'ACTIVO'
          });

          // Eliminar de la lista de inactivación
          horariosToInactivate.delete(intervalo.id);
        } else {
          // Si el intervalo no tiene id, agregar al array de creación
          horariosToCreate.push({
            int_centro_id: data.id_centro,
            int_dia_id: dia_id,
            tm_horario_hora_inicio: intervalo.inicio,
            tm_horario_hora_fin: intervalo.fin,
            dt_fecha_actualizacion: new Date(),
            str_horario_estado: 'ACTIVO'
          });
        }
      }
    }

    // Actualizar horarios existentes
    for (let horario of horariosToUpdate) {
      await Horario.update(
        {
          int_centro_id: horario.int_centro_id,
          int_dia_id: horario.int_dia_id,
          tm_horario_hora_inicio: horario.tm_horario_hora_inicio,
          tm_horario_hora_fin: horario.tm_horario_hora_fin,
          dt_fecha_actualizacion: horario.dt_fecha_actualizacion,
          str_horario_estado: horario.str_horario_estado
        },
        { where: { int_horario_id: horario.int_horario_id } }
      );
    }

    // Crear nuevos horarios
    if (horariosToCreate.length > 0) {
      await Horario.bulkCreate(horariosToCreate);
    }

    // Inactivar horarios no incluidos
    if (horariosToInactivate.size > 0) {
      await Horario.update(
        {
          str_horario_estado: 'INACTIVO',
          dt_fecha_actualizacion: new Date()
        },
        { where: { int_horario_id: [...horariosToInactivate] } }
      );
    }

    return res.json({
      status: true,
      message: "Horarios procesados exitosamente",
      body: {
        created: horariosToCreate,
        updated: horariosToUpdate,
        inactivated: [...horariosToInactivate]
      }
    });
  } catch (error) {
    console.error("Error processing horarios: ", error.message);
    return res.status(500).json({
      message: "Error processing horarios",
    });
  }
};




export const getHorario = async (req, res) => {
  try {
    const { id_centro } = req.params;
    console.log("id_centro", id_centro);

    const horario = await Horario.findAll({
      where: { int_centro_id: id_centro, str_horario_estado: "ACTIVO"},
      include: [
        {
          model: Dias,
          attributes: ["str_dia_nombre"],
        },
      ],
      order: [
        [Dias, 'str_dia_nombre', 'ASC'],
        ['tm_horario_hora_inicio', 'ASC']
      ]
    });

    if (!horario || horario.length === 0) {
      console.log("No se encontró horario");
      return res.json({
        status: false,
        message: "No se encontró horario",
        body: []
      });
    }

    // Formatear la respuesta
    let horario_formateado = [];
    let dia_actual = null;
    let intervalos = [];

    console.log("Cantidad de registros", horario.length);

    for (let i = 0; i < horario.length; i++) {
      const h = horario[i];
      const nombre_dia = h.tb_dia.str_dia_nombre;

      if (dia_actual !== nombre_dia) {
        if (dia_actual !== null) {
          horario_formateado.push({
            dia: dia_actual,
            intervalos: intervalos,
          });
        }
        dia_actual = nombre_dia;
        intervalos = [];
      }

      intervalos.push({
        id: h.int_horario_id,
        inicio: h.tm_horario_hora_inicio,
        fin: h.tm_horario_hora_fin,
      });
    }

    // Agregar el último día procesado
    if (dia_actual !== null) {
      horario_formateado.push({
        dia: dia_actual,
        intervalos: intervalos,
      });
    }

    return res.json({
      status: true,
      message: "Horario obtenido exitosamente",
      body: horario_formateado,
    });
  } catch (error) {
    console.error("Error al obtener horario: ", error.message);
    return res.status(500).json({
      message: "Error al obtener horario",
    });
  }
};


export default {
  createHorario,
  getHorario,
};
