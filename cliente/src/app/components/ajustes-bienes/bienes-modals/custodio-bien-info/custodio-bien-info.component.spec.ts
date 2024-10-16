import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodioBienInfoComponent } from './custodio-bien-info.component';

describe('CustodioBienInfoComponent', () => {
  let component: CustodioBienInfoComponent;
  let fixture: ComponentFixture<CustodioBienInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodioBienInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustodioBienInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
