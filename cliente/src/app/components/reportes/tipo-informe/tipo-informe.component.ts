import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InformesService } from 'src/app/core/services/informes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-informe',
  templateUrl: './tipo-informe.component.html',
  styleUrls: ['./tipo-informe.component.css']
})
export class TipoInformeComponent implements OnInit {

  private destroy$ = new Subject<any>();

  isLoading: boolean = false
  isData: boolean = false;

  elementForm: {
    //Establecemos los elementos "formulario" y "title" a los que les
    //designaremos sus respectivos tipos
    form: string;
    title: string;
    special: boolean;
  } = {
    //inicializamos los elementos en vacio
    form: '',
    title: '',
    special: true,
  };

  constructor(public srvInformes: InformesService,
              public srvModal: ModalService) { }

  ngOnInit(): void {
    this.getTipos()
  }

  getTipos(){
    Swal.fire({
      title: 'Cargando Tipos de Informes...',
      didOpen: () => {
        Swal.showLoading()
        this.isLoading = true
        this.isData = true
      },
    });
    this.srvInformes.getTipos({})
    .pipe(takeUntil(this.destroy$)).
    subscribe({
      next: (data: any) => {
        if(data.body.length > 0){
          this.isData = true;
          this.srvInformes.datosTipos = data.body
          // this.metadata = roles.total
        }else{
          this.isData = false
          this.isLoading = false
        }
        Swal.close();
        // this.pdf = data.body
//         let viewpdf = document.getElementById('ver-pdf-solicitud');
//             if (viewpdf) {
//               viewpdf.innerHTML =
//                 ' <iframe src="' +
//                 'data:application/pdf;base64,' +
//                 this.pdf +
//                 '" type="application/pdf" width="100%" height="600" />';
//             }
        // console.log('Lo que llega ->', data);
      },
      error: (err) =>{
        console.log('Error ->', err);
      }
    })
  }

  modificarTipo(id: number, _title: string, _form: string){
    this.srvInformes.idModifyT = id
    this.elementForm.form = _form
    this.elementForm.title = _title
    this.srvModal.setForm(this.elementForm)
    this.srvModal.openModal() 
    // console.log('llega bien el tiempo')
  }

  deleteTipo(id: number){
    Swal.fire({
      title: '¿Está seguro que desea modificar este Tipo?',
      showDenyButton: true,
      text: 'Al deshabilitar un Tipo, este no podra acceder al sistema. Este cambio puede ser revertido en cualquier momento',
      confirmButtonText: 'Si, modificar',
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Modificando Tipo...',
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.srvInformes
          .deleteTipos(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res:any) => {
              if (res.status) {
                Swal.fire({
                  title: 'Estado modificado corectamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 3000,
                });
              } else {
                Swal.fire({
                  title: 'No se modifico el estado',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 3000,
                });
              }
              this.getTipos();
              setTimeout(() => {
                Swal.close();
              }, 3000);
            },
            error: (error) => {
              console.log('err', error);
            },
            complete: () => {},
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
