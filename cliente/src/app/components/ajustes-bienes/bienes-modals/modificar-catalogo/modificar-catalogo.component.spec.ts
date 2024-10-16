import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCatalogoComponent } from './modificar-catalogo.component';

describe('ModificarCatalogoComponent', () => {
  let component: ModificarCatalogoComponent;
  let fixture: ComponentFixture<ModificarCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarCatalogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
