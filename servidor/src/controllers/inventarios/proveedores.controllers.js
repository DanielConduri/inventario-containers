import { Proveedores } from "../../models/inventario/proveedores.models.js";
//importar OP de sequelize ;
import { Op } from "sequelize";
const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedores.findAll();
    if (proveedores.length === 0 || !proveedores) {
      return res.json({
        status: false,
        message: "No se encontraron proveedores",
      });
    } else {
      return res.json({
        status: true,
        message: "Proveedores obtenidos",
        body: proveedores,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//actualizar
const obtenerProveedor = async (req, res) => {
  try {
    const { int_proveedor_id } = req.params;
    const proveedor = await Proveedores.findOne({
      where: {
        int_proveedor_id: int_proveedor_id,
      },
    });
    if (!proveedor) {
      return res.json({
        status: false,
        message: "No se encontró el proveedor",
      });
    }
    return res.json({
      status: true,
      message: "Proveedor obtenido correctamente",
      body: proveedor,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const obtenerProveedoresActivos = async (req, res) => {
  try {
    const proveedores = await Proveedores.findAll({
      where: {
        str_proveedor_estado: "ACTIVO",
      },
    });
    if (proveedores.length === 0 || !proveedores) {
      return res.json({
        status: false,
        message: "No se encontraron proveedores activos",
      });
    } else {
      return res.json({
        status: true,
        message: "Proveedores activos obtenidos",
        body: proveedores,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const obtenerRucNombre = async (req, res) => {
  try {
    const { dato } = req.params;
    
    let proveedor = null;
    const ruc = await Proveedores.findOne({
      where: {
        str_proveedor_ruc: dato,
      },
    });
    

    const nombre = await Proveedores.findOne({
      where: {
        str_proveedor_nombre: dato,
      },
    });

   

    if (!ruc && !nombre) {
      return res.json({
        status: false,
        message: "No se encontraron datos coincidentes",
      });
    } else if (ruc) {
      proveedor = ruc;
    } else {
      proveedor = nombre;
    }

    return res.json({
      status: true,
      message: "Proveedor obtenido correctamente",
      body: proveedor,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const insertarProveedores = async (req, res) => {


  try {
    const { str_proveedor_ruc, str_proveedor_nombre } = req.body;
    

    const buscarProveedor = await Proveedores.findOne({
      where: {
        str_proveedor_ruc: str_proveedor_ruc,
      },
    });
    
    if (!buscarProveedor) {
      const nuevoProveedor = await Proveedores.create({
        str_proveedor_ruc,
        str_proveedor_nombre,
      });
      return res.json({
        status: true,
        message: "Proveedor insertado correctamente",
        body: nuevoProveedor,
      });
    } else {
      return res.json({
        status: false,
        message: "El ruc digitado ya se encuentra registrado",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const actualizarProveedores = async (req, res) => {
  const { int_proveedor_id } = req.params;
  const { str_proveedor_ruc, str_proveedor_nombre } = req.body;
  try {
    const proveedores = await Proveedores.findOne({
      where: {
        int_proveedor_id: int_proveedor_id,
      },
    });
    if (!proveedores) {
      return res.json({
        status: false,
        message: "No se encontró el proveedor",
      });
    }
    proveedores.str_proveedor_ruc = str_proveedor_ruc;
    proveedores.str_proveedor_nombre = str_proveedor_nombre;
    await proveedores.save();

    return res.json({
      status: true,
      message: "Proveedor actualizado correctamente",
      body: proveedores,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const eliminarProveedores = async (req, res) => {
  const { int_proveedor_id } = req.params;
  try {
    const proveedores = await Proveedores.findByPk(int_proveedor_id);
    if (!proveedores) {
      return res.json({
        status: false,
        message: "No se encontró el proveedor",
      });
    } else if (proveedores.str_proveedor_estado == "ACTIVO") {
      proveedores.str_proveedor_estado = "INACTIVO";
    } else {
      proveedores.str_proveedor_estado = "ACTIVO";
    }

    await proveedores.save();

    return res.json({
      status: true,
      message: "Proveedor eliminado correctamente",
      body: proveedores,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filtradoProveedores = async (req, res) => {
  try {
   
    const { filter } = req.query;
    //transformar el string en un objeto
    const filtro = JSON.parse(filter);
    let dato = filtro.like.data;
    dato = dato.toUpperCase();
    const estado = filtro.status.data;
    

    //buscar por nombre o por ruc
    const proveedores = await Proveedores.findAll({
      where: {
        [Op.or]: [
          {
            str_proveedor_nombre: {
              [Op.like]: "%" + dato + "%",
            },
          },
          {
            str_proveedor_ruc: {
              [Op.like]: "%" + dato + "%",
            },
          },
        ],
        str_proveedor_estado: estado,
      },
    });
    if (proveedores.length === 0 || !proveedores) {
      return res.json({
        status: false,
        message: "No se encontraron proveedores",
        body: proveedores,
      });
    }
    return res.json({
      status: true,
      message: "Proveedores obtenidos correctamente",
      body: proveedores,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  obtenerProveedores,
  obtenerProveedor,
  obtenerProveedoresActivos,
  obtenerRucNombre,
  insertarProveedores,
  actualizarProveedores,
  eliminarProveedores,
  filtradoProveedores,
};
