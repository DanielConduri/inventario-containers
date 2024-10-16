import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MostrarUsuariosComponent } from './mostrar-usuarios/mostrar-usuarios.component';
import { AgregarUsuarioComponent } from './modals/agregar-usuario/agregar-usuario.component';
import { ModificarUsuarioComponent } from './modals/modificar-usuario/modificar-usuario.component';
import { MostrarCuentaComponent } from './mostrar-cuenta/mostrar-cuenta.component';
import { MostrarRolesComponent } from './mostrar-roles/mostrar-roles.component';
import { AgregarRolComponent } from './modals/agregar-rol/agregar-rol.component';
import { ModificarRolComponent } from './modals/modificar-rol/modificar-rol.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MostrarPerRolComponent } from './mostrar-per-rol/mostrar-per-rol.component';
import { AgregarPerfilComponent } from './modals/agregar-perfil/agregar-perfil.component';
import { ModificarPerfilComponent } from './modals/modificar-perfil/modificar-perfil.component';
import { ImportarUsuariosComponent } from './modals/importar-usuarios/importar-usuarios.component';
import { EditarPermisosComponent } from './modals/editar-permisos/editar-permisos.component';
import { RouterModule } from '@angular/router';
import { MostrarMenusComponent } from './mostrar-menus/mostrar-menus.component';
import { ModificarMenuComponent } from './modals/modificar-menu/modificar-menu.component';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { AgregarMenuComponent } from './modals/agregar-menu/agregar-menu.component';
import { MostrarSubmenuComponent } from './mostrar-submenu/mostrar-submenu.component';




@NgModule({
  declarations: [
    MostrarUsuariosComponent,
    AgregarUsuarioComponent,
    ModificarUsuarioComponent,
    MostrarCuentaComponent,
    MostrarRolesComponent,
    AgregarRolComponent,
    ModificarRolComponent,
    MostrarPerRolComponent,
    AgregarPerfilComponent,
    ModificarPerfilComponent,
    ImportarUsuariosComponent,
    EditarPermisosComponent,
    MostrarMenusComponent,
    ModificarMenuComponent,
    AgregarMenuComponent,
    MostrarSubmenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    PaginationModule
  ],
  exports:[
    MostrarUsuariosComponent,
    AgregarUsuarioComponent,
    ModificarUsuarioComponent,
    MostrarCuentaComponent,
    MostrarRolesComponent,
    AgregarRolComponent,
    ModificarRolComponent,
    AgregarPerfilComponent,
    MostrarPerRolComponent,
    ModificarPerfilComponent,
    ImportarUsuariosComponent,
    EditarPermisosComponent,
    MostrarMenusComponent,
    ModificarMenuComponent,
    AgregarMenuComponent,
    MostrarSubmenuComponent,
    RouterModule
  ]
})
export class AjustesModule { }
