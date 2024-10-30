import { sequelize } from "../../database/database.js";
import { CatalogoBienes } from "../../models/inventario/catalogo_bienes.models.js";
import obtenerPrimeraFila from "../../utils/obtenerHeadersCsv.utils.js";
const upload = multer({ dest: "uploads/" });
import multer from "multer";
import parser from "csv-parser";
import fs from "fs";
import {Op} from "sequelize";
import { eliminarFichero } from "../../utils/eliminarFichero.utils.js";
import { paginarDatos } from "../../utils/paginacion.utils.js";

export const obtenerCatalogoBienes = async (req, res) => {
  
  
  try {
    const paginationData = req.query/*.pagination.substring(8, 17)*/;
    
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, CatalogoBienes,'','');
      
    
      return res.json({
        status: true,
        message: "Bienes encontrados",
        body: datos,
        total: total,
      });
      
    }

    const catalogo_bienes = await CatalogoBienes.findAll({limit:5});
    //const paginationData = JSON.parse(req.query.pagination);
    if (catalogo_bienes.lenght === 0 || !catalogo_bienes) {
      return res.json({
        status: false,
        message: "No se encontraron bienes",
      });
    } else {
      const { datos, total } = await paginarDatos(
        paginationData.page,
        paginationData.size,
        CatalogoBienes,
        paginationData.parameter,
        paginationData.data
      );
      
      return res.json({
        status: true,
        message: "Bienes encontrados",
        body: datos,
        total: total,
      });
    }
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};


export const obtenerCatalogoBien = async (req, res) => {
  try {
    
    const { int_catalogo_bien_id } = req.params;
    
    const catalogo_bien = await CatalogoBienes.findOne({
      where: {
        int_catalogo_bien_id: int_catalogo_bien_id,
      },
    });
    if (!catalogo_bien) {
      return res.json({
        status: false,
        message: "No se encontró el bien",
      });
    }
    return res.json({
      status: true,
      message: "Bien encontrado",
      body: catalogo_bien,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const insertarCatalogoBien = async (req, res) => {
  try {
    const {
      str_catalogo_bien_descripcion,
      str_catalogo_bien_id_bien,
      int_catalogo_bien_item_presupuestario,
      int_catalogo_bien_cuenta_contable,
    } = req.body;
    const catalogo_bien = await CatalogoBienes.create(
      {
        str_catalogo_bien_descripcion,
        str_catalogo_bien_id_bien,
        int_catalogo_bien_item_presupuestario,
        int_catalogo_bien_cuenta_contable,
      },
      {
        fields: [
          "str_catalogo_bien_descripcion",
          "str_catalogo_bien_id_bien",
          "int_catalogo_bien_item_presupuestario",
          "int_catalogo_bien_cuenta_contable",
        ],
      }
    );
    if (catalogo_bien) {
      return res.json({
        status: true,
        message: "Bien creado exitosamente",
        body: catalogo_bien,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const actualizarCatalogoBien = async (req, res) => {
  try {
    
    const { int_catalogo_bien_id } = req.params;
   
    const {
      str_catalogo_bien_descripcion,
      str_catalogo_bien_id_bien,
      int_catalogo_bien_item_presupuestario,
      str_catalogo_bien_cuenta_contable,
    } = req.body;
    const catalogo_bienes = await CatalogoBienes.findAll({
      attributes: [
        "int_catalogo_bien_id",
        "str_catalogo_bien_descripcion",
        "str_catalogo_bien_id_bien",
        "int_catalogo_bien_item_presupuestario",
        "str_catalogo_bien_cuenta_contable",
      ],
      where: {
        int_catalogo_bien_id,
      },
    });
    if (catalogo_bienes.length > 0) {
      catalogo_bienes.forEach(async (catalogo_bien) => {
        await catalogo_bien.update({
          str_catalogo_bien_descripcion,
          str_catalogo_bien_id_bien,
          int_catalogo_bien_item_presupuestario,
          str_catalogo_bien_cuenta_contable,
        });
      });
    }
    return res.json({
      status: true,
      message: "Bien actualizado exitosamente",
      body: catalogo_bienes,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const eliminarCatalogoBien = async (req, res) => {
  try {
    const { int_catalogo_bien_id } = req.params;
    const catalogo_bien = await CatalogoBienes.findOne({
      where: {
        int_catalogo_bien_id,
      },
    });
    if (!catalogo_bien) {
      return res.json({
        status: false,
        message: "No se encontró el bien",
      });
    } else if (catalogo_bien.str_catalogo_bien_estado == "ACTIVO") {
      catalogo_bien.update({
        str_catalogo_bien_estado: "INACTIVO",
      });
    } else {
      catalogo_bien.update({
        str_catalogo_bien_estado: "ACTIVO",
      });
    }
    return res.json({
      status: true,
      message: "Bien actualizado exitosamente",
      body: catalogo_bien,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const importarCatalogoBienes = async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).send("No se ha seleccionado ningún archivo");
    }

    //obtener la primera fila del csv
    const primeraFila = await obtenerPrimeraFila(file.path);
    
    const encabezadosValidos = [
      "id_bien",
      "descripcion",
      "item_presupuestario",
      "cuenta_contable",
    ];
    const headers = Object.keys(primeraFila);
    

    //validar que los encabezados del csv sean válidos
    function validarEncabezados(headers, encabezadosValidos) {
      const separador = /[,;]/;
      const encabezados = headers[0]
        .split(separador)
        .map((encabezado) => encabezado.trim().toLowerCase());
      return encabezados.every((encabezado) =>
        encabezadosValidos.includes(encabezado)
      );
    }

    const sonValidos = validarEncabezados(headers, encabezadosValidos);
    
    if (sonValidos) {
      const arrayCatalogoBienes = await leerArchivoCsv(file.path);
      let CHUNK_SIZE = 0;

      

      //definimos el tamaño del bloque de datos a insertar
      if (arrayCatalogoBienes.length > 10000) {
        let maximo = Math.ceil(arrayCatalogoBienes.length / 10000);
        CHUNK_SIZE = Math.floor(arrayCatalogoBienes.length / maximo);
      } else {
        CHUNK_SIZE = arrayCatalogoBienes.length;
      }
      let index = 0;
      let repetidos = 0;
      //funcion para insertar en bloques de datos
      function insertarBloque() {
        const chunk = arrayCatalogoBienes.slice(index, index + CHUNK_SIZE);
        index += CHUNK_SIZE;

        const promises = chunk.map((item) => {
          return CatalogoBienes.findOrCreate({
            where: {
              str_catalogo_bien_id_bien: item.str_catalogo_bien_id_bien,
            },
            defaults: item,
          }).then(([result, created]) => {
            if (!created) {
              // si el registro ya existe, aumentar el contador
              repetidos++;
              
            }
          });
        });

        //ejecutar todas las promesas en paralelo usando Promise.all()
        Promise.all(promises)
          .then(() => {
            if (index <= arrayCatalogoBienes.length) {
              insertarBloque();
            } else {
              eliminarFichero(file.path);
              return res.json({
                status: true,
                message: "Estado de importación",
                total: arrayCatalogoBienes.length,
                repetidos: repetidos,
                insertados: arrayCatalogoBienes.length - repetidos,
              });
            }
          })
          .catch((error) => {
            console.log("error", error.message);
          });
      }
      insertarBloque();
      
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
function obtenerDatosCsv(path, separador) {
  return new Promise((resolve, reject) => {
    const resultado = [];
    fs.createReadStream(path)
      .pipe(
        parser({
          separator: separador,
          newLine: "\n",
          skipLines: 1,
          headers: [
            "id_bien",
            "descripcion",
            "item_presupuestario",
            "cuenta_contable",
          ],
        })
      )
      .on("data", (row) => {
        const rowToInsert = {
          str_catalogo_bien_id_bien: row.id_bien,
          str_catalogo_bien_descripcion: row.descripcion,
          int_catalogo_bien_item_presupuestario: parseInt(
            row.item_presupuestario
          ),
          str_catalogo_bien_cuenta_contable: row.cuenta_contable,
        };
        resultado.push(rowToInsert);
      })
      .on("end", () => {
        
        resolve(resultado);
        
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
function leerArchivoCsv(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        let separador;
        if (data.includes(";")) {
          separador = ";";
        } else if (data.includes(",")) {
          separador = ",";
        } else {
          reject(
            new Error("No se encontró un separador válido en el archivo CSV.")
          );
        }
        obtenerDatosCsv(path, separador)
          .then((datosCsv) => {
            resolve(datosCsv);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
}

const filtrarCatalogoBienes = async (req, res) => {

  try {

    const { filter } = req.query;
   
    const filtro = JSON.parse(filter);
    const dato = filtro.like.data.toUpperCase();
    const estado = filtro.status.data;



  
    const catalogoBienes = await CatalogoBienes.findAll({
      where: {
        [Op.or]: [
          {
            str_catalogo_bien_id_bien: {
              [Op.like]: "%" + dato + "%",
            }
          },
          {
            str_catalogo_bien_descripcion: {
              [Op.like]: "%" + dato + "%",
            }
          }
        ],
        str_catalogo_bien_estado: estado,
      },
    });

    if(catalogoBienes.length === 0 || !catalogoBienes){
      return res.json({	
        status: false,
        message: "No se encontraron datos",
      });
    }
    return res.json({
      status: true,
      message: "Datos obtenidos correctamente",
      body: catalogoBienes
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default {
  obtenerCatalogoBienes,
  obtenerCatalogoBien,
  insertarCatalogoBien,
  actualizarCatalogoBien,
  eliminarCatalogoBien,
  importarCatalogoBienes,
  filtrarCatalogoBienes,
};
