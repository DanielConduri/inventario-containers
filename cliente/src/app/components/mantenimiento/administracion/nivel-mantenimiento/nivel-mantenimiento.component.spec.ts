import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelMantenimientoComponent } from './nivel-mantenimiento.component';

describe('NivelMantenimientoComponent', () => {
  let component: NivelMantenimientoComponent;
  let fixture: ComponentFixture<NivelMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelMantenimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
