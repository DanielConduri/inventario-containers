import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarInventarioComponent } from './mostrar-inventario.component';

describe('MostrarInventarioComponent', () => {
  let component: MostrarInventarioComponent;
  let fixture: ComponentFixture<MostrarInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
