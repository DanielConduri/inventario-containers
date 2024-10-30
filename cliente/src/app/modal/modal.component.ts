import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../core/services/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
public formType: string = "";
public titleModal: string = "";
triggerModal?: boolean;



private destroy$ = new Subject<any>();

  constructor(public srvModal: ModalService) {

  }

  //inicializamos el ciclo de vida de nuestro modal.component
  ngOnInit(): void {



    this.formType = '';
    this.titleModal = '';
    // console.log("dentro de modal.compo.ts: ", this.formType);
    this.srvModal.selectForm$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(form)=>{
        //  console.log("form en el modal.ts ->", form);
        this.formType = form.form;
        this.titleModal = form.title;
        this.triggerModal = form.special;
      },
      error:(e)=>{
        console.log("Error =>", e);
      },
    })

    document.addEventListener('keydown', this.handleKeyDown.bind(this)); //para cerrar el modal

  }

  handleKeyDown(event: KeyboardEvent) {
    // Si se presiona la tecla "Esc"
    if (event.key === 'Escape') {
      this.closeModalX();
    }
  }
//cambiar el nombre, es decir, que no tengan los mismos nombres
  closeModalX(){
    this.srvModal.closeModal()

    this.formType = 'clear';
    this.titleModal = ''
    this.srvModal.openModal()
    this.srvModal.closeModal()

  }


}
