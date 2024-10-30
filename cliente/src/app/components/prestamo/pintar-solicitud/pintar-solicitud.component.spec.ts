import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PintarSolicitudComponent } from './pintar-solicitud.component';

describe('PintarSolicitudComponent', () => {
  let component: PintarSolicitudComponent;
  let fixture: ComponentFixture<PintarSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PintarSolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PintarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
