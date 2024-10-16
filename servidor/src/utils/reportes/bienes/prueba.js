import PdfkitConstruct from "pdfkit-construct";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pdfPrueba(contenido, titulo) {
  const headerImage1 = path.join(__dirname, "../../recursos/Banderin.png");
  const headerImage2 = path.join(__dirname, "../../recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "../../recursos/PieDePágina.png");

  return new Promise((resolve, reject) => {
    const doc = new PdfkitConstruct({
      size: "A4",
      margins: { top: 10, left: 35, right: 25, bottom: 10 },
      bufferPages: true,
      //autoFirstPage: true,
    });
    var fecha = new Date();
    var options = { year: "numeric", month: "long", day: "numeric" };
    // set the header to render in every page
    doc.setDocumentHeader({height: 200}, () => {
      //imagen
      doc.image(headerImage1, doc.header.x , doc.header.y-10, { width: 50 });
      doc.image(headerImage2, doc.header.x + 60, doc.header.y + 50, {  width: 160});
    });

    // set the footer to render in every page
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
    
      
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
      { c: "hola" },
    ];

    doc.addTable([{ key: "c", label: "h", align: "left" }], contenido, {
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
  });
}
function getDbData() {
  return new Promise((resolve, reject) => {
    resolve([
      {
        id: 7631,
        SKU: "HEH-9133",
        name: "On Cloud Nine Pillow On Cloud Nine Pillow On Cloud Nine Pillow On Cloud Nine Pillow",
        price: 24.99,
        brand: "FabDecor",
        quantity: 1,
        created_at: "2018-03-03 17:41:13",
      },
      {
        id: 7615,
        SKU: "HEH-2245",
        name: "Simply Sweet Blouse",
        price: 42,
        brand: "Entity Apparel",
        quantity: 2,
        created_at: "2018-03-20 22:24:21",
      },
      {
        id: 8100,
        SKU: "WKS-6016",
        name: "Uptown Girl Blouse",
        price: 58,
        brand: "Entity Apparel",
        quantity: 3,
        created_at: "2018-03-16 21:55:28",
      },
    ]);
  });
}

export default pdfPrueba;
