import { fileURLToPath } from "url";
import path from "path";
import PDFDocument from "pdfkit-table";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generarInformePDF(contenido) {
  const headerImage1 = path.join(__dirname, "../recursos/Banderin.png");

  const headerImage2 = path.join(__dirname, "../recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "../recursos/PieDePágina.png");

  console.log("Llego a generarInformePDF");

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: "A4",
        // autoFirstPage: false,
      });
      //doc.addPage();
      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        const base64String = result.toString("base64");
        resolve(base64String);
      });

      doc.on("error", (error) => {
        reject(error);
      });

    
      // Agrega la fecha y hora actual al lado de la imagen
      const now = new Date(); // Obtiene la fecha y hora actual
      const formattedDate = now.toLocaleString(); // Formatea la fecha y hora como una cadena de texto legible
      let pageNumber = 0;
      //agregar evento para cuando se crea una pagina se agrege el header y el footer
      doc.on("pageAdded", () => {
        pageNumber++;
        // Agregar 2 imagenes de cabecera una alado de otra
        doc.image(headerImage1, {
          fit: [100, 100],
          align: "left",
          valign: "top",
          x: 25,
          y: 0,
        });
        doc.image(headerImage2, {
          fit: [160, 160],
          align: "center",
          valign: "top",
          x: 80,
          y: 50,

        });
        doc.moveDown(10);
        // Agregar imagen de pie de página
        doc.image(footerImage1, {
          fit: [290, 290],
          align: "center",
          valign: "bottom",
          x: 25,
          y: doc.page.height - 300,
        });

      });

      let responsables = "";
      //recorremos los responsables
      contenido.responsables.forEach((responsable) => {
        //compruebo que el responsable no sea null
        if (responsable.str_per_nombres === null) {
          //si es null le asigno un string vacio
          responsable.str_per_nombres = "";
        } else {
          //concatenamos los nombres de los responsables
          responsables += responsable.str_per_nombres + ", ";
        }
      });

      /**
       * {
  int_documento_id: 1,
  str_documento_id: 'DOC-2-1',
  int_tipo_documento_id: 2,
  str_documento_fecha: 'Riobamba, 16 de mayo del 2023 ',
  str_documento_titulo: 'Informe Técnico Sistema Gestión Inventario',
  str_documento_peticion: ' Coordinador',
  str_documento_recibe: 'Ledesma',
  str_documento_introduccion: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas Letraset, las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',
  str_documento_desarrollo: 'El trozo de texto estándar de Lorem Ipsum usado desde el año 1500 es reproducido debajo para aquellos interesados.',
  str_documento_conclusiones: 'Conclusiones',
  str_documento_recomendaciones: 'El trozo de texto estándar de Lorem Ipsum usado desde el año 1500 es reproducido debajo para aquellos interesados. Las secciones 1.10.32 y 1.10.33 de de Finibus Bonorum et Malorum por Cicero son también reproducidas en su forma original exacta, acompañadas por versiones en Inglés de la traducción realizada en 1914 por H. Rackham',
  str_documento_estado: 'ACTIVO',
  dt_fecha_impresion: null,
  dt_fecha_creacion: 2023-06-19T03:08:34.050Z,
  tipoDocumentoNombre: 'Informe Técnico'
}
       */
      //quitamos la ultima coma
      responsables = responsables.slice(0, -2);
      //Tabla Lugar y Fecha
      const tablaInformacion= {
        headers:[""],
        rows:[
          [contenido.str_documento_fecha],
          [contenido.str_documento_titulo],
          [contenido.str_documento_peticion],
          [contenido.str_documento_recibe],
          [responsables]
        ]
      }
      doc.table(tablaInformacion, {
      });
      const table = {
        headers: [
          { label:"Name", property: 'name', width: 60, renderer: null },
          { label:"Description", property: 'description', width: 150, renderer: null }, 
          { label:"Price 1", property: 'price1', width: 100, renderer: null }, 
          { label:"Price 2", property: 'price2', width: 100, renderer: null }, 
          { label:"Price 3", property: 'price3', width: 80, renderer: null }, 
          { label:"Price 4", property: 'price4', width: 63, renderer: (value, indexColumn, indexRow, row) => { return `U$ ${Number(value).toFixed(2)}` } },
        ],
        datas: [
          { description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ', price1: '$1', price3: '$ 3', price2: '$2', price4: '4', name: 'Name 1', },
          { name: 'bold:Name 2', description: 'bold:Lorem ipsum dolor.', price1: 'bold:$1', price3: '$3', price2: '$2', price4: '4', options: { fontSize: 10, separation: true } },
          { name: 'Name 3', description: 'Lorem ipsum dolor.', price1: 'bold:$1', price4: '4.111111', price2: '$2', price3: { label:'PRICE $3', options: { fontSize: 12 } }, },
          ],
        rows: [
          [
            "Apple",
            "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
            "$ 105,99",
            "$ 105,99",
            "$ 105,99",
            "105.99",
          ],
          [
            "Tire",
            "Donec ac tincidunt nisi, sit amet tincidunt mauris. Fusce venenatis tristique quam, nec rhoncus eros volutpat nec. Donec fringilla ut lorem vitae maximus. Morbi ex erat, luctus eu nulla sit amet, facilisis porttitor mi.",
            "$ 105,99",
            "$ 105,99",
            "$ 105,99",
            "105.99",
          ],
        ],
      };
    
      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow) => doc.font("Helvetica").fontSize(8),
      });




      // Crear la tabla fuera del ciclo
      const tableBienes = {
        headers: ["Código", "Nombre", "Modelo", "Serie", "Custodios"],
        rows: [],
      };

      //creo una tabla solo para la informacion adicional
      const tableInfoAdicional = {
        headers: ["Código", "Información Adicional"],
        rows: [],
      };

      /*
      {
    fecha: '2023-07-12',
    encargado: 'JONATHAN DANIEL TENE CONDURI',
    descripcion: '12GB',
    caracteristica: 'RAM'
  }
      */

      //creo una tabla con los campos de la informacion adicional

      const tableCamposInfoAdicional = {
        headers: ["Fecha", "Encargado", "Descripción", "Característica"],
        rows: [],
      };

      let valores = {};
      // Recorrer los bienes
      contenido.bienes.forEach((bien) => {
        console.log("infoAdicional", bien.str_bien_info_adicional);
        let infoAdicional = "";
        if (bien.str_bien_info_adicional !== null) {
          console.log(Object.values(bien.str_bien_info_adicional));
          valores = Object.values(bien.str_bien_info_adicional);

          //recorro los valores del objeto
          valores.forEach((valor) => {
            //recorro los campos del objeto
            for (const [key, value] of Object.entries(valor)) {
              console.log(`${key}: ${value}`);
              const row = [
                valor.fecha,
                valor.encargado,
                valor.descripcion,
                valor.caracteristica,
              ];
            }
            tableCamposInfoAdicional.rows.push(row);
          });

          infoAdicional = JSON.stringify(bien.str_bien_info_adicional);
          //separo los elementos del objeto y los convierto en un array

          infoAdicional = infoAdicional.replace(/"/g, "");
          infoAdicional = infoAdicional.replace(/}/g, "");
          infoAdicional = infoAdicional.replace(/{/g, "");
          infoAdicional = infoAdicional.replace(/]/g, "");
          infoAdicional = infoAdicional.replace(/\[/g, "");
          infoAdicional = infoAdicional.replace(/,/g, ", ");
          infoAdicional = infoAdicional.replace(/:/g, ": ");
          infoAdicional = infoAdicional.replace(/_/g, " ");
          infoAdicional = infoAdicional.replace(/str/g, "");
          infoAdicional = infoAdicional.replace(/int/g, "");
          infoAdicional = infoAdicional.replace(/bool/g, "");
          infoAdicional = infoAdicional.replace(/dt/g, "");
        }
        let custodios = "";
        if (bien.custodios !== null) {
          custodios = bien.custodios.join(", ");
        }
        const row = [
          bien.str_codigo_bien || "No tiene",
          bien.str_bien_nombre || "No tiene",
          bien.str_bien_modelo || "No tiene",
          bien.str_bien_serie || "No tiene",
          custodios,
        ];
        tableBienes.rows.push(row);
        const rowInfoAdicional = [
          bien.str_codigo_bien || "No tiene",
          infoAdicional,
        ];
        tableInfoAdicional.rows.push(rowInfoAdicional);
      });
      doc.moveDown
      // Agregar la tabla al documento
      doc.table(tableBienes, {
      });
      //Agregar la tabla de informacion adicional
      doc.font("Helvetica-Bold").fontSize(12).text("Información Adicional:");
      doc.moveDown(1);
      doc.table(tableCamposInfoAdicional, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
      });
      //Agrego nuevamente los responsables para que firmen el documento pero en una tabla
      doc.moveDown(5);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Responsables:", { align: "justify" });
      doc.moveDown(5);
      let responsablesF = contenido.responsables.map(
        (responsable) => responsable.str_per_nombres
      );
      //imprimir los responsables en el centro de la pagina y debajo de su nombre un espacio para que firmen
      const tableResponsables = {
        headers: ["Nombre", "Firma"],
        rows: [],
      };
      // Recorrer los responsables
      contenido.responsables.forEach((responsable) => {
        const row = [responsable.str_per_nombres || "No tiene", " "];

        tableResponsables.rows.push(row);
      });

      // Agregar la tabla al documento
      doc.table(tableResponsables, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
      });
      doc.end();
    } catch (error) {
      console.log(error);
    }
  });
}

export default generarInformePDF;
