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
      margins: { top: 10, left: 35, right: 25, bottom: 10 },
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

    /**
     *   {
    int_bien_id: 29621,
    str_codigo_bien: '31050246',
    int_custodio_id: 579,
    int_condicion_bien_id: 3,
    int_bodega_id: 1,
    int_ubicacion_id: 604,
    int_codigo_bien_id: 25178,
    int_marca_id: 6772,
    int_catalogo_bien_id: 809,
    int_proveedor_id: 14,
    int_bien_numero_acta: 81,
    str_bien_bld_bca: 'BLD',
    str_bien_numero_compromiso: '4897',
    str_bien_estado_acta: 'LEGALIZADO',
    str_bien_contabilizado_acta: 'S',
    str_bien_nombre: 'EQUIPO ELECTRONICO/COMPUTADOR DE ESCRITORIO',
    str_bien_modelo: 'PRODESK 600 G5 MT',
    str_bien_serie: 'MXL9504XL6',
    str_bien_valor_compra: '1,183.68',
    str_bien_recompra: 'N',
    str_bien_color: 'NEGRO',
    str_bien_material: 'METALICO',
    str_bien_dimensiones: '28X34X18 CM APROXIMADAMENTE',
    str_bien_habilitado: 'S',
    str_bien_version: null,
    str_bien_estado: 'APROBADO',
    str_bien_estado_logico: 'ACTIVO',
    str_bien_origen_ingreso: 'COMPCONTR',
    str_bien_tipo_ingreso: 'ACTA',
    dt_bien_fecha_compra: '10/07/2020',
    str_bien_descripcion: 'ESPOCH-DTIC-AKROS CIA.LTDA-PAGO FACT N.11701 PARA CANCELAR CONT.ADQ.BIEN N.153-DJ-ESPOCH-19-ADQ.COMPUT.PORTATILES Y DE ESCRITORIO PARA VARIAS DEPENDENCIAS DE..OP N.023.DTIC-2020-JUST N.430-UCP-2019-ACTA N.81-ADJ DOC HABILITANTES.',
    str_bien_garantia: 'S',
    int_bien_anios_garantia: 5,
    str_bien_info_adicional: {},
    dt_fecha_creacion: 2023-08-10T06:44:41.934Z
  },
     */

    doc.addTable(
      [
        { key: "str_codigo_bien", label: " CÓDIGO ", align: "left", width:50, },
        { key: "str_bien_modelo", label: "MODELO", align: "center" },
        { key: "str_bien_color", label: "COLOR", align: "center" },
        { key: "dt_bien_fecha_compra", label: "FECHA DE COMPRA", align: "center"},
      ],
      contenido,
      {
        headBackground: "white",
        border: { size: 0.02, color: "black" },
        marginLeft: 100,
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
