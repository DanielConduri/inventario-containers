import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPlanificacionComponent } from './detalles-planificacion.component';

describe('DetallesPlanificacionComponent', () => {
  let component: DetallesPlanificacionComponent;
  let fixture: ComponentFixture<DetallesPlanificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesPlanificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
