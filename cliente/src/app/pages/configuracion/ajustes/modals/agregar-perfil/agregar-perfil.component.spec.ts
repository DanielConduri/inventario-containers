import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPerfilComponent } from './agregar-perfil.component';

describe('AgregarPerfilComponent', () => {
  let component: AgregarPerfilComponent;
  let fixture: ComponentFixture<AgregarPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPerfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
