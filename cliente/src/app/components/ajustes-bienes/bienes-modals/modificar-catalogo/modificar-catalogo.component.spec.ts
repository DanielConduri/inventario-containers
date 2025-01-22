import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCatalogoComponent } from './modificar-catalogo.component';
import { HttpClientModule } from '@angular/common/http';

describe('ModificarCatalogoComponent', () => {
  let component: ModificarCatalogoComponent;
  let fixture: ComponentFixture<ModificarCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarCatalogoComponent ],
      imports: [ HttpClientModule]
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
