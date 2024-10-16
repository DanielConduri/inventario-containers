import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarInfoBienComponent } from './mostrar-info-bien.component';

describe('MostrarInfoBienComponent', () => {
  let component: MostrarInfoBienComponent;
  let fixture: ComponentFixture<MostrarInfoBienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarInfoBienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarInfoBienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
