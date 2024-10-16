import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienesComponent } from './bienes.component';

describe('BienesComponent', () => {
  let component: BienesComponent;
  let fixture: ComponentFixture<BienesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
