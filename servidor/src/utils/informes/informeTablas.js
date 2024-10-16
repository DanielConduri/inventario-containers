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

    /**
     * 
    doc.addTable(
      [
        { key: "str_codigo_bien", label: "CÓDIGO", align: "center", width: 60 },
        { key: "str_bien_nombre", label: "NOMBRE", align: "center", width: 190 },
        { key: "int_bien_anios_garantia", label: "AÑOS DE GARANTÍA", align: "center" },
        { key: "dt_bien_fecha_compra", label: "FECHA DE COMPRA", align: "center" }
      ],
      contenido,
      {
        headBackground: 'white',
        border: { size: 0.02, color: 'black' },
        marginLeft: 55,
        marginRight: 15,
        cellsFontSize: 7,
        headFontSize: 8,
      }
    );
     */
    doc.font("Times-Bold").fontSize(12)
    doc.addTable(
      [
        {key:"titulo", label:"INFORME TÉCNICO", align:"center", width: 500}
      ],
      [
        {titulo:"INFORME TÉCNICO"},
      ],
      {
        headBackground: 'white',
        
      }
    )
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
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
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
      {
        //damos un tamaño para que este contenido no se sobreponga con el footer
        width: doc.x,
        height: 800,
      }
    );
    //agregamos la informacion de los bienes no en tablas sino en texto plano con saltos de linea
    /**
       * [
    {
      int_bien_id: 8745,
      str_codigo_bien: '722577',
      int_custodio_id: 579,
      int_condicion_bien_id: 3,
      int_bodega_id: 1,
      int_ubicacion_id: 604,
      int_codigo_bien_id: 3,
      int_marca_id: 23,
      int_catalogo_bien_id: 286,
      int_proveedor_id: 7,
      int_bien_numero_acta: 65,
      str_bien_bld_bca: 'BLD',
      str_bien_numero_compromiso: '7264',
      str_bien_estado_acta: 'LEGALIZADO',
      str_bien_contabilizado_acta: 'S',
      str_bien_nombre: 'EQUIPO DE INGENIERIA Y ARQUITECTURA/GPS',
      str_bien_modelo: 'MONTERRA',
      str_bien_serie: '2TG010493',
      str_bien_valor_compra: '755.74',
      str_bien_recompra: 'N',
      str_bien_color: 'NEGRO',
      str_bien_material: 'POLICARBONATO, ACERO INOXIDABLE, COBRE, ALUMINIO',
      str_bien_dimensiones: '7,48X14,96X6,63 CM',
      str_bien_habilitado: 'S',
      str_bien_version: null,
      str_bien_estado: 'APROBADO',
      str_bien_estado_logico: 'ACTIVO',
      str_bien_origen_ingreso: 'COMPRA',
      str_bien_tipo_ingreso: 'ACTA',
      dt_bien_fecha_compra: '01/10/2014',
      str_bien_descripcion: 'ESPOCH, IPEC, ENTERSYSTEMS LATINOAMERICANA DE COMPUTADORAS&SISTEMAS CIA. LTDA., 22 GPS GARMIN MONTERRA, FAC. NO. 0154135, OP. NO. 528-UCP-2014, SOL. REQ. NO. 018-IPEC-2014, ACTA NO. 65, ADJ. DOC. HABILITANTES.',
      str_bien_garantia: 'N',
      int_bien_anios_garantia: 0,
      str_bien_info_adicional: {},
      dt_fecha_creacion: 2023-08-10T06:44:41.934Z,
      custodios: [Array]
    },
    {
      int_bien_id: 34927,
      str_codigo_bien: '722572',
      int_custodio_id: 969,
      int_condicion_bien_id: 3,
      int_bodega_id: 1,
      int_ubicacion_id: 604,
      int_codigo_bien_id: 4,
      int_marca_id: 23,
      int_catalogo_bien_id: 286,
      int_proveedor_id: 13,
      int_bien_numero_acta: 65,
      str_bien_bld_bca: 'BLD',
      str_bien_numero_compromiso: '7264',
      str_bien_estado_acta: 'LEGALIZADO',
      str_bien_contabilizado_acta: 'S',
      str_bien_nombre: 'EQUIPO DE INGENIERIA Y ARQUITECTURA/GPS',
      str_bien_modelo: 'MONTERRA',
      str_bien_serie: '2TG010468',
      str_bien_valor_compra: '755.74',
      str_bien_recompra: 'N',
      str_bien_color: 'NEGRO',
      str_bien_material: 'POLICARBONATO, ACERO INOXIDABLE, COBRE, ALUMINIO',
      str_bien_dimensiones: '7,48X14,96X6,63 CM',
      str_bien_habilitado: 'S',
      str_bien_version: null,
      str_bien_estado: 'APROBADO',
      str_bien_estado_logico: 'ACTIVO',
      str_bien_origen_ingreso: 'COMPRA',
      str_bien_tipo_ingreso: 'ACTA',
      dt_bien_fecha_compra: '01/10/2014',
      str_bien_descripcion: 'ESPOCH, IPEC, ENTERSYSTEMS LATINOAMERICANA DE COMPUTADORAS&SISTEMAS CIA. LTDA., 22 GPS GARMIN MONTERRA, FAC. NO. 0154135, OP. NO. 528-UCP-2014, SOL. REQ. NO. 018-IPEC-2014, ACTA NO. 65, ADJ. DOC. HABILITANTES.',
      str_bien_garantia: 'S',
      int_bien_anios_garantia: 1,
      str_bien_info_adicional: {},
      dt_fecha_creacion: 2023-11-04T00:35:52.980Z,
      custodios: []
    },
    {
      int_bien_id: 9698,
      str_codigo_bien: '3287522',
      int_custodio_id: 198,
      int_condicion_bien_id: 3,
      int_bodega_id: 1,
      int_ubicacion_id: 536,
      int_codigo_bien_id: 7201,
      int_marca_id: 5251,
      int_catalogo_bien_id: 313,
      int_proveedor_id: 1,
      int_bien_numero_acta: 28247,
      str_bien_bld_bca: 'BLD',
      str_bien_numero_compromiso: 'No Aplica',
      str_bien_estado_acta: 'No Aplica',
      str_bien_contabilizado_acta: 'No Aplica',
      str_bien_nombre: 'EQUIPO ELECTRONICO/CPU',
      str_bien_modelo: 'ATX PENTIUM 4',
      str_bien_serie: 'EC61474030535',
      str_bien_valor_compra: '484.00',
      str_bien_recompra: 'N',
      str_bien_color: 'SIN COLOR',
      str_bien_material: '',
      str_bien_dimensiones: '',
      str_bien_habilitado: 'S',
      str_bien_version: null,
      str_bien_estado: 'APROBADO',
      str_bien_estado_logico: 'ACTIVO',
      str_bien_origen_ingreso: 'COMPRA',
      str_bien_tipo_ingreso: 'MATRIZ',
      dt_bien_fecha_compra: '19/03/2007',
      str_bien_descripcion: '.',
      str_bien_garantia: 'N',
      int_bien_anios_garantia: 0,
      str_bien_info_adicional: {},
      dt_fecha_creacion: 2023-08-10T06:44:41.934Z,
      custodios: [Array]
    },
    {
      int_bien_id: 17147,
      str_codigo_bien: '5427522',
      int_custodio_id: 492,
      int_condicion_bien_id: 3,
      int_bodega_id: 1,
      int_ubicacion_id: 456,
      int_codigo_bien_id: 53938,
      int_marca_id: 3526,
      int_catalogo_bien_id: 474,
      int_proveedor_id: 5,
      int_bien_numero_acta: 183,
      str_bien_bld_bca: 'BCA',
      str_bien_numero_compromiso: '13128',
      str_bien_estado_acta: 'LEGALIZADO',
      str_bien_contabilizado_acta: 'S',
      str_bien_nombre: 'BIENES SUJETOS A CONTROL/LICENCIA',
      str_bien_modelo: 'SYMBOLIC MATH TOOLBOX (SMALL)',
      str_bien_serie: 'LIC S/N-090',
      str_bien_valor_compra: '29.68',
      str_bien_recompra: 'N',
      str_bien_color: 'NO APLICA',
      str_bien_material: 'NO APLICA',
      str_bien_dimensiones: 'NO APLICA',
      str_bien_habilitado: 'S',
      str_bien_version: null,
      str_bien_estado: 'APROBADO',
      str_bien_estado_logico: 'ACTIVO',
      str_bien_origen_ingreso: 'COMPRA',
      str_bien_tipo_ingreso: 'ACTA',
      dt_bien_fecha_compra: '18/09/2015',
      str_bien_descripcion: 'ESPOCH-FC-ESCUELA DE FISICA Y MATEMATICA-INGELSI S.A.-FACT.N.16204-COMPRA INFIMA CUANTIA-ADQ.LIC MATLAB PARA CENTROS DE COMPUTO-ORDEN PAGO N.648-UCP-15-ACTA N.183-ADJUTO DOCUMENTOS HABILITANTES',
      str_bien_garantia: 'N',
      int_bien_anios_garantia: 0,
      str_bien_info_adicional: {},
      dt_fecha_creacion: 2023-08-10T06:44:41.934Z,
      custodios: [Array]
    },
    {
      int_bien_id: 25639,
      str_codigo_bien: '19407522',
      int_custodio_id: 134,
      int_condicion_bien_id: 3,
      int_bodega_id: 1,
      int_ubicacion_id: 62,
      int_codigo_bien_id: 53248,
      int_marca_id: 5685,
      int_catalogo_bien_id: 880,
      int_proveedor_id: 9,
      int_bien_numero_acta: 293,
      str_bien_bld_bca: 'BCA',
      str_bien_numero_compromiso: 'No Aplica',
      str_bien_estado_acta: 'LEGALIZADO',
      str_bien_contabilizado_acta: 'S',
      str_bien_nombre: 'BIENES SUJETOS A CONTROL/TARJETA DE RED',
      str_bien_modelo: 'DWA-130',
      str_bien_serie: 'F3WX1D5006011',
      str_bien_valor_compra: '17.55',
      str_bien_recompra: 'N',
      str_bien_color: 'NEGRO',
      str_bien_material: 'PLASTICO',
      str_bien_dimensiones: '(WXDXH): 1.1X 3.4X 0.5 PULGADAS',
      str_bien_habilitado: 'S',
      str_bien_version: null,
      str_bien_estado: 'APROBADO',
      str_bien_estado_logico: 'ACTIVO',
      str_bien_origen_ingreso: 'REG ESIGEF',
      str_bien_tipo_ingreso: 'ACTA',
      dt_bien_fecha_compra: '16/07/2015',
      str_bien_descripcion: 'ESPOCH-VARIAS DEPENDENCIAS-INSTALRED CIA LTDA.-FACT N.220-CONTRATO MODIFICATORIO N.65-DJ-ESPOCH-15-ADQ. DE EQUIPOS ACTIVOS Y PASIVOS DE RED-ORDEN DE PAGO N.297-UCP-15-ACTA N.293-ADJ.DOCUMENTOS HABILITANTES.',
      str_bien_garantia: 'N',
      int_bien_anios_garantia: 0,
      str_bien_info_adicional: {},
      dt_fecha_creacion: 2023-08-10T06:44:41.934Z,
      custodios: [Array]
    },
    {
      int_bien_id: 26,
      str_codigo_bien: '1477522',
      int_custodio_id: 389,
      int_condicion_bien_id: 3,
      int_bodega_id: 1,
      int_ubicacion_id: 793,
      int_codigo_bien_id: 118,
      int_marca_id: 6772,
      int_catalogo_bien_id: 809,
      int_proveedor_id: 7,
      int_bien_numero_acta: 80,
      str_bien_bld_bca: 'BLD',
      str_bien_numero_compromiso: '8038',
      str_bien_estado_acta: 'LEGALIZADO',
      str_bien_contabilizado_acta: 'S',
      str_bien_nombre: 'EQUIPO ELECTRONICO/COMPUTADOR DE ESCRITORIO',
      str_bien_modelo: 'HP PRO DESK 400 G1 MT',
      str_bien_serie: 'MXL4361D9L',
      str_bien_valor_compra: '806.40',
      str_bien_recompra: 'N',
      str_bien_color: 'NEGRO',
      str_bien_material: 'POLICARBONATO, ACERO INOXIDABLE',
      str_bien_dimensiones: '33.7*38.05*10 CM',
      str_bien_habilitado: 'S',
      str_bien_version: null,
      str_bien_estado: 'APROBADO',
      str_bien_estado_logico: 'ACTIVO',
      str_bien_origen_ingreso: 'COMPRA',
      str_bien_tipo_ingreso: 'ACTA',
      dt_bien_fecha_compra: '21/10/2014',
      str_bien_descripcion: 'ESPOCH-CENTRO DE IDIOMAS-ENTERSYSTEMS CIA. LTDA- PAGO DE 67 COMPUTADORES HP PRO DESK 400G1 PARA LA LAB. INFORMTICO, ADJ. FACT. NO. 154751, OP NO.596-UCP-14, SOL. REQ NO. 01-CI-2014, ACTA NO.80, ADJ. DCTOS. HABILITANTE',
      str_bien_garantia: 'N',
      int_bien_anios_garantia: 0,
      str_bien_info_adicional: {},
      dt_fecha_creacion: 2023-08-10T06:44:41.934Z,
      custodios: [Array]
    },
    {
      int_bien_id: 5926,
      str_codigo_bien: '14217522',
      int_custodio_id: 423,
      int_condicion_bien_id: 3,
      int_bodega_id: 1,
      int_ubicacion_id: 124,
      int_codigo_bien_id: 36579,
      int_marca_id: 2806,
      int_catalogo_bien_id: 148,
      int_proveedor_id: 3,
      int_bien_numero_acta: 282299,
      str_bien_bld_bca: 'BCA',
      str_bien_numero_compromiso: 'No Aplica',
      str_bien_estado_acta: 'No Aplica',
      str_bien_contabilizado_acta: 'No Aplica',
      str_bien_nombre: 'BIENES SUJETOS A CONTROL/REGULADOR DE VOLTAJE',
      str_bien_modelo: 'LS1006',
      str_bien_serie: '9611AY00009',
      str_bien_valor_compra: '0.01',
      str_bien_recompra: 'N',
      str_bien_color: 'SIN COLOR',
      str_bien_material: '',
      str_bien_dimensiones: '',
      str_bien_habilitado: 'S',
      str_bien_version: null,
      str_bien_estado: 'APROBADO',
      str_bien_estado_logico: 'ACTIVO',
      str_bien_origen_ingreso: 'MATRIZ1',
      str_bien_tipo_ingreso: 'MATRIZ',
      dt_bien_fecha_compra: '25/10/2007',
      str_bien_descripcion: 'REGULADOR DE VOLTAJE',
      str_bien_garantia: 'N',
      int_bien_anios_garantia: 0,
      str_bien_info_adicional: {},
      dt_fecha_creacion: 2023-08-10T06:44:41.934Z,
      custodios: [Array]
    }
  ],
       */
    //recorro los bienes para extraer la informacion de cada uno y agregarla al pdf

    doc.addContent(
      contenido.bienes.forEach((bien) => {
        //compruebo que el bien no sea null
        if (bien.str_bien_nombre === null) {
          //si es null le asigno un string vacio
          bien.str_bien_nombre = "";
        }
        if (bien.str_bien_modelo === null) {
          //si es null le asigno un string vacio
          bien.str_bien_modelo = "";
        }
        if (bien.str_bien_serie === null) {
          //si es null le asigno un string vacio
          bien.str_bien_serie = "";
        }
        if (bien.str_bien_valor_compra === null) {
          //si es null le asigno un string vacio
          bien.str_bien_valor_compra = "";
        }
        if (bien.str_bien_color === null) {
          //si es null le asigno un string vacio
          bien.str_bien_color = "";
        }
        if (bien.str_bien_material === null) {
          //si es null le asigno un string vacio
          bien.str_bien_material = "";
        }
        if (bien.str_bien_dimensiones === null) {
          //si es null le asigno un string vacio
          bien.str_bien_dimensiones = "";
        }
        if (bien.str_bien_habilitado === null) {
          //si es null le asigno un string vacio
          bien.str_bien_habilitado = "";
        }
        if (bien.str_bien_estado === null) {
          //si es null le asigno un string vacio
          bien.str_bien_estado = "";
        }
        if (bien.str_bien_origen_ingreso === null) {
          //si es null le asigno un string vacio
          bien.str_bien_origen_ingreso = "";
        }
        if (bien.str_bien_tipo_ingreso === null) {
          //si es null le asigno un string vacio
          bien.str_bien_tipo_ingreso = "";
        }
        if (bien.dt_bien_fecha_compra === null) {
          //si es null le asigno un string vacio
          bien.dt_bien_fecha_compra = "";
        }
        if (bien.str_bien_descripcion === null) {
          //si es null le asigno un string vacio
          bien.str_bien_descripcion = "";
        }
        if (bien.str_bien_garantia === null) {
          //si es null le asigno un string vacio
          bien.str_bien_garantia = "";
        }
        if (bien.int_bien_anios_garantia === null) {
          //si es null le asigno un string vacio
          bien.int_bien_anios_garantia = "";
        }
        if (bien.str_bien_info_adicional === null) {
          //si es null le asigno un string vacio
          bien.str_bien_info_adicional = "";
        }

        //doc.moveDown(1);
        doc.font("Times-Bold").text("Nombre : ", { continued: true });
        doc.font("Times-Roman").text(bien.str_bien_nombre, {
          align: "left",
        });
        doc.font("Times-Bold").text("Modelo : ", { continued: true });
        doc.font("Times-Roman").text(bien.str_bien_modelo, {
          align: "left",
        });
        doc.font("Times-Bold").text("Serie : ", { continued: true });
        doc.font("Times-Roman").text(bien.str_bien_serie, {
          align: "left",
        });

        //agregar una division / linea para separar los datos
        doc
          .strokeColor("#000000")
          .lineWidth(1)
          .moveTo(75, doc.y)
          .lineTo(520, doc.y)
          .stroke();
        doc.moveDown(1);
      }),
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
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      //Recomendaciones
      doc.moveDown(1),
      doc.font("Times-Bold").fontSize(12),
      doc.text("5. RECOMENDACIONES", {
        align: "left",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
      }),
      doc.font("Times-Roman").fontSize(12),
      doc.text(contenido.str_documento_desarrollo, {
        align: "justify",
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
