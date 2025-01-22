import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCatalogoComponent } from './mostrar-catalogo.component';
import { HttpClientModule } from '@angular/common/http';

describe('MostrarCatalogoComponent', () => {
  let component: MostrarCatalogoComponent;
  let fixture: ComponentFixture<MostrarCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarCatalogoComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
