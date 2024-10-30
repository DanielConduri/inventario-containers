import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMantenimientoPreventivoComponent } from './editar-mantenimiento-preventivo.component';

describe('EditarMantenimientoPreventivoComponent', () => {
  let component: EditarMantenimientoPreventivoComponent;
  let fixture: ComponentFixture<EditarMantenimientoPreventivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarMantenimientoPreventivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMantenimientoPreventivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
