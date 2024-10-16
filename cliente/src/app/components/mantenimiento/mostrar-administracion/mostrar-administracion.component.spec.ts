import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarAdministracionComponent } from './mostrar-administracion.component';

describe('MostrarAdministracionComponent', () => {
  let component: MostrarAdministracionComponent;
  let fixture: ComponentFixture<MostrarAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarAdministracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
