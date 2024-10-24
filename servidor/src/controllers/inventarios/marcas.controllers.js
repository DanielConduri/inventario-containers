import { Marcas } from "../../models/inventario/marcas.models.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";
import { Op } from "sequelize";
const obtenerMarcas = async (req, res) => {
    console.log("ingreso a obtenerMarcas");
    console.log("req.query", req.query);
      //Obtener todos las marcas
    try {
        const paginationData = req.query;
        console.log("paginationData", paginationData.page)
        if (paginationData.page === "undefined") {
            const { datos, total } = await paginarDatos(1, 10, Marcas, '', '');
            return res.json({
                status: true,
                message: "Marcas encontradas",
                body: datos,
                total: total,
            });
        }
        const marcas = await Marcas.findAll({ limit: 5 });
        if (marcas.length === 0 || !marcas) {
            return res.json({
                status: false,
                message: "No se encontraron marcas"
            });
        } else {
            const { datos, total } = await paginarDatos(
                paginationData.page, 
                paginationData.size, 
                Marcas, 
                paginationData.parameter, 
                paginationData.data
            );
                
            return res.json({
                status: true,
                message: "Marcas obtenidas",
                body: datos,
                total: total,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const obtenerMarca = async (req, res) => {
    
    try {
        const { int_marca_id } = req.params;
        console.log('id_marca',int_marca_id);
        const marca = await Marcas.findOne({
            where: {
                int_marca_id: int_marca_id,
            }
        });
        
        if(!marca){
            return res.json({
                status: false,
                message: "No se encontraron marcas"
            });
        }
    
        return res.json({
            status: true,
            message: "Marca obtenida correctamente",
            body: marca,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

const filtrarMarcas = async (req, res) => {

    try {
        const { filter } = req.query;
        console.log('Datos del filtro', filter);
        
        const filtro = JSON.parse(filter);
        const dato = filtro.like.data.toUpperCase();
        const estado = filtro.status.data;
    

        const marcas = await Marcas.findAll({
            where: {
                str_marca_nombre: {
                    [Op.like]: "%" + dato  +"%",
                },
            },
         
                str_marca_estado: estado,
        });
        //console.log("marcas", marcas);
        if (marcas.length === 0 || !marcas) {
          return res.json({
            status: false,
            message: "No se encontraron centros",
          });
        }
        return res.json({
          status: true,
          message: "Marcas obtenidos correctamente",
          body: marcas,
        });
      
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const obtenerMarcasActivas = async (req, res) => {

    const marcas = await Marcas.findAll({
        where: {
            str_marca_estado: "ACTIVO"
        }
    });   //Obtener todos las marcas
    try {
        if (marcas.length === 0 || !marcas) {
            return res.json({
                status: false,
                message: "No se encontraron marcas"
            });
        } else {
            return res.json({
                status: true,
                message: "Marcas obtenidas",
                body: marcas,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const insertarMarcas = async (req, res) => {
    const { str_marca_nombre, str_marca_descripcion } = req.body;
    console.log(req.body);
    try {
        const nuevaMarca = await Marcas.create({
            str_marca_nombre,
            str_marca_descripcion
        });
        return res.json({
            status: true,
            message: "Marca insertada correctamente",
            body: nuevaMarca
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const actualizarMarcas = async (req, res) => {
    console.log("ingreso a actualizar marca");
    //console.log("req.body", req.body);
    const { int_marca_id } = req.params;
    const {str_marca_nombre} = req.body;
    console.log("req.body", req.body);
    //console.Console(req);
    //const str_marca_nombre = "APPLE";
    console.log("id_marca en actualizar", int_marca_id);
    //const { int_marca_id, str_marca_nombre } = req.body;
    try {
        const marca = await Marcas.findOne({
            where: {
                int_marca_id: int_marca_id
            }
        });

        console.log("marca", marca);
        if(!marca || marca.length === 0){
            return res.json({
                status: false,
                message: "No se encontró la marca"
            });
        }
        marca.str_marca_nombre = str_marca_nombre;
        await marca.save();
        return res.json({
            status: true,
            message: "Marca actualizada correctamente",
            body: marca
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

const eliminarMarcas = async (req, res) => {
    const { int_marca_id } = req.params;
    const {str_marca_nombre, str_marca_estado} = req.body;
    console.log("req.body", req.body);
    console.log("id_marca en eliminar", int_marca_id);
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
};


export default {
    obtenerMarcas,
    obtenerMarcasActivas,
    filtrarMarcas,
    insertarMarcas,
    actualizarMarcas,
    eliminarMarcas,
    obtenerMarca,
};