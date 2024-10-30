import { Personas } from "../../models/seguridad/personas.models.js";
import { insertarAuditoria } from "../../utils/insertarAuditoria.utils.js";
import jwt from "jsonwebtoken";
import { jwtVariables } from "../../config/variables.config.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { Op } from "sequelize";
import https from "https";
const agent = new https.Agent({ rejectUnauthorized: false }); //Validar credenciales

export const obtenerPersonas = async (req, res) => {

  try {
    const paginationData= req.query;
    if(paginationData.page === "undefined"){
      const { datos, total } = await paginarDatos(1, 10, Personas,'','');
      return res.json({
        status: true,
        message: "Personas encontradas",
        body: datos,
        total: total,
      });
    }
    const personas = await Personas.findAll({limit:5});
    if (personas.lenght === 0 || !personas) {
      return res.json({
        status: false,
        message: "Personas no encontrados",
      });
    } else {
      
      const { datos, total } = await paginarDatos(paginationData.page, paginationData.size, Personas, paginationData.parameter, paginationData.data);
      return res.json({
        status: true,
        message: "Personas encontradas",
        body: datos,
        total: total,
      });
    }
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//filtrado de personas por nombre o cedula
export const filtrarPersonas = async (req, res) => {
  try {
    
    const { filter } = req.query;
    const filtro = JSON.parse(filter);

    let dato = filtro.like.data;
    

    if (isNaN(dato)) {
      //es un nombre o apellido
      dato = dato.toUpperCase();
    }
    const estado = filtro.status.data;

    // buscar por nombre o apellido o cedula
    const personas = await Personas.findAll({
      where: {
        [Op.or]: [
          {
            str_per_nombres: {
              [Op.like]: "%" + dato + "%",
            },
          },
          {
            str_per_apellidos: {
              [Op.like]: "%" + dato + "%",
            },
          },
          {
            str_per_cedula: {
              [Op.like]: "%" + dato + "%",
            },
          },
        ],
        str_per_estado: estado,
      },
    });
    if (personas.lenght === 0 || !personas) {
      return res.json({
        status: false,
        message: "Personas no encontrados",
      });
    } else {
      return res.json({
        status: true,
        message: "Personas encontradas",
        body: personas,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//obtener un persona específico de la BD
export const obtenerPersona = async (req, res) => {
  const { per_id } = req.params;
  try {
    const persona = await Personas.findOne({
      where: {
        int_per_id: per_id,
      },
    });
    
    if (!persona) {
      return res.json({
        status: false,
        message: "Pesona no encotrada",
        body: persona,
      });
    }

    return res.json({
      status: true,
      message: "Persona encotrada",
      body: persona,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Acualizar persona
const actualizarPersona = async (req, res) => {
  try {
    const { per_id } = req.params;
    let { per_cargo, per_telefono } = req.body;
    per_cargo = per_cargo.toUpperCase();
    
    const persona = await Personas.findOne({
      where: {
        int_per_id: per_id,
      },
    });

    if (!validarPersona(per_cargo, per_telefono)) {
      return res.json({
        status: false,
        message: "Debe llenar todos los campos",
      });
    }
    if (!persona || persona.lenght === 0) {
      return res.json({
        status: false,
        message: "Usuario no encontrado",
      });
    }
    persona.str_per_cargo = per_cargo;
    persona.str_per_telefono = per_telefono;
    await persona.save();
    return res.json({
      status: true,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Eliminar persona 
const eliminarPersona = async (req, res) => {
  
  const { token } = req.cookies;
  
  const usuario = jwt.verify(token, jwtVariables.jwtSecret);
  
  const ipCliente = req.ip;
  const nombreHost = req.headers.host;
  const url = req.headers.origin;
  
  console.log('req en eliminar  Persona', req)
  console.log('url', url)
  

  try {
    const { per_id } = req.params;
    const valorAntiguo = await Personas.findByPk(per_id);
    const persona = await Personas.findOne({
      where: {
        int_per_id: per_id,
      },
    });

    if (!persona) {
      return res.json({
        status: false,
        message: "Pesona no encotrada",
      });
    } else if (usuario.idCas == persona.int_per_idcas) {
      
      return res.json({
        status: false,
        message: "No se puede eliminar a si mismo",
      });
    } else {
      if (persona.str_per_estado == "ACTIVO") {
        persona.str_per_estado = "INACTIVO";
      } else {
        persona.str_per_estado = "ACTIVO";
      }

      await persona.save(); //Guarda los cambios en la BD
      const valorNuevo = await Personas.findByPk(per_id);
      
      const idUsuario = usuario.idCas;

      try {
        
        await insertarAuditoria(
          idUsuario,
          valorAntiguo,
          Personas.tableName,
          "DELETE",
          valorNuevo,
          ipCliente,
          nombreHost,
          req
        );
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

      return res.json({
        status: true,
        message: "Estado de persona actualizado correctamente",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const obtenerMiPerfil = async (req, res) => {
 
  try {
    const { token } = req.cookies;
    
    const usuario = jwt.verify(token, jwtVariables.jwtSecret);
    
    const persona = await Personas.findOne({
      where: {
        int_per_idcas: usuario.idCas,
      },
    });

    if (!persona) {
      return res.json({
        status: false,
        message: "Pesona no encotrada",
      });
    }
    res.json({
      status: true,
      message: "Persona encotrada",
      body: persona,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Validar datos
function validarPersona(cargo, estado) {
  if (cargo === "" || estado === "") return 0;
  else return 1;
}

//Funcion pra devolver los datos del usuario

export default {
  obtenerPersonas,
  eliminarPersona,
  obtenerPersona,
  actualizarPersona,
  obtenerMiPerfil,
  filtrarPersonas,
};
