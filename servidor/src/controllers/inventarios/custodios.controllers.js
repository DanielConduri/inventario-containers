import { sequelize } from "../../database/database.js";
import { Custodios } from "../../models/inventario/custodios.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
const obtenerCustodios = async (req, res) => {
  //Obtener todos las custodios
  try {
    const paginationData = req.query;
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, Custodios, "", "");
      return res.json({
        status: true,
        message: "Custodios encontrados",
        body: datos,
        total: total,
      });
    }
    const custodios = await Custodios.findAll({ limit: 5 });

    if (custodios.length === 0 || !custodios) {
      return res.json({
        status: false,
        message: "No se encontraron custodios",
      });
    } else {
      const { datos, total } = await paginarDatos(
        paginationData.page,
        paginationData.size,
        Custodios,
        paginationData.parameter,
        paginationData.data
      );

      return res.json({
        status: true,
        message: "Custodios obtenidas",
        body: datos,
        total: total,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const obtenerCustodio = async (req, res) => {

  try {
    const { int_bien_id } = req.params;

    const custodio = await sequelize.query(
      `SELECT 
      cst.int_custodio_id,
      cst.str_custodio_cedula,
      cst.str_custodio_nombre,
      cst.str_custodio_activo,
      cb.str_persona_bien_activo,
      cb.dt_fecha_creacion
      FROM inventario.tb_custodio_bien cb
      INNER JOIN inventario.tb_custodios cst ON cst.int_custodio_id = cb.int_custodio_id
      WHERE cb.int_bien_id = ${int_bien_id}`,
      { type: sequelize.QueryTypes.SELECT }
    );

  

    if (!custodio) {
      return res.json({
        status: false,
        message: "No se encontró al custodio",
      });
    }

    return res.json({
      status: true,
      message: "Custodio obtenido correctamente",
      body: custodio,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  obtenerCustodios,
  obtenerCustodio,
};
