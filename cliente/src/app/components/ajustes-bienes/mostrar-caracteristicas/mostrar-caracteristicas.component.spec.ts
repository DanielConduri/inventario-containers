import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCaracteristicasComponent } from './mostrar-caracteristicas.component';

describe('MostrarCaracteristicasComponent', () => {
  let component: MostrarCaracteristicasComponent;
  let fixture: ComponentFixture<MostrarCaracteristicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarCaracteristicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarCaracteristicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
