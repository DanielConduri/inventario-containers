import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarMarcaComponent } from './agregar-marca.component';

describe('AgregarMarcaComponent', () => {
  let component: AgregarMarcaComponent;
  let fixture: ComponentFixture<AgregarMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarMarcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
