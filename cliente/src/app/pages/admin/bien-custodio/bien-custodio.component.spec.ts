import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienCustodioComponent } from './bien-custodio.component';

describe('BienCustodioComponent', () => {
  let component: BienCustodioComponent;
  let fixture: ComponentFixture<BienCustodioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienCustodioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienCustodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
