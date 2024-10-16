import PdfkitConstruct from "pdfkit-construct";
import { fileURLToPath } from "url";
import path from "path";
import PDFDocumentWithTables from "pdfkit-table";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generarPDFInforme(contenido) {
  const headerImage1 = path.join(__dirname, "../recursos/Banderin.png");
  const headerImage2 = path.join(__dirname, "../recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "../recursos/PieDePágina.png");

  return new Promise((resolve, reject) => {
    const doc = new PdfkitConstruct({
      size: "A4",
      margins: { top: 10, left: 35, right: 45, bottom: 10 },
      bufferPages: true,
      autoFirstPage: true,
      title: "Informe",
    });
    var fecha = new Date();
    var options = { year: "numeric", month: "long", day: "numeric" };
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
    //quitamos la ultima coma
    responsables = responsables.slice(0, -2);
    // set the header to render in every page
    doc.setDocumentHeader({ height: 250 }, () => {
      //imagen
      doc.image(headerImage1, doc.header.x, doc.header.y - 10, { width: 50 });
      doc.image(headerImage2, doc.header.x + 60, doc.header.y + 50, {
        width: 160,
      });
    });


    //agregar el contenido despues del header y antes del footer
    doc.addContent(
      doc.moveDown(8),
      doc.font("Times-Bold").fontSize(12),
      doc.text("INFORME TÉCNICO", {
        align: "center",
      }),
      doc.moveDown(1),
      //MOVER a la derecha para tener un margen
      console.log(doc.x),
      (doc.x = 75),
      console.log(doc.x),

      doc.font("Times-Bold").fontSize(12),
      doc.text("1. DATOS GENERALES", {
        align: "left",
      }),
      doc.moveDown(1),
      //negrita
      doc.font("Times-Bold").fontSize(12),
      doc.font("Times-Roman").fontSize(12),
      doc.font("Times-Bold").text("Lugar y fecha : ", { continued: true }),
      doc.font("Times-Roman").text(contenido.str_documento_fecha, {
        align: "left",
      }),
      //peticion
      doc.font("Times-Bold").text("Peticionario : ", { continued: true }),
      doc.font("Times-Roman").text(contenido.str_documento_peticion, {
        align: "left",
      }),

      //titulo
      doc.font("Times-Bold").text("Título : ", { continued: true }),
      doc.font("Times-Roman").text(contenido.str_documento_titulo, {
        align: "left",
      }),
      //Dirigido a
      doc.font("Times-Bold").text("Dirigido a : ", { continued: true }),
      doc.font("Times-Roman").text(contenido.str_documento_recibe, {
        align: "left",
      }),
      //responsables
      doc.font("Times-Bold").text("Responsables : ", { continued: true }),
      doc.font("Times-Roman").text(responsables, {
        align: "left",
      }),
      doc.moveDown(1),
      //Introduccion
      doc.font("Times-Bold").fontSize(12),
      doc.text("2. INTRODUCCIÓN", {
        align: "left",
      }),
      doc.moveDown(1),
      //contenido
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_introduccion, {
        align: "justify",
      }),
      doc.moveDown(1),
      //Desarrollo
      doc.font("Times-Bold").fontSize(12),
      doc.text("3. DESARROLLO", {
        align: "left",
      }),
      doc.moveDown(1),
      //contenido
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),

      //Lista de bienes
      doc.moveDown(1),
      doc.font("Times-Bold").fontSize(12),
      doc.text("Lista de bienes", {
        align: "left",
      }),

      doc.moveDown(1),
      
    );
    doc.moveDown(1);
    doc.addContent(
      //tabla
      doc.addPageDoc(),
      doc.addTable(
        [
          {
            key: "str_codigo_bien",
            label: " CÓDIGO ",
            align: "left",
            width: 50,
          },
          { key: "str_bien_modelo", label: "MODELO", align: "center" },
          { key: "str_bien_color", label: "COLOR", align: "center" },
          {
            key: "dt_bien_fecha_compra",
            label: "FECHA DE COMPRA",
            align: "center",
          },
        ],
        contenido.bienes,
        {
          headBackground: "white",
          border: { size: 0.02, color: "black" },
          marginLeft: 100,
          marginRight: 15,
          cellsFontSize: 7,
          headFontSize: 8,
        }
      ),
    )
    doc.moveDown(1);

    doc.addContent(
      //conclusiones y recomendaciones
      //Conclusiones
      doc.moveDown(1),
      doc.font("Times-Bold").fontSize(12),
      doc.text("4. CONCLUSIONES", {
        align: "left",
      }),
      doc.moveDown(1),
      //contenido
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_conclusiones, {
        align: "justify",
      }),
      //Recomendaciones
      doc.moveDown(1),
      doc.font("Times-Bold").fontSize(12),
      doc.text("5. RECOMENDACIONES", {
        align: "left",
      }),
      doc.moveDown(1)
    );
    doc.moveDown(1);
    // set the footer to render in every page
    doc.setDocumentFooter({ height: 100 }, () => {
      //imagen
      doc.image(footerImage1, doc.footer.x + 70, doc.footer.y);
      //fecha
      doc
        .fill("#000000")
        .font("Times-Bold")
        .fontSize(8)
        .text("Generado el ", doc.footer.x + 390, doc.footer.y + 70);
      doc
        .font("Times-Bold")
        .fontSize(8)
        .text(
          fecha.toLocaleDateString("es-ES", options),
          doc.footer.x + 436,
          doc.footer.y + 70,
          {
            width: 420,
            align: "letf",
          }
        );
    });

    doc.render();
    doc.setPageNumbers((p, c) => `${p}/${c}`, "right top");

    //genero el pdf base64 buffer
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
    doc.end();
  });
}

export default generarPDFInforme;