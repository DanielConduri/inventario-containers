import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InformesService } from 'src/app/core/services/informes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pintar-pdf',
  templateUrl: './pintar-pdf.component.html',
  styleUrls: ['./pintar-pdf.component.css']
})
export class PintarPDFComponent implements OnInit {

  constructor(public srvInformes: InformesService) { }

  pdf!: string

  private destroy$ = new Subject<any>();

  ngOnInit(): void {
    this.getInforme()
  }

  getInforme(){
    Swal.fire({
      title: 'Cargando Informe...',
      didOpen: () => {
        Swal.showLoading()
        // this.isLoading = true
        // this.isData = true
      },
    });
    // this.srvReportes.getPDF({})
    // .pipe(takeUntil(this.destroy$)).
    // subscribe({
      // next: (data: any) => {
    this.srvInformes.getInf(this.srvInformes.pdf).
    pipe(takeUntil(this.destroy$)).
    subscribe({
      next: (data: any) => {
        console.log('Lo que llega ->', data);
        this.pdf  = data.body
        // this.pdf = this.srvInformes.pdf
        let viewpdf = document.getElementById('ver-pdf-solicitud');
            if (viewpdf) {
              viewpdf.innerHTML =
                ' <iframe src="' +
                'data:application/pdf;base64,' +
                this.pdf +
                '" type="application/pdf" width="100%" height="600" />';
            }
        console.log('Lo que llega ->', this.pdf);
        Swal.close();

      },
      error: (err) =>{
        console.log('Error ->', err);
      }, 
      complete: () =>{

      }
    })
//         this.pdf = this.srvInformes.pdf
//         let viewpdf = document.getElementById('ver-pdf-solicitud');
//             if (viewpdf) {
//               viewpdf.innerHTML =
//                 ' <iframe src="' +
//                 'data:application/pdf;base64,' +
//                 this.pdf +
//                 '" type="application/pdf" width="100%" height="600" />';
//             }
//         console.log('Lo que llega ->', this.pdf);
      // },
    //   error: (err) =>{
    //     console.log('Error ->', err);
    //   }
    // })
  }


}
