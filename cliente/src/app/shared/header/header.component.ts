import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PersonasService } from '../../core/services/personas.service';
import { dataPerfiles } from '../../core/models/personas';
import { CasClient } from '../../core/security/CasClient/CasClient';
import { ModalService } from 'src/app/core/services/modal.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 // @ViewChild('idAside', { static: false }) div: ElementRef | undefined;


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
      special: false
    }

private destroy$ = new Subject<any>()
id_Per: number = 0;
roles: string[] = [];
nameRol: string = '';
getBolean?: boolean;
status: boolean = false;
//div: ElementRef = {} as ElementRef;


  constructor(
    public srvPersona: PersonasService,
    public casCliente: CasClient,
    public srvModal: ModalService,
    public srvSideBar: SidebarService
   // private elementRef: ElementRef
  //  public cpnAside: AsideComponent
  ) { 
  //  this.div = undefined;

  }


  showDropdown = false;
  showDropdownRoles = false;
  showDropdownResponsive = false;


  ngOnInit(): void {

    this.srvPersona.getMe()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(_me) =>{
        this.srvPersona.dataMe = _me.body
        this.srvPersona.getPerfiles(_me.body.int_per_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
         next:(_rol)=>{
          this.srvPersona.datosPerfiles = _rol.body
          // console.log("Aqui se imprimen rol body =>", _rol.body)
          this.roles = this.srvPersona.datosPerfiles.map((item: dataPerfiles) => item.str_rol_nombre)
          this.nameRol = this.roles[0]
          //console.log("Aqui se imprimen Roles heard =>", this.nameRol)
          // console.log("Aqui se imprimen Roles =>", this.nameRol)
        },
        error:(err)=>{
          console.log(err)
        }
    })
      },
      error:(err)=>{
        console.log(err)
      }
    })
//Declaracion del fromEvent

  }

  ngAfterViewInit() {

    this.toggleSidebar();

}

  toggleSidebar(){

    let pAside = document.querySelector(".pAside")
    let pSidebar = document.querySelector(".pSidebar")

    // console.log("pAside en ts del header => ", pAside)
    // console.log("pSidebar en ts del header => ", pSidebar)

    // console.log("captura del botón desde el header: ",buttonSidebar)
    // if (this.status){
      pAside?.classList.toggle('close');
      this.status= !this.status

      
    // }else{
      // pAside?.classList.toggle('open');
      // this.status=false
    // }
    let sidebarBody = document.querySelector(".sidebar");
    let pContainer = document.querySelector('.pContainer');
    // console.log("el cuerpo del sidebar => ", sidebarBody)
   // sidebarBody?.classList.remove('close')

    let sidebarA = document.querySelector('.link-opcion');
    let settings = document.querySelector('.settings');
    let buttonSidebar = document.getElementById('toggle-sidebar')

    // sidebarA?.classList.remove('close')

  //  const clases = this.div?.nativeElement.classList;

   // console.log("clases.constains",/*clases.contains('close')*/ clases);

   const divLinkOp = document.querySelector('.link-opcion') as HTMLDivElement

   if(divLinkOp.classList.contains('close')){
     sidebarA?.classList.toggle('close')

   }else{
     sidebarA?.classList.remove('close')

   }

   const div = document.querySelector('#idAside') as HTMLDivElement

   if (div.classList.contains('close')) {
     sidebarA?.classList.toggle('close')
     pSidebar?.classList.toggle('close')

  //  pAside?.classList.remove('close');
    pContainer?.classList.toggle('close')
    settings?.classList.toggle('close')
    buttonSidebar?.classList.toggle('close')
    sidebarBody?.classList.toggle('close')
    this.srvSideBar.getBool(true)

  } else {
    sidebarA?.classList.remove('close')
    pSidebar?.classList.remove('close')

  //  pAside?.classList.toggle('close');
    pContainer?.classList.remove('close')
    settings?.classList.remove('close')
    buttonSidebar?.classList.remove('close')
    sidebarBody?.classList.remove('close')
    this.srvSideBar.getBool(false)

  }

    // if(this.status /*(clases.contains('close'))!*/){
    //   sidebarA?.classList.toggle('close')
    //   settings?.classList.toggle('close')
    //   buttonSidebar?.classList.toggle('close')

    // }else{
    //   sidebarA?.classList.remove('close')
    //   settings?.classList.remove('close')
    //   buttonSidebar?.classList.remove('close')
    // }

    // console.log(" la A: ", sidebarA)
    // console.log(" el boton en el header ", buttonSidebar)


  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleDropdownRoles() {
    this.showDropdownRoles = !this.showDropdownRoles;
  }

  toggleDropdownResponsive(){
    // let element = document.getElementById('containerResponsive');
    // element?.classList.add('showResponsive');

    //Condicion para mostrar - ocultar el menu responsive
    // if(this.showDropdownResponsive == false){
    //   let element = document.getElementById('containerResponsive');
    //   element?.classList.add('showResponsive');
    //   this.showDropdownResponsive = true;
    // }else{
    //   let element = document.getElementById('containerResponsive');
    //   element?.classList.remove('showResponsive');
    //   this.showDropdownResponsive = false;
    // }



    // Modal Responsivo
    this.srvModal.setForm(this.elementForm);
    this.srvModal.openModal();

  }

  mostrarAjustes(){
    // console.log('Haciendo click en mostrar ajustes')

  }

  getRolName(rolName:any){
    this.nameRol = rolName;
  }

  salirDelSistema(){
    this.casCliente.Logout()
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
