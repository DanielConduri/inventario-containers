import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCaracteresComponent } from './mostrar-caracteres.component';

describe('MostrarCaracteresComponent', () => {
  let component: MostrarCaracteresComponent;
  let fixture: ComponentFixture<MostrarCaracteresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarCaracteresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarCaracteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
