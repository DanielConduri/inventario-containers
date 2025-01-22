import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodioBienInfoComponent } from './custodio-bien-info.component';
import { HttpClientModule } from '@angular/common/http';

describe('CustodioBienInfoComponent', () => {
  let component: CustodioBienInfoComponent;
  let fixture: ComponentFixture<CustodioBienInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodioBienInfoComponent ],
      imports: [ HttpClientModule]
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
