import { Component, OnInit } from '@angular/core';
import { CasClient } from 'src/app/core/security/CasClient/CasClient';
import { ActivatedRoute } from '@angular/router';
import { CasService } from 'src/app/core/services/cas.service';
import { Subject, takeUntil } from 'rxjs';
import config from 'config/config';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  isLoading = false;
  request: any;
  orderby: any;

  private destroy$ = new Subject<any>();

  constructor(private route: ActivatedRoute, private casclient: CasClient,
    private srvCasService: CasService
    ) { }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
      next: async (params: any) => {
          if (this.casclient.isAuth()) {
            window.location.href = config.URL_BASE_PATH + '/welcome';
          }else{
            // console.log('PASO 2 Xd');
            await this.loginWithTicket(params);
          }
          this.isLoading = true;
          this.request = true;
      },
      error: (err) => {
        console.log('err =>', err);
      },
    });
  }

  async loginWithTicket(params: any) {
    if (!this.casclient.isAuth()) {
      if (params.ticket) {
        await this.autenticar();
      }
    }
  }

  async autenticar() {
    this.casclient.saveTicket();
    let res = await  this.casclient.verificaLogin();
    if (res) {
      window.location.href = config.URL_BASE_PATH + '/welcome';
    }else{
      this.srvCasService.setMessageCasError('No se pudo autenticar');
      this.casclient.casError();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

   }

}
