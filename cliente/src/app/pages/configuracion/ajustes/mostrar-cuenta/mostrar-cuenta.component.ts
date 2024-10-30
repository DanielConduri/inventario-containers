import { Component, OnInit } from '@angular/core';
import { PersonasService } from '../../../../core/services/personas.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-cuenta',
  templateUrl: './mostrar-cuenta.component.html',
  styleUrls: ['./mostrar-cuenta.component.css']
})
export class MostrarCuentaComponent implements OnInit {

  private destroy$ = new Subject<any>()
  isData: boolean = false;

  constructor(
    public srvPersona: PersonasService,
    public fbMe: FormBuilder, ) {
    }

  ngOnInit(): void {
    // console.log('Estoy en mi cueenta')
    Swal.fire({
      title: 'Cargando Cuenta...',
      didOpen: () => {
        Swal.showLoading()
      }
    })
    this.srvPersona.getMe()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(_me) =>{
        if(_me.body){
          this.isData = true;
          // console.log('Recibiendo onInit de _me=>',_me)
          this.srvPersona.dataMe = _me.body

        }
        Swal.close();
      },
      error:(err) =>{
        console.log(err)
      }
    })

  }






}
