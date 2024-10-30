import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPlanificacionComponent } from './agregar-planificacion.component';

describe('AgregarPlanificacionComponent', () => {
  let component: AgregarPlanificacionComponent;
  let fixture: ComponentFixture<AgregarPlanificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPlanificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
