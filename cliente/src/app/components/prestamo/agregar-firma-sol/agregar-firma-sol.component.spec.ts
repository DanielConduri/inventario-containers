import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFirmaSolComponent } from './agregar-firma-sol.component';

describe('AgregarFirmaSolComponent', () => {
  let component: AgregarFirmaSolComponent;
  let fixture: ComponentFixture<AgregarFirmaSolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarFirmaSolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarFirmaSolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
