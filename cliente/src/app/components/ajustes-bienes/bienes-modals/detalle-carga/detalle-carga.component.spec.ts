import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCargaComponent } from './detalle-carga.component';

describe('DetalleCargaComponent', () => {
  let component: DetalleCargaComponent;
  let fixture: ComponentFixture<DetalleCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCargaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
