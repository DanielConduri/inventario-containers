import PdfkitConstruct from "pdfkit-construct";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generarPDFBienesPorCatalogo(contenido, titulo) {
  const headerImage1 = path.join(__dirname, "../../recursos/Banderin.png");
  const headerImage2 = path.join(__dirname, "../../recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "../../recursos/PieDePágina.png");

  return new Promise((resolve, reject) => {
    const doc = new PdfkitConstruct({
      size: "A4",
      margins: { top: 10, left: 25, right: 25, bottom: 10 },
      bufferPages: true,
      //autoFirstPage: true,
    });
    var fecha = new Date();
    var options = { year: "numeric", month: "long", day: "numeric" };
    // set the header to render in every page
    doc.setDocumentHeader({ height: 150 }, () => {
      //imagen
      doc.image(headerImage1, doc.header.x, doc.header.y - 10, { width: 50 });
      doc.image(headerImage2, doc.header.x + 60, doc.header.y + 50, {
        width: 160,
      });
      doc.moveDown(12);
      doc.font("Times-Bold").fontSize(12);
      doc.text(titulo, {
        align: "center",
      });
      doc.text(contenido[0].str_bien_nombre, {
        align: "center",
      });
    });
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


    doc.addTable(
      [
        { key: "str_codigo_bien", label: " CÓDIGO ", align: "left", width:50 },
        { key: "str_bien_serie", label: "SERIE", align: "center", width:50 },
        { key: "str_bien_modelo", label: "MODELO", align: "center", width:50 },
        { key: "str_bien_color", label: "COLOR", align: "center", width:50 },
        { key: "dt_bien_fecha_compra", label: "FECHA DE COMPRA", align: "center", width:50},
      ],
      contenido,
      {
        headBackground: "white",
        border: { size: 0.02, color: "black" },
        marginLeft: 70,
        marginRight: 15,
        cellsFontSize: 7,
        headFontSize: 8,
      }
    );

    // render tables
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

export default generarPDFBienesPorCatalogo;
