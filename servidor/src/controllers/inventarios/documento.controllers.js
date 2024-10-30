import { paginarDatos } from "../../utils/paginacion.utils.js";
import { Documento } from "../../models/inventario/documento.models.js";
import { sequelize } from "../../database/database.js";
import generarInformePDF from "../../utils/informes/informes.utils.js";
import { BienesDocumento } from "../../models/inventario/bienes_documentos.models.js";
import { PersonaDocumento } from "../../models/inventario/persona_documento.models.js";
import { TipoDocumento } from "../../models/inventario/tipo_documento.models.js";
import { Bienes } from "../../models/inventario/bienes.models.js";
import { Personas } from "../../models/seguridad/personas.models.js";
import { Custodios } from "../../models/inventario/custodios.models.js";
import { Op } from "sequelize";
import {  CustodiosBien } from "../../models/inventario/custodios_bienes.models.js";
import generarPDFInforme from "../../utils/informes/informe.js";

 
const obtenerDocumentos = async (req, res) => {
  try {
    const paginationData = req.query;
    if (paginationData.page === "undefined") {
      const { datos, total } = await paginarDatos(1, 10, Documento, "", "");
      return res.json({
        status: true,
        message: "Documentos encontrados",
        body: datos,
        total: total,
      });
    }
    const informes = await Documento.findAll({
      limit: 10,
    });
    if(informes.length === 0){
      return res.json({
        status: false,
        message: "Documentos no encontrados",
      });
    } else {
      const { datos, total } = await paginarDatos(
        paginationData.page,
        paginationData.size,
        Documento,
        paginationData.parameter,
        paginationData.data
      );
      return res.json({
        status: true,
        message: "Documentos encontrados",
        body: datos,
        total: total,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Funcion para obtener un documento y enviar pdf
const obtenerDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    //actualizo la fecha de impresion del documento
    await Documento.update(
      {
        dt_fecha_impresion: new Date(),
      },
      {
        where: {
          int_documento_id: id,
        },
      }
    );
    const informe = await Documento.findOne({
      where: {
        int_documento_id: id,
      },
      raw: true,
    });
    if (!informe) {
      return res.json({
        status: false,
        message: "Documento no encontrado",
      });
    } else {
      //consultar nombre de tipo de documento
      const tipoDocumento = await TipoDocumento.findOne({
        where: {
          int_tipo_documento_id: informe.int_tipo_documento_id,
        },
        raw: true,
      });
      //consultar bienes asociados al documento
      const bienes = await BienesDocumento.findAll({
        where: {
          int_documento_id: informe.int_documento_id,
        },
        raw: true,
      });
      //Consulto la informacion bienes del modelo Bienes
      const bienesInfo = await Promise.all(
        bienes.map(async (bien) => {
          const bienInfo = await Bienes.findOne({
            where: {
              str_codigo_bien: bien.str_codigo_bien,
            },
            raw: true,
          });
          return bienInfo;
        })
      );
      
      //consultar id de todos los  responsables del documento y nombres de los responsables

      const responsables = await PersonaDocumento.findAll({
        where: {
          int_documento_id: informe.int_documento_id,
        },
        raw: true,
      });

      //genero un objeto añadiendo los custodios de cada bien al bien
      const b = await CustodiosBien.findAll({
        where: {
          int_bien_id: 1,
        },
        raw: true,
      });

      const bienesInfoC = await Promise.all(
        bienesInfo.map(async (bien) => {
          
          const custodios = await CustodiosBien.findAll({
            where: {
              int_bien_id: bien.int_bien_id,
            },
            raw: true,
          });

          //consulto a partir de los id de los custodios los nombres de los custodios
          const custodiosNombres = await Promise.all(
            custodios.map(async (custodio) => {
              const custodioNombre = await Custodios.findOne({
                where: {
                  int_custodio_id: custodio.int_custodio_id,
                },
                raw: true,
              });
              return custodioNombre;
            })
          );
          
          //genero un objeto añadiendo los nombres de los custodios al custodio
          let bienC = {
            ...bien,
            custodios: [],
          };
          //añado los nombres de los custodios al array custodios del bien
          custodiosNombres.map((custodio) => {
            bienC.custodios.push(custodio.str_custodio_nombre);
          });


          return bienC;
        })
      );
      //genero un objeto con la informacion del informe
      const informeCompleto = {
        ...informe,
        tipoDocumentoNombre: tipoDocumento.str_tipo_documento_nombre,
        bienes: bienesInfoC,
        responsables: responsables,
      };

      

      //const informePDF = await generarInformePDF(informeCompleto);
    
      const inf = await generarPDFInforme(informeCompleto);
     // const inf = await generarInformePDF(informeCompleto);
      //IMPRIMIR EN EL NAVEGADOR

      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", "inline; filename=informe.pdf");
      // res.send(Buffer.from(inf, "base64"));

     
      
     
      //res.setHeader("Content-Type", "application/pdf");
      res.json({
        status: true,
        message: "Informe generado",
        body: inf,
      });
      
      
      
     //res.send(Buffer.from(informePDF, "base64")); // para ver directamente el pdf en el navegador
    }
    //llamo a un funcion para que me devuelva el informe en base64
    //res.send(Buffer.from(pdfBase64String, 'base64')); // para ver directamente el pdf en el navegador
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const crearDocumento = async (req, res) => {
  
  try {
    const {
      str_documento_titulo,
      str_documento_peticion,
      str_documento_dirigido,
      str_documento_recibe,
      str_documento_introduccion,
      str_documento_desarrollo,
      str_documento_conclusiones,
      str_documento_recomendaciones,
      str_documento_fecha,
      int_tipo_documento_id,
      str_documento_estado,
    } = req.body;
    
    const bienes = req.body.str_codigo_bien;
    const responsables = req.body.id_cas_responsables;
    const nombresResponsables = req.body.str_nombres_responsables;

    //hago una transaccion para que si falla en algun paso no se ejecute nada
    const informes = await sequelize.transaction(async (t) => {
      //Primero ingreso el documento
      const codigoDocumento = await generarCodigoDocumento(
        int_tipo_documento_id
      );
      const informe = await Documento.create(
        {
          int_tipo_documento_id,
          str_documento_id: codigoDocumento,
          str_documento_titulo,
          str_documento_peticion,
          str_documento_dirigido,
          str_documento_recibe,
          str_documento_introduccion,
          str_documento_desarrollo,
          str_documento_conclusiones,
          str_documento_recomendaciones,
          str_documento_fecha,
          str_documento_estado,
          dt_fecha_creacion: new Date(),
        },
        { transaction: t }
      );

      //Inserto en la tabla tb_bienes_documentos con el informe.int_documento_id
      const bienesPromises = bienes.map((bien) => {
        return BienesDocumento.create(
          {
            int_documento_id: informe.int_documento_id,
            str_codigo_bien: bien,
          },
          { transaction: t }
        );
      });
      await Promise.all(bienesPromises);

      //Inserto en la tabla tb_persona_documento con el informe.int_documento_id todos los responsables [1,2,3] y los nombres de los responsables ["juan","pedro","maria"]
    
      const responsablesPromises = responsables.map((responsable, index) => {
        return PersonaDocumento.create(
          {
            int_documento_id: informe.int_documento_id,
            int_per_id: responsable,
            str_per_nombres: nombresResponsables[index],
          },
          { transaction: t }
        );
      });
      await Promise.all(responsablesPromises);

      return informe;

      function generarCodigoDocumento(int_tipo_documento_id) {
        return new Promise(async (resolve, reject) => {
          try {
            //Hallo la cantidad de documentos que hay en la tabla documentos sin importar el tipo
            const documentos = await Documento.findAll({
              raw: true,
            });
            const cantidadDocumentos = documentos.length;
            const codigoDocumento = `DOC-${int_tipo_documento_id}-${
              cantidadDocumentos + 1
            }`;
            resolve(codigoDocumento);
          } catch (error) {
            reject(error);
          }
        });
      }

    });

    
    if (!informes  || informes.length === 0) {
      return res.json({
        status: false,
        message: "Documento no creado",
      });
    }
    return res.json({
      status: true,
      message: "Documento creado",
      body: informes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const actualizarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;


    //Para actualizar un documento debo considerar que se pueden agregar nuevos bienes y personas o ya no sean los mismos
    //por lo tanto debo eliminar los que ya no estan y agregar los nuevos
    //primero elimino los bienes y personas que ya no estan
    //dentro de una transaccion
    const bienes = req.body.str_codigo_bien;
    const responsables = req.body.id_cas_responsables;
    const nombresResponsables = req.body.str_nombres_responsables;

    //En una transaccion elimino los registros de la tabla tb_bienes_documentos y tb_persona_documento
    const informeT = await sequelize.transaction(async (t) => {
      //Elimino los bienes
      await BienesDocumento.destroy(
        {
          where: {
            int_documento_id: id,
          },
        },
        { transaction: t }
      );

      //Elimino las personas
      await PersonaDocumento.destroy(
        {
          where: {
            int_documento_id: id,
          },
        },
        { transaction: t }
      );

      //Actualizo el documento
      const informe = await Documento.update(
        { ...body },
        {
          where: {
            int_documento_id: id,
          },
        },
        { transaction: t }
      );

      //Inserto en la tabla tb_bienes_documentos con el informe.int_documento_id todos los bienes [1,2,3] 
      const bienesPromises = bienes.map((bien) => {
        return BienesDocumento.create(
          {
            int_documento_id: id,
            str_codigo_bien: bien,
          },
          { transaction: t }
        );
      });
      await Promise.all(bienesPromises);
      //Inserto en la tabla tb_persona_documento con el informe.int_documento_id todos los responsables [1,2,3] ademas de los nombres de los responsables
      const responsablesPromises= responsables.map((responsable, index) => {
        return PersonaDocumento.create(
          {
            int_documento_id: id,
            int_per_id: responsable,
            str_per_nombres: nombresResponsables[index],
          },
          { transaction: t }
        );
      });
      await Promise.all(responsablesPromises);
      return informe;
    });
    if (!informeT) {
      return res.json({
        status: false,
        message: "Documento no actualizado",
      });
    }
    return res.json({
      status: true,
      message: "Documento actualizado",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const obtenerDocumentoEspecifico = async (req, res) => {
  try {
    const { id } = req.params;
    const informe = await Documento.findOne({
      where: {
        int_documento_id: id,
      },
      raw: true,
    });

    //de este documento encontrado debo obtener los bienes y las personas
    const personas = await PersonaDocumento.findAll({
      where: {
        int_documento_id: informe.int_documento_id,
      },
      raw: true,
    });
    //debo hallar los bienes
    const bienes = await BienesDocumento.findAll({
      where: {
        int_documento_id: informe.int_documento_id,
      },
      raw: true,
    });

    //debo hallar los nombres de los bienes
    const bienesNombres = await Promise.all(
      bienes.map(async (bien) => {
        const nombre = await Bienes.findOne({
          where: {
            str_codigo_bien: bien.str_codigo_bien,
          },
          raw: true,
        });
        const bienes = {
          ...bien,
          str_bien_nombre: nombre.str_bien_nombre,
        };
        return bienes;
      })
    );

    informe.bienes = bienesNombres;
    //añadir a informe los nombres de los custodios
    informe.personas = personas;
    if (!informe) {
      return res.json({
        status: false,
        message: "Documento no encontrado",
      });
    }

    return res.json({
      status: true,
      message: "Documento encontrado",
      body: informe,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  obtenerDocumentos,
  obtenerDocumento,
  crearDocumento,
  actualizarDocumento,
  obtenerDocumentoEspecifico,
};
