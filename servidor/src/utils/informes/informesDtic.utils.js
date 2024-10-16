
async function certificadoPasoCalificaciones(carrera, periodo, dsvcoddocente, materia, callback) {
    var lst = listado;
    var respuesta = "";

    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    respuesta = ""

    var datosdocentes = await new Promise(resolve => { evaluacion.traerdocentedadocodigo(carrera, dsvcoddocente, (err, valor) => { resolve(valor.recordset); }) });
    var datosfacultad = await new Promise(resolve => { Academic.datosfacultad(carrera, (err, valor) => { resolve(valor.recordset); }) });
    // var datosnivel = await new Promise(resolve => { evaluacion.traerniveldadocodigo(carrera, nivel, (err, valor) => { resolve(valor.recordset); }) });
    var traerperiodo = await new Promise(resolve => { evaluacion.traerperiododadocodigo(carrera, periodo, (err, valor) => { resolve(valor.recordset); }) });
    var traermateria = await new Promise(resolve => { evaluacion.traermateriadadocodigo(carrera, materia, (err, valor) => { resolve(valor.recordset); }) });
    var estudiantesvalidacion = await new Promise(resolve => { Validacion.obtenerestudiantesvalidaciondadoiddocenteymateria(carrera, periodo, dsvcoddocente, materia, (err, valor) => { resolve(valor); }) });
    console.log("Listado de estudiantes");
    console.log(estudiantesvalidacion);
    var listado = [];
    // listado =estudiantesvalidacion.recordset
    console.log('sssssssssss')
    console.log(listado)
    var contador = 0;
    var fechaAsentamiento = "";
    try {


        for (var informacion of estudiantesvalidacion.recordset) {
            contador = contador + 1;
            fechaAsentamiento = informacion.dsvfechaasentamiento;
            let objInformacion = {
                contador: contador,
                dsvcodmateria: informacion.dsvcodmateria,
                dsvcoddocente: informacion.dsvcoddocente,
                dsvnota: informacion.dsvnota,
                materia: informacion.materia,
                dsvidsolicitud: informacion.dsvidsolicitud,
                svalcodestud: informacion.svalcodestud,
                strCedula: informacion.strCedula,
                strNombres: informacion.strApellidos + ' ' + informacion.strNombres,
                strEstado: informacion.dsvnota >= 28 ? 'APROBADO' : 'REPROBADO'
            }
            listado.push(objInformacion);

        }
        var fecha = new Date();
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        const doc = new PdfkitConstruct({
            size: 'A4',
            margins: { top: 10, left: 35, right: 25, bottom: 10 },
            bufferPages: true,
        });

        doc.setDocumentHeader({ height: 250 }, () => {
            var imageespoch = pathimage.join(__dirname, '../public/imagenes/espoch.png')
            doc.image(imageespoch, 30, 26, { width: 95, height: 100 });

            doc.font('Times-Bold').fontSize(12.5).text('ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO', 110, 40,
                {
                    width: 420, align: 'center'
                });
            doc.font('Times-Bold').fontSize(10.5).text('FACULTAD: ' + datosfacultad[0].strnombrefacultad, 150, 95,
                {
                    width: 420, align: 'length'
                });
            doc.font('Times-Bold').fontSize(10.5).text('CARRERA: ' + datosfacultad[0].strNombre.replace('.', ''), 150, 110,
                {
                    width: 420, align: 'length'
                });

            doc.font('Times-Bold').fontSize(10).text('PERÍODO ACADÉMICO: ' + traerperiodo[0].strDescripcion, 150, 80,
                {
                    width: 420, align: 'length'
                });
            doc.font('Times-Bold').fontSize(11.5).text('CALIFICACIONES DE VALIDACIÓN DE CONOCIMIENTO', 180, 55,
                {
                    width: 420, align: 'length'
                });

            doc.font('Times-Bold').fontSize(10.5).text('Asignatura:', doc.header.x, doc.header.y + 145,
                {
                    width: 420, align: 'left'
                });
            doc.font('Times-Roman').fontSize(10.5).text(traermateria[0].strNombre, doc.header.x + 60, doc.header.y + 145,
                {
                    width: 420, align: 'left'
                });
            doc.font('Times-Bold').fontSize(10.5).text('Código:', doc.header.x + 300, doc.header.y + 145,
                {
                    width: 420, align: 'left'
                });
            doc.font('Times-Roman').fontSize(10.5).text(traermateria[0].strCodigo, doc.header.x + 347, doc.header.y + 145,
                {
                    width: 420, align: 'left'
                });
            doc.font('Times-Bold').fontSize(10.5).text('Créditos:', doc.header.x + 450, doc.header.y + 145,
                {
                    width: 420, align: 'left'
                });
            doc.font('Times-Roman').fontSize(10.5).text(traermateria[0].fltCreditos, doc.header.x + 497, doc.header.y + 145,
                {
                    width: 420, align: 'left'
                });
            doc.font('Times-Bold').fontSize(10.5).text('Profesor:', doc.header.x, doc.header.y + 170,
                {
                    width: 420, align: 'left'
                });
            doc.font('Times-Roman').fontSize(10.5).text(datosdocentes[0].strNombres + " " + datosdocentes[0].strApellidos, doc.header.x + 47, doc.header.y + 170,
                {
                    width: 420, align: 'left'
                });


        });
        doc.addTable(
            [
                { key: 'contador', label: ' No ', align: 'center' },
                { key: 'svalcodestud', label: 'Código Est.', align: 'left' },
                { key: 'strCedula', label: 'Cédula', align: 'left' },
                { key: 'strNombres', label: 'Apellidos y Nombres', align: 'left', width: 210, fontSize: 8 },
                { key: 'dsvnota', label: 'Calificación', align: 'center' },
                { key: 'strEstado', label: 'Estado', align: 'center' }
            ],
            listado, {
            headBackground: 'white',
            width: 480,
            border: { size: 0.02, color: 'black' },
            marginLeft: 4,
            marginRight: 15,
            cellsFontSize: 7,
            headFontSize: 8,
            options: { x: 150, y: 550 }

        });


        doc.setDocumentFooter({ height: 115 }, () => {
            doc.polygon([200, 722], [410, 722],);
            doc.stroke();
            doc.fontSize(10.5).text('Observaciones:  ', doc.header.x, doc.header.y + 600,
                {
                    width: 420,
                    align: 'left'
                });
            doc.font('Times-Roman').fontSize(10.5).text('Proceso de validación de conocimiento registro de calificaciones.', doc.header.x + 80, doc.header.y + 600,
                {
                    width: 460, align: 'letf'
                });
            doc.fontSize(10.5).text('Fecha Registro:  ', doc.header.x, doc.header.y + 635,
                {
                    width: 420,
                    align: 'left'
                });
            doc.font('Times-Roman').fontSize(10.5).text(fechaAsentamiento.toLocaleDateString("es-ES", options), doc.header.x + 120, doc.header.y + 635,
                {
                    width: 420, align: 'letf'
                });

            doc.font('Times-Roman').fontSize(9).text(datosdocentes[0].strNombres + " " + datosdocentes[0].strApellidos, doc.header.x + 200, doc.header.y + 725,
                {
                    width: 250, align: 'letf'
                });
            doc.font('Times-Roman').fontSize(9).text(' CARRERA ' + datosfacultad[0].strNombre.replace('.', ''), doc.header.x + 200, doc.header.y + 736,
                {
                    width: 250, align: 'letf'
                });
            if (datosfacultad[0].strSede == 'MATRIZ') {
                var image = pathimage.join(__dirname, '../public/imagenes/matriz.png')
                doc.image(image, doc.footer.x + 80, doc.footer.y + 50, { width: 230, height: 45 });
            }
            if (datosfacultad[0].strSede == 'MORONA') {
                var image = pathimage.join(__dirname, '../public/imagenes/macas.png')
                doc.image(image, doc.footer.x + 80, doc.footer.y + 50, { width: 230, height: 45 });
            }

            if (datosfacultad[0].strSede == 'NORTE') {
                var image = pathimage.join(__dirname, '../public/imagenes/orellana.png')
                doc.image(image, doc.footer.x + 80, doc.footer.y + 50, { width: 230, height: 45 });
            }
            var image1 = pathimage.join(__dirname, '../public/imagenes/logo.png')
            doc.image(image1, doc.footer.x, doc.footer.y + 60, { width: 68, height: 27 });
            doc.fill("#000000")
                .font('Times-Bold')
                .fontSize(8)
                .text("Generado el ", doc.footer.x + 390, doc.footer.y + 70);
            doc.font('Times-Bold').fontSize(8).text(fecha.toLocaleDateString("es-ES", options), doc.footer.x + 436, doc.footer.y + 70,
                {
                    width: 420, align: 'letf'
                });

        });

        doc.render();
     doc.pipe(fs.createWriteStream('ActaMatricula.pdf'));
        /*var finalString = ''; // contains the base64 string
        var stream = doc.pipe(new Base64Encode());*/
        doc.end()

        /*  stream.on('data', function (chunk) {
              finalString += chunk;
          });
          stream.on('end', function () {
              return callback(null, finalString);
          });
          stream.on('end', function () {
           
              return callback(null, finalString);
          });*/


    } catch (err) {

        console.log('Error: ' + err)
        return callback(null, 'Error: ' + err);
    }
}