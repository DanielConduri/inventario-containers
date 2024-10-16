import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEstadoMComponent } from './agregar-estado-m.component';

describe('AgregarEstadoMComponent', () => {
  let component: AgregarEstadoMComponent;
  let fixture: ComponentFixture<AgregarEstadoMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarEstadoMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarEstadoMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
