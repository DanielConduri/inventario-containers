import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { CasService } from 'src/app/core/services/cas.service';

@Component({
  selector: 'app-cas-err',
  templateUrl: './cas-err.component.html',
  styleUrls: ['./cas-err.component.css']
})
export class CasErrComponent implements OnInit {

  messageCasError!: string;
  private destroy$ = new Subject<any>();


  constructor(
    public casService: CasService,
  ) { }

  ngOnInit(): void {
    this.casService.SelectIsMessageCasError$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(data) =>{
        this.messageCasError = data;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
