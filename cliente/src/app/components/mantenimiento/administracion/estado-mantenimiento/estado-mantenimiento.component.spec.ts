import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMantenimientoComponent } from './estado-mantenimiento.component';

describe('EstadoMantenimientoComponent', () => {
  let component: EstadoMantenimientoComponent;
  let fixture: ComponentFixture<EstadoMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoMantenimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
