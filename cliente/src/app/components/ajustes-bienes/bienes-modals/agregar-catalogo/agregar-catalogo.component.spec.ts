import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCatalogoComponent } from './agregar-catalogo.component';
import { HttpClientModule } from '@angular/common/http';

describe('AgregarCatalogoComponent', () => {
  let component: AgregarCatalogoComponent;
  let fixture: ComponentFixture<AgregarCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarCatalogoComponent ],
      imports: [ HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
