import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarProcesoComponent } from './mostrar-proceso.component';

describe('MostrarProcesoComponent', () => {
  let component: MostrarProcesoComponent;
  let fixture: ComponentFixture<MostrarProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarProcesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
