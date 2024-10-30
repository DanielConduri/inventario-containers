import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import config from 'config/config';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { PrestamosService } from 'src/app/core/services/prestamos/prestamos.service';
import { converBase64toBlob } from 'src/app/utils/converter/base64.converter';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { FirmaService } from 'src/app/core/services/firma.service';
// Remove the assignment to pdfMake.vfs

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

declare function cargarData(ruta: any, archivo: any): any;
declare function onUpload(file: any, ruta: any, cedula: any): any;
declare function getTokenGenerado(token: any): any;

@Component({
  selector: 'app-pintar-solicitud',
  templateUrl: './pintar-solicitud.component.html',
  styleUrls: ['./pintar-solicitud.component.css'],
})
export class PintarSolicitudComponent implements OnInit {
  src: SafeResourceUrl | undefined;

  constructor(
    public srvPrestamos: PrestamosService,
    public srvModal: ModalService,
    private readonly router: Router,
    public srvPersona: PersonasService,
    public srvfirma: FirmaService,
    private sanitizer: DomSanitizer
  ) { }

  pdf!: string;

  fir!: number;
  cedulaLogin!: string;
  firmado: boolean = false;
  loading: boolean = true;

  datosPrestamo!: any;

  urlSolicitud: string = '';
  request: boolean = true;

  private destroy$ = new Subject<any>();

  async ngOnInit() {
    if (!this.srvPrestamos.reporte) {
      if (this.srvPrestamos.proceso > 0) {
        this.srvPrestamos
          .getDecano(this.srvPrestamos.horarioId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data: any) => {
              console.log('data decano->', data);
              this.srvPrestamos.cedulaDecano =
                data.body.listado[0].strCedulaDecano;
            },
            error: (error) => {
              console.log(error);
            },
          });
      }

      console.log('custodio --->', this.srvPrestamos.cedulaCustodio);
      console.log('solicitante--->', this.srvPrestamos.cedulaPrestamo);
      console.log('proceso --->', this.srvPrestamos.proceso);
      console.log('id prestamos pdf --->', this.srvPrestamos.pdf);
      console.log('id prestamo --->', this.srvPrestamos.idPrestamo);
      console.log('horario prestamo --->', this.srvPrestamos.horarioId);
      console.log('cedula Decano ---->', this.srvPrestamos.cedulaDecano);
      console.log('direccion onedrive ---->', this.srvPrestamos.linkOneDrive);
      Swal.fire({
        title: 'Cargando...',
        didOpen: () => {
          Swal.showLoading();
          // this.isLoading = true
          // this.isData = true
        },
      });

      if (this.srvPersona.dataMe.str_per_cedula.length < 9) {
        this.cedulaLogin = '0' + this.srvPersona.dataMe.str_per_cedula;
      } else {
        this.cedulaLogin = this.srvPersona.dataMe.str_per_cedula;
      }
      console.log('cedulaLogin ->', this.cedulaLogin);
      this.srvPrestamos
        .getPrestamoId(this.srvPrestamos.pdf)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            console.log('data ->', data);
            this.datosPrestamo = data.body;
            console.log('datosPrestamo ->', this.datosPrestamo);
            this.fir = data.body.proceso;
            // this.cedulaUser = data.body.int_prestamo_persona_id;
            // console.log('cedulaUser => ', this.cedulaUser);
          },
        });
    }

    if (this.srvPrestamos.base64 && !this.srvPrestamos.reporte) {
      this.srvPrestamos
        .getFirma(this.srvPrestamos.pdf)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            console.log('Lo que llega en el get firma ->', data);
            if (!data.status) {
              Swal.fire({
                icon: 'warning',
                title: data.message,
                text: 'Para poder generar la solicitud se debe llenar la información necesaria del centro o laboratorio',
                showDenyButton: true,
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.close();
                  this.srvModal.closeModal();
                  this.srvPrestamos.pdf = 0;
                  window.location.href =
                    config.URL_BASE_PATH + '/prestamos/prestamo';

                  this.srvPrestamos.obtenerPrestamosConEstado({});
                }
              });
            } else {
              this.pdf = data.body;
              // this.pdf = this.srvInformes.pdf
              let viewpdf = document.getElementById('ver-pdf-solicitud');
              if (viewpdf) {
                viewpdf.innerHTML =
                  ' <iframe src="' +
                  'data:application/pdf;base64,' +
                  this.pdf +
                  '" type="application/pdf" width="100%" height="400" />';
              }
              Swal.close();
            }
          },
          error: (err) => {
            console.log('Error ->', err);
          },
        });
    } else if (
      !this.srvPrestamos.base64 &&
      !this.srvPrestamos.reporte &&
      !this.srvPrestamos.linkOneDrive
    ) {
      this.srvPrestamos
        .getPdf(this.srvPrestamos.pdf)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            console.log('Lo que llega en el get pdf ->', data);

            if (!data.status) {
              Swal.fire({
                icon: 'warning',
                title: data.message,
                text:
                  'Para poder generar la solicitud se debe llenar la información necesaria del centro o laboratorio' +
                  data.body,
                // showDenyButton: true,
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.close();
                  this.srvModal.closeModal();
                }
              });
            } else {
              this.pdf = data.body;
              // this.pdf = this.srvInformes.pdf
              let viewpdf = document.getElementById('ver-pdf-solicitud');
              if (viewpdf) {
                viewpdf.innerHTML =
                  ' <iframe src="' +
                  'data:application/pdf;base64,' +
                  this.pdf +
                  '" type="application/pdf" width="100%" height="400" />';
              }
              // console.log('Lo que llega ->', this.pdf);
              Swal.close();
            }
          },
          error: (err) => {
            console.log('Error ->', err);
          },
          complete: () => { },
        });
    } else if (this.srvPrestamos.reporte) {
      // this.abrirPdf = true;
      console.log('lo que viene del filtrado', this.srvPrestamos.datosPrestamo);
      // this.srvPrestamos.solicitanteNombre = this.srvPrestamos.datosPrestamo.map(
      //   (p) => p.str_prestamo_persona_nombre
      // )
      this.srvPrestamos.solicitanteNombre = this.srvPrestamos.datosPrestamo
        .filter((p) => p.str_prestamo_persona_nombre)
        .map((p) => p.str_prestamo_persona_nombre)[0]
        // .join(', ');
      console.log('solicitanteNombre', this.srvPrestamos.solicitanteNombre);
      const pdfDefinition: any = {
        content: [
          { text: 'Reporte de Prestamos', style: 'header' },
          { text: new Date().toLocaleString(), alignment: 'right' },
          { text: this.srvPrestamos.solicitanteNombre, style: 'subheader' },
          {
            table: {
              headerRows: 1,
              widths: [
                //'*', 
                'auto', 'auto', '*', '*'],
              body: [
                [
                  //'Solicitante',
                   'Custodio', 'Fecha Prestamo', 'Tipo', 'Estado'],
                ...this.srvPrestamos.datosPrestamo.map((p) => [
                  //p.str_prestamo_persona_nombre,
                  p.str_prestamo_custodio_nombre,
                  p.dt_fecha_prestamo.substring(0, 10),
                  p.str_prestamo_tipo.toUpperCase(),
                  p.str_estado_prestamo_nombre,
                ]),
              ],
            },
          },
        ],
      };
      const pdfDocGenerator = pdfMake.createPdf(pdfDefinition);
      pdfDocGenerator.getBase64((data: any) => {
        // console.log('data', data);
        this.pdf = data;
        // console.log('pdf', this.pdf);
        let viewpdf = document.getElementById('ver-pdf-solicitud');
        if (viewpdf) {
          viewpdf.innerHTML =
            ' <iframe src="' +
            'data:application/pdf;base64,' +
            this.pdf +
            '" type="application/pdf" width="100%" height="400" />';
        } else {
          console.log('no se encontro el elemento');
        }
      });
    } else if (this.srvPrestamos.linkOneDrive && this.srvPrestamos.linkOneDrive!='') {
      await this.OnDriveObtener();
    }
  }

  firmar() {
    this.srvModal.closeModal();
    this.router.navigate(['firma-electronica'], {
      queryParams: { solicitud: this.pdf },
    });
  }

  async OnDriveObtener() {
    Swal.fire({
      title: 'Cargando PDF Firmado...',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    console.log('entro a ondrive ---->');
    const datosToken = await new Promise<any>((resolve) =>
      this.srvfirma
        .obtenerTokenOneDrive()
        .pipe(takeUntil(this.destroy$))
        .subscribe((translated) => {
          resolve(translated);
        })
    );
    console.log('datos token --->', datosToken);
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
    console.log('informacion token --->', informacion);
    if (datosToken.success) {
      if (datosToken.token) {
        getTokenGenerado(informacion);

        let info = await cargarData(this.srvPrestamos.linkOneDrive, '');

        if (info) {
          const file: any = await this.toDataURL(
            info['@microsoft.graph.downloadUrl']
          );
          const blod = converBase64toBlob(file, 'application/pdf');
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
            window.URL.createObjectURL(blod)
          );

          Swal.close();
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudo descargar el archivo',
            icon: 'error',
            showDenyButton: false,
            confirmButtonText: 'Aceptar',
          });
        }
      }
    }
  }

  toDataURL = async (url: any) => {
    let res = await fetch(url);
    let blob = await res.blob();

    const result = await new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(new Error('Promise rejected with null value.'));
      };
      reader.readAsDataURL(blob);
    });

    return result;
  };
}
