import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCentrosComponent } from './detalles-centros.component';

describe('DetallesCentrosComponent', () => {
  let component: DetallesCentrosComponent;
  let fixture: ComponentFixture<DetallesCentrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesCentrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesCentrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
