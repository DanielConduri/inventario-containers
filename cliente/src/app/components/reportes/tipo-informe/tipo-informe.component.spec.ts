import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoInformeComponent } from './tipo-informe.component';

describe('TipoInformeComponent', () => {
  let component: TipoInformeComponent;
  let fixture: ComponentFixture<TipoInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoInformeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
