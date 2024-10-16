import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PaginacionService } from 'src/app/core/services/paginacion.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnDestroy{
  loading: boolean = false;

  dataLength: any = [];
  metadata: any = [];
  currentPage: any = 0;
  npage! : number
  metadatos!: number
  private destroy$ = new Subject<any>();

  // Eventos
  @Output() nextPage: EventEmitter<any> = new EventEmitter();

  constructor(private srvPagina: PaginacionService) {
  }
  ngOnInit(): void {
    this.srvPagina.Pagination$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) =>{
        this.dataLength = data.dataLength;
        this.metadata = data.metaData;
        this.currentPage = data.currentPage;
        this.metadatos = this.metadata
        this.npage = Math.ceil(this.metadata/10)

        this.srvPagina.setEvento(this.nextPage)

      },
      error: (err) =>{
        console.log('Error ->', err);
      }
    })
  }
  
  getNumberArray(n: number): number[] {
    return Array.from({length: n}, (_, i) => i + 1);
  }
  

  //funcion que nos permite pasar a la siguiente pagina 
  nextPageDir(dir: number) {
    this.currentPage = this.currentPage + 1 * (dir === 1 ? 1 : -1);
    this.nextPage.emit(this.currentPage);
  }

  //funcion que nos permite pasar a la pagina que queramos
  saltarPagina() {
    this.nextPage.emit(this.currentPage);
  }

  //funcion que nos permite ir a la ultima pagina
  ultimaPagina() {
    this.currentPage = this.npage
    this.nextPage.emit(this.currentPage);
  }

  //funcion que nos permite ir a la primera pagina
  primeraPagina() {
    this.currentPage = 1
    this.nextPage.emit(this.currentPage);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }
}