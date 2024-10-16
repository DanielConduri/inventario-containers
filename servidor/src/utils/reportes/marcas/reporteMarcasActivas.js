import { fileURLToPath } from "url";
import path from "path";
import PDFDocument from "pdfkit-construct";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generatePDF() {
    return new Promise((resolve, reject) => {
        const headerImage1 = path.join(__dirname, "../../recursos/Banderin.png");
        const headerImage2 = path.join(__dirname, "../../recursos/Espoch-Dtic.png");
        const footerImage1 = path.join(__dirname, "../../recursos/PieDePágina.png");

        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 20, left: 10, right: 10, bottom: 20 },
            bufferPages: true,
        });
        const pdfBuffer = [];
        doc.on('data', (chunk) => {
            pdfBuffer.push(chunk);
        });

        doc.on('end', () => {
            const result = Buffer.concat(pdfBuffer);
            const base64String = result.toString("base64");
            resolve(base64String);
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

        doc.on('pageAdded', () => {
            doc.image(headerImage1, 0, 0, { width: doc.page.width, height: doc.header.options.heightNumber });
            doc.fill("#115dc8")
                .fontSize(20)
                .text("Hello world header", doc.header.x, doc.header.y + 70);
        });

        doc.on('pageAdded', () => {
            doc.image(footerImage1, 0, doc.page.height - doc.footer.options.heightNumber, { width: doc.page.width, height: doc.footer.options.heightNumber });
            doc.fill("#7416c8")
                .fontSize(8)
                .text("Hello world footer", doc.footer.x, doc.footer.y + 10);
        });

        doc.addTable(
            [
                { key: 'name', label: 'Product', align: 'left' },
                { key: 'brand', label: 'Brand', align: 'left' },
                { key: 'price', label: 'Price', align: 'right' },
                { key: 'quantity', label: 'Quantity' },
                { key: 'amount', label: 'Amount', align: 'right' }
            ],
            {
                border: null,
                width: "fill_body",
                striped: true,
                stripedColors: ["#f6f6f6", "#d6c4dd"],
                cellsPadding: 10,
                marginLeft: 45,
                marginRight: 45,
                headAlign: 'center'
            }
        );
        


        doc.end();
    });
}

export default generatePDF;

