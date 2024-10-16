import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PintarPDFComponent } from './pintar-pdf.component';

describe('PintarPDFComponent', () => {
  let component: PintarPDFComponent;
  let fixture: ComponentFixture<PintarPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PintarPDFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PintarPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
