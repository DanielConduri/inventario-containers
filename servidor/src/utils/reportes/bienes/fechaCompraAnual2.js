import PDFDocument from "pdfkit-table";
import PdfkitConstruct from "pdfkit-construct";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*function generarPDFFechaCompraAnual2(contenido, titulo) {
  const headerImage1 = path.join(__dirname, "../../recursos/Banderin.png");
  const headerImage2 = path.join(__dirname, "../../recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "../../recursos/PieDePágina.png");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 0, bottom: 50, left: 25, right: 25 },
      bufferPages: true,
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

    doc.set


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

    //ESTABLECER un header, footer, body del pdf 
    doc.

    // Agregar el título del PDF
    doc.fontSize(18).text(`Reporte por ${titulo}`, { align: "center" }).moveDown(0.5);
    doc.fontSize(10).text(`Ordenado por año`, { align: "center" }).moveDown(0.5);

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
        headers: ["AÑO", "CANTIDAD ADQUIRIDA"],
        rows: filas.map((fila) => [fila.anio, fila.Cantidad]),
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

    doc.pipe()

    doc.end();
  });
}*/

function generarPDFFechaCompraAnual2(contenido, titulo){
  const headerImage1 = path.join(__dirname, "../../recursos/Banderin.png");
  const headerImage2 = path.join(__dirname, "../../recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "../../recursos/PieDePágina.png");

  return new Promise((resolve, reject) => {
    const doc = new PdfkitConstruct({
      size: "A4",
      margins: { top: 10, left: 35,   right: 25, bottom: 10 },
      bufferPages: true,
    });
    var fecha = new Date();
    var options = { year: "numeric", month: "long", day: "numeric"};

    //set the header to render in every page
    doc.setDocumentHeader({height: 200}, () => {
      //imagen
      doc.image(headerImage1, doc.header.x , doc.header.y-10, { width: 50 });
      doc.image(headerImage2, doc.header.x + 60, doc.header.y + 50, {  width: 160});
    });

    doc.setDocumentFooter({height:115}, () => {
      //imagen
      doc.image(footerImage1, doc.footer.x, doc.footer.y + 60);
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
    doc.moveDown(15);
    doc.text('probando', {
      width: 420,
      align: "center",
    });

    const contenido = [
    
      
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" },
      { c: "pdfFechaCompraAnualDos" }
    
    
    
  
    ];

    doc.addTable([{ key: "c", label: "Columna1", align: "left" }], contenido, {
      headBackground: 'white',
      width: 480,
      border: { size: 0.02, color: 'black' },
      marginLeft: 4,
      marginRight: 15,
      cellsFontSize: 7,
      headFontSize: 8,
      options: { x: 150, y: 550 }
    });

    // render tables
    doc.render();

     // this should be the last
    // for this to work you need to set bufferPages to true in constructor options
    //paginas
    doc.setPageNumbers((p, c) => `Página ${p} de ${c}`, "right top");
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
 

  })
}


export default generarPDFFechaCompraAnual2;


