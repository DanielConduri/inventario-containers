import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCuentaComponent } from './mostrar-cuenta.component';

describe('MostrarCuentaComponent', () => {
  let component: MostrarCuentaComponent;
  let fixture: ComponentFixture<MostrarCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
