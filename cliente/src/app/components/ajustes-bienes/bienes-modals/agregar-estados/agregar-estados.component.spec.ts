import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEstadosComponent } from './agregar-estados.component';
import { HttpClientModule } from '@angular/common/http';

describe('AgregarEstadosComponent', () => {
  let component: AgregarEstadosComponent;
  let fixture: ComponentFixture<AgregarEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarEstadosComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  
});
