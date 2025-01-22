import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarEstadosComponent } from './modificar-estados.component';
import { HttpClientModule } from '@angular/common/http';

describe('ModificarEstadosComponent', () => {
  let component: ModificarEstadosComponent;
  let fixture: ComponentFixture<ModificarEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarEstadosComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
