import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPrestamoComponent } from './agregar-prestamo.component';

describe('AgregarPrestamoComponent', () => {
  let component: AgregarPrestamoComponent;
  let fixture: ComponentFixture<AgregarPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPrestamoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
