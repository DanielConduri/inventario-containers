import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPlanificacionComponent } from './editar-planificacion.component';

describe('EditarPlanificacionComponent', () => {
  let component: EditarPlanificacionComponent;
  let fixture: ComponentFixture<EditarPlanificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarPlanificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
