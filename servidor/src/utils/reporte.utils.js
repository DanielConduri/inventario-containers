import PDFDocument from "pdfkit-table";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generarPDF(contenido, titulo) {
  const headerImage1 = path.join(__dirname, "recursos/Banderin.png");
  const headerImage2 = path.join(__dirname, "recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "recursos/PieDePágina.png");
 
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 0, bottom: 50, left: 25, right: 25 },
    });
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
    // Agregar el título del PDF
    doc.fontSize(18).text(`Reporte de ${titulo}`, { align: "center" }).moveDown(0.5);

    const filasPorPagina = 38;
    let paginaActual = 1;

    for (let i = 0; i < contenido.length; i += filasPorPagina) {
      const filas = contenido.slice(i, i + filasPorPagina);

      if (paginaActual !== 1) {
        doc.addPage();
      }

      // Agregar imagen de pie de página
      doc.image(footerImage1, {
        fit: [290, 290],
        align: "center",
        valign: "bottom",
        x: 25,
        y: doc.page.height - 300,
      });

      const table = {
        headers: ["ID", "CANTIDAD"],
        rows: filas.map((fila) => [fila.int_marca_id, fila.Cantidad]),
      };

      doc.table(table, {
        width: 500,
        align: ["center"], // Centrar las celdas horizontalmente
        border: { horizontal: "solid", vertical: "solid" },
        headerBackgroundColor: "#EEEEEE",
        fontSize: 10,
        headerSize: 10,
        lineHeight: 1.2,
        padding: 10,
        x: 50,
        y: 150,
      });

      // Agregar número de página en la parte inferior
      //
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(`Página ${paginaActual}`,280, doc.page.height - 70);

      paginaActual++;
    }

    // Agrega la fecha y hora actual al lado de la imagen
    const now = new Date(); // Obtiene la fecha y hora actual
    const formattedDate = now.toLocaleString(); // Formatea la fecha y hora como una cadena de texto legible

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`Generado: ${formattedDate}`, 425, doc.page.height - 70, {
        align: "left",
      });

    doc.end();
  });
}

export default generarPDF;







