import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaElectronicaComponent } from './firma-electronica.component';

describe('FirmaElectronicaComponent', () => {
  let component: FirmaElectronicaComponent;
  let fixture: ComponentFixture<FirmaElectronicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmaElectronicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmaElectronicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
