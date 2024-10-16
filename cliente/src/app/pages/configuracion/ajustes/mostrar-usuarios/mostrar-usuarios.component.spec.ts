import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarUsuariosComponent } from './mostrar-usuarios.component';

describe('MostrarUsuariosComponent', () => {
  let component: MostrarUsuariosComponent;
  let fixture: ComponentFixture<MostrarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
