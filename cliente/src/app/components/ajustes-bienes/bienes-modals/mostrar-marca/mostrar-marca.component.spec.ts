import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarMarcaComponent } from './mostrar-marca.component';

describe('MostrarMarcaComponent', () => {
  let component: MostrarMarcaComponent;
  let fixture: ComponentFixture<MostrarMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarMarcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
