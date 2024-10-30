import { Component, Input, OnInit } from '@angular/core';
import { InformesService } from 'src/app/core/services/informes.service';
import { MantenimientoService } from 'src/app/core/services/mantenimiento/mantenimiento.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() form! : string
  @Input() title! : string

  element: {
  form: string ;
  title: string ;
  special: boolean;
  } = {
    form: '',
    title: '',
    special: true
  }



  constructor(public srvModal: ModalService,
   public srvInforme: InformesService,
   public srvMantenimiento: MantenimientoService) { }

  ngOnInit(): void {

  }

  openModal(){
    // console.log('modal abierto');
    // console.log('abriendo modal del boton');
    this.element.form = this.form
    this.element.title = this.title
    // console.log('boton->', this.element);
    this.srvModal.setForm(this.element)

    if(this.element.form)
    {
      // console.log('entra al modal');
      this.srvModal.openModal()
    } else{
      this.srvInforme.typeviw = false
      this.srvInforme.typeview = false
      this.srvMantenimiento.typeviw = false
    }

  }
}
