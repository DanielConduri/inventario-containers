import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { PersonasService } from 'src/app/core/services/personas.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {


  //creamos la propiedad "elementForm"
  elementForm: {
    //Establecemos los elementos "formulario" y "title" a los que les
    //designaremos sus respectivos tipos
    form: string,
    title: string,
    special: boolean
  } = {
      //inicializamos los elementos en vacio
      form: '',
      title: '',
      special: true
    }
  typeView: boolean = false;

  isValue: number = 0;  // This is a class property. By initializing with a value, you can set the default button highlighted

  private destroy$ = new Subject<any>();


  constructor(public srvSideBar: SidebarService,
    public srvModal: ModalService,
    public srvPersonas: PersonasService
  ) { }


  height!: number;

  open = false;

  ngOnInit(): void {
    this.srvPersonas.selectData_rol$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.typeView = data.status;
          // console.log('body typeView', this.typeView);
        }

      })
  }

  id: any = ""

  tabChange(ids: any, _title: string, _form: string) {

    // const menu = document.getElementById('menu')
    // const menu = document.querySelector('.container-button')
    this.open = !this.open

    // console.log('el cambiador ->', this.open);


    // console.log('body',this.elementForm);
    this.elementForm.title = _title
    this.elementForm.form = _form

    this.srvModal.setForm(this.elementForm)
    this.typeView=true;

    this.id = ids;

  }



toggle1() { this.isValue = 1; }
toggle2() { this.isValue = 2; }
toggle3() { this.isValue = 3; }
toggle4() { this.isValue = 4; }

// ngOnDestroy(): void{
//   this.destroy$.next(true);
//   this.destroy$.unsubscribe();
// }

}
