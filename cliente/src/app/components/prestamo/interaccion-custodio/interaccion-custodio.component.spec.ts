import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteraccionCustodioComponent } from './interaccion-custodio.component';

describe('InteraccionCustodioComponent', () => {
  let component: InteraccionCustodioComponent;
  let fixture: ComponentFixture<InteraccionCustodioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteraccionCustodioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteraccionCustodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
