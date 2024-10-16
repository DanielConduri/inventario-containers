import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarInformeComponent } from './mostrar-informe.component';

describe('MostrarInformeComponent', () => {
  let component: MostrarInformeComponent;
  let fixture: ComponentFixture<MostrarInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarInformeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
