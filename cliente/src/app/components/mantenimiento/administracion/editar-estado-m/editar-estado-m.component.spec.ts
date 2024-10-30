import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEstadoMComponent } from './editar-estado-m.component';

describe('EditarEstadoMComponent', () => {
  let component: EditarEstadoMComponent;
  let fixture: ComponentFixture<EditarEstadoMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarEstadoMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEstadoMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
