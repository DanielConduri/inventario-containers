import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarTipoComponent } from './modificar-tipo.component';

describe('ModificarTipoComponent', () => {
  let component: ModificarTipoComponent;
  let fixture: ComponentFixture<ModificarTipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarTipoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
