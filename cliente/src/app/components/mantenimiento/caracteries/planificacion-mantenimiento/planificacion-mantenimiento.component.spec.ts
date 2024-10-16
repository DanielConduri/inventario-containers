import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificacionMantenimientoComponent } from './planificacion-mantenimiento.component';

describe('PlanificacionMantenimientoComponent', () => {
  let component: PlanificacionMantenimientoComponent;
  let fixture: ComponentFixture<PlanificacionMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanificacionMantenimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificacionMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
