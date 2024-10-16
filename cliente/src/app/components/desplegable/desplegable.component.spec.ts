import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesplegableComponent } from './desplegable.component';

describe('DesplegableComponent', () => {
  let component: DesplegableComponent;
  let fixture: ComponentFixture<DesplegableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesplegableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesplegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
