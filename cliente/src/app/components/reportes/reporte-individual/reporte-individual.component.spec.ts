import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIndividualComponent } from './reporte-individual.component';

describe('ReporteIndividualComponent', () => {
  let component: ReporteIndividualComponent;
  let fixture: ComponentFixture<ReporteIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
