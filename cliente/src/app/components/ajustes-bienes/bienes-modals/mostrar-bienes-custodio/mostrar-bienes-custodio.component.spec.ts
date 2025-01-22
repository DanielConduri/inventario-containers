import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarBienesCustodioComponent } from './mostrar-bienes-custodio.component';
import { HttpClientModule } from '@angular/common/http';

describe('MostrarBienesCustodioComponent', () => {
  let component: MostrarBienesCustodioComponent;
  let fixture: ComponentFixture<MostrarBienesCustodioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarBienesCustodioComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarBienesCustodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
