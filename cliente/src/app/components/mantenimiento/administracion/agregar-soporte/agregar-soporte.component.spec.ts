import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSoporteComponent } from './agregar-soporte.component';

describe('AgregarSoporteComponent', () => {
  let component: AgregarSoporteComponent;
  let fixture: ComponentFixture<AgregarSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarSoporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
