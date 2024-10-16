import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarReporteComponent } from './mostrar-reporte.component';

describe('MostrarReporteComponent', () => {
  let component: MostrarReporteComponent;
  let fixture: ComponentFixture<MostrarReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarReporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
