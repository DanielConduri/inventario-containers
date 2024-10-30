import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { dataPerfiles } from 'src/app/core/models/personas';
import { CasClient } from 'src/app/core/security/CasClient/CasClient';
import { PersonasService } from 'src/app/core/services/personas.service';

@Component({
  selector: 'app-desplegable',
  templateUrl: './desplegable.component.html',
  styleUrls: ['./desplegable.component.css'],
})
export class DesplegableComponent implements OnInit {
  private destroy$ = new Subject<any>();
  id_Per: number = 0;
  roles: string[] = [];
  nameRol: string = '';
  getBolean?: boolean;
  srvModal: any;

  constructor(
    public srvPersona: PersonasService,
    public casCliente: CasClient
  ) // private location: Location
  {}

  showDropdown = false;
  showDropdownRoles = false;
  showDropdownResponsive = false;

  ngOnInit(): void {
    this.srvPersona
      .getMe()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_me) => {
          this.srvPersona.dataMe = _me.body;
          this.srvPersona
            .getPerfiles(_me.body.int_per_id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (_rol) => {
                this.srvPersona.datosPerfiles = _rol.body;
                this.roles = this.srvPersona.datosPerfiles.map(
                  (item: dataPerfiles) => item.str_rol_nombre
                );
                // console.log(
                //   'INICIO Obtengo el valor en desplegable =>',
                //   this.srvPersona.nameRol
                // );

                if (this.srvPersona.nameRol === '@d$') {
                  this.nameRol = this.roles[0];
                  // console.log('nameRol =>', this.nameRol);
                } else {
                  this.nameRol = this.srvPersona.nameRol;
                }
                this.srvPersona.setPermisoRol(this.nameRol);
                this.srvPersona.nameRol = this.nameRol;

                // console.log(
                //   'Obtengo el valor en desplegable =>',
                //   this.srvPersona.nameRol
                // );
              },
              error: (err) => {
                console.log(err);
              },
            });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleDropdownRoles() {
    this.showDropdownRoles = !this.showDropdownRoles;
  }

  // toggleDropdownResponsive(){
  //   this.srvModal.setForm(this.elementForm);
  //   this.srvModal.openModal();
  // }

  mostrarAjustes() {
    // console.log('Haciendo click en mostrar ajustes');
  }

  getRolName(rolName: any) {
    this.nameRol = rolName;
    this.srvPersona.nameRol = rolName;

    // console.log(' getRolName =>', this.srvPersona.nameRol);
    this.srvPersona.setData_nameRol(this.nameRol);
    // this.location.reload();
    // this.window.location.reload();
    window.location.reload();
    this.srvPersona.nameRol = rolName;

    // this.location.reload()
  }

  salirDelSistema() {
    this.casCliente.Logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
