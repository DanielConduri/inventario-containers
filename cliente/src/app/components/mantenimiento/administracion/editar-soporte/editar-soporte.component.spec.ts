import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSoporteComponent } from './editar-soporte.component';

describe('EditarSoporteComponent', () => {
  let component: EditarSoporteComponent;
  let fixture: ComponentFixture<EditarSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSoporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
