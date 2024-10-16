import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarMantenimientoComponent } from './mostrar-mantenimiento.component';

describe('MostrarMantenimientoComponent', () => {
  let component: MostrarMantenimientoComponent;
  let fixture: ComponentFixture<MostrarMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarMantenimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
