import { TipoDocumento } from "../../models/inventario/tipo_documento.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { Op } from "sequelize";
const obtenerTiposDocumentos = async (req, res) => {
  try {
    const paginationData = req.query;
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, TipoDocumento, "", "");
      return res.json({
        status: true,
        message: "Tipos de documentos encontrados",
        body: datos,
        total: total,
      });
    }
    const tiposDocumentos = await TipoDocumento.findAll({ limit: 10 });
    if (tiposDocumentos.lenght === 0 || !tiposDocumentos) {
      return res.json({
        status: false,
        message: "Tipos de documentos no encontrados",
      });
    } else {
      const { datos, total } = await paginarDatos(
        paginationData.page,
        paginationData.size,
        TipoDocumento,
        paginationData.parameter,
        paginationData.data
      );
      return res.json({
        status: true,
        message: "Tipos de documentos encontrados",
        body: datos,
        total: total,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
const filtrarTiposDocumentos = async (req, res) => {
  try {
    const { filter } = req.query;
    //transformar el string en un objeto
    const filtro = JSON.parse(filter);
    let dato = filtro.like.data;
    dato = dato.toUpperCase();
    const estado = filtro.status.data;
    //buscar con Like por nombre o por id
    const tiposDocumentos = await TipoDocumento.findAll({
      where: {
        [Op.or]: [
          {
            str_tipo_documento_descripcion: {
              [Op.like]: "%" + dato + "%",
            },
          },
          {
            str_tipo_documento_nombre: {
              [Op.like]: "%" + dato + "%",
            },
          },
        ],
        str_tipo_documento_estado: estado,
      },
    });
    if (tiposDocumentos.length === 0 || !tiposDocumentos) {
      return res.json({
        status: false,
        message: "No se encontraron tipos de documentos",
        body: tiposDocumentos,
      });
    }
    return res.json({
      status: true,
      message: "Tipos de documentos obtenidos correctamente",
      body: tiposDocumentos,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
const crearTipoDocumento = async (req, res) => {
  try {
    const { body } = req;
    const nuevoTipoDocumento = await TipoDocumento.create(body);
    if (nuevoTipoDocumento) {
      return res.json({
        status: true,
        message: "Tipo de documento creado correctamente",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const actualizarTipoDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const tipoDocumento = await TipoDocumento.findOne({
            where: {
                int_tipo_documento_id: id,
            },
        });
        if (tipoDocumento) {
            await TipoDocumento.update(body, {
                where: {
                    int_tipo_documento_id: id,
                },
            });
            return res.json({
                status: true,
                message: "Tipo de documento actualizado correctamente",
            });
        }
        return res.json({
            status: false,
            message: "No se encontro el tipo de documento",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const obtenerTipoDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoDocumento = await TipoDocumento.findOne({
            where: {
                int_tipo_documento_id: id,
            },
        });
        if (tipoDocumento) {
            return res.json({
                status: true,
                message: "Tipo de documento encontrado",
                body: tipoDocumento,
            });
        }
        return res.json({
            status: false,
            message: "No se encontro el tipo de documento",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const eliminarTipoDocumento = async (req, res) => {
/*
    try {
        const marca = await Marcas.findOne({
            where: {
                int_marca_id: int_marca_id
            }
        });
        if (!marca) {
            return res.json({
                status: false,
                message: "No se encontró la marca"
            });
        } else if (marca.str_marca_estado == "ACTIVO") {
            marca.str_marca_estado = "INACTIVO";
        } else {
            marca.str_marca_estado = "ACTIVO";
        }
        await marca.save();

        return res.json({
            status: true,
            message: "Marca eliminada correctamente",
            body: marca,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
*/

    try {
      const tipoDocumento = await TipoDocumento.findOne({
        where: {
          int_tipo_documento_id: req.params.id,
        },
      });
      if (!tipoDocumento) {
        return res.json({
          status: false,
          message: "No se encontró el tipo de documento",
        });
      }else if (tipoDocumento.str_tipo_documento_estado == "ACTIVO") {
        tipoDocumento.str_tipo_documento_estado = "INACTIVO";
      }
      else {
        tipoDocumento.str_tipo_documento_estado = "ACTIVO";
      }
      await tipoDocumento.save();
      return res.json({
        status: true,
        message: "Tipo de documento eliminado correctamente",
        body: tipoDocumento,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    


};
export default {
  obtenerTiposDocumentos,
  filtrarTiposDocumentos,
  crearTipoDocumento,
  actualizarTipoDocumento,
  obtenerTipoDocumento,
  eliminarTipoDocumento,
};
