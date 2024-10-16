import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasErrComponent } from './cas-err.component';

describe('CasErrComponent', () => {
  let component: CasErrComponent;
  let fixture: ComponentFixture<CasErrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasErrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasErrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
