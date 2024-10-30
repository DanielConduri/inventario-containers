import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarBienesCustodioComponent } from './mostrar-bienes-custodio.component';

describe('MostrarBienesCustodioComponent', () => {
  let component: MostrarBienesCustodioComponent;
  let fixture: ComponentFixture<MostrarBienesCustodioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarBienesCustodioComponent ]
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
