import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarInformeComponent } from './modificar-informe.component';

describe('ModificarInformeComponent', () => {
  let component: ModificarInformeComponent;
  let fixture: ComponentFixture<ModificarInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarInformeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
