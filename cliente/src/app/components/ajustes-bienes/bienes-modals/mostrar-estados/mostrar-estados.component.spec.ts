import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarEstadosComponent } from './mostrar-estados.component';
import { HttpClientModule } from '@angular/common/http';

describe('MostrarEstadosComponent', () => {
  let component: MostrarEstadosComponent;
  let fixture: ComponentFixture<MostrarEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarEstadosComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
