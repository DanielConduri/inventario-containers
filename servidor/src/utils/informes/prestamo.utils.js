import PdfkitConstruct from "pdfkit-table";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generarPDFInformePrestamo(contenido) {
  const headerImage1 = path.join(__dirname, "../recursos/Banderin.png");
  const headerImage2 = path.join(__dirname, "../recursos/Espoch-Dtic.png");
  const footerImage1 = path.join(__dirname, "../recursos/PieDePágina.png");

  return new Promise((resolve, reject) => {
    const doc = new PdfkitConstruct({
      size: "A4",
      margins: { top: 175, left: 75, right: 75, bottom: 100 },
      bufferPages: true,
      layout: "portrait",
    });
    var fecha = new Date();
    var options = { year: "numeric", month: "long", day: "numeric" };
    let asunto = `Por medio de la presente, yo, ${contenido.prestamo.str_prestamo_persona_nombre
      }, con número de cédula ${contenido.prestamo.int_prestamo_persona_id
      } solicito el préstamo del o los equipos descritos a continuación, para el día ${contenido.fecha.dt_fecha_prestamo.toLocaleDateString(
        "es-ES",
        options
      )}.`;
    let sizeLetra = 12;
    let colorTexto = 'black';
    let sizeLetraTabla = 9;

    // Función para agregar encabezado y pie de página
    const addHeaderAndFooter = () => {
    };
    doc.image(headerImage1, 25, 0, { fit: [100, 100] });
    doc.image(headerImage2, 80, 50, { fit: [160, 160] });
    doc.image(footerImage1, 150, doc.page.height - 75, { fit: [290, 290] });
    const titleX = doc.page.width - 260;
    const titleY = 130;
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("SOLICITUD DE PRÉSTAMO ", titleX, titleY, {
      align: "right",
    });
    doc.moveDown(0.5);
    doc.text(`Riobamba ${fecha.toLocaleDateString("es-ES", options)}`, {
      align: "right",
    });
    doc.x = 75;

    // Función para establecer el formato del texto en cada página
    const setTextFormat = () => {
      doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    };

    // Agregar encabezado y pie de página a la primera página
    addHeaderAndFooter();

    doc.moveDown(2);
    setTextFormat();
    doc.text(asunto, {
      align: "justify",
    });
    doc.moveDown(2);
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("Información solicitante", {});
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text('Cargo: ', {
      continued: true,
    });
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.infoCliente.cargo, {
      align: "justify",
    });
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text('Dependencia General: ', {
      continued: true,
    });
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.infoCliente.dependenciaGeneral, {
      align: "justify",
    });
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text('Dependencia Específica: ', {
      continued: true,
    });
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.infoCliente.dependenciaEspecifica, {
      align: "justify",
    });
    doc.moveDown(2);
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("Objetivo de uso de los equipos:", {});
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.prestamo.str_prestamo_objeto_investigacion, {
      align: "justify",
    });
    doc.moveDown(1);
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text('Inducción del equipo: ', {
      continued: true,
    });
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.prestamo.str_prestamo_induccion, {
      align: "justify",
    });
    doc.moveDown(2);
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("Fecha y Hora de Uso del Equipo:", {});
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.fecha.dt_fecha_prestamo.toLocaleDateString("es-ES", options) + " de " + contenido.horario.tm_horario_hora_inicio + " a " + contenido.horario.tm_horario_hora_fin, {  });
    doc.moveDown(2);
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("Características del Equipo o Material:", {align: 'center'});
    doc.moveDown(1);

    // Crear tabla para los bienes
    //
    const table = {
      headers: [
        { label: "Código", property: "codigoBien", width: 50 },
        { label: "Nombre", property: "nombre", width: 150 },
        { label: "Modelo", property: "modelo", width: 150 },
        { label: "Serie", property: "serie", width: 50 },
        { label: "Marca", property: "marca", width: 50 },
      ],
      datas: contenido.bienes,
    };

    // Agregar tabla al documento
    doc.table(table, {
      prepareHeader: () => doc.font("Times-Bold").fontSize(sizeLetraTabla).fillColor(colorTexto),
      prepareRow: (row, i) => doc.font("Times-Roman").fontSize(sizeLetraTabla).fillColor(colorTexto),
      align: "center",
    });


    // estado de los bienes
    // doc.addPage();

    // doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    // doc.text("Estado técnico de los bienes:", {align: 'center'});
    // doc.moveDown(1);

    // const table2 = {
    //   headers: [
    //     { label: "Código", property: "str_codigo_bien", width: 50 },
    //     { label: "Estado Técnico", property: "str_estado_tecnico", width: 350 },
    //   ],
    //   datas: contenido.estadoTecnico,
    // };


    // doc.table(table2, {
    //   prepareHeader: () => doc.font("Times-Bold").fontSize(sizeLetraTabla).fillColor(colorTexto),
    //   prepareRow: (row, i) => doc.font("Times-Roman").fontSize(sizeLetraTabla).fillColor(colorTexto),
    //   align: "center",
    // });

    // doc.moveDown(2);
    // doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    // doc.text("Fecha de Devolución del Equipo:", {});
    // doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    // doc.text(
    //   contenido.fecha.dt_fecha_prestamo.toLocaleDateString("es-ES", options)
    // );
    // doc.moveDown(2);

    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("Autorización:", {});
    doc.moveDown(5);
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.prestamo.str_prestamo_custodio_nombre, {
      align: "center",
    });
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("Custodio", {
      align: 'center'
    });

    doc.moveDown(5);
    doc.font("Times-Roman").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text(contenido.prestamo.str_prestamo_persona_nombre, {
      align: "center",
    });
    doc.font("Times-Bold").fontSize(sizeLetra).fillColor(colorTexto);
    doc.text("Solicitante", {
      align: 'center'
    });

    const pages = doc.bufferedPageRange();
    for (let i = pages.start; i < pages.count; i++) {
      doc.switchToPage(i);
      addHeaderAndFooter();
      setTextFormat(); // Asegurarse de que el formato del texto sea consistente
    }

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






export default generarPDFInformePrestamo;
