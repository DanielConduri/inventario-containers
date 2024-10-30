import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarReporteMantenimientoComponent } from './mostrar-reporte-mantenimiento.component';

describe('MostrarReporteMantenimientoComponent', () => {
  let component: MostrarReporteMantenimientoComponent;
  let fixture: ComponentFixture<MostrarReporteMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarReporteMantenimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarReporteMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
