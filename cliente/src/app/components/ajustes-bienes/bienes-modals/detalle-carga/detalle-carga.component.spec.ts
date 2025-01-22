import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCargaComponent } from './detalle-carga.component';
import { HttpClientModule } from '@angular/common/http';

describe('DetalleCargaComponent', () => {
  let component: DetalleCargaComponent;
  let fixture: ComponentFixture<DetalleCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCargaComponent ],
      imports: [ HttpClientModule]
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
