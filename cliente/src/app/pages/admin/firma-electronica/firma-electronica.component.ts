import {
  Component,
  OnInit,
  HostListener,
  TemplateRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import config from 'config/config';
import * as pdfjslib from 'pdfjs-dist/legacy/build/pdf';
import { Subject, takeUntil } from 'rxjs';
import { FirmaService } from 'src/app/core/services/firma.service';
import { PrestamosService } from 'src/app/core/services/prestamos/prestamos.service';
import Swal from 'sweetalert2';

declare function getTokenGenerado(token: any): any;
declare function onUpload(file: any, ruta: any, cedula: any): any;

if (pdfjslib !== undefined) {
  pdfjslib.GlobalWorkerOptions.workerSrc =
    'https://npmcdn.com/pdfjs-dist@2.14.305/build/pdf.worker.js';
}

@Component({
  selector: 'app-firma-electronica',
  templateUrl: './firma-electronica.component.html',
  styleUrls: ['./firma-electronica.component.css'],
})
export class FirmaElectronicaComponent implements OnInit {
  @ViewChild('canvasRef', { static: false }) canvasRef!: ElementRef;
  @ViewChild('AceptarFirmar', { static: false }) myModalInfo!: TemplateRef<any>;
  private destroy$ = new Subject<any>();

  myForm!: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public srvPrestamos: PrestamosService,
    private srvfirma: FirmaService,
    public fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      str_prestamo_observacion: [''],
      int_estado_id: [0],
      int_estados_prestamo_id: [0],
      int_prestamo_estado: [],
    });
  }

  public mr: any;
  mr2: any;
  mr3: any;
  public width: number = 615;
  public height: number = 860;
  public coordenadaX: any;
  public coordenadaY: any;

  private nombreDoc: string = '';
  private cedulaUser: string = '';

  private cx!: CanvasRenderingContext2D;

  //coordenadas del mouse
  private points: Array<any> = [];

  public isAvailabe: any;
  blActivarRecuperarArchvio: boolean = false;
  public pdfurl: any;
  public pageRendering: boolean = false;
  public pageNum: any;
  public pageNumPending: any;
  public pdfDoc: any;
  public pageCount: any;
  public strCodigoBase64!: string | null;
  strDatosActa: any;
  public tipocertificado!: string;
  strCedulaSinUsuario: any;
  tokenobteneido!: string;
  urlFrima: string | URL | undefined;
  strCedulaUsuarioSinGuion!: number;
  TipoActa!: string;
  intIdDocumento: number = -1;
  tipoActaGenerada: any;
  public lstListadoFirmar!: { nombre: any; archivo: any }[];
  lstListadoEnviadoFirmar!: string | any[];
  lstArchivoEnviarAlmacenamientoOneDriver!: Array<any>;

  archivoBase64: string = '';
  private certificadosporf: Array<any> = [];
  private key: string =
    'c8dcd2f25835dbd8fe7b7d513afbfb179902676a39d55eb6d59bd43de3be55dc';
  private nomresis: number = 483091;
  estaFirmado: boolean = false;
  loading: boolean = true;
  request: boolean = true;

  upload!: any;
  uploadButtonText!: any;
  uploadFilename!: any;
  fileInput: any = null;
  fileName!: any;
  filePrueva!: any;
  fileOut: any = null;
  objetoSolicitud: {
    estado: string;
    url: string;
  } = {
    estado: '',
    url: '',
  };

  proceso!: number;
  tipoActa!: string;
  

  async ngOnInit() {
    console.log('llega el idEstado ---->', this.srvPrestamos.idEstados);

    this.route.queryParams.subscribe({
      next: (params) => {
        console.log('Params ->', params);
        this.request = false;
        this.loading = false;
        console.log('loadinfg => ', this.loading, 'request => ', this.request);
        this.archivoBase64 = params['solicitud'];
        console.log('archivoBase64 => ', this.archivoBase64);
      },
    });

    this.srvPrestamos
      .getPrestamoId(this.srvPrestamos.pdf)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('data ->', data);
          this.proceso = data.body.proceso;
          this.tipoActa = data.body.str_prestamo_tipo;
          this.cedulaUser = data.body.int_prestamo_persona_id;
          this.srvPrestamos.horarioId = data.body.int_prestamo_horario_id;
          console.log('cedulaUser => ', this.cedulaUser);
        },
      });

    this.intIdDocumento = this.srvPrestamos.pdf;

    await this.InicializacionVariable();
    await this.ProcesoVisualizacionPdF();
  }

  async InicializacionVariable() {
    this.pageRendering = false;
    this.blActivarRecuperarArchvio = false;
    this.pageNum = 1;
    this.tipocertificado = '2';
    this.pageNumPending = '';
    this.TipoActa = '';
    this.tokenobteneido = '';
    this.urlFrima = '';
    this.tipoActaGenerada = '';
    this.pdfDoc = null;
    this.pageCount = '';
    this.coordenadaX = '';
    this.coordenadaY = '';
    this.lstListadoFirmar = [];
    this.lstListadoEnviadoFirmar = [];
    this.lstArchivoEnviarAlmacenamientoOneDriver = [];
  }
  //captura los movimientos del mouse
  @HostListener('document:click', ['$event'])
  click = (e: any) => {
    if (e.target.id === 'canvasId') {
      this.write(e);
    }
  };

  async ProcesoVisualizacionPdF() {
    this.strCodigoBase64 = this.archivoBase64;
    this.pdfurl = atob(this.strCodigoBase64);
    await this.render(this.pageNum);
  }

  async render(num: any) {
    this.pageRendering = false;
    if (
      this.pageRendering != undefined &&
      Boolean(!this.pageRendering) &&
      num != '' &&
      this.pdfurl != '' &&
      this.pdfurl != undefined &&
      this.canvasRef &&
      this.canvasRef.nativeElement
    ) {
      const canvasEl = this.canvasRef.nativeElement;
      this.cx = canvasEl.getContext('2d');
      let context = this.cx;
      canvasEl.width = this.width;
      canvasEl.height = this.height;
      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000';
      const loadingTask = pdfjslib.getDocument({ data: this.pdfurl });
      loadingTask.promise.then((pdf) => {
        this.pdfDoc = pdf;
        this.pageCount = pdf.numPages;
        // Fetch the first page
        let pageNumber = num;
        this.pdfDoc.getPage(pageNumber).then((page: any) => {
          // original width of the pdf page at scale 1
          let pdf_original_height = page._pageInfo.view[3];
          let pdf_original_with = page._pageInfo.view[2];
          // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
          let scale_required = canvasEl.width / pdf_original_with;
          let viewport = page.getViewport({ scale: scale_required });
          // Render PDF page into canvas context
          let renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          let renderTask = page.render(renderContext);
          renderTask.promise.then(() => {
            this.pageRendering = false;
            if (this.pageNumPending !== '') {
              // New page rendering is pending
              this.render(this.pageNumPending);
              this.pageNumPending = null;
            }
          });
        });
      });
    }
    this.pageNum = num;
  }

  //representacion de las coordenadas de este elemento en pantalla pixeles
  private write(res: any) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: Math.round(res.clientX - rect.left),
      y: Math.round(res.clientY - rect.top),
    };
    let valornormalx = prevPos.x - 45;
    let valornormaly = prevPos.y - 30;
    let firmax = valornormalx;
    let firmay = 840 - valornormaly;
    this.coordenadaX = firmax;
    this.coordenadaY = firmay;
    // this.writeSingle(prevPos);
    this.drawOnCanvas(prevPos);
  }

  //dibuja el cuadrado al rededor de la imagen
  private drawOnCanvas(prevPos: any) {
    if (!this.cx) return;
    this.cx.beginPath();
    if (prevPos) {
      let image = document.getElementById('source') as HTMLCanvasElement;
      this.cx.drawImage(image, prevPos.x - 50, prevPos.y - 70, 100, 100);
      this.cx.stroke();
      this.AbrirFirmaEc();
    }
    if (prevPos.x && prevPos.y) {
      /*this.mr= this.modal.open(this.myModalInfo, {
         size: "sm",
         backdrop: "static",
         keyboard: false,
       });*/
    }
  }

  //limpia el lienzo
  public clearZone = () => {
    this.coordenadaX = '';
    this.coordenadaY = '';
    this.blActivarRecuperarArchvio = false;
    this.pageNum = 1;
    this.points = [];
    this.cx.clearRect(0, 0, this.width, this.height);
    this.render(this.pageNum);
  };

  //refresca para cambiar de pagina
  async queueRenderPage(num: any) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.render(num);
    }
  }
  //pagina siguiente
  async onPrevPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }
  //pagina anterior
  async onNextPage() {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  async AbrirFirmaEc() {
    console.log('AbrirFirmaEc');
    let nom: any =
      this.nomresis + this.cedulaUser + Math.floor(1000 * Math.random());
    this.fileName = nom;
    this.certificadosporf.push({
      nombre: nom,
      archivo: this.archivoBase64,
    });
    this.nombreDoc = nom;
    let content = {
      // cedula: this.cedulaUser,
      cedula: '0604737940',
      listado: this.certificadosporf,
    };
    const datos = await new Promise<any>((resolve) =>
      this.srvfirma.postFirmaSolicitud(content).subscribe((translated) => {
        resolve(translated);
      })
    );

    console.log('datos 123 => ', datos);

    if (datos.status === 'success') {
      this.estaFirmado = true;
      this.urlFrima =
        'firmaec://' +
        this.key +
        '/firmar?token=' +
        datos.token +
        '&tipo_certificado=2%26llx%3D' +
        this.coordenadaX +
        '%26lly%3D' +
        this.coordenadaY +
        '%26pagina%3D' +
        this.pageNum +
        '%26estampado%3DQR%26url%3Dhttp%3A%2F%2Fapifirmaec.espoch.edu.ec%2Fapi%26razon%3Dfirmado%20desde%20https%3A%2F%2Fsai.espoch.edu.ec';
      window.open(this.urlFrima, '_blank');
    }
  }

  async RecuperarArEc() {
    this.request = true;
    this.srvfirma.getDocFirmado(this.nombreDoc).subscribe({
      next: (res) => {
        this.loading = true;
        this.estaFirmado = true;
        this.fileInput = res.body[0].func_recuperar_archivo;
        console.log('que es esto --->', this.fileInput);
        console.log('res => ', res);
        setTimeout(() => {
          let viewpdf = document.getElementById('ver-pdf-docFirmado');
          this.request = false;
          if (viewpdf) {
            viewpdf.innerHTML =
              ' <iframe src="' +
              'data:application/pdf;base64,' +
              this.fileInput +
              '" type="application/pdf" width="100%" height="700" />';
          }
        }, 1000);
        // this.OnDriveAlamcenar();
        
      },
      error: (err) => {
        console.log('err => ', err);
      },
    });
  }

  async OnDriveAlamcenar() {
    console.log('entra a OnDriveAlamcenar');
    this.fileOut = this.dataURItoBlob(this.fileInput, 'pdf');
    console.log('fileOut => ', this.fileOut);
    const datosToken = await new Promise<any>((resolve, reject) =>
      this.srvfirma
        .obtenerTokenOneDrive()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (translated) => {
            resolve(translated);
          },
          error: (err) => {
            console.log('error =>', err);
            reject(new Error('Error obtaining token from OneDrive service'));
          },
        })
    );
    console.log('datosToken => ', datosToken);
    if (!datosToken) {
      Swal.fire({
        title: 'Ocurrio un error al conectarse al servicio de OneDrive',
        allowOutsideClick: false,
      });
      return;
    }

    let informacion = {
      access_token: datosToken.informacionToken.strAccessToken,
      bitactivo: datosToken.token,
      expires_on: datosToken.informacionToken.strExpireOn,
      id_token: datosToken.informacionToken.strToken,
      idtok: datosToken.informacionToken.idSistema,
      tokfechacreacion: datosToken.informacionToken.strFechaCreacion,
      tokfechaexp: datosToken.informacionToken.strFechaExpiracion,
      token_type: 'Bearer',
    };

    if (datosToken.success) {
      if (datosToken.token) {
        console.log('informacion => ', informacion);
        getTokenGenerado(informacion);
       // console.log('fileOut => ', this.fileOut);
        const date = new Date();
        const nameFolderMonth =
          date.toLocaleString('es', { month: 'short' }).toUpperCase() +
          date.getFullYear().toString().slice(2, 4);


        // url de la firma en ondrive, esto debo almacenar en la base de datos
        this.objetoSolicitud.url =
          'Prestamos' +
          '/' +
          nameFolderMonth +
          '/' +
          '_firma_' +
          this.fileName.replace(' ', '_').split('.')[0] +
          '.pdf';
        const resp = await onUpload(
          this.fileOut,
          'Prestamos' + '/' + nameFolderMonth,
          '_firma_' + this.fileName.replace(' ', '_').split('.')[0]
        );

        // this.objetoSolicitud.estado = 'FIRMADO';
        console.log('objetoSolicitud => ', this.objetoSolicitud);

        console.log('resp => ', resp);
        if (resp) {
          console.log('entra al if', resp.status);
          this.srvPrestamos.putOneDrive(this.intIdDocumento, this.objetoSolicitud.url)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (data) => {
                Swal.close();
                Swal.fire({
                  title: '¡Documento guardado correctamente!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2500,
                });
              },
              error: (err) => {
                Swal.close();
                Swal.fire({
                  title: `Ocurrio un error al actualizar el acta`,
                  text: 'Por favor comuníquese con el servicio técnico',
                  icon: 'error',
                  footer:
                    'Error: ' +
                    err.error.message +
                    '\n' +
                    (err.error.errores
                      ? JSON.stringify(err.error.errores)
                      : ''),
                  showDenyButton: false,
                  confirmButtonText: 'Aceptar',
                });
                console.log('err =>', err);
              },
              complete: () => {
                // this.router.navigate(['solicitudes']);
              },
            });
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'No se ha subido el archivo correctamente, Por favor comuníquese con el servicio técnico',
            icon: 'error',
            // showConfirmButton: false,
            // timer: 2500,
            showDenyButton: false,
            confirmButtonText: 'Aceptar',
          });
        }
      } else {
        console.error('Error al obtener el token');
      }

      this.fileInput = null;
    }
  }

  //base 64 es fileInput

  guardarDocFirmado() {
    this.srvPrestamos
      .putPDF(this.intIdDocumento, this.fileInput)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('data => ', data);
          Swal.fire({
            title: 'Documento firmado guardado con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
          });
          console.log('se ha firmado y se va a cambiar de proceso');

          if (this.proceso === 0) {
            console.log('debe entrar si es la primera firma');
            this.myForm.get('int_estado_id')?.setValue(2);
            this.myForm.get('int_prestamo_estado')?.setValue(1);
            this.myForm
              .get('int_estados_prestamo_id')
              ?.setValue(this.srvPrestamos.idEstados);
          } else if (this.proceso === 1 ) {
            this.myForm.get('int_estado_id')?.setValue(3);
            this.myForm.get('int_prestamo_estado')?.setValue(1);
            this.myForm
              .get('int_estados_prestamo_id')
              ?.setValue(this.srvPrestamos.idEstados);
            this.OnDriveAlamcenar();

            // this.myForm.get('int_prestamo_estado')?.setValue(1)
          } 
          // else if (this.proceso === 1 && this.tipoActa === 'externo') {
          //   this.myForm.get('int_estado_id')?.setValue(5);
          //   this.myForm.get('int_prestamo_estado')?.setValue(2);
          //   this.myForm
          //     .get('int_estados_prestamo_id')
          //     ?.setValue(this.srvPrestamos.idEstados);
          //    // this.OnDriveAlamcenar();

          //   // this.obtenerDecano(
          //   //   this.srvPrestamos.horarioId
          //   // );
          // }

          console.log(
            'lo que va a la funcion --->',
            this.myForm.value,
            this.srvPrestamos.idPrestamo
          );

          setTimeout(() => {
            this.srvPrestamos.actualizarPrestamo(
              this.srvPrestamos.pdf,
              this.myForm.value
            );
            this.srvPrestamos.obtenerPrestamosConEstado({});

            // this.router.navigate(['/prestamos/prestamo']);
            window.location.href = config.URL_BASE_PATH + '/prestamos/prestamo';
          }, 3000);
        },
        error: (err) => {
          console.log('err => ', err);
        },
      });
  }

  // obtenerDecano(id: number){
  //   this.srvPrestamos.getDecano(id)
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe({
  //     next: (data:any) => {
  //       console.log('data decano->', data);
  //       this.srvPrestamos.cedulaDecano = data.listado[0].strCedulaDecano
  //       // this.srvPrestamos.datosPrestamo = data.body;
  //       // console.log('datosPrestamo ->', this.srvPrestamos.datosPrestamo);
  //       // this.fir = data.body.proceso;
  //       // this.cedulaUser = data.body.int_prestamo_persona_id;
  //       // console.log('cedulaUser => ', this.cedulaUser);
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     }
  //   });
  // }

  async guardarDocFir() {
    Swal.fire({
      title: 'Guardando documento firmado...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.guardarDocFirmado();
   // await this.OnDriveAlamcenar();
  }
  dataURItoBlob(base64: string, fileName: string): File {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blobData = new Blob([bytes], { type: 'application/pdf' });
    return new File([blobData], fileName, { type: 'application/pdf' });
  }
}
