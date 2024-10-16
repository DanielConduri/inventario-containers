import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router, RoutesRecognized } from '@angular/router';


import { Layouts } from './layout/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>()

  title = 'app';
  Layouts = Layouts;
  layout: Layouts = Layouts.simple

  showLoading: boolean = true

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data instanceof RoutesRecognized) {
            this.layout = data.state.root.firstChild?.data['layout']
          }
        },
        error: (err) => { 
          console.log('error', err);
        }
      })


  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe()
  }

}
