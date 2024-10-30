import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarPrestamoComponent } from './mostrar-prestamo.component';

describe('MostrarPrestamoComponent', () => {
  let component: MostrarPrestamoComponent;
  let fixture: ComponentFixture<MostrarPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarPrestamoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
